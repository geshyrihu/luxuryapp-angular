import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PlatformService } from "@core/services/platform.service";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { ROUTES } from "src/app/routing/route-paths";
import { EmployeeFileListDesktop } from "./desktop/employee-file-list-desktop";
import { EmployeeFileSummaryDTO } from "./interfaces/employee-file.interfaces";
import { EmployeeFileListMobile } from "./mobile/employee-file-list-mobile";

@Component({
  selector: "app-employee-file-list",
  templateUrl: "./employee-file-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LuxInputSelectSignal,
    EmployeeFileListDesktop,
    EmployeeFileListMobile,
  ],
})
export class EmployeeFileList {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  platformS = inject(PlatformService);

  dataSignal = signal<EmployeeFileSummaryDTO[]>([]);
  isActiveFilter = signal<boolean | null>(null);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  statusOptions = [
    { label: "Todos", value: null },
    { label: "Activos", value: true },
    { label: "Inactivos", value: false },
  ];

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData(): void {
    const endpoint = Endpoints.HR.EmployeeFile.getAll(
      this.customerIdS.customerId(),
      this.isActiveFilter(),
    );
    this.apiResponseS
      .onGetList<EmployeeFileSummaryDTO[]>(endpoint)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onStatusChange(event: { value: boolean | null }): void {
    this.isActiveFilter.set(event.value);
    this.onLoadData();
  }

  onViewFile(item: EmployeeFileSummaryDTO): void {
    this.router.navigate(ROUTES.RECURSOS_HUMANOS.EXPEDIENTE(item.id));
  }
}
