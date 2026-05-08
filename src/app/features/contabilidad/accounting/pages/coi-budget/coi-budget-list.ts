import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { calendarOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { CoiFiscalPeriodResponseDTO } from "./models/coi-budget-fiscal-period.dto";

@Component({
  selector: "app-list-coi-budget",
  imports: [
    TableModule,
    TabsModule,
    PrimeNgCustomCaption,
    CustomButtonDelete,
    DataViewMobile,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
  templateUrl: "./coi-budget-list.html",
})
export default class CoiBudgetList implements OnInit {
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  // States
  periodsSignal = signal<CoiFiscalPeriodResponseDTO[]>([]);
  totalRecords = signal<number>(0); // Added based on instruction snippet

  constructor() {
    addIcons({ calendarOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadPeriods();
      }
    });
  }

  ngOnInit(): void {
    // Si necesitas código en init inicial independiente del effect
  }

  async onLoadPeriods() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    // Por simplicidad, consultamos los del año actual
    const currentYear = new Date().getFullYear();
    // Placeholder for filterParams, as it was introduced in the instruction snippet
    const filterParams = { year: currentYear };
    const result = await this.apiResponseS.onPostPaged<any>(
      `coi-fiscal-periods/paginated/${customerId}`,
      filterParams,
    );
    if (result && result.data) {
      this.periodsSignal.set(result.data.items);
      this.totalRecords.set(result.data.totalRecords);
    }
  }

  onModalPeriod() {
    // ModalHandlerService para crear periodo
  }

  async togglePeriod(id: string) {
    const success = await this.apiResponseS.onPost<boolean>(
      `coi-fiscal-periods/${id}/toggle-status`,
      {},
    );
    if (success) {
      this.onLoadPeriods();
    }
  }

  async deletePeriod(id: string) {
    const success = await this.apiResponseS.onDelete(
      `coi-fiscal-periods/${id}`,
    );
    if (success) {
      this.onLoadPeriods();
    }
  }
}
