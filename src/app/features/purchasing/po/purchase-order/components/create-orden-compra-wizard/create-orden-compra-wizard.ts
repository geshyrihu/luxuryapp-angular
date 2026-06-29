import { CommonModule } from "@angular/common";
import { Endpoints } from "src/app/core/constants/endpoints";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
// PrimeNG Modules
import { MenuItem } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog"; // Added DynamicDialogConfig
import { FileUploadModule } from "primeng/fileupload"; // Added
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message"; // Added
import { StepsModule } from "primeng/steps";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag"; // Added
import { firstValueFrom } from "rxjs";

// Project specific services and components
import { CustomInputAutoComplete } from "src/app/core/components/web/inputs/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { ETipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service"; // Added
import { CustomButton } from "src/app/core/components/web/buttons";
import { OrdenCompraDetalleForm } from "../orden-compra-detalle-form/orden-compra-detalle-form";
const tipoGastoTitles: { [key: number]: string } = {
  [ETipoGasto.Fijo]: "GASTOS FIJOS",
  [ETipoGasto.Variable]: "GASTOS VARIABLES",
  [ETipoGasto.CajaChica]: "CAJA CHICA",
  [ETipoGasto.Extraordinario]: "GASTOS EXTRAORDINARIOS",
  [ETipoGasto.Devoluciones]: "DEVOLUCIONES",
  [ETipoGasto.TarjetaDebito]: "TARJETA DE DóBITO",
  [ETipoGasto.Proyectos]: "GASTOS DE PROYECTOS",
  [ETipoGasto.Nomina]: "NóMINA",
  [ETipoGasto.Impuestos]: "IMPUESTOS Y CONTRIBUCIONES",
};

// Interfaces for Typed Forms
interface IBudgetForm {
  accountId: FormControl<string | null>;
  accountNumber: FormControl<string | null>;
  accountName: FormControl<string | null>;
  amount: FormControl<number | null>;
}

interface IStep1Form {
  customerId: FormControl<string | null>;
  providerId: FormControl<string | null>;
  justificacionGasto: FormControl<string | null>;
  notasEspeciales: FormControl<string | null>;
  equipoOInstalacion: FormControl<string | null>;
  tipoGasto: FormControl<number | null>;
  fundingYear: FormControl<number | null>;
  fundingPeriod: FormControl<number | null>;
}

interface IStep3Form {
  fiscalYear: FormControl<number | null>;
  budgets: FormArray<FormGroup<IBudgetForm>>;
}

@Component({
  selector: "app-create-orden-compra-wizard",
  imports: [
    AutoCompleteModule,
    AutoCompleteModule,
    AvatarModule,
    CustomButton,
    CommonModule,
    CustomInputAutoComplete,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    FileUploadModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    MessageModule, // Added
    ReactiveFormsModule,
    StepsModule,
    TableModule,
    TagModule, // Added
  ],
  templateUrl: "./create-orden-compra-wizard.html",
})
export class CreateOrdenCompraWizard implements OnInit {
  privatefb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig); // Added
  private customToastS = inject(CustomToastService);
  public dialogHandlerS = inject(DialogHandlerService);
  private enumSelectS = inject(EnumSelectService); // Added

  items: MenuItem[];
  activeIndex: number = 0;
  submitting = signal(false);

  // Typed Forms
  step1Form: FormGroup<IStep1Form>;
  step3Form: FormGroup<IStep3Form>;

  fundingId: string | null = null;
  initialTipoGasto: number | null = null; // New helper variable

  itemsSignal = signal<any[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  cb_measurement_units = signal<ISelectItem[]>([]);
  cb_richProducts = signal<ISelectItem[]>([]);
  filteredRichProducts = signal<ISelectItem[]>([]);
  selectedProductForAutocomplete: any;

  // Budget Account signals
  cb_accounts = signal<ISelectItem[]>([]);
  filteredAccounts = signal<ISelectItem[]>([]);
  selectedAccountForAutocomplete = new FormControl<ISelectItem | null>(null);
  cb_fiscalYear = signal<ISelectItem[]>([]);

  // Funding signals
  fundingPeriodsByMonth = signal<any[]>([]);
  cb_fundingYear = signal<ISelectItem[]>([]);

  // Invoices state
  // Invoices state
  uploadedFiles = signal<File[]>([]);

  selectedProductControl = new FormControl<any>(null);
  providerControl = new FormControl<ISelectItem | null>(
    null,
    Validators.required,
  );

  tiposDeGastoOptions: ISelectItem[] = Object.keys(ETipoGasto)
    .filter((key) => !isNaN(Number(ETipoGasto[key])))
    .map((key) => ({
      value: ETipoGasto[key] as number,
      label: tipoGastoTitles[ETipoGasto[key] as number] || key,
    }));

  constructor() {
    this.items = [
      { label: "Información General" },
      { label: "Añadir Productos" },
      { label: "Asignar Presupuesto" },
      { label: "Facturas" },
      { label: "Resumen" },
    ];

    this.step1Form = new FormGroup<IStep1Form>({
      customerId: new FormControl(this.customerIdS.customerId(), {
        validators: Validators.required,
        nonNullable: true,
      }),
      providerId: new FormControl(null, { validators: Validators.required }),
      justificacionGasto: new FormControl("", {
        validators: Validators.required,
        nonNullable: true,
      }),
      notasEspeciales: new FormControl(""),
      equipoOInstalacion: new FormControl("", {
        validators: Validators.required,
        nonNullable: true,
      }),
      tipoGasto: new FormControl(null, { validators: Validators.required }),
      fundingYear: new FormControl(null),
      fundingPeriod: new FormControl(null),
    });

    this.step3Form = new FormGroup<IStep3Form>({
      fiscalYear: new FormControl(
        new Date().getFullYear(),
        Validators.required,
      ),
      budgets: new FormArray<FormGroup<IBudgetForm>>(
        [],
        [Validators.required, Validators.minLength(1)],
      ),
    });
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.fundingId = this.config.data.fundingId || null;
      this.initialTipoGasto = this.config.data.tipoGasto || null;

      if (this.initialTipoGasto) {
        this.step1Form.patchValue({ tipoGasto: this.initialTipoGasto });
      }

      // If a fundingId is passed, fetch its details to pre-fill the form
      if (this.fundingId) {
        this.apiResponseS
          .onGetItem<any>(`funding/${this.fundingId}`)
          .then((fundingData) => {
            if (fundingData) {
              this.step1Form.patchValue({
                fundingYear: fundingData.year, // The entity property is 'Year'
                fundingPeriod: fundingData.fundingPeriod,
              });
            }
          });
      }
    }
    this.cb_fiscalYear.set(this.generateYearOptions());
    this.onLoadSelects();
    this.loadFundingOptions();
    this.loadAccounts(this.step3Form.controls.fiscalYear.value);
  }

  async loadFundingOptions() {
    this.cb_fundingYear.set(this.generateYearOptions());
    const periods = await firstValueFrom(
      this.enumSelectS.onLoadEnumList("EFundingPeriod", false),
    );
    this.processFundingPeriods(periods as ISelectItem[]);
  }

  private generateYearOptions(): ISelectItem[] {
    const currentYear = new Date().getFullYear();
    return [
      { label: (currentYear - 1).toString(), value: currentYear - 1 },
      { label: currentYear.toString(), value: currentYear },
      { label: (currentYear + 1).toString(), value: currentYear + 1 },
    ];
  }

  processFundingPeriods(periods: ISelectItem[]) {
    const months: any = {};
    periods.forEach((period) => {
      const monthName = period.label.split(" ")[2];
      if (!months[monthName]) {
        months[monthName] = {
          monthName: monthName,
          quincenas: [],
        };
      }
      months[monthName].quincenas.push(period);
    });
    this.fundingPeriodsByMonth.set(Object.values(months));
  }

  selectFundingPeriod(quincena: ISelectItem) {
    const control = this.step1Form.get("fundingPeriod");
    if (control?.value === quincena.value) {
      control.setValue(null);
    } else {
      control.setValue(quincena.value);
    }
  }

  onLoadSelects(): void {
    const customerId: string = this.customerIdS.customerId();
    if (customerId) {
      // Changed from !== 0 to truthy check (non-empty string)
      this.apiResponseS
        .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.providers(customerId))
        .then((data) => this.cb_providers.set(data));
    }
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.measurementUnits)
      .then((data) => this.cb_measurement_units.set(data));
  }

  loadAccounts(fiscalYear: number): void {
    const customerId: string = this.customerIdS.customerId();
    if (customerId && fiscalYear) {
      // Changed from !== 0 to truthy check (non-empty string)
      this.apiResponseS
        .onGetSelectItem<
          ISelectItem[]
        >(Endpoints.SelectItems.accountingCatalogsByCustomerAndYear(customerId, fiscalYear))
        .then((data) => this.cb_accounts.set(data));
    }
  }

  onFiscalYearChange(newYear: number): void {
    this.budgetsFormArray.clear();
    this.loadAccounts(newYear);
  }

  openItemDetailModal(productData: any, index?: number): void {
    const data = {
      product: {
        ...productData,
        descuento: productData.descuento || 0,
        ivaAplicado: productData.ivaAplicado || 16, // Default IVA 16%?
        retencionIVAPorcentaje: productData.retencionIVAPorcentaje || 0,
        retencionISRPorcentaje: productData.retencionISRPorcentaje || 0,
      },
      measurementUnits: this.cb_measurement_units(),
    };

    this.dialogHandlerS
      .openDialog(
        OrdenCompraDetalleForm,
        data,
        productData.productoId ? "Editar Artóculo" : "Añadir Artóculo",
        this.dialogHandlerS.sizeMd,
      )
      .then((result: any) => {
        if (result) {
          if (index !== undefined && index > -1) {
            const items = [...this.itemsSignal()];
            items[index] = result;
            this.itemsSignal.set(items);
          } else {
            this.itemsSignal.update((items) => [...items, result]);
          }
        }
      });
  }

  onProductSelect(event: any): void {
    const selectedProduct = event.value;
    const existingItem = this.itemsSignal().find(
      (item) => item.productoId === selectedProduct.value,
    );

    if (existingItem) {
      this.customToastS.showInfo(
        "Producto ya agregado",
        "Este producto ya se encuentra en la lista.",
      );
    } else {
      this.openItemDetailModal({
        productoId: selectedProduct.value,
        productName: selectedProduct.label,
        image: selectedProduct.image,
      });
    }

    setTimeout(() => {
      this.selectedProductControl.setValue(null);
      this.filteredRichProducts.set([]);
    });
  }

  editItem(item: any, index: number): void {
    this.openItemDetailModal(item, index);
  }

  removeItem(index: number): void {
    this.itemsSignal.update((items) => items.filter((_, i) => i !== index));
  }

  filterRichProducts(event: { originalEvent: Event; query: string }): void {
    const query = event.query;
    if (query.length < 3) return;

    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.richProducts(query))
      .then((data) => {
        this.filteredRichProducts.set(data || []);
      });
  }

  get budgetsFormArray(): FormArray<FormGroup<IBudgetForm>> {
    return this.step3Form.controls.budgets;
  }

  onAccountSelect(selectedAccount: ISelectItem): void {
    if (!selectedAccount) return;

    const parts = selectedAccount.label.split("|");
    const code = parts[0]?.trim() || "";
    const name = parts[1]?.trim() || selectedAccount.label;

    this.addBudget(selectedAccount.value, code, name);

    setTimeout(() => {
      this.selectedAccountForAutocomplete.setValue(null);
    });
  }

  calculateTotalProducts(): number {
    return this.itemsSignal().reduce((acc, item) => {
      const subtotal =
        Number(item.quantity) * Number(item.unitPrice) -
        Number(item.descuento || 0);
      const total = subtotal * (1 + Number(item.ivaAplicado || 0) / 100);
      return acc + total;
    }, 0);
  }

  createBudget(
    accountId: any,
    accountNumber: string,
    accountName: string,
    initialAmount: number = 0,
  ): FormGroup<IBudgetForm> {
    return new FormGroup<IBudgetForm>({
      accountId: new FormControl(accountId, Validators.required),
      accountNumber: new FormControl(
        { value: accountNumber, disabled: true },
        Validators.required,
      ),
      accountName: new FormControl(
        { value: accountName, disabled: true },
        Validators.required,
      ),
      amount: new FormControl(initialAmount, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });
  }

  addBudget(
    accountId?: any,
    accountNumber: string = "",
    accountName: string = "",
  ): void {
    let amount = 0;
    if (this.budgetsFormArray.length === 0) {
      amount = this.calculateTotalProducts();
    }

    this.budgetsFormArray.push(
      this.createBudget(accountId, accountNumber, accountName, amount),
    );
  }

  removeBudget(index: number): void {
    this.budgetsFormArray.removeAt(index);
  }

  // Invoice Methods
  onFilesSelect(event: any): void {
    // PrimeNG sends { files: File[] }
    // We append new files to our signal list
    const newFiles: File[] = event.files;
    this.uploadedFiles.update((current) => {
      // Avoid duplicates by name + size fallback
      const unique = [...current];
      for (const file of newFiles) {
        if (!unique.some((f) => f.name === file.name && f.size === file.size)) {
          unique.push(file);
        }
      }
      return unique;
    });
  }

  onFileRemove(event: any): void {
    const fileToRemove = event.file;
    this.uploadedFiles.update((files) =>
      files.filter((f) => f.name !== fileToRemove.name),
    );
  }

  onClearFiles(): void {
    this.uploadedFiles.set([]);
  }

  getActionIcon(fileName: string): string {
    if (fileName.endsWith(".pdf")) return "mdi:file-pdf-box text-red-500";
    if (fileName.endsWith(".xml")) return "mdi:file-code text-blue-500";
    return "mdi:file-document-outline";
  }

  saveProviderId(item: ISelectItem): void {
    this.step1Form.patchValue({ providerId: item?.value });
    this.providerControl.setValue(item);
  }

  getTipoGastoLabel(value: number): string {
    return (
      this.tiposDeGastoOptions.find((option) => option.value === value)
        ?.label || "No definido"
    );
  }

  getMeasurementUnitLabel(unitId: any): string {
    return (
      this.cb_measurement_units().find((u) => u.value === unitId)?.label ||
      "N/A"
    );
  }

  nextStep() {
    if (this.activeIndex === 0) {
      if (
        !this.apiResponseS.validateForm(this.step1Form) ||
        !this.providerControl.valid
      ) {
        return this.customToastS.showError(
          "Formulario Invólido",
          "Por favor, complete todos los campos de Información General.",
        );
      }
    }
    if (this.activeIndex === 1) {
      if (this.itemsSignal().length === 0) {
        return this.customToastS.showError(
          "Formulario Invólido",
          "Debe Añadir al menos un producto.",
        );
      }
    }
    if (this.activeIndex === 2) {
      if (
        this.budgetsFormArray.length === 0 ||
        !this.apiResponseS.validateForm(this.step3Form)
      ) {
        return this.customToastS.showError(
          "Formulario Invólido",
          "Debe Añadir al menos una cuenta de presupuesto.",
        );
      }
    }
    // Step 3 (Invoices) is optional, no validation needed to proceed

    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    }
  }

  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  onSubmit() {
    if (
      !this.apiResponseS.validateForm(this.step1Form) ||
      !this.providerControl.valid
    ) {
      this.activeIndex = 0;
      return this.customToastS.showError(
        "Formulario Invólido",
        "La información general estó incompleta.",
      );
    }
    if (this.itemsSignal().length === 0) {
      this.activeIndex = 1;
      return this.customToastS.showError(
        "Formulario Invólido",
        "Debe Añadir al menos un producto.",
      );
    }
    if (
      this.budgetsFormArray.length === 0 ||
      !this.apiResponseS.validateForm(this.step3Form)
    ) {
      this.activeIndex = 2;
      return this.customToastS.showError(
        "Formulario Invólido",
        "La información de presupuesto estó incompleta.",
      );
    }

    this.submitting.set(true);
    const step1 = this.step1Form.getRawValue();

    // Use getRawValue() to include disabled fields (AccountNumber, AccountName)
    const step3 = this.step3Form.getRawValue();

    const finalPayload = {
      customerId: step1.customerId,
      providerId: step1.providerId,
      fundingId: this.fundingId,
      justificacionGasto: step1.justificacionGasto,
      notasEspeciales: step1.notasEspeciales,
      equipoOInstalacion: step1.equipoOInstalacion,
      tipoGasto: step1.tipoGasto,
      fundingYear: step1.fundingYear,
      fundingPeriod: step1.fundingPeriod,
      items: this.itemsSignal().map((item) => ({
        productoId: item.productoId,
        unidadMedidaId: item.unidadMedidaId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        descuento: Number(item.descuento || 0),
        ivaAplicado: Number(item.ivaAplicado || 0),
        retencionIVAPorcentaje: Number(item.retencionIVAPorcentaje || 0),
        retencionISRPorcentaje: Number(item.retencionISRPorcentaje || 0),
      })),
      budgets: step3.budgets.map((b) => ({
        accountId: b.accountId,
        accountNumber: b.accountNumber,
        accountName: b.accountName,
        amount: Number(b.amount),
        fiscalYear: step3.fiscalYear,
      })),
    };

    this.apiResponseS
      .onPost(Endpoints.PurchaseOrders.progressiveCreate, finalPayload)
      .then(async (result: any) => {
        if (result && result.id) {
          const ordenCompraId = result.id;

          // Upload invoices sequentially if any
          if (this.uploadedFiles().length > 0) {
            // Group files by base name (without extension)
            const groupedFiles: { [key: string]: { pdf?: File; xml?: File } } =
              {};

            for (const file of this.uploadedFiles()) {
              const extension = file.name.split(".").pop()?.toLowerCase();
              const baseName = file.name.substring(
                0,
                file.name.lastIndexOf("."),
              );

              if (!groupedFiles[baseName]) {
                groupedFiles[baseName] = {};
              }

              if (extension === "pdf") {
                groupedFiles[baseName].pdf = file;
              } else if (extension === "xml") {
                groupedFiles[baseName].xml = file;
              }
            }

            // Iterate over groups and upload
            // Note: If there are files without a pair, we upload them individually anyway if possible,
            // or we might skip if the backend requires strict pairs.
            // Start with strict pair upload attempts, or just upload whatever we have.
            // The existing endpoint likely takes PdfFile/XmlFile optional.

            for (const baseName in groupedFiles) {
              const group = groupedFiles[baseName];
              const formData = new FormData();
              if (group.pdf) formData.append("PdfFile", group.pdf);
              if (group.xml) formData.append("XmlFile", group.xml);

              if (group.pdf || group.xml) {
                try {
                  await this.apiResponseS.onPost(
                    Endpoints.PurchaseOrders.uploadInvoice(ordenCompraId),
                    formData,
                  );
                } catch (error) {
                  console.error(
                    "Error uploading invoice group " + baseName,
                    error,
                  );
                  // We continue uploading others even if one fails
                }
              }
            }
          }

          this.ref.close(true);
        }
        this.submitting.set(false);
      })
      .catch((error) => {
        console.error("Error creating PO", error);
        this.submitting.set(false);
      });
  }
}

