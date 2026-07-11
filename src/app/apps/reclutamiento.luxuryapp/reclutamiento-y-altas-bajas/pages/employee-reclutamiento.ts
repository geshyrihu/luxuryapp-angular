import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";

import { LxCard } from "@ui/adaptive/card/card";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SolicitudAltaForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-requests/components/solicitud-alta-form";
import { SolicitudBajaForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/request-dismissal/components/solicitud-baja-form";
import { SolicitudModificacionSalarioForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/salary-modification/components/solicitud-modificacion-salario-form";
@Component({
  selector: "employee-reclutamiento",
  templateUrl: "./employee-reclutamiento.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxCard, AppIcon],
})
export class EmployeeReclutamiento implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  employeeId = input<any>();

  solicitudAltaStatus = signal<any>(null);
  solicitudBajaStatus = signal<any>(null);
  solicitudModificacionSalarioStatus = signal<any>(null);
  workPosition = signal<any>(null);

  ngOnInit() {
    this.onValidarSolicitudesAbiertas();
  }

  // Metodo para validar si hay solicitudes abiertas
  // Solicitud de baja
  // Solicitud de modificacion de salario
  onValidarSolicitudesAbiertas() {
    const urlApi = `employees/validarsolicitudesabiertas/${this.employeeId()}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.workPosition.set(result.workPosition);
      this.solicitudAltaStatus.set(result.solicitudAlta);
      this.solicitudBajaStatus.set(result.solicitudBaja);
      this.solicitudModificacionSalarioStatus.set(
        result.solicitudModificacionSalario,
      );
    });
  }

  onModalSolicitudALta() {
    this.dialogHandlerS
      .openDialog(
        SolicitudAltaForm,
        {
          employeeId: this.employeeId(),
          customerId: this.customerIdS.customerId(),
        },
        "Solicitud de alta",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) {
          this.onValidarSolicitudesAbiertas();
        }
      });
  }

  // Metodo para solicitar baja del empleado

  onModalSolicitudBaja() {
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaForm,
        {
          employeeId: this.employeeId(),
        },
        "Solicitud de baja",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onValidarSolicitudesAbiertas();
      });
  }

  //Solicitar Modificacion de salario

  onModalSolicitudModificacionSalarion() {
    this.dialogHandlerS
      .openDialog(
        SolicitudModificacionSalarioForm,
        {
          workPositionId: this.employeeId(),
        },
        "Solicitud de Modificación de salario",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onValidarSolicitudesAbiertas();
      });
  }
}
