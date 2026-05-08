import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
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

  @Input()
  customerId: string;
  @Input()
  meetingId: any;
  cb_ParticipantComite = signal<any[]>([]);
  comiteparticipante = new FormControl<string | null>(null);
  listaParticipantesComite = signal<any[]>([]);

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }

  onLoadCB() {
    const urlApi = `GetListComiteMinuta/${this.customerIdS.customerId()}/${
      this.meetingId
    }`;
    this.apiResponseS.onGetSelectItem(urlApi).then((result: any) => {
      this.cb_ParticipantComite.set(result);
    });
  }

  onSubmit() {
    if (!this.comiteparticipante.value) return;

    const urlApi = `MeetingComite/AgregarParticipantesComite/${this.meetingId}/${this.comiteparticipante.value}`;
    this.apiResponseS.onPost(urlApi).then(() => {
      this.onLoadData();
      this.onLoadCB();
      this.comiteparticipante.reset();
    });
  }

  onDelete(idParticipant: number): void {
    this.apiResponseS.onDelete(`MeetingComite/${idParticipant}`).then(() => {
      this.onLoadData();
      this.onLoadCB();
    });
  }

  onLoadData() {
    const urlApi = `MeetingComite/ParticipantesComite/${this.meetingId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.listaParticipantesComite.set(result);
    });
  }
}
