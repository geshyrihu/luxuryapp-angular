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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelDelete } from "@ui/buttons/web-label";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

interface IServiceOrderFollowUpForm {
  serviceOrderId: FormControl<string>;
  description: FormControl<string>;
}

interface ServiceOrderFollowUpItem {
  id: string;
  serviceOrderId: string;
  description: string;
  createdAt: string;
  createdAtFilter: string;
  applicationUser: string;
}

@Component({
  selector: "app-seguimiento-orden-servicio",
  templateUrl: "./seguimiento-orden-servicio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    ReactiveFormsModule,
    WebButtonLabelSave,
    WebButtonLabelDelete,
    AppSpinner,
    CustomInputTextAreaSignal,
  ],
})
export class SeguimientoOrdenServicio implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private aspRoleS = inject(AspRoleService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);
  followUps = signal<ServiceOrderFollowUpItem[]>([]);
  submitting = signal(false);
  loading = signal(false);

  serviceOrderId: string = this.config.data.id;

  form: FormGroup<IServiceOrderFollowUpForm> = new FormGroup<IServiceOrderFollowUpForm>({
    serviceOrderId: new FormControl<string>(this.serviceOrderId, {
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

  descriptionValue = toSignal(this.form.controls.description.valueChanges, {
    initialValue: "",
  });
  remainingChars = computed(
    () => 200 - ((this.descriptionValue() as string)?.length || 0),
  );

  ngOnInit(): void {
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.apiResponseS.onGetList<ServiceOrderFollowUpItem[]>(
        Endpoints.ServiceOrderFollowUps.list(this.serviceOrderId),
      );
      this.followUps.set(result ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.ServiceOrderFollowUps.create,
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
    });

    if (result) {
      this.form.patchValue({ description: "" });
      await this.onLoadData();
    }
  }

  onDelete(id: string): void {
    if (
      !window.confirm(
        "Se eliminara el seguimiento. Esta acción no se puede deshacer. Continuar?",
      )
    ) {
      return;
    }

    this.apiResponseS
      .onDelete(Endpoints.ServiceOrderFollowUps.delete(id))
      .then((ok) => {
        if (ok) this.onLoadData();
      });
  }

  ngOnDestroy(): void {
    const items = this.followUps();
    const latest = items.length > 0 ? items[0] : null;
    this.ref.close({
      count: items.length,
      lastFollowUp: latest?.description ?? null,
      lastFollowUpDate: latest?.createdAt ?? null,
    });
  }
}
