import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { UpdatePasswordDto } from "src/app/core/interfaces/user-info.interface";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
@Component({
  selector: "app-update-password-account",
  templateUrl: "./update-password-account.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxMessage, WebButtonLabel, AppIcon],
})
export class UpdatePasswordAccount implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService);
  applicationUserId = input<string>("");
  userInfoDTO = input<UpdatePasswordDto>(null);

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
