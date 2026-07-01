import { Component, inject, input, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { UpdatePasswordDTO } from "src/app/core/interfaces/user-info.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
@Component({
  selector: "app-update-password-account",
  templateUrl: "./update-password-account.html",
  imports: [CardModule, MessageModule, WebButtonLabel, AppIcon],
})
export class UpdatePasswordAccount implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService);
  applicationUserId = input<string>("");
  userInfoDTO = input<UpdatePasswordDTO>(null);

  submitting = signal(false);
  email = signal<string>("");
  phoneNumber = signal<string>("");
  userName = signal<string>("");
  applicationUserState = signal<boolean>(false);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeInternal.dataForRecoveryPassword(
          this.applicationUserId(),
        ),
      )
      .then((result: any) => {
        if (result) {
          const { email, phoneNumber, userName } = result;
          this.email.set(email);
          this.phoneNumber.set(phoneNumber);
          this.userName.set(userName);
        }
      });

    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeInternal.onValidateState(this.applicationUserId()),
      )
      .then((result: any) => {
        this.applicationUserState.set(result);
      });
  }

  sendOnlyPasswordEmail() {
    this.apiResponseS
      .onGetItem(
        Endpoints.Auth.sendNewPasswordForEmail(this.applicationUserId()),
      )
      .then(() => {});
  }

  onGenerateUserNameAndPassword() {
    this.apiResponseS
      .onGetItem(
        Endpoints.ApplicationUsers.sendNewUserNameForEmail(
          this.applicationUserId(),
        ),
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onToBlockAccount() {
    this.apiResponseS
      .onGetItem(
        Endpoints.ApplicationUsers.toBlockAccount(this.applicationUserId()),
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onToUnlockAccount() {
    this.apiResponseS
      .onGetItem(
        Endpoints.ApplicationUsers.toUnlockAccount(this.applicationUserId()),
      )
      .then(() => {
        this.onLoadData();
      });
  }
}
