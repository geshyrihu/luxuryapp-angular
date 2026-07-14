import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IReviewForm {
  value: FormControl<any>;
  label: FormControl<string>;
}

@Component({
  selector: "app-inspeccion-activo-condominio-editar",
  templateUrl: "./inspeccion-activo-condominio-editar.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    InputAutocomplete,
    CustomInputTextSignal,
    WebButtonLabelConfirm,
    WebButtonLabelSave,
  ],
})
export class InspeccionActivoCondominioEditar implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);

  cb_activos = signal<SelectItemDto[]>([]);
  cb_inspection_reviews_catalog = signal<SelectItemDto[]>([]);
  cb_inspection_reviews_catalog_original = signal<SelectItemDto[]>([]);

  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    inspectionId: new FormControl<string>(this.config.data.inspectionId, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    condominiumAssetId: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    condominiumAssetName: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    position: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    reviewSelection: new FormControl<SelectItemDto | null>(null),
    inspectionReviews: new FormArray<FormGroup<IReviewForm>>([]),
  });

  get reviewsControl(): FormArray<FormGroup<IReviewForm>> {
    return this.form.controls.inspectionReviews;
  }

  async ngOnInit(): Promise<void> {
    await this.onLoadSelectItems();
    await this.loadInspectionCondominiumAsset();
  }

  async onLoadSelectItems(): Promise<void> {
    const [activos, reviewsCatalog] = await Promise.all([
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.CondominiumAssets.selectByCustomer(
          this.customerIdS.customerId(),
        ),
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.InspectionReviewCatalog.getAll,
      ),
    ]);

    this.cb_activos.set(activos as SelectItemDto[]);
    this.cb_inspection_reviews_catalog.set(reviewsCatalog as SelectItemDto[]);
    this.cb_inspection_reviews_catalog_original.set(
      reviewsCatalog as SelectItemDto[],
    );
  }

  async loadInspectionCondominiumAsset(): Promise<void> {
    const assetId = this.config.data.inspectionCondominiumAssetId;
    if (!assetId) return;

    const resp: any = await this.apiResponseS.onGetItem(
      Endpoints.InspectionCondominiumAssets.getById(assetId),
    );

    if (resp) {
      let condominiumAssetId = null;
      if (
        resp.condominiumAssetId !== null &&
        resp.condominiumAssetId !== undefined
      ) {
        condominiumAssetId =
          typeof resp.condominiumAssetId === "object" &&
          resp.condominiumAssetId !== null
            ? resp.condominiumAssetId.value
            : resp.condominiumAssetId;
      }

      const selectedAsset = condominiumAssetId
        ? this.cb_activos().find((item) => item.value === condominiumAssetId)
        : null;

      this.form.patchValue({
        id: resp.id,
        inspectionId: resp.inspectionId,
        condominiumAssetId,
        condominiumAssetName: selectedAsset ? selectedAsset.label : null,
        position: resp.position || 1,
      });

      this.loadInspectionReviews(resp.inspectionReviews || []);
    }
  }

  loadInspectionReviews(reviews: any[]): void {
    this.reviewsControl.clear();

    reviews.forEach((review) => {
      const reviewValue = typeof review === "object" ? review.value : review;
      const reviewLabel =
        typeof review === "object" && review.label
          ? review.label
          : this.cb_inspection_reviews_catalog_original().find(
              (item) => item.value === reviewValue,
            )?.label || "";

      this.reviewsControl.push(
        new FormGroup<IReviewForm>({
          value: new FormControl(reviewValue),
          label: new FormControl(reviewLabel, { nonNullable: true }),
        }),
      );
    });

    const filteredCatalog =
      this.cb_inspection_reviews_catalog_original().filter(
        (catalogItem) =>
          !reviews.some((reviewForm) => {
            const reviewValue =
              typeof reviewForm === "object" ? reviewForm.value : reviewForm;
            return reviewValue === catalogItem.value;
          }),
      );

    this.cb_inspection_reviews_catalog.set(filteredCatalog);
  }

  onAddReviewAutocomplete(item: SelectItemDto): void {
    if (!item || !item.value) return;

    this.reviewsControl.push(
      new FormGroup<IReviewForm>({
        value: new FormControl(item.value),
        label: new FormControl(item.label, { nonNullable: true }),
      }),
    );

    const updatedCatalog = this.cb_inspection_reviews_catalog().filter(
      (review) => review.value !== item.value,
    );

    this.cb_inspection_reviews_catalog.set(updatedCatalog);
    this.form.patchValue({ reviewSelection: null });
  }

  onRemoveReview(index: number): void {
    const removedReview = this.reviewsControl.at(index).getRawValue();
    this.reviewsControl.removeAt(index);

    const existsInCatalog = this.cb_inspection_reviews_catalog().some(
      (review) => review.value === removedReview.value,
    );

    if (!existsInCatalog) {
      const updatedCatalog = [
        ...this.cb_inspection_reviews_catalog(),
        {
          value: removedReview.value,
          label: removedReview.label,
        },
      ];

      updatedCatalog.sort((a, b) => a.label.localeCompare(b.label));
      this.cb_inspection_reviews_catalog.set(updatedCatalog);
    }
  }

  saveCondominiumAsset = (item: SelectItemDto) => {
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
    const payload = {
      id: formVal.id,
      inspectionId: formVal.inspectionId,
      condominiumAssetId: formVal.condominiumAssetId,
      position: formVal.position,
      inspectionReviews: formVal.inspectionReviews.map((review: any) => ({
        value: review.value,
      })),
    };

    this.apiResponseS
      .onPut(Endpoints.InspectionCondominiumAssets.update(payload.id!), payload)
      .then((result: boolean) => {
        if (result) {
          this.ref.close(true);
        } else {
          this.submitting.set(false);
        }
      });
  }
}
