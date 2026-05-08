import { Component, inject, input, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { UpdatePasswordDTO } from "src/app/core/interfaces/user-info.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
@Component({
  selector: "app-update-password-account",
  templateUrl: "./update-password-account.html",
  imports: [CardModule, MessageModule, CustomButton],
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
        `EmployeeInternal/DataForRecoveryPassword/${this.applicationUserId()}`,
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
      .onGetItem(`EmployeeInternal/OnValidateState/${this.applicationUserId()}`)
      .then((result: any) => {
        this.applicationUserState.set(result);
      });
  }

  sendOnlyPasswordEmail() {
    this.apiResponseS
      .onGetItem(`Auth/SendNewPasswordForEmail/${this.applicationUserId()}`)
      .then(() => {});
  }

  onGenerateUserNameAndPassword() {
    this.apiResponseS
      .onGetItem(
        `application-users/SendNewUserNameForEmail/${this.applicationUserId()}`,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onToBlockAccount() {
    this.apiResponseS
      .onGetItem(`application-users/ToBlockAccount/${this.applicationUserId()}`)
      .then(() => {
        this.onLoadData();
      });
  }

  onToUnlockAccount() {
    this.apiResponseS
      .onGetItem(
        `application-users/ToUnlockAccount/${this.applicationUserId()}`,
      )
      .then(() => {
        this.onLoadData();
      });
  }
}
