import { Component, inject, input, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-invited-form",
  templateUrl: "./invited-form.html",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    CustomInputTextSignal,
  ],
})
export class InvitedForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
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

  onDelete(idParticipant: number): void {
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
