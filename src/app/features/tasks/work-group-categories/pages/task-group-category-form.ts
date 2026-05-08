import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface ITaskGroupCategoryForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  departament: FormControl<number | null>;
  emoji: FormControl<string>;
  color: FormControl<string>;
}

@Component({
  selector: "app-task-group-category-form",
  templateUrl: "./task-group-category-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class TaskGroupCategoryForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumService = inject(EnumSelectService);

  id: string = "";
  submitting = signal(false);
  cb_departament = signal<ISelectItem[]>([]);

  form: FormGroup<ITaskGroupCategoryForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    departament: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    emoji: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    color: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
  });

  ngOnInit() {
    this.enumService.departament().subscribe((data) => {
      this.cb_departament.set(data);
    });
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    // Sync Id
    this.form.controls.id.setValue(this.id);
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.TaskGroupCategories.getById(this.id))
      .then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.TaskGroupCategories.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    };
    FormHelper.submitCrud(options);
  }
}
