import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { IonInputToggle } from "@ui/inputs/mobile/ion-input-toggle";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { addIcons } from "ionicons";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { CustomerModulGroup } from "./interfaces/customer-modul-group.interface";

@Component({
  selector: "app-customer-modul-edit",
  imports: [
    CommonModule,
    LxMessage,
    LxSpinner,
    CustomSearchInput,
    FormsModule,
    MobileListItem,
    IonInputToggle,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./customer-modul-edit.html",
})
export class CustomerModulEdit implements OnInit {
  apiResponseS = inject(ApiResponseService);
  activatedRoute = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);
  dataConnectorS = inject(DataConnectorService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  allData = signal<CustomerModulGroup[]>([]);
  searchTerm = signal("");

  filteredGroupedData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.allData();

    return this.allData()
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.moduleAppName.toLowerCase().includes(term) ||
            group.groupTitle.toLowerCase().includes(term),
        ),
      }))
      .filter((group) => group.items.length > 0);
  });

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
    this.apiResponseS
      .onGetList(Endpoints.ModuleAppCustomers.customerModules(customerId))
      .then((result: CustomerModulGroup[]) => {
        this.allData.set(result);
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
