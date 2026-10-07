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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonWeb } from "@ui/buttons/web";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    FormsModule,
    ReactiveFormsModule,
    InputAutocomplete,
    LuxInputNumberSignal,
    LuxInputSelectSignal,
    ButtonWeb,
  ],
})
export class InspeccionActivoCondominio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);

  cb_activos = signal<SelectItemDto[]>([]);
  cb_inspection_reviews_catalog = signal<SelectItemDto[]>([]);
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
    const activos = await this.apiResponseS.onGetItem<SelectItemDto[]>(
      Endpoints.Inspections.equipmentByCustomer(this.customerIdS.customerId()),
    );

    this.cb_activos.set((activos as SelectItemDto[]) ?? []);
    // Hasta elegir un equipo no se conocen sus revisiones (dependen de su clasificación).
    this.selectedReviewControl.disable({ emitEvent: false });
  }

  /**
   * Al elegir un equipo/área se recargan SOLO los criterios de su misma
   * clasificación (EquipoClasificacionId).
   */
  async onEquipmentSelected(item: SelectItemDto): Promise<void> {
    this.form.patchValue({
      condominiumAssetId: item?.value,
      condominiumAssetName: item?.label,
    });

    // Cambió el equipo: las revisiones previas ya no aplican.
    this.reviewsControl.clear();
    this.cb_inspection_reviews_catalog.set([]);
    this.selectedReviewControl.setValue(null, { emitEvent: false });

    if (!item?.value) {
      this.selectedReviewControl.disable({ emitEvent: false });
      return;
    }

    const reviews = await this.apiResponseS.onGetList<SelectItemDto[]>(
      Endpoints.InspectionReviewCatalog.byEquipment(item.value),
    );
    this.cb_inspection_reviews_catalog.set(reviews ?? []);
    this.selectedReviewControl.enable({ emitEvent: false });
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

  saveCondominiumAsset = (item: SelectItemDto) => {
    void this.onEquipmentSelected(item);
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
      equipmentId: formVal.condominiumAssetId,
      inspectionReviews: formVal.inspectionReviews.map(
        (review: any) => review.value || review.inspectionReviewsCatalogId,
      ),
    };

    this.apiResponseS
      .onPost(Endpoints.InspectionCondominiumAssets.create, data)
      .then((result: any) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
