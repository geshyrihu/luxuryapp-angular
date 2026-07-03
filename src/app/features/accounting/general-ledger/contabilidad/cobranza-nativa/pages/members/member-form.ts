import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { EMemberRole } from "../../models/enums";
import {
  CreatePropertyMemberDTO,
  UpdatePropertyMemberDTO,
} from "../../models/property-member.dto";

// ETypePerson.Client = 2
const E_TYPE_PERSON_CLIENT = 2;

interface IUserForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
}

interface IMemberForm {
  memberRole: FormControl<EMemberRole>;
  isFinancialResponsible: FormControl<boolean>;
  receiveNotifications: FormControl<boolean>;
  startDate: FormControl<Date>;
  endDate: FormControl<Date | null>;
  notes: FormControl<string | null>;
}

@Component({
  selector: "app-member-form",
  imports: [
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
  templateUrl: "./member-form.html",
})
export default class MemberForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private enumSelectS = inject(EnumSelectService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id = "";
  propertyId = "";
  customerId = "";

  step = signal<1 | 2>(1);
  submitting = signal(false);
  createdUserId = signal("");

  userForm: FormGroup<IUserForm>;
  memberForm: FormGroup<IMemberForm>;

  roleOptions = signal<ISelectItem[]>([]);

  ngOnInit() {
    this.id = this.config.data.id ?? "";
    this.propertyId = this.config.data.propertyId ?? "";
    this.customerId = this.config.data.customerId ?? "";

    this.enumSelectS
      .memberRole()
      .subscribe((opts) => this.roleOptions.set(opts));

    this.userForm = this.fb.group({
      firstName: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      phoneNumber: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.memberForm = this.fb.group({
      memberRole: new FormControl(EMemberRole.Owner, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      isFinancialResponsible: new FormControl(false, { nonNullable: true }),
      receiveNotifications: new FormControl(true, { nonNullable: true }),
      startDate: new FormControl(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDate: new FormControl<Date | null>(null),
      notes: new FormControl<string | null>(null, [Validators.maxLength(500)]),
    });

    if (this.id) {
      this.step.set(2);
      this.loadData();
    }
  }

  async onNextStep() {
    const result = await FormHelper.submitCrud({
      form: this.userForm,
      api: this.apiResponseS,
      endpoint: Endpoints.ApplicationUsers.createAccount,
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: (raw) => ({
        customerId: this.customerId,
        typePerson: E_TYPE_PERSON_CLIENT,
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        phoneNumber: raw.phoneNumber,
      }),
    });

    if (result && typeof result === "object") {
      this.createdUserId.set(result.id ?? "");
      this.step.set(2);
    }
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.PropertyMembers.byId(this.id),
    );
    if (res) {
      this.memberForm.patchValue({
        ...res,
        startDate: this.dateS.parseDate(res.startDate),
        endDate: this.dateS.parseDate(res.endDate),
      });
    }
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.memberForm,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.AccountingCoi.NativeCollection.PropertyMembers.update(
            this.id,
          )
        : Endpoints.AccountingCoi.NativeCollection.PropertyMembers.create,
      method: this.id ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (raw) => {
        if (!this.id) {
          return {
            customerId: this.customerId,
            propertyId: this.propertyId,
            userId: this.createdUserId(),
            memberRole: raw.memberRole,
            isFinancialResponsible: raw.isFinancialResponsible,
            receiveNotifications: raw.receiveNotifications,
            startDate: this.dateS.getDateFormat(raw.startDate) ?? "",
            endDate: this.dateS.getDateFormat(raw.endDate),
            notes: raw.notes,
          } as CreatePropertyMemberDTO;
        } else {
          return {
            id: this.id,
            memberRole: raw.memberRole,
            isFinancialResponsible: raw.isFinancialResponsible,
            receiveNotifications: raw.receiveNotifications,
            notes: raw.notes,
          } as UpdatePropertyMemberDTO;
        }
      },
    });
  }
}
