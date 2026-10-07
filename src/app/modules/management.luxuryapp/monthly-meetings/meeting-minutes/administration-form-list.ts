import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
@Component({
  selector: "app-administration-form-list",
  templateUrl: "./administration-form-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, LuxInputSelectSignal, ButtonWeb],
})
export class AdministrationFormList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private confirmS = inject(ConfirmService);
  customerId = input<string>();
  meetingId = input<any>();

  cb_Administration = signal<any[]>([]);
  listaParticipantesAdministration = signal<any[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    administrationparticipante: new FormControl<string | null>(null, [
      Validators.required,
    ]),
  });

  get administrationparticipante() {
    return this.form.controls.administrationparticipante;
  }

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }

  onLoadCB() {
    this.apiResponseS
      .onGetSelectItem(
        Endpoints.SelectItems.administracionMinuta(
          this.customerIdS.customerId(),
          this.meetingId(),
        ),
      )
      .then((result: any) => {
        this.cb_Administration.set(result);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeetingAdministracion.addParticipant(
        this.meetingId(),
        this.administrationparticipante.value,
      ),
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => ({}),
    });

    if (result) {
      this.onLoadData();
      this.onLoadCB();
      this.administrationparticipante.reset();
    }
  }

  async onDelete(idParticipant: number): Promise<void> {
    const ok = await this.confirmS.confirm("¿Eliminar a este participante?");
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.MeetingAdministracion.delete(idParticipant))
      .then(() => {
        this.onLoadData();
        this.onLoadCB();
      });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.MeetingAdministracion.participants(this.meetingId()))
      .then((result: any) => {
        this.listaParticipantesAdministration.set(result);
      });
  }
}
