import { Component, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TagModule } from "primeng/tag";
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
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface ITaskGroupForm {
  id: FormControl<string | null>;
  customerId: FormControl<string>;
  visibility: FormControl<number>;
  TaskGroupCategoryId: FormControl<string>;
  userCreateId: FormControl<string>;
}

@Component({
  selector: "app-task-group-form",
  templateUrl: "./task-group-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    TagModule,
  ],
})
export class TaskGroupForm implements OnInit {
  private readonly authS = inject(AuthService);
  private readonly apiS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(DynamicDialogRef);
  private readonly enumS = inject(EnumSelectService);

  readonly id = signal<string>(this.config.data?.id ?? "");
  readonly submitting = signal(false);

  readonly cb_visibility = toSignal(this.enumS.visibilityLevel(), {
    initialValue: [],
  });
  readonly cb_TaskGroupCategory = signal<ISelectItem[]>([]);

  form: FormGroup<ITaskGroupForm> = this.fb.nonNullable.group({
    id: new FormControl({ value: this.id(), disabled: true }),
    customerId: [
      this.customerIdS.customerId(),
      { validators: [Validators.required] },
    ],
    visibility: [0, { validators: [Validators.required] }],
    TaskGroupCategoryId: ["", { validators: [Validators.required] }],
    userCreateId: [
      this.authS.applicationUserId,
      { validators: [Validators.required] },
    ],
  });

  ngOnInit() {
    this.onLoadTaskGroupCategory();
    if (this.id() !== "") this.onLoadData();
  }

  onLoadData() {
    this.apiS.onGetItem<any>(Endpoints.TaskGroups.getById(this.id())).then((result) => {
      if (result) this.form.patchValue(result);
    });
  }

  onLoadTaskGroupCategory() {
    this.apiS
      .onGetSelectItem<ISelectItem[]>(
        Endpoints.TaskGroupCategories.selectByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((result) => {
      this.cb_TaskGroupCategory.set(result ?? []);
    });
  }

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.TaskGroups.base,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
    };
    FormHelper.submitCrud(options);
  }
}
