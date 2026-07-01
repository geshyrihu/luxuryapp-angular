import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { FloatLabelModule } from "primeng/floatlabel";
import { PasswordModule } from "primeng/password";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { passwordValidation } from "src/app/core/directives/password-validation.directive";
import { IChangePassword } from "src/app/core/interfaces/change-password.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
@Component({
  selector: "app-actualizar-contrasena",
  templateUrl: "./update-password.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PasswordModule,
    WebButtonLabelSave,
    FloatLabelModule,
  ],
})
export class UpdatePasswordComponent implements OnInit {
  formB = inject(FormBuilder);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  submitting = signal(false);

  formUpdatePassword!: UntypedFormGroup;

  ngOnInit(): void {
    this.onCreateForm();
  }
  get f() {
    return this.formUpdatePassword.controls;
  }

  onCreateForm() {
    this.formUpdatePassword = this.formB.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: [
          "",
          {
            validators: [Validators.required, passwordValidation()],
          },
        ],
        confirm: ["", Validators.required],
      },
      {
        validators: this.passwordEqual("newPassword", "confirm"),
      },
    );
  }

  updatePassword() {
    if (!this.apiResponseS.validateForm(this.formUpdatePassword)) return;

    const model: IChangePassword = {
      currentPassword: this.formUpdatePassword.get("currentPassword").value,
      newPassword: this.formUpdatePassword.get("newPassword").value,
    };
    const id = this.authS.userToken.infoUserAuthDTO.applicationUserId;

    this.submitting.set(true);

    this.apiResponseS
      .onPut(`Users/ChangePassword/${id}`, model)
      .then((result: boolean) => {
        if (result) {
          this.submitting.set(false);
          this.authS.logout();
        } else {
          this.submitting.set(false);
        }
      });
  }

  passwordEqual(pass1: string, pass2: string) {
    return (formGroup: UntypedFormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notIsEqual: true });
      }
    };
  }
  passwordNotValid() {
    const pass1 = this.formUpdatePassword.get("newPassword").value;
    const pass2 = this.formUpdatePassword.get("confirm").value;

    return pass1 !== pass2 && this.updatePassword ? true : false;
  }
}
