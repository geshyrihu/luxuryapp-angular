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
import { CustomInputAutoMultiple } from "@ui/inputs/web/custom-input-autocomplete-multiple-signal";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
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

  async ngOnInit(): Promise<void> {
    await this.onLoadUsers();
  }

  async onLoadUsers(): Promise<void> {
    const result: any = await this.apiResponseS.onGetListNotLoading(
      Endpoints.Notifications.users,
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
      Endpoints.Notifications.testSignalR(this.selectedUserId()!),
      {},
    );

    alert("SignalR enviado a usuario");
  }

  async sendSignalRToUsers(): Promise<void> {
    if (!this.selectedUserIds().length) return;

    await this.apiResponseS.onPost(Endpoints.Notifications.testSignalUsers, {
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
      Endpoints.Notifications.testOneSignal,
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
      Endpoints.Notifications.testOneSignalWeb,
      body,
    );

    alert("Push enviada (OneSignal Web). Revisa el resultado en la respuesta.");
    console.log(result);
  }
}
