import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  IonAvatar,


  IonList,
  IonListHeader,
} from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { TooltipModule } from "primeng/tooltip";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-general-anual-mantenimiento",
  templateUrl: "./general-anual-mantenimiento.html",
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CardModule,

    TooltipModule,

    IonList,
    IonListHeader,

    IonAvatar,
    SanitizeHtmlPipe,
  ],
})
export class GeneralAnualMantenimiento implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);
  cb_providers: ISelectItem[] = [];
  providerIdControl = new FormControl<string>("");

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  ngOnInit() {
    this.onLoadData();
    this.onLoadProveedores();
  }
  onLoadProveedores() {
    this.cb_providers = [];
    const url = `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(url).then((result: any) => {
      this.cb_providers = result;
    });
  }
  onLoadData() {
    this.dataSignal.set([]);
    const url = `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdS.customerId()}/${this.providerIdControl.value || ""
      }`;
    this.apiResponseS.onGetList(url).then((result: any) => {
      this.dataSignal.set(result);
    });
  }
}









