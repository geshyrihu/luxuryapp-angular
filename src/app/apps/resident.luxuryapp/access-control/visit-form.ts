import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CustomInputDateTimeSignal } from "@ui/inputs/web/custom-input-date-time-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CreateVisitRequestDto } from "src/app/core/interfaces/create-visit-request.dto";
import { Property } from "src/app/core/interfaces/property.interface";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { VisitDto } from "src/app/core/interfaces/visit.dto";

interface IVisitForm {
  propertyId: FormControl<string | null>;
  visitorFullName: FormControl<string>;
  visitorPhone: FormControl<string | null>;
  visitorEmail: FormControl<string | null>;
  company: FormControl<string | null>;
  vehiclePlate: FormControl<string | null>;
  scheduledStart: FormControl<string | null>;
  scheduledEnd: FormControl<string | null>;
  purpose: FormControl<string | null>;
  credentialValidityType: FormControl<string>;
  generateInvitation: FormControl<boolean>;
  invitationChannel: FormControl<string | null>;
}

@Component({
  selector: "app-visit-form",
  templateUrl: "./visit-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateTimeSignal,
    CustomInputSwitch,
    WebButtonLabel,
    WebButtonLabelSave,
  ],
})
export class VisitForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private customerIdS = inject(CustomerIdService);

  submitting = signal(false);
  properties = signal<SelectItemDto[]>([]);
  createdVisit = signal<VisitDto | null>(null);

  validityTypes: SelectItemDto[] = [
    { value: "SingleUseScheduled", label: "Un solo uso (programado)" },
    { value: "MultiUseScheduled", label: "Multiuso (programado)" },
  ];

  form!: FormGroup<IVisitForm>;

  ngOnInit(): void {
    this.onLoadProperties();
    this.form = this.formB.group<IVisitForm>({
      propertyId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      visitorFullName: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      visitorPhone: new FormControl<string | null>(null),
      visitorEmail: new FormControl<string | null>(null),
      company: new FormControl<string | null>(null),
      vehiclePlate: new FormControl<string | null>(null),
      scheduledStart: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      scheduledEnd: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      purpose: new FormControl<string | null>(null),
      credentialValidityType: new FormControl("SingleUseScheduled", {
        nonNullable: true,
      }),
      generateInvitation: new FormControl(false, { nonNullable: true }),
      invitationChannel: new FormControl<string | null>("WhatsApp"),
    });
  }

  channels: SelectItemDto[] = [
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Email", label: "Correo" },
    { value: "SMS", label: "SMS" },
  ];

  private onLoadProperties(): void {
    const url = Endpoints.RefactorResident.propertyListById(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList<Property[]>(url).then((result) => {
      this.properties.set(
        (result ?? []).map((p) => ({ value: p.id, label: p.fullName })),
      );
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const v = this.form.getRawValue();
    const payload: CreateVisitRequestDto = {
      propertyId: v.propertyId!,
      visitorFullName: v.visitorFullName,
      visitorPhone: v.visitorPhone,
      visitorEmail: v.visitorEmail,
      company: v.company,
      vehiclePlate: v.vehiclePlate,
      scheduledStart: v.scheduledStart!,
      scheduledEnd: v.scheduledEnd!,
      purpose: v.purpose,
      credentialValidityType: v.credentialValidityType,
      generateInvitation: v.generateInvitation,
      invitationChannel: v.generateInvitation ? v.invitationChannel : null,
    };

    this.apiResponseS
      .onPost<VisitDto>(Endpoints.AccessControlVisits.create, payload)
      .then((result) => {
        this.submitting.set(false);
        if (result) this.createdVisit.set(result);
      });
  }

  nuevaVisita(): void {
    this.createdVisit.set(null);
    this.form.reset({ credentialValidityType: "SingleUseScheduled" });
  }

  qrSrc(base64: string): string {
    return `data:image/png;base64,${base64}`;
  }
}
