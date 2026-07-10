import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {} from "@ionic/angular/standalone";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CardModule } from "primeng/card";
import { TooltipModule } from "primeng/tooltip";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-general-anual-mantenimiento",
  templateUrl: "./general-anual-mantenimiento.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CardModule,

    TooltipModule,
    AppIcon,
    SanitizeHtmlPipe,
  ],
})
export class GeneralAnualMantenimiento {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  providerIdControl = new FormControl<string>("");

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadProveedores();
        this.onLoadData();
      }
    });
  }

  onLoadProveedores() {
    const url = `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(url).then((result: any) => {
      this.cb_providers.set([
        { label: "Todos", value: "" } as any,
        ...(result || []),
      ]);
    });
  }

  onLoadData() {
    this.dataSignal.set([]);
    const url = `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdS.customerId()}/${
      this.providerIdControl.value || ""
    }`;
    this.apiResponseS.onGetList(url).then((result: any) => {
      this.dataSignal.set(result || []);
    });
  }
}
