import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/buttons/web";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
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
    CustomButton,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomButtonSave,
  ],
  templateUrl: "./member-form.html",
})
export default class MemberForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
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
    if (!this.apiResponseS.validateForm(this.userForm)) return;
    this.submitting.set(true);
    try {
      const raw = this.userForm.getRawValue();
      const result = await this.apiResponseS.onPost<{ id: string }>(
        Endpoints.ApplicationUsers.createAccount,
        {
          customerId: this.customerId,
          typePerson: E_TYPE_PERSON_CLIENT,
          firstName: raw.firstName,
          lastName: raw.lastName,
          email: raw.email,
          phoneNumber: raw.phoneNumber,
        },
      );
      if (result && typeof result === "object") {
        this.createdUserId.set(result.id ?? "");
        this.step.set(2);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.PropertyMembers.byId(this.id),
    );
    if (res) {
      this.memberForm.patchValue({
        ...res,
        startDate: new Date(res.startDate),
        endDate: res.endDate ? new Date(res.endDate) : null,
      });
    }
  }

  async onSubmit() {
    if (!this.apiResponseS.validateForm(this.memberForm)) return;
    this.submitting.set(true);
    try {
      const raw = this.memberForm.getRawValue();
      let ok: boolean;

      if (!this.id) {
        const payload: CreatePropertyMemberDTO = {
          customerId: this.customerId,
          propertyId: this.propertyId,
          userId: this.createdUserId(),
          memberRole: raw.memberRole,
          isFinancialResponsible: raw.isFinancialResponsible,
          receiveNotifications: raw.receiveNotifications,
          startDate: raw.startDate.toISOString(),
          endDate: raw.endDate ? raw.endDate.toISOString() : null,
          notes: raw.notes,
        };
        ok = await this.apiResponseS.onPost(
          Endpoints.AccountingCoi.NativeCollection.PropertyMembers.create,
          payload,
        );
      } else {
        const payload: UpdatePropertyMemberDTO = {
          id: this.id,
          memberRole: raw.memberRole,
          isFinancialResponsible: raw.isFinancialResponsible,
          receiveNotifications: raw.receiveNotifications,
          notes: raw.notes,
        };
        ok = await this.apiResponseS.onPut(
          Endpoints.AccountingCoi.NativeCollection.PropertyMembers.update(
            this.id,
          ),
          payload,
        );
      }

      if (ok) this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
