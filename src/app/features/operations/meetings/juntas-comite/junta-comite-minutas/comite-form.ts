import { Component, inject, input, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-comite-form",
  templateUrl: "./comite-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomButtonItem,
    CustomButtonDelete,
  ],
})
export class ComiteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  // private config = inject(DynamicDialogConfig); // Not used

  customerId = input<string>();
  meetingId = input<any>();
  cb_ParticipantComite = signal<any[]>([]);
  listaParticipantesComite = signal<any[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    comiteparticipante: new FormControl<string | null>(null, [Validators.required]),
  });

  get comiteparticipante() {
    return this.form.controls.comiteparticipante;
  }

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }

  onLoadCB() {
    this.apiResponseS.onGetSelectItem(
      Endpoints.MeetingComite.listCandidates(this.customerIdS.customerId(), this.meetingId()),
    ).then((result: any) => {
      this.cb_ParticipantComite.set(result);
    });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeetingComite.addParticipant(this.meetingId(), this.comiteparticipante.value),
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => ({}),
    });

    if (result) {
      this.onLoadData();
      this.onLoadCB();
      this.comiteparticipante.reset();
    }
  }

  onDelete(idParticipant: number): void {
    this.apiResponseS.onDelete(Endpoints.MeetingComite.delete(idParticipant)).then(() => {
      this.onLoadData();
      this.onLoadCB();
    });
  }

  onLoadData() {
    this.apiResponseS.onGetList(
      Endpoints.MeetingComite.participants(this.meetingId()),
    ).then((result: any) => {
      this.listaParticipantesComite.set(result);
    });
  }
}

