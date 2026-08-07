import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelDelete } from "@ui/buttons/web-label";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
interface ITicketMessageFollowupForm {
  id: FormControl<string>;
  ticketMessageId: FormControl<string>;
  applicationUserId: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: "app-task-followup",
  templateUrl: "./task-followup.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    ReactiveFormsModule,
    FormsModule,
    WebButtonLabelSave,
    WebButtonLabelDelete,
    AppSpinner,
    CustomInputTextAreaSignal,
  ],
})
export class TaskFollowup implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private aspRoleS = inject(AspRoleService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);
  description = signal<any[]>([]);
  submitting = signal(false);

  ticketMessageId: any = this.config.data.id;
  id: string = "";
  loading = signal(false);

  form: FormGroup<ITicketMessageFollowupForm> = this.formB.group({
    id: new FormControl<string>(
      { value: this.id, disabled: true },
      { nonNullable: true },
    ),
    ticketMessageId: new FormControl<string>(this.ticketMessageId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ],
    }),
  });

  // Character count signal
  descriptionValue = toSignal(this.form.controls.description.valueChanges, {
    initialValue: "",
  });
  remainingChars = computed(
    () => 200 - ((this.descriptionValue() as string)?.length || 0),
  );

  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  onCargaListaseguimientos() {
    this.apiResponseS
      .onGetList(
        Endpoints.TaskFollowUps.listByTicketMessage(this.ticketMessageId),
      )
      .then((result: any) => {
        this.description.set(result || []);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.TaskFollowUps.create,
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
    });

    if (result) {
      this.onCargaListaseguimientos();
      this.form.patchValue({ description: "" });
    }
  }
  onDelete(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.TaskFollowUps.delete(id))
      .then((ok) => {
        if (ok) this.onCargaListaseguimientos();
      });
  }

  ngOnDestroy(): void {
    const items = this.description();
    const latest = items.length > 0 ? items[0] : null; // backend devuelve desc por fecha
    this.ref.close({
      count: items.length,
      lastFollowUp: latest?.description ?? null,
      lastFollowUpDate: latest
        ? (latest.createdAt as string).split(" ")[0]
        : null,
    });
  }
}
