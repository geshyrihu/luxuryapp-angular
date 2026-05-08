import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonList, IonToggle } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
// En tu componente .ts
interface ModuleGroup {
  key: string; // PathParent
  items: CustomerModulListDTO[];
}

interface CustomerModulListDTO {
  customerId: string;
  nameCustomer: string;
  moduleAppId: string;
  moduleAppName: string;
  isAssigned: boolean;
  photoPath?: string;
  numeroCliente?: string;
  register?: string;
  pathParent?: string;
}

@Component({
  selector: "app-customer-modul-edit",
  imports: [
    CommonModule,
    MessageModule,
    ProgressSpinnerModule,
    IonList,

    IonToggle,
  ],
  templateUrl: "./customer-modul-edit.html",
})
export class CustomerModulEdit implements OnInit {
  apiResponseS = inject(ApiResponseService);
  activatedRoute = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);
  dataConnectorS = inject(DataConnectorService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  groupedData: any[] = []; // Ahora será un array de grupos
  loading = signal(true);
  customerId: string | null = null;
  customerName: string = "";

  constructor() {
    addIcons({ checkmarkOutline, closeOutline });
  }

  ngOnInit(): void {
    this.customerId = this.config.data.customerId;
    this.customerName = this.config.data.nameCustomer || "Cliente";
    this.onLoadData(this.customerId);
  }

  onLoadData(customerId: string): void {
    const urlApi = Endpoints.ModuleAppCustomers.customerModules(customerId);
    this.apiResponseS.onGetList(urlApi).then((result: any[]) => {
      console.log("Datos recibidos:", result); // 👈 ¡Mira esto en la consola del navegador!
      this.groupedData = result;
      this.loading.set(false);
    });
  }

  toggleModuleActivation(item: any): void {
    item.isAssigned = !item.isAssigned;
    this.updateModuleStatus(item);
  }

  updateModuleStatus(item: any): void {
    const urlApi = Endpoints.ModuleAppCustomers.updateModuleStatus;
    const data = {
      customerId: this.customerId,
      moduleAppId: item.moduleAppId,
      isAssigned: item.isAssigned,
    };

    this.dataConnectorS.post(urlApi, data).subscribe();
  }
}
