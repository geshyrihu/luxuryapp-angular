import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { RoleType } from "src/app/core/enums/role-type.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { OnboardingChecklistOptionFormGroup } from "./interfaces/onboarding-checklist-option-form.interface";
import {
  OnboardingChecklistOptionAddOrEdit,
  OnboardingChecklistOptionDto,
} from "./interfaces/onboarding-checklist-option.dto";
import { ApplicationRoleDto } from "../../seguridad-permisos/application-role/interfaces/application-role.dto";

@Component({
  selector: "app-onboarding-checklist-option-form",
  templateUrl: "./onboarding-checklist-option-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputNumberSignal,
    CustomInputMultiselectSignal,
    WebButtonLabelSave,
  ],
})
export class OnboardingChecklistOptionForm implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly submitting = signal(false);
  readonly roleOptions = signal<SelectItemDto<number | string>[]>([]);
  id = "";

  form = new FormGroup<OnboardingChecklistOptionFormGroup>({
    id: new FormControl<string | null>({ value: "", disabled: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    isActive: new FormControl(true, { nonNullable: true }),
    diasSla: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(365)],
    }),
    roles: new FormControl<Array<number | string>>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    await this.loadRoleOptions();
    if (this.id) this.onLoadData();
  }

  async loadRoleOptions(): Promise<void> {
    const roles = await this.apiResponseS.onGetList<ApplicationRoleDto[]>(
      Endpoints.ApplicationRoles.getAll,
    );
    this.roleOptions.set(
      (roles ?? [])
        .filter(
          (item) =>
            (item.roleTypeOrder === RoleType.Corporate ||
              item.roleTypeOrder === RoleType.Staff) &&
            item.systemRole !== null,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map<SelectItemDto<number>>((item) => ({
          label: item.displayName,
          value: item.systemRole as number,
        })),
    );
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetItem<OnboardingChecklistOptionDto>(
        Endpoints.Catalogs.OnboardingChecklistOptions.getById(this.id),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue({
            ...result,
            roles: result.roles ?? [],
          });
        }
      });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Catalogs.OnboardingChecklistOptions.create,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (
        value: OnboardingChecklistOptionDto,
      ): OnboardingChecklistOptionAddOrEdit => ({
        ...value,
        name: value.name?.trim(),
        description: value.description?.trim(),
        roles: this.normalizeRoles(value.roles),
      }),
    });
  }

  private normalizeRoles(
    roles: Array<number | string> | null | undefined,
  ): number[] {
    return (roles ?? [])
      .map((role) => this.toRoleEnumValue(role))
      .filter((role): role is number => Number.isInteger(role) && role >= 0);
  }

  private toRoleEnumValue(role: number | string): number {
    if (typeof role === "number") return role;
    const parsed = Number(role);
    return Number.isNaN(parsed) ? -1 : parsed;
  }
}
