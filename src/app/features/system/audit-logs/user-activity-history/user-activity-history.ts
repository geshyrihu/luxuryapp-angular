import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrModule, provideFlatpickrDefaults } from "angularx-flatpickr";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
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
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-user-activity-history",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    FlatpickrModule,
    WebButtonLabel,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    DataViewMobile,
    PrimeNgCustomCaption,
    AppIcon,
  ],
  templateUrl: "./user-activity-history.html",
  providers: [
    provideFlatpickrDefaults({
      dateFormat: "d/m/Y",
      locale: "es",
    }),
  ],
})
export class UserActivityHistory implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  dateS = inject(DateService);
  data = signal<any[]>([]);
  loading = signal(true);

  // Signals para paginación y búsqueda
  totalRecords = signal(0);
  rows = signal(tablePrimeNgRows());
  searchTerm = signal<string>("");
  currentPage = signal(1);

  // Signals para filtros de UI
  filterCustomerIdControl = new FormControl<string | null>(null);
  filterUserTypeControl = new FormControl<any | null>(0);
  filterDateRangeControl = new FormControl<Date[] | null>(null);

  customerOptions: ISelectItem[] = [];
  userTypeOptions: ISelectItem[] = [];
  isUserAdmin = false;

  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  ngOnInit(): void {
    this.isUserAdmin = this.aspRoleS.hasAny([
      EApplicationRole.SuperUsuario,
      EApplicationRole.Administrador,
    ]);

    this.setupFilters();
    this.onLoadData(true); // Carga inicial
  }

  get isSearchDisabled(): boolean {
    const isCustomerMissing = this.filterCustomerIdControl.value === null;
    const isUserTypeMissing = !this.filterUserTypeControl.value;
    const dates = this.filterDateRangeControl.value;
    const isDateRangeMissing = !dates || dates.length < 2;
    return isCustomerMissing || isUserTypeMissing || isDateRangeMissing;
  }

  setupFilters(): void {
    this.userTypeOptions = [
      { label: "Empleado", value: "Employee" },
      { label: "Proveedor", value: "Provider" },
      { label: "Condomino", value: "Client" },
    ];

    if (this.isUserAdmin) {
      this.customerOptions = this.authS.customerAccess.map((c) => ({
        label: c.label,
        value: c.value,
      }));
      this.filterCustomerIdControl.setValue(null);
    } else {
      const userCustomerId = this.authS.infoUserAuth.customerId;
      const userCustomerName = this.authS.customerAccess.find(
        (c) => c.value === userCustomerId,
      )?.label;
      this.filterCustomerIdControl.setValue(userCustomerId);
      this.customerOptions = [
        { label: userCustomerName, value: userCustomerId },
      ];
    }
  }

  onLoadData(isNewSearch: boolean = false): void {
    if (isNewSearch) {
      this.currentPage.set(1);
    }

    this.loading.set(true);

    const params: any = {
      page: this.currentPage(),
      recordsNumber: this.rows(),
      filter: this.searchTerm(),
    };

    if (this.filterCustomerIdControl.value) {
      params.customerId = this.filterCustomerIdControl.value;
    }
    if (this.filterUserTypeControl.value) {
      params.userType = this.filterUserTypeControl.value;
    }
    const dates = this.filterDateRangeControl.value;
    if (dates && dates.length === 2) {
      if (dates[0]) {
        params.startDate = this.dateS.getDateFormat(dates[0]);
      }
      if (dates[1]) {
        params.endDate = this.dateS.getDateFormat(dates[1]);
      }
    }

    this.apiResponseS
      .onGetList(Endpoints.UserActivityHistory.base, params)
      .then((result: any) => {
        if (result) {
          if (isNewSearch) {
            this.data.set(result.items);
          } else {
            this.data.update((current) => [...current, ...result.items]);
          }
          this.totalRecords.set(result.totalRecords);
        } else {
          this.data.set([]);
          this.totalRecords.set(0);
        }
        this.loading.set(false);
      });
  }

  onPageChange(event: any): void {
    this.rows.set(event.rows);
    this.currentPage.set(event.first / event.rows + 1);
    this.onLoadData(true); // En la tabla de escritorio, cada cambio de página es una nueva búsqueda
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.onLoadData(true);
  }

  loadMore(): void {
    this.currentPage.update((p) => p + 1);
    this.onLoadData();
  }
}
