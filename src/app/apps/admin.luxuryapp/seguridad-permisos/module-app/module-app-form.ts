import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { ModuleAppFormGroup } from "./interfaces/module-app-form.interface";
import { ModuleAppGetDto } from "./interfaces/module-app-get.dto";

@Component({
  selector: "app-module-app-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./module-app-form.html",
})
export class ModuleAppForm {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  cb_pathParent = signal<SelectItemDto[]>([]);
  id: string = "";
  submitting = signal(false);
  cb_rolLevel = toSignal(this.enumSelectS.rolLevel(), { initialValue: [] });
  form: FormGroup<ModuleAppFormGroup> = this.formB.group({
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
      .onGetItem<ModuleAppGetDto>(Endpoints.ModuleApps.getById(this.id))
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
      .onGetSelectItem<SelectItemDto[]>(Endpoints.ModuleApps.getAll)
      .then((result) => {
        this.cb_pathParent.set(result);
      });
  }
}
