import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { EDocumentType } from "@legal.luxuryapp/legal/interfaces/document-type.enum";
import { TemplatesListDesktop } from "./desktop/templates-list-desktop";
import { TemplatesListMobile } from "./mobile/templates-list-mobile";
import { TemplatesForm } from "./templates-form";

@Component({
  selector: "app-templates-list",
  templateUrl: "./templates-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TemplatesListDesktop, TemplatesListMobile],
})
export class TemplatesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  public aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  public AspRole = ApplicationRole;

  // Usar el servicio global para scrollHeight
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  // Seóales
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  isSuperUsuario = computed(() =>
    this.aspRoleS.hasRole(this.AspRole.SuperUsuario),
  );

  loading = signal(true);
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    const urlApi = Endpoints.CustomDocuments.listByCustomerAndType(
      customerId,
      EDocumentType.Template,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.CustomDocuments.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(TemplatesForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
