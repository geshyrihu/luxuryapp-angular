import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { RangoCalendarioyyyymmdd } from "src/app/core/components/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { IPresupuestoAdd } from "src/app/core/interfaces/presupuesto-add.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
@Component({
  selector: "app-presupuesto-add",
  templateUrl: "./presupuesto-add.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomButtonSave,
    CustomButton,
    RangoCalendarioyyyymmdd,
  ],
})
export class PresupuestoAdd implements OnInit {
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  messageS = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);
  periodo: IPresupuestoAdd;
  id: string = "";
  submitting = signal(false);

  fechasSignal = toSignal(this.rangoCalendarioService.fechas$);

  constructor() {
      effect(() => {
          const resp = this.fechasSignal();
          if (resp) {
            this.periodo = {
                customerId: this.customerIdS.customerId(),
                from: resp.fechaInicio,
                to: resp.fechaFinal,
            };
          }
      });
  }

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
    // Initial value set is redundant if signal emits initially or we handle it in effect, 
    // but keep it for safety if service behavior is cold/late. 
    // actually rangoCalendarioService holds state so it might emit.
    this.periodo = {
      customerId: this.customerIdS.customerId(),
      from: this.dateS.formatDateTime(this.rangoCalendarioService.fechaInicial),
      to: this.dateS.formatDateTime(this.rangoCalendarioService.fechaFinal),
    };
    
    // Subscription moved to effect
  }

  onSubmit() {
    this.submitting.set(true);
    if (!this.id) {
      this.apiResponseS
        .onPost(Endpoints.Presupuestos.create, this.periodo)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.Presupuestos.update(this.id), this.periodo)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
  onLoadData() {
    this.apiResponseS.onGetList(Endpoints.Banks.getAll).then((result: any) => {
      this.periodo = {
        customerId: this.customerIdS.customerId(),
        from: result.fechaInicio,
        to: result.fechaFinal,
      };
    });
  }
}









