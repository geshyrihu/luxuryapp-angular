import { Component, inject, input, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SolicitudModificacionSalarioForm } from "src/app/features/salary-modification/components/solicitud-modificacion-salario-form";
import { SolicitudBajaForm } from "src/app/features/request-dismissal/components/solicitud-baja-form";
import { SolicitudAltaForm } from "src/app/features/recruitment-requests/components/solicitud-alta-form";
@Component({
  selector: "employee-reclutamiento",
  templateUrl: "./employee-reclutamiento.html",
  imports: [CardModule],
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







