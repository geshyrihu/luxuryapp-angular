import { Component, effect, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  } from "@ionic/angular/standalone";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-cumpleanos",
  templateUrl: "./cumpleanos-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CardModule,
    WebButtonLabel,
    AppAvatar,
    LxTag,
    AppIcon,
  ],
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
        `Birthday/${this.customerIdS.customerId()}/${this.selectedMonth()}`,
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
}
