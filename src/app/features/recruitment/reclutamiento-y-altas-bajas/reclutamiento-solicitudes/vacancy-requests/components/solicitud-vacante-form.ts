import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TextareaModule } from "primeng/textarea";
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-solicitud-vacante",
  templateUrl: "./solicitud-vacante-form.html",
  imports: [ReactiveFormsModule, CardModule, WebButtonLabelSave, TextareaModule],
})
export class SolicitudVacanteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private authS = inject(AuthService);
  private enumSelectS = inject(EnumSelectService);
  workPositionId: any = this.config.data.workPositionId;

  data: any;
  submitting = signal(false);

  id: string = "";

  cb_turnoTrabajo = signal<ISelectItem[]>([]);

  form = this.formB.nonNullable.group({
    id: [this.config.data.workPositionId],
    applicationRoleName: ["", Validators.required],
    sueldo: ["", [Validators.required, Validators.minLength(4)]],
    sueldoBase: ["", [Validators.required, Validators.minLength(4)]],
    turnoTrabajo: [null as number | null, Validators.required],
    lunesEntrada: [""],
    lunesSalida: [""],
    martesEntrada: [""],
    martesSalida: [""],
    miercolesEntrada: [""],
    miercolesSalida: [""],
    juevesEntrada: [""],
    juevesSalida: [""],
    viernesEntrada: [""],
    viernesSalida: [""],
    sabadoEntrada: [""],
    sabadoSalida: [""],
    domingoEntrada: [""],
    domingoSalida: [""],
    additionalInformation: [""],
  });

  async ngOnInit() {
    this.cb_turnoTrabajo.set(
      await firstValueFrom(this.enumSelectS.turnoTrabajo()),
    );
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `work-positions/${this.workPositionId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.data = result;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        `SolicitudesReclutamiento/SolicitudVacante/${this.authS.infoUserAuth.applicationUserId}`,
        this.form.getRawValue(),
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
