import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonAccordion, IonAccordionGroup } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { add, briefcaseOutline, calendarOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CATALOGO_GASTOS_FIJOS_LIST_MODULES } from "./catalogo-gastos-fijos-list-moduls";

@Component({
  selector: "app-catalogo-gastos-fijos-list",
  templateUrl: "./catalogo-gastos-fijos-list.html",
  imports: [
    EmptyState,
    IonAccordion,
    IonAccordionGroup,
    ...CATALOGO_GASTOS_FIJOS_LIST_MODULES,


  ],
})
export class CatalogoGastosFijosList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  routerS = inject(Router);
  customToastS = inject(CustomToastService);
  enumSelectS = inject(EnumSelectService); // Inject EnumSelectService

  dataSignal = signal<any[]>([]);
  public selectedItems = signal<any[]>([]);
  public AspRole = EApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  fundingYear = signal<number>(new Date().getFullYear()); // Default to current year
  selectedMonthName = signal<string | null>(null); // Only select the Month Name

  cb_fundingYear: ISelectItem[] = [];
  cb_fundingPeriod: ISelectItem[] = [];
  fundingPeriodsByMonth = signal<any[]>([]);

  allFundingsForYear = signal<any[]>([]);

  private readonly SPANISH_MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  selectedFundingStatus = computed(() => {
    const monthName = this.selectedMonthName();
    const year = this.fundingYear();
    const fondeos = this.allFundingsForYear();

    if (!monthName || !year || fondeos.length === 0) return null;

    const monthIndex = this.SPANISH_MONTHS.indexOf(monthName);
    if (monthIndex === -1) return null;

    const matching = fondeos.filter((f: any) => {
      const date = new Date(f.periodDate);
      return date.getFullYear() === year && date.getMonth() === monthIndex;
    });

    if (matching.length === 0) return null;

    const toStatus = (f: any) =>
      f
        ? { isVerified: !!f.verifiedByName, isAuthorized: !!f.authorizedByName, isConfirmed: !!f.confirmedByName }
        : null;

    return {
      firstQNA: toStatus(matching.find((f: any) => new Date(f.periodDate).getDate() <= 15)),
      secondQNA: toStatus(matching.find((f: any) => new Date(f.periodDate).getDate() > 15)),
    };
  });

  isGenerationParamsSelected = computed(
    () => this.fundingYear() !== null && this.selectedMonthName() !== null,
  );

  isFirstQuincenaGenerationBlocked = computed(
    () => this.selectedFundingStatus()?.firstQNA?.isVerified === true,
  );

  isSecondQuincenaGenerationBlocked = computed(
    () => this.selectedFundingStatus()?.secondQNA?.isVerified === true,
  );

  // Computed signal to determine if all items are selected
  isAllSelected = computed(() => {
    return (
      this.dataSignal().length > 0 &&
      this.dataSignal().every((item) => item.crearOrdenCompra)
    );
  });

  isFirstQuincenaSelected = computed(() =>
    this.dataSignal().some(
      (item) => item.quincena === 0 && item.crearOrdenCompra,
    ),
  );
  isSecondQuincenaSelected = computed(() =>
    this.dataSignal().some(
      (item) => item.quincena === 1 && item.crearOrdenCompra,
    ),
  );

  constructor() {
    addIcons({ add, briefcaseOutline, calendarOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
        this.loadFundingOptions();
        this.loadAllFundings();
      }
    });
  }

  private generateYearOptions(): ISelectItem[] {
    const currentYear = new Date().getFullYear();
    return [
      { label: currentYear.toString(), value: currentYear },
      { label: (currentYear + 1).toString(), value: currentYear + 1 },
    ];
  }

  async loadFundingOptions() {
    this.cb_fundingYear = this.generateYearOptions();
    this.cb_fundingPeriod = (await firstValueFrom(
      this.enumSelectS.onLoadEnumList("EFundingPeriod", false),
    )) as ISelectItem[];
    this.processFundingPeriods(this.cb_fundingPeriod);
  }

  async loadAllFundings(): Promise<void> {
    const result: any = await this.apiResponseS.onGetList(
      `Funding/list/${this.customerIdS.customerId()}`,
    );
    if (result) {
      this.allFundingsForYear.set(result);
    }
  }

  processFundingPeriods(periods: ISelectItem[]) {
    const months: any = {};
    periods.forEach((period) => {
      // Assuming format like "1ra Quincena Enero"
      // Split by space and take the third element for month name (index 2)
      // If the label is just "Enero", then monthName will be "Enero"
      const parts = period.label.split(" ");
      const monthName = parts.length > 2 ? parts[2] : parts[0];

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

  selectMonth(monthName: string) {
    if (this.selectedMonthName() === monthName) {
      this.selectedMonthName.set(null);
    } else {
      this.selectedMonthName.set(monthName);
    }
  }

  onLoadData() {
    const urlApi = `CatalogoGastosFijos/list/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result);
      this.updateSelectedItems();
    });
  }

  updateSelectedItems(): void {
    this.selectedItems.set(
      this.dataSignal().filter((item) => item.crearOrdenCompra),
    );
  }

  onItemCheckChange(item: any, isChecked: boolean) {
    // Actualizar el estado de la señal de forma inmutable para garantizar la reactividad
    this.dataSignal.update((currentData) => {
      const itemToUpdate = currentData.find((i) => i.id === item.id);
      if (itemToUpdate) {
        itemToUpdate.crearOrdenCompra = isChecked;
      }
      return [...currentData]; // Retornar una nueva referencia del arreglo
    });

    // Llamar a la API para persistir el cambio
    this.updateItemSelectionOnApi(item.id, isChecked);
    // Actualizar la lista de seleccionados
    this.updateSelectedItems();
  }

  updateItemSelectionOnApi(id: any, value: any) {
    const urlApi = `CatalogoGastosFijos/UpdateValidation/${id}/${value}`;
    this.apiResponseS.onGetListNotLoading(urlApi, null).then(() => {
      // Opcional: se podría volver a llamar a updateSelectedItems aquí si hubiera alguna duda,
      // pero ya se hace en el método que origina el cambio.
    });
  }

  selectAllItems(): void {
    this.dataSignal.update((currentData) => {
      currentData.forEach((item) => {
        if (!item.crearOrdenCompra) {
          item.crearOrdenCompra = true;
          this.updateItemSelectionOnApi(item.id, true);
        }
      });
      return [...currentData];
    });
    this.updateSelectedItems();
  }

  deselectAllItems(): void {
    this.dataSignal.update((currentData) => {
      currentData.forEach((item) => {
        if (item.crearOrdenCompra) {
          item.crearOrdenCompra = false;
          this.updateItemSelectionOnApi(item.id, false);
        }
      });
      return [...currentData];
    });
    this.updateSelectedItems();
  }

  // Toggle all items based on the master checkbox
  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectAllItems();
    } else {
      this.deselectAllItems();
    }
  }

  /**
   * Alterna la selección de los ítems de una quincena específica (Toggle).
   * No afecta a los ítems de otras quincenas.
   * @param quincenaTarget 0 para 1ra Quincena, 1 para 2da Quincena
   */
  selectByQuincena(quincenaTarget: number) {
    this.dataSignal.update((currentData) => {
      // 1. Filtrar los ítems que pertenecen a la quincena objetivo
      const targetItems = currentData.filter(
        (item: any) => item.quincena === quincenaTarget,
      );

      if (targetItems.length === 0) return currentData;

      // 2. Verificar si todos los ítems de esa quincena ya están seleccionados
      const allSelected = targetItems.every(
        (item: any) => item.crearOrdenCompra,
      );

      // 3. Determinar el nuevo estado
      const newState = !allSelected;

      let paramsUpdated = false;

      targetItems.forEach((item: any) => {
        // Solo actualizar si el estado es diferente
        if (item.crearOrdenCompra !== newState) {
          item.crearOrdenCompra = newState;
          // Llamada optimista a la API
          this.updateItemSelectionOnApi(item.id, newState);
          paramsUpdated = true;
        }
      });

      if (paramsUpdated) {
        // Notificar al usuario (side effect fuera del update idealmente, pero aceptable aquí)
        // Nota: updateSelectedItems se llamará después
        this.customToastS.showInfo(
          "Selección Actualizada",
          `Se han ${newState ? "marcado" : "desmarcado"} los registros de la ${quincenaTarget === 0 ? "1ra" : "2da"
          } quincena.`,
        );
      }
      return [...currentData]; // Retornar nueva referencia para disparar reactividad
    });
    // Actualizar items seleccionados
    this.updateSelectedItems();
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`catalogogastosfijos/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
          this.updateSelectedItems();
        }
      });
  }

  onCreate() {
    this.routerS.navigate(["/catalogo-gastos-fijos/create"]);
  }
  onEdit(id: any) {
    this.routerS.navigate(["/catalogo-gastos-fijos/edit", id]);
  }

  onModal(data: { id: string; title: string }): void {
    this.routerS.navigate(["/purchases/catalogo-gastos-fijos-form", data.id]);
  }

  generateOrdenesPorQuincena(quincenaIndex: number) {
    if (!this.isGenerationParamsSelected()) {
      this.customToastS.showError(
        "Faltan Datos",
        "Por favor, selecciona un Año y un Mes.",
      );
      return;
    }

    const monthData = this.fundingPeriodsByMonth().find(
      (m) => m.monthName === this.selectedMonthName(),
    );

    if (!monthData || !monthData.quincenas[quincenaIndex]) {
      this.customToastS.showError(
        "Error",
        "No se encontró el periodo para la quincena seleccionada.",
      );
      return;
    }

    const fundingPeriodId = monthData.quincenas[quincenaIndex].value;

    const urlApi = `OrdenCompra/GenerarOrdenCompraFijos/${this.customerIdS.customerId()}/${quincenaIndex}/${this.fundingYear()}/${fundingPeriodId}`;

    this.apiResponseS.onPostNotLoading(urlApi, {}).then((result) => {
      if (result !== false) {
        this.customToastS.showSuccess(
          `Generación Exitosa`,
          `Órdenes de la ${quincenaIndex === 0 ? "1ra" : "2da"} quincena de ${this.selectedMonthName()} generadas.`,
        );
      }
    });
  }
}









