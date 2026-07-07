import { Component, computed, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ButtonType } from "src/app/core/enums/button-type";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { IDestinatariosMailReporte } from "src/app/core/interfaces/destinatarios-mail-reporte.interface";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
@Component({
  selector: "app-send-operation-report",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    CustomInputTextSignal,
    TagModule,
    TooltipModule,
    CustomInputCheckSignal,
    WebButtonLabel,
    WebButtonLabelConfirm,
    WebButtonLabelAdd,
    PrimeNgCustomCaption,
  ],
  templateUrl: "./send-operation-report.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService],
})
export class SendOperationReport {
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  // private messageS = inject(MessageService); // Unused
  // private ref = inject(DynamicDialogRef); // Unused in original but maybe implicitly needed or mistake in cleaning? Keeping just in case or removing if sure. Original didn't use ref explicitly in methods shown except maybe close? Checked: no ref.close() in explicit methods shown, but logically maybe needed? The code shows `ref` injected but not used in onSubmit logic for this report sending component (it sends email). Wait, previous did `ref.close`. This one does `.then(() => {})` on `onEnviarEmail`. I will remove `ref` if unused to be clean.

  year: number = this.config.data.year;
  numeroSemana: number = this.config.data.numeroSemana;
  ButtonTypeSubmit = ButtonType.Submit;
  destinatariosSignal = signal<any[]>([]);
  globalFilterFields = computed(() =>
    globalFilterFields(this.destinatariosSignal()),
  );
  loading = signal(true);
  destinatariosFinal: IDestinatariosMailReporte[] = [];
  destinatariosAdicionales: IDestinatariosMailReporte[] = [];
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  para: string = "";
  cc: string = "";
  cco: string = "";
  mostrarPara: boolean = false;
  mostrarCo: boolean = false;
  mostrarCco: boolean = false;
  placeholder: string = "";

  form = this.formB.nonNullable.group({
    email: [
      "",
      [
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        Validators.required,
      ],
    ],
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
  }

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<
        ISelectItem[]
      >(Endpoints.ResidentesEdificio.selectByCustomer(this.customerIdS.customerId()))
      .then((response: any) => {
        const items = response.map((item: any) => ({
          ...item,
          selectControl: new FormControl(item.select ?? false),
        }));
        this.destinatariosSignal.set(items);
        this.loading.set(false); // Valid assumption to turn off loading
      });
  }

  onEnviarEmail() {
    const applicationUserId = this.authS.applicationUserId;
    const customerId: string = this.customerIdS.customerId();
    this.apiResponseS
      .onPost(
        Endpoints.SendEmail.operationReport(
          applicationUserId,
          customerId,
          this.year,
          this.numeroSemana,
        ),
        this.onFilterDestinatarios(),
      )
      .then(() => {});
  }
  onSelectAll() {
    this.destinatariosSignal.update((current) =>
      current.map((resp) => {
        resp.selectControl?.setValue(true, { emitEvent: false });
        return { ...resp, select: true };
      }),
    );
  }
  onDeselecteAll() {
    this.destinatariosSignal.update((current) =>
      current.map((resp) => {
        resp.selectControl?.setValue(false, { emitEvent: false });
        return { ...resp, select: false };
      }),
    );
  }

  onFilterDestinatarios(): IDestinatariosMailReporte[] {
    this.destinatariosFinal = [];
    this.destinatariosSignal().forEach((resp) => {
      // let correo: IDestinatariosMailReporte;
      if (resp.selectControl !== undefined && resp.email !== null) {
        if (resp.selectControl.value) {
          const correoFiltro = {
            nivelPrivacidad: resp.nivelPrivacidad,
            email: resp.email,
          };
          this.destinatariosFinal.push(correoFiltro);
        }
      }
    });

    this.destinatariosAdicionales.forEach((resp) => {
      this.destinatariosFinal.push(resp);
    });
    return this.destinatariosFinal;
  }

  onAddCorreo() {
    let nivelPrivacidad: string = "";
    if (this.mostrarPara) nivelPrivacidad = "PARA";
    if (this.mostrarCo) nivelPrivacidad = "CC";
    if (this.mostrarCco) nivelPrivacidad = "CCO";
    const correoFiltro = {
      nivelPrivacidad: nivelPrivacidad,
      email: this.form.controls.email.value,
    };
    this.form.patchValue({
      email: "",
    });
    this.destinatariosAdicionales.push(correoFiltro);
  }

  onMostrarInput(
    para: boolean,
    cc: boolean,
    cco: boolean,
    placeholder: string,
  ) {
    this.mostrarPara = para;
    this.mostrarCo = cc;
    this.mostrarCco = cco;
    this.placeholder = `${placeholder}  (separar correos con ";")`;
  }

  onDeleteDestinatariosAdicionales(indexArr: any) {
    this.destinatariosAdicionales.splice(indexArr, 1);
  }
}
