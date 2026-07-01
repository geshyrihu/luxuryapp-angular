import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IReviewForm {
  id: FormControl<string | null>;
  inspectionReviewsCatalogId: FormControl<string | null>;
  catalogDescription: FormControl<string | null>;
  label: FormControl<string | null>;
  value: FormControl<string | null>;
}

@Component({
  selector: "app-inspeccion-activo-condominio",
  templateUrl: "./inspeccion-activo-condominio.html",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CustomInputAutoComplete,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class InspeccionActivoCondominio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);

  cb_activos = signal<ISelectItem[]>([]);
  cb_inspection_reviews_catalog = signal<ISelectItem[]>([]);
  selectedReviewControl = new FormControl<string | null>(null);

  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    inspectionId: new FormControl<string>(this.config.data.inspectionId, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    condominiumAssetId: new FormControl<string>("", Validators.required),
    condominiumAssetName: new FormControl<string | null>(null),
    position: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
    inspectionReviews: new FormArray<FormGroup<IReviewForm>>([]),
  });

  get reviewsControl(): FormArray<FormGroup<IReviewForm>> {
    return this.form.controls.inspectionReviews;
  }

  async ngOnInit(): Promise<void> {
    await this.onLoadSelectItems();
  }

  async onLoadSelectItems(): Promise<void> {
    const [activos, reviewsCatalog] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.CondominiumAssets.selectByCustomer(
          this.customerIdS.customerId(),
        ),
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.InspectionReviewCatalog.getAll,
      ),
    ]);

    this.cb_activos.set(activos as ISelectItem[]);
    this.cb_inspection_reviews_catalog.set(reviewsCatalog as ISelectItem[]);
  }

  loadInspectionReviews(reviews: any[]) {
    this.reviewsControl.clear();
    reviews.forEach((review) => {
      this.reviewsControl.push(
        new FormGroup<IReviewForm>({
          id: new FormControl(review.id),
          inspectionReviewsCatalogId: new FormControl(review.value),
          catalogDescription: new FormControl(review.label),
          label: new FormControl(review.label),
          value: new FormControl(review.value),
        }),
      );
    });
  }

  onAddReview(reviewId: string) {
    if (!reviewId) return;

    const selectedReview = this.cb_inspection_reviews_catalog().find(
      (review) => review.value === reviewId,
    );

    if (selectedReview) {
      this.reviewsControl.push(
        new FormGroup<IReviewForm>({
          id: new FormControl(null),
          inspectionReviewsCatalogId: new FormControl(selectedReview.value),
          catalogDescription: new FormControl(selectedReview.label),
          label: new FormControl(selectedReview.label),
          value: new FormControl(selectedReview.value),
        }),
      );

      const updatedCatalog = this.cb_inspection_reviews_catalog().filter(
        (review) => review.value !== reviewId,
      );
      this.cb_inspection_reviews_catalog.set(updatedCatalog);

      this.selectedReviewControl.setValue(null, { emitEvent: false });
    }
  }

  onRemoveReview(index: number) {
    const removedReview = this.reviewsControl.at(index).getRawValue();
    this.reviewsControl.removeAt(index);

    const removedValue =
      removedReview.value || removedReview.inspectionReviewsCatalogId;

    const existsInCatalog = this.cb_inspection_reviews_catalog().some(
      (review) => review.value === removedValue,
    );

    if (!existsInCatalog && removedValue) {
      const updatedCatalog = [
        ...this.cb_inspection_reviews_catalog(),
        {
          value: removedValue,
          label: removedReview.label || removedReview.catalogDescription || "",
        },
      ];

      updatedCatalog.sort((a, b) => a.label.localeCompare(b.label));
      this.cb_inspection_reviews_catalog.set(updatedCatalog);
    }
  }

  saveCondominiumAsset = (item: ISelectItem) => {
    this.form.patchValue({
      condominiumAssetId: item?.value,
      condominiumAssetName: item?.label,
    });
  };

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    if (this.reviewsControl.length === 0) {
      console.error("Debe agregar al menos una revisión");
      return;
    }

    this.submitting.set(true);

    const formVal = this.form.getRawValue();
    const data = {
      inspectionId: formVal.inspectionId,
      condominiumAssetId: formVal.condominiumAssetId,
      position: formVal.position,
      inspectionReviews: formVal.inspectionReviews.map((review: any) => ({
        inspectionReviewsCatalogId:
          review.value || review.inspectionReviewsCatalogId,
      })),
    };

    this.apiResponseS
      .onPost(Endpoints.InspectionCondominiumAssets.create, data)
      .then((result: any) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
