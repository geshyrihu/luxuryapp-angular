import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-asunto-legal-form",
  imports: [
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
  ],
  templateUrl: "./asunto-legal-form.html",
})
export class AsuntoLegalForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  // Signal para categoróas
  cb_categories = signal<ISelectItem[]>([]);

  cb_resposanbles: ISelectItem[] = [
    {
      value: true,
      label: "Interno",
    },
    {
      value: false,
      label: "Externo",
    },
  ];

  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    legalMatterCategoryId: [null as any], // ID can be number or string or null
    legalMatterCategory: [null as any], // Can be string or ISelectItem
    title: ["", [Validators.required, Validators.maxLength(100)]],
    isInternal: [true],
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    await this.onCategories();

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onCategories(): Promise<void> {
    const result: any =
      await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.LegalMatters.categories,
      );
    this.cb_categories.set(result as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.LegalMatters.getById(this.id),
    );

    // Extraer legalMatterCategoryId
    let legalMatterCategoryId = null;
    if (
      result.legalMatterCategoryId !== null &&
      result.legalMatterCategoryId !== undefined
    ) {
      legalMatterCategoryId =
        typeof result.legalMatterCategoryId === "object" &&
        result.legalMatterCategoryId !== null
          ? (result.legalMatterCategoryId as any).value
          : result.legalMatterCategoryId;
    }

    // Buscar la categoróa completa
    const selectedCategory = legalMatterCategoryId
      ? this.cb_categories().find(
          (item) => item.value === legalMatterCategoryId,
        )
      : null;

    this.form.patchValue({
      ...result,
      legalMatterCategoryId,
      legalMatterCategory: selectedCategory || null,
    });
  }

  saveCategorie = (item: ISelectItem) => {
    // Si item es null, significa que es una categoróa nueva (texto libre)
    if (item === null) {
      this.form.patchValue({
        legalMatterCategoryId: null,
        legalMatterCategory: null,
      });
    } else {
      this.form.patchValue({
        legalMatterCategoryId: item.value,
        legalMatterCategory: item.label, // or item object? original code put item.label
      });
    }
  };

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const formValue = this.form.getRawValue();

    // Construir payload
    // If legalMatterCategory is object, it has label. If string, it is label.
    // original: (legalMatterCategoryValue?.label || legalMatterCategoryValue)

    const categoryValue = formValue.legalMatterCategory;

    // Check if categoryValue is ISelectItem (has label) or string.
    // At runtime, if selected via autocomplete it might be object or string based on propagate.
    // Actually saveCategorie updates `legalMatterCategory` to `item.label`.
    // So `legalMatterCategory` in form is likely a string.
    // But `autocomplete` usually binds object if not configured otherwise.
    // Original LoadData sets `selectedCategory || null`. `selectedCategory` is ISelectItem.

    // If user types, it propagates string or null?
    // CustomInputAutocomplete logic matters.
    // Assuming original logic was correct with safe access `?.label || value`.

    const payload = {
      legalMatterCategoryId: formValue.legalMatterCategoryId,
      // Si legalMatterCategoryId es null, enviar el texto como nueva categoróa
      legalMatterCategory: (categoryValue as any)?.label || categoryValue,
      title: formValue.title,
      isInternal: formValue.isInternal,
    };

    const request =
      this.id === ""
        ? this.apiResponseS.onPost(Endpoints.LegalMatters.create, payload)
        : this.apiResponseS.onPut(Endpoints.LegalMatters.update(this.id), payload);

    request.then((result: boolean) => {
      result ? this.ref.close(true) : this.submitting.set(false);
    });
  }
}
