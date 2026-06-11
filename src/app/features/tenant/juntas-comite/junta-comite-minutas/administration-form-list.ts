import { Component, inject, input, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { SelectModule } from "primeng/select";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-administration-form-list",
  templateUrl: "./administration-form-list.html",
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CustomButtonItem,
    CustomButtonDelete,
  ],
})
export class AdministrationFormList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  customerId = input<string>();
  meetingId = input<any>();

  cb_Administration = signal<any[]>([]);
  listaParticipantesAdministration = signal<any[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    administrationparticipante: new FormControl<string | null>(null, [Validators.required]),
  });

  get administrationparticipante() {
    return this.form.controls.administrationparticipante;
  }

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }

  onLoadCB() {
    const urlApi = `GetListAdministracionMinuta/${this.customerIdS.customerId()}/${
      this.meetingId()
    }`;
    this.apiResponseS.onGetSelectItem(urlApi).then((result: any) => {
      this.cb_Administration.set(result);
    });
  }

  async onSubmit() {
    const urlApi = `MeetingAdministracion/AgregarParticipantesAdministracion/${
      this.meetingId()
    }/${this.administrationparticipante.value}/${1}`;

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
      this.administrationparticipante.reset();
    }
  }

  onDelete(idParticipant: number): void {
    this.apiResponseS
      .onDelete(`MeetingAdministracion/${idParticipant}`)
      .then(() => {
        this.onLoadData();
        this.onLoadCB();
      });
  }

  onLoadData() {
    const urlApi = `MeetingAdministracion/ParticipantesAdministracion/${this.meetingId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.listaParticipantesAdministration.set(result);
    });
  }
}
