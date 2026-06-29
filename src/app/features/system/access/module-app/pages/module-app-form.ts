import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IModuleAppGetDTO } from "../models/module-app.dto";

interface IModuleAppForm {
  id: FormControl<string | null>;
  nameModule: FormControl<string>;
  rolLevel: FormControl<string | number | null>;
  label: FormControl<string | null>;
  routerLink: FormControl<string | null>;
  icon: FormControl<string | null>;
  pathParent: FormControl<string | null>;
  viewMobil: FormControl<boolean | null>;
}

@Component({
  selector: "app-module-app-form",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    RouterModule,
  ],
  templateUrl: "./module-app-form.html",
})
export class ModuleAppForm {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  cb_pathParent = signal<ISelectItem[]>([]);
  id: string = "";
  submitting = signal(false);
  cb_rolLevel = toSignal(this.enumSelectS.rolLevel(), { initialValue: [] });
  form: FormGroup<IModuleAppForm> = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }),
    nameModule: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rolLevel: new FormControl<string | number | null>(null),
    label: new FormControl<string | null>(null),
    routerLink: new FormControl<string | null>(null),
    icon: new FormControl<string | null>(null),
    pathParent: new FormControl<string | null>(null),
    viewMobil: new FormControl<boolean | null>(null),
  });

  async ngOnInit() {
    // this.enumSelectS.rolLevel().subscribe((data) => this.cb_rolLevel.set(data));

    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    this.onLoadModuleApp();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem<IModuleAppGetDTO>(Endpoints.ModuleApps.getById(this.id))
      .then((result) => {
        if (result) {
          this.form.patchValue(result as any);
        }
      });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.ModuleApps.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onLoadModuleApp() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.ModuleApps.getAll)
      .then((result) => {
        this.cb_pathParent.set(result);
      });
  }
}
