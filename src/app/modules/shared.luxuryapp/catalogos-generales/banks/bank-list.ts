import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { addIcons } from "ionicons";
import { businessOutline } from "ionicons/icons";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { BankForm } from "./bank-form";
import { BankListDesktop } from "./desktop/bank-list-desktop";
import { BankListMobile } from "./mobile/bank-list-mobile";
import { BankDto } from "./interfaces/banks.dto";

@Component({
  selector: "app-bank-list",
  templateUrl: "./bank-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BankListDesktop, BankListMobile],
})
export class BankList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<BankDto[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ businessOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<BankDto[]>(Endpoints.Catalogs.Banks.getAll)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.Banks.delete(id))
      .then((response: boolean) => {
        if (response) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(BankForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
