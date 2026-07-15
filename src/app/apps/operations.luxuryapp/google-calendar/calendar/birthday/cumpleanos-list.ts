import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-cumpleanos",
  templateUrl: "./cumpleanos-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonLabel, AppAvatar, LxTag, AppIcon],
})
export class Cumpleanos implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  selectedMonth = signal<number>(new Date().getMonth());
  months: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  dataSignal = signal<any[]>([]);

  /**
   *
   */
  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  ngOnInit() {}

  onMonthSelect(month: number): void {
    this.selectedMonth.set(month);
    this.onLoadData();
  }

  onMonthSelectMobile(event: any) {
    this.onMonthSelect(event.detail.value);
  }

  ref: DynamicDialogRef;

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.Birthday.listByCustomerAndMonth(
          this.customerIdS.customerId(),
          this.selectedMonth(),
        ),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
}
