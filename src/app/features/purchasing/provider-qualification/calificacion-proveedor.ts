import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
@Component({
  selector: "app-calificacion-proveedor",
  templateUrl: "./calificacion-proveedor.html",
  imports: [ReactiveFormsModule, NgbRatingModule, WebButtonLabelSave],
})
export class CalificacionProveedor implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  providerId: string = "";
  qualificationProviderId: string = "";

  form: FormGroup = this.formB.group({
    applicationUserId: [this.authS.applicationUserId, Validators.required],
    providerId: [this.config.data.providerId, Validators.required],
    precio: [0, Validators.required],
    servicio: [0, Validators.required],
    entrega: [0, Validators.required],
  });

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `QualificationProvider/${this.authS.applicationUserId}/${this.providerId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (result != null) {
        this.qualificationProviderId = result.id;
        this.form.patchValue(result);
      }
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    if (this.qualificationProviderId) {
      this.apiResponseS
        .onPost(`QualificationProvider`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(
          `QualificationProvider/${this.qualificationProviderId}`,
          this.form.value,
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
