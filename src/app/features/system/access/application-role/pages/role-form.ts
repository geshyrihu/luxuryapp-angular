import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { LxCard } from "@ui/adaptive/card/card";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IApplicationRoleAddOrEditDTO } from "../models/application-role.dto";

interface IRoleForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  displayName: FormControl<string>;
  roleType: FormControl<number>;
  departament: FormControl<number>;
  sortOrder: FormControl<number>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-role-form",
  templateUrl: "./role-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
    LxCard,
  ],
})
export class RoleForm implements OnInit {
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private apiResponseS = inject(ApiResponseService);
  private enumS = inject(EnumSelectService);

  submitting = signal(false);
  id: string = "";
  cb_roleType = toSignal(this.enumS.roleType(), { initialValue: [] });
  cb_departament = toSignal(this.enumS.departament(), { initialValue: [] });

  form: FormGroup<IRoleForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    displayName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    roleType: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    departament: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    sortOrder: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isActive: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData(this.id);

    // Sync Id
    this.form.controls.id.setValue(this.id);
  }

  onLoadData(id: string) {
    this.apiResponseS
      .onGetItem<IApplicationRoleAddOrEditDTO>(
        Endpoints.ApplicationRoles.getById(id),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue({
            id: result.id,
            name: result.name,
            displayName: result.displayName,
            roleType: result.roleType,
            departament: result.departament,
            sortOrder: result.sortOrder,
            isActive: result.isActive,
          });
        }
      });
  }

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.ApplicationRoles.getAll,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    };
    FormHelper.submitCrud(options);
  }
}
