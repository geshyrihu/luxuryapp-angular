import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TableModule } from "primeng/table";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AccessCredentialDto } from "src/app/core/interfaces/access-credential.dto";
import { InvitationDto } from "src/app/core/interfaces/invitation.dto";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { VisitDto } from "src/app/core/interfaces/visit.dto";

@Component({
  selector: "app-visit-detail",
  templateUrl: "./visit-detail.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    WebButtonLabel,
  ],
})
export class VisitDetail implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);

  visitId = "";
  visit = signal<VisitDto | null>(null);
  credential = signal<AccessCredentialDto | null>(null);
  invitations = signal<InvitationDto[]>([]);
  sending = signal(false);

  channelControl = new FormControl<string>("WhatsApp", { nonNullable: true });
  channels: SelectItemDto[] = [
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Email", label: "Correo" },
    { value: "SMS", label: "SMS" },
  ];

  validityControl = new FormControl<string>("SingleUseScheduled", {
    nonNullable: true,
  });
  validityTypes: SelectItemDto[] = [
    { value: "SingleUseScheduled", label: "Un solo uso (programado)" },
    { value: "MultiUseScheduled", label: "Multiuso (programado)" },
  ];

  ngOnInit(): void {
    this.visitId = this.route.snapshot.paramMap.get("id") ?? "";
    this.onLoadVisit();
    this.onLoadInvitations();
  }

  onLoadVisit(): void {
    this.apiResponseS
      .onGetItem<VisitDto>(Endpoints.AccessControlVisits.getById(this.visitId))
      .then((result) => {
        this.visit.set(result);
        if (result?.credential) this.loadCredential(result.credential.id);
        else this.credential.set(null);
      });
  }

  private loadCredential(credentialId: string): void {
    this.apiResponseS
      .onGetItem<AccessCredentialDto>(
        Endpoints.AccessControlCredentials.getById(credentialId),
      )
      .then((result) => this.credential.set(result));
  }

  regenerate(): void {
    this.apiResponseS
      .onPost<AccessCredentialDto>(
        Endpoints.AccessControlCredentials.generateQr,
        { visitId: this.visitId, validityType: this.validityControl.value },
      )
      .then((result) => {
        if (result) this.loadCredential(result.id);
      });
  }

  revoke(): void {
    const cred = this.credential();
    if (!cred) return;
    this.apiResponseS
      .onPatch<boolean>(Endpoints.AccessControlCredentials.revoke(cred.id), {
        reason: "Revocada por el residente",
      })
      .then((result) => {
        if (result) this.loadCredential(cred.id);
      });
  }

  onLoadInvitations(): void {
    this.apiResponseS
      .onGetList<InvitationDto[]>(
        Endpoints.AccessControlInvitations.byVisit(this.visitId),
      )
      .then((result) => this.invitations.set(result ?? []));
  }

  send(): void {
    this.sending.set(true);
    this.apiResponseS
      .onPost<InvitationDto>(Endpoints.AccessControlInvitations.send, {
        visitId: this.visitId,
        channel: this.channelControl.value,
      })
      .then((result) => {
        this.sending.set(false);
        if (result) this.onLoadInvitations();
      });
  }

  resend(invitation: InvitationDto): void {
    this.apiResponseS
      .onPost<InvitationDto>(
        Endpoints.AccessControlInvitations.resend(invitation.id),
        null,
      )
      .then((result) => {
        if (result) this.onLoadInvitations();
      });
  }

  qrSrc(base64: string): string {
    return `data:image/png;base64,${base64}`;
  }
}
