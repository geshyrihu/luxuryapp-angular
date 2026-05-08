import { Component, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-application-user-form",
  templateUrl: "./application-user-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
  ],
})
export class ApplicationUserForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  submitting = signal(false);
  applicationUserId: string = "";
  cb_customer = signal<ISelectItem[]>([]);
  cb_typePerson = toSignal(this.enumSelectS.typePerson(), { initialValue: [] });

  // Definición estricta del formulario
  form = new FormGroup({
    email: new FormControl<string>(""),
    phoneNumber: new FormControl<string>(""),
    customerId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    typePerson: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    firstName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    // this.enumSelectS.typePerson().subscribe((items) => {
    //   this.cb_typePerson.set(items);
    // });
    this.onLoadSelectItem();
    this.applicationUserId = this.config.data.applicationUserId || "";
    if (this.applicationUserId !== "") this.onLoadData();
  }

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.customersActive)
      .then((items: ISelectItem[]) => {
        this.cb_customer.set(items);
      });
  }

  onLoadData() {
    const urlApi = Endpoints.ApplicationUsers.getById(this.applicationUserId);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (result) {
        this.form.patchValue(result);
      }
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    if (this.applicationUserId === "") {
      this.apiResponseS
        .onPost(Endpoints.ApplicationUsers.createAccount, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(
          Endpoints.ApplicationUsers.updateAccount(this.applicationUserId),
          this.form.value,
        )
        .then((result: boolean) => {
          if (result) {
            this.ref.close(true);
          } else {
            this.submitting.set(false);
          }
        });
    }
  }
}
