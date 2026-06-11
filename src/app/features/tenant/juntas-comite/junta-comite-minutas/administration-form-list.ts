import { Component, inject, input, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
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
  // Usar FormBuilder o simplemente FormControl
  administrationparticipante = new FormControl<string | null>(null);

  customerId = input<string>();
  meetingId = input<any>();

  cb_Administration = signal<any[]>([]);
  listaParticipantesAdministration = signal<any[]>([]);

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

  onSubmit() {
    if (!this.administrationparticipante.value) return;

    const urlApi = `MeetingAdministracion/AgregarParticipantesAdministracion/${
      this.meetingId()
    }/${this.administrationparticipante.value}/${1}`;

    this.apiResponseS.onPost(urlApi).then(() => {
      this.onLoadData();
      this.onLoadCB();
      this.administrationparticipante.reset();
    });
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
