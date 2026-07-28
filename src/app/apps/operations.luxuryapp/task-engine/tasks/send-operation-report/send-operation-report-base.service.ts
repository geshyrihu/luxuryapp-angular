import { Injectable, signal, computed, inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ButtonType } from "src/app/core/enums/button-type.enum";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DestinatariosMailReporte } from "src/app/core/interfaces/destinatarios-mail-reporte.interface";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

@Injectable()
export class SendOperationReportBaseService {
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private customerIdS = inject(CustomerIdService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  year = 0;
  numeroSemana = 0;

  ButtonTypeSubmit = ButtonType.Submit;
  destinatariosSignal = signal<any[]>([]);
  globalFilterFields = computed(() =>
    globalFilterFields(this.destinatariosSignal()),
  );
  loading = signal(true);
  destinatariosFinal: DestinatariosMailReporte[] = [];
  destinatariosAdicionales: DestinatariosMailReporte[] = [];
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  mostrarPara = false;
  mostrarCo = false;
  mostrarCco = false;
  placeholder = "";

  form = this.formB.nonNullable.group({
    email: [
      "",
      [
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        Validators.required,
      ],
    ],
  });

  initialize(year: number, numeroSemana: number): void {
    this.year = year;
    this.numeroSemana = numeroSemana;
    this.onLoadSelectItem();
  }

  onLoadSelectItem(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.ResidentesEdificio.selectByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((response: any) => {
        if (!Array.isArray(response)) {
          this.loading.set(false);
          return;
        }
        const items = response.map((item: any) => ({
          ...item,
          selectControl: new FormControl(item.select ?? false),
        }));
        this.destinatariosSignal.set(items);
        this.loading.set(false);
      });
  }

  onEnviarEmail(): void {
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

  onSelectAll(): void {
    this.destinatariosSignal.update((current) =>
      current.map((resp) => {
        resp.selectControl?.setValue(true, { emitEvent: false });
        return { ...resp, select: true };
      }),
    );
  }

  onDeselecteAll(): void {
    this.destinatariosSignal.update((current) =>
      current.map((resp) => {
        resp.selectControl?.setValue(false, { emitEvent: false });
        return { ...resp, select: false };
      }),
    );
  }

  onFilterDestinatarios(): DestinatariosMailReporte[] {
    this.destinatariosFinal = [];
    this.destinatariosSignal().forEach((resp) => {
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

  onAddCorreo(): void {
    let nivelPrivacidad = "";
    if (this.mostrarPara) nivelPrivacidad = "PARA";
    if (this.mostrarCo) nivelPrivacidad = "CC";
    if (this.mostrarCco) nivelPrivacidad = "CCO";
    const correoFiltro = {
      nivelPrivacidad: nivelPrivacidad,
      email: this.form.controls.email.value,
    };
    this.form.patchValue({ email: "" });
    this.destinatariosAdicionales.push(correoFiltro);
  }

  onMostrarInput(
    para: boolean,
    cc: boolean,
    cco: boolean,
    placeholder: string,
  ): void {
    this.mostrarPara = para;
    this.mostrarCo = cc;
    this.mostrarCco = cco;
    this.placeholder = `${placeholder}  (separar correos con ";")`;
  }

  onDeleteDestinatariosAdicionales(indexArr: number): void {
    this.destinatariosAdicionales.splice(indexArr, 1);
  }
}
