import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskGroupCategoryFormGroup } from "./interfaces/task-group-category-form.interface";

@Component({
  selector: "app-task-group-category-form",
  templateUrl: "./task-group-category-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class TaskGroupCategoryForm implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly formB = inject(FormBuilder);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly enumService = inject(EnumSelectService);
  private readonly destroyRef = inject(DestroyRef);

  id: string = "";
  submitting = signal(false);
  cb_departament = signal<SelectItemDto[]>([]);

  form: FormGroup<TaskGroupCategoryFormGroup> = this.formB.group({
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
    this.enumService.departament()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
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
