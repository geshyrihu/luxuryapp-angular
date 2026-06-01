import { CommonModule } from "@angular/common";
import {
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
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
interface ITicketMessageFollowupForm {
  id: FormControl<string>;
  ticketMessageId: FormControl<string>;
  applicationUserId: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: "app-task-followup",
  templateUrl: "./task-followup.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    CustomButtonSave,
    ProgressSpinnerModule,
    CustomInputTextAreaSignal,
  ],
})
export class TaskFollowup implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
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
      .onGetList(Endpoints.TaskFollowUps.listByTicketMessage(this.ticketMessageId))
      .then((result: any) => {
      this.description.set(result || []);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const formValue = this.form.getRawValue();

    this.apiResponseS.onPost(Endpoints.TaskFollowUps.create, formValue).then((_) => {
      this.onCargaListaseguimientos();
      this.form.patchValue({
        description: "",
      });
      // remainingChars will update automatically via valueChanges
      this.submitting.set(false);
    });
  }
  ngOnDestroy(): void {
    this.ref.close(this.description().length);
  }
}
