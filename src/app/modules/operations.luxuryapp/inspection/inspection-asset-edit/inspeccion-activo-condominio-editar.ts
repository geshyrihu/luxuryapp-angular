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
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { ButtonWeb } from "@ui/buttons/web";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";

interface IReviewForm {
  value: FormControl<any>;
  label: FormControl<string>;
}

@Component({
  selector: "app-inspeccion-activo-condominio-editar",
  templateUrl: "./inspeccion-activo-condominio-editar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputAutocomplete,
    LuxInputTextSignal,
    ButtonWeb,
  ],
})
export class InspeccionActivoCondominioEditar implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  private swalS = inject(SwalService);
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
    const activos = await this.apiResponseS.onGetItem<SelectItemDto[]>(
      Endpoints.Inspections.equipmentByCustomer(this.customerIdS.customerId()),
    );

    this.cb_activos.set((activos as SelectItemDto[]) ?? []);
  }

  /**
   * Carga los criterios del catálogo que aplican a la clasificación del equipo
   * indicado (mismo EquipoClasificacionId).
   */
  private async loadCatalogForEquipment(
    equipmentId: string | null,
  ): Promise<void> {
    if (!equipmentId) {
      this.cb_inspection_reviews_catalog.set([]);
      this.cb_inspection_reviews_catalog_original.set([]);
      return;
    }

    const reviews = await this.apiResponseS.onGetList<SelectItemDto[]>(
      Endpoints.InspectionReviewCatalog.byEquipment(equipmentId),
    );
    const list = reviews ?? [];
    this.cb_inspection_reviews_catalog.set([...list]);
    this.cb_inspection_reviews_catalog_original.set([...list]);
  }

  async onEquipmentSelected(item: SelectItemDto): Promise<void> {
    this.form.patchValue({
      condominiumAssetId: item?.value,
      condominiumAssetName: item?.label,
    });

    // Cambió el equipo: las revisiones previas ya no aplican a su clasificación.
    this.reviewsControl.clear();
    await this.loadCatalogForEquipment(item?.value ?? null);
  }

  async loadInspectionCondominiumAsset(): Promise<void> {
    const assetId = this.config.data.inspectionCondominiumAssetId;
    if (!assetId) return;

    const resp: any = await this.apiResponseS.onGetItem(
      Endpoints.InspectionCondominiumAssets.getById(assetId),
    );

    if (resp) {
      const condominiumAssetId = resp.equipmentId;

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

      await this.loadCatalogForEquipment(condominiumAssetId ?? null);
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

  async onRemoveReview(index: number): Promise<void> {
    const confirmed = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Está seguro de quitar esta revisión?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!confirmed) return;
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
    const payload = {
      id: formVal.id,
      inspectionId: formVal.inspectionId,
      equipmentId: formVal.condominiumAssetId,
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
