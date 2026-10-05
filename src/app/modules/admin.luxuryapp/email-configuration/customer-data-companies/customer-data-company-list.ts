import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { CustomerDataCompanyForm } from "./customer-data-company-form";
import { CustomerDataCompanyDto } from "./customer-data-company.dto";
import { CustomerDataCompanyListDesktop } from "./desktop/customer-data-company-list-desktop";
import { CustomerDataCompanyListMobile } from "./mobile/customer-data-company-list-mobile";

@Component({
  selector: "app-customer-data-company-list",
  templateUrl: "./customer-data-company-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomerDataCompanyListDesktop, CustomerDataCompanyListMobile],
})
export class CustomerDataCompanyList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  data = signal<CustomerDataCompanyDto[]>([]);
  readonly globalFilterFields = signal<string[]>([
    "customer",
    "email",
    "phoneNumber",
    "applicationUser",
    "applicationRoleName",
  ]);
  loading = signal(true);
  ref: DynamicDialogRef;

  groupingOptions = [
    { label: "Agrupar por Cliente", value: "numeroCliente" },
    { label: "Agrupar por Rol", value: "applicationRoleSortOrder" },
  ];
  groupingOptionControl = new FormControl<string>("numeroCliente", {
    nonNullable: true,
  });
  groupingOption = signal<string>("numeroCliente");

  sortedData = computed(() => {
    const data = [...(this.data() ?? [])];
    const key = this.groupingOption();

    if (key === "numeroCliente") {
      // Agrupar por cliente: ordenar por numeroCliente y luego por el orden del rol
      data.sort((a, b) => {
        const numeroClienteCompare = a.numeroCliente.localeCompare(
          b.numeroCliente,
          undefined,
          { numeric: true },
        );
        if (numeroClienteCompare !== 0) {
          return numeroClienteCompare;
        }
        return a.applicationRoleSortOrder - b.applicationRoleSortOrder;
      });
    } else if (key === "applicationRoleSortOrder") {
      // Agrupar por rol: ordenar por el orden del rol y luego por el numeroCliente
      data.sort((a, b) => {
        const roleSortOrderCompare =
          a.applicationRoleSortOrder - b.applicationRoleSortOrder;
        if (roleSortOrderCompare !== 0) {
          return roleSortOrderCompare;
        }
        return a.numeroCliente.localeCompare(b.numeroCliente, undefined, {
          numeric: true,
        });
      });
    }
    return data;
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CustomerDataCompany.getAll)
      .then((result: CustomerDataCompanyDto[]) => {
        this.data.set(result ?? []);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.CustomerDataCompany.delete(id))
      .then((result: boolean) => {
        if (result)
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CustomerDataCompanyForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
