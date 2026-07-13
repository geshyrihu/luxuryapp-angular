import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CATALOGO_GASTOS_FIJOS_LIST_MODULES } from "./catalogo-gastos-fijos-list-moduls";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxAccordion } from "@ui/adaptive/accordion/accordion";
import { LxCheckbox } from "@ui/adaptive/checkbox/checkbox";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { MobileButtonLabel } from "@ui/buttons/mobile-label/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { InputSelect } from "@ui/inputs/adaptive/input-select/input-select";
import { MobileBadge } from "@ui/mobile/badge/badge";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";

@Component({
  selector: "app-catalogo-gastos-fijos-list",
  templateUrl: "./catalogo-gastos-fijos-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonLabel,
    IonInputCheckbox,
    IonInputSelect,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    AppIcon,
    LxAccordion,
    LxTabs,
    LxCheckbox,
    MobileBadge,
    MobileButtonLabel,
    ...CATALOGO_GASTOS_FIJOS_LIST_MODULES,
    LxMessage,
    InputSelect,
    MobileListItem,
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
  public AspRole = ApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  fundingYear = signal<number>(new Date().getFullYear()); // Default to current year
  selectedMonthName = signal<string | null>(null); // Only select the Month Name

  cb_fundingYear: SelectItemDto[] = [];
  cb_fundingPeriod: SelectItemDto[] = [];
  fundingPeriodsByMonth = signal<any[]>([]);

  /** Accordion móvil (una sola sección colapsable). */
  genAccordionItems = [
    { id: "generation", title: "Generar órdenes de Compra" },
  ];
  genExpanded = signal<string[]>([]);

  /** Selector de mes como tabs (id = monthName, label = abreviatura). */
  monthTabs = computed(() =>
    this.fundingPeriodsByMonth().map((m: any) => ({
      id: m.monthName as string,
      label: (m.monthName as string).slice(0, 3).toUpperCase(),
    })),
  );

  allFundingsForYear = signal<any[]>([]);

  private readonly SPANISH_MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
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
        ? {
            isVerified: !!f.verifiedByName,
            isAuthorized: !!f.authorizedByName,
            isConfirmed: !!f.confirmedByName,
          }
        : null;

    return {
      firstQNA: toStatus(
        matching.find((f: any) => new Date(f.periodDate).getDate() <= 15),
      ),
      secondQNA: toStatus(
        matching.find((f: any) => new Date(f.periodDate).getDate() > 15),
      ),
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
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
        this.loadFundingOptions();
        this.loadAllFundings();
      }
    });
  }

  private generateYearOptions(): SelectItemDto[] {
    const currentYear = new Date().getFullYear();
    return [
      { label: currentYear.toString(), value: currentYear },
      { label: (currentYear + 1).toString(), value: currentYear + 1 },
    ];
  }

  async loadFundingOptions() {
    this.cb_fundingYear = this.generateYearOptions();
    this.cb_fundingPeriod = (await firstValueFrom(
      this.enumSelectS.onLoadEnumList("e-funding-period", false),
    )) as SelectItemDto[];
    this.processFundingPeriods(this.cb_fundingPeriod);
  }

  async loadAllFundings(): Promise<void> {
    const result: any = await this.apiResponseS.onGetList(
      Endpoints.Funding.list(this.customerIdS.customerId()),
    );
    if (result) {
      this.allFundingsForYear.set(result);
    }
  }

  processFundingPeriods(periods: SelectItemDto[]) {
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
    const urlApi = Endpoints.RefactorContabilidad.catalogoGastosFijosListById(this.customerIdS.customerId());
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
    const urlApi = Endpoints.RefactorContabilidad.catalogoGastosFijosUpdateValidationByIdById(id, value);
    this.apiResponseS.onGetListNotLoading(urlApi, null).then(() => {
      // Opcional: se podría volver a llamar a updateSelectedItems aqué si hubiera alguna duda,
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
   * Alterna la selección de los ótems de una quincena específica (Toggle).
   * No afecta a los ótems de otras quincenas.
   * @param quincenaTarget 0 para 1ra Quincena, 1 para 2da Quincena
   */
  selectByQuincena(quincenaTarget: number) {
    this.dataSignal.update((currentData) => {
      // 1. Filtrar los ótems que pertenecen a la quincena objetivo
      const targetItems = currentData.filter(
        (item: any) => item.quincena === quincenaTarget,
      );

      if (targetItems.length === 0) return currentData;

      // 2. Verificar si todos los ótems de esa quincena ya estén seleccionados
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
        // Notificar al usuario (side effect fuera del update idealmente, pero aceptable aqué)
        // Nota: updateSelectedItems se llamaré después
        this.customToastS.showInfo(
          "Selección Actualizada",
          `Se han ${newState ? "marcado" : "desmarcado"} los registros de la ${
            quincenaTarget === 0 ? "1ra" : "2da"
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
      .onDelete(Endpoints.RefactorContabilidad.catalogogastosfijosById(id))
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
        "No se encontré el periodo para la quincena seleccionada.",
      );
      return;
    }

    const fundingPeriodId = monthData.quincenas[quincenaIndex].value;

    const urlApi = Endpoints.RefactorContabilidad.ordenCompraGenerarOrdenCompraFijosByIdByIdByIdById(this.customerIdS.customerId(), quincenaIndex, this.fundingYear(), fundingPeriodId);

    this.apiResponseS.onPostNotLoading(urlApi, {}).then((result) => {
      if (result !== false) {
        this.customToastS.showSuccess(
          `Generación Exitosa`,
          `órdenes de la ${quincenaIndex === 0 ? "1ra" : "2da"} quincena de ${this.selectedMonthName()} generadas.`,
        );
      }
    });
  }
}
