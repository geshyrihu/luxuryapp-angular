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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
@Component({
  selector: "app-invited-form",
  templateUrl: "./invited-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, ButtonWeb, LuxInputTextSignal],
})
export class InvitedForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private confirmS = inject(ConfirmService);
  customerId = input<string>();
  meetingId = input<any>();

  listaInvitados = signal<any[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    invitado: new FormControl<string | null>(null, [Validators.required]),
  });

  get invitado() {
    return this.form.controls.invitado;
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeetingInvitado.addParticipant(
        this.meetingId(),
        this.invitado.value,
      ),
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => ({}),
    });

    if (result) {
      this.onLoadData();
      this.invitado.reset();
    }
  }

  async onDelete(idParticipant: number): Promise<void> {
    const ok = await this.confirmS.confirm("¿Eliminar a este invitado?");
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.MeetingInvitado.delete(idParticipant))
      .then(() => {
        this.onLoadData();
      });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.MeetingInvitado.participants(this.meetingId()))
      .then((result: any) => {
        this.listaInvitados.set(result);
      });
  }
}
