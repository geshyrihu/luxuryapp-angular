import { Component, inject, input, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { SelectModule } from "primeng/select";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-comite-form",
  templateUrl: "./comite-form.html",
  imports: [
    ReactiveFormsModule,
    SelectModule,
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
    const urlApi = `GetListComiteMinuta/${this.customerIdS.customerId()}/${
      this.meetingId()
    }`;
    this.apiResponseS.onGetSelectItem(urlApi).then((result: any) => {
      this.cb_ParticipantComite.set(result);
    });
  }

  async onSubmit() {
    const urlApi = `MeetingComite/AgregarParticipantesComite/${this.meetingId()}/${this.comiteparticipante.value}`;
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: urlApi,
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
    this.apiResponseS.onDelete(`MeetingComite/${idParticipant}`).then(() => {
      this.onLoadData();
      this.onLoadCB();
    });
  }

  onLoadData() {
    const urlApi = `MeetingComite/ParticipantesComite/${this.meetingId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.listaParticipantesComite.set(result);
    });
  }
}
