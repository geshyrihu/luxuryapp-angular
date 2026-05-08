import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-invited-form",
  templateUrl: "./invited-form.html",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomButtonItem,
    CustomButtonDelete,
    CustomInputTextSignal,
  ],
})
export class InvitedForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  @Input()
  customerId: string;
  @Input()
  meetingId: any;

  listaInvitados = signal<any[]>([]);
  invitado = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.onLoadData();
  }

  onSubmit() {
    if (!this.invitado.value) return;

    const urlApi = `MeetingInvitado/AgregarParticipantesInvitado/${this.meetingId}/${this.invitado.value}`;
    this.apiResponseS.onPost(urlApi).then(() => {
      this.onLoadData();
      this.invitado.reset();
    });
  }

  onDelete(idParticipant: number): void {
    this.apiResponseS.onDelete(`MeetingInvitado/${idParticipant}`).then(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `MeetingInvitado/ParticipantesInvitado/${this.meetingId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.listaInvitados.set(result);
    });
  }
}









