import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { CardModule } from "primeng/card";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomInputAutoMultiple } from "src/app/core/components/inputs/web/custom-input-autocomplete-multiple-signal";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-testsignalr",
  imports: [
    CardModule,
    WebButtonLabel,
    CustomInputTextSignal,
    CustomInputAutoComplete,
    CustomInputAutoMultiple,
  ],
  templateUrl: "./testsignalr.html",
})
export class Testsignalr implements OnInit {
  apiResponseS = inject(ApiResponseService);
  // Signals
  users = signal<ISelectItem[]>([]);
  selectedUserId = signal<string | null>(null);
  selectedUserIds = signal<string[]>([]);

  // Form Controls
  userControl = new FormControl(null);
  multiUserControl = new FormControl([]);
  titleControl = new FormControl("Título de prueba");
  messageControl = new FormControl("Mensaje de prueba desde Angular");
  routeControl = new FormControl("/ruta/prueba");

  async ngOnInit(): Promise<void> {
    await this.onLoadUsers();
  }

  async onLoadUsers(): Promise<void> {
    const result: any = await this.apiResponseS.onGetListNotLoading(
      Endpoints.Notifications.users,
    );
    this.users.set(result as ISelectItem[]);
  }

  onSelectUser = (item: ISelectItem) => {
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
