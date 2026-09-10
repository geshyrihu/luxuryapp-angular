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
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-administration-form-list",
  templateUrl: "./administration-form-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    WebButtonLabelItem,
    WebButtonLabelDelete,
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

  onDelete(idParticipant: number): void {
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
