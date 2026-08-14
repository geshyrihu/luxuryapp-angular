import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputAutoMultiple } from "@ui/inputs/web/custom-input-autocomplete-multiple-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
@Component({
  selector: "app-testsignalr",
  imports: [
    LxCard,
    WebButtonLabel,
    CustomInputTextSignal,
    InputAutocomplete,
    CustomInputAutoMultiple,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./testsignalr.html",
})
export class Testsignalr implements OnInit {
  apiResponseS = inject(ApiResponseService);
  // Signals
  users = signal<SelectItemDto[]>([]);
  selectedUserId = signal<string | null>(null);
  selectedUserIds = signal<string[]>([]);

  // Form Controls
  userControl = new FormControl(null);
  multiUserControl = new FormControl([]);
  titleControl = new FormControl("Tútulo de prueba");
  messageControl = new FormControl("Mensaje de prueba desde Angular");
  routeControl = new FormControl("/ruta/prueba");
  phoneControl = new FormControl("5559878523");
  folioControl = new FormControl("FOLIO-TEST");
  clienteControl = new FormControl("Cliente Prueba");
  solicitaControl = new FormControl("Solicita Prueba");
  resultadoControl = new FormControl("Completada");

  async ngOnInit(): Promise<void> {
    await this.onLoadUsers();
  }

  async onLoadUsers(): Promise<void> {
    const result: any = await this.apiResponseS.onGetListNotLoading(
      Endpoints.NotificationDiagnostics.users,
    );
    this.users.set(result as SelectItemDto[]);
  }

  onSelectUser = (item: SelectItemDto) => {
    this.selectedUserId.set(item?.value);
    this.userControl.setValue(item?.label);
  };

  onSelectUsers = (ids: any[]) => {
    this.selectedUserIds.set(ids);
  };

  async sendSignalRToUser(): Promise<void> {
    if (!this.selectedUserId()) return;

    await this.apiResponseS.onPost(
      Endpoints.NotificationDiagnostics.testSignalR(this.selectedUserId()!),
      {},
    );

    alert("SignalR enviado a usuario");
  }

  async sendSignalRToUsers(): Promise<void> {
    if (!this.selectedUserIds().length) return;

    await this.apiResponseS.onPost(Endpoints.NotificationDiagnostics.testSignalUsers, {
      userIds: this.selectedUserIds(),
    });

    alert("SignalR enviado a usuarios seleccionados");
  }

  async sendOneSignalToUser(): Promise<void> {
    if (!this.selectedUserId()) return;

    const body = {
      title: this.titleControl.value,
      message: this.messageControl.value,
      route: this.routeControl.value,
      externalUserId: this.selectedUserId(),
    };

    const result: any = await this.apiResponseS.onPost(
      Endpoints.NotificationDiagnostics.testOneSignal,
      body,
    );

    alert("Push enviada (OneSignal). Revisa el resultado en la respuesta.");
    console.log(result);
  }

  async sendOneSignalWebToUser(): Promise<void> {
    if (!this.selectedUserId()) return;

    const body = {
      title: this.titleControl.value,
      message: this.messageControl.value,
      route: this.routeControl.value,
      externalUserId: this.selectedUserId(),
    };

    const result: any = await this.apiResponseS.onPost(
      Endpoints.NotificationDiagnostics.testOneSignalWeb,
      body,
    );

    alert("Push enviada (OneSignal Web). Revisa el resultado en la respuesta.");
    console.log(result);
  }

  async sendWhatsAppLegalTicket(): Promise<void> {
    if (!this.phoneControl.value) return;

    const body = {
      title: this.titleControl.value ?? "Test",
      folio: this.folioControl.value ?? "FOLIO-TEST",
      cliente: this.clienteControl.value ?? "Cliente Prueba",
      solicita: this.solicitaControl.value ?? "Solicita Prueba",
      phone: this.phoneControl.value,
    };

    const result: any = await this.apiResponseS.onPost(
      Endpoints.NotificationDiagnostics.testWhatsAppLegalTicket,
      body,
    );

    alert("WhatsApp LegalTicket enviado. Revisa tu consola y celular.");
    console.log(result);
  }

  async sendWhatsAppSolicitudRecibida(): Promise<void> {
    if (!this.phoneControl.value) return;

    const body = {
      cliente: this.clienteControl.value ?? "Cliente Prueba",
      folio: this.folioControl.value ?? "FOLIO-TEST",
      asunto: this.titleControl.value ?? "Solicitud de prueba",
      phone: this.phoneControl.value,
    };

    const result: any = await this.apiResponseS.onPost(
      Endpoints.NotificationDiagnostics.testWhatsAppSolicitudRecibida,
      body,
    );

    alert("WhatsApp SolicitudRecibida enviado. Revisa tu consola y celular.");
    console.log(result);
  }

  async sendWhatsAppSolicitudTerminada(): Promise<void> {
    if (!this.phoneControl.value) return;

    const body = {
      cliente: this.clienteControl.value ?? "Cliente Prueba",
      folio: this.folioControl.value ?? "FOLIO-TEST",
      asunto: this.titleControl.value ?? "Solicitud concluida",
      resultado: this.resultadoControl.value ?? "Completada",
      phone: this.phoneControl.value,
    };

    const result: any = await this.apiResponseS.onPost(
      Endpoints.NotificationDiagnostics.testWhatsAppSolicitudTerminada,
      body,
    );

    alert("WhatsApp SolicitudTerminada enviado. Revisa tu consola y celular.");
    console.log(result);
  }
}
