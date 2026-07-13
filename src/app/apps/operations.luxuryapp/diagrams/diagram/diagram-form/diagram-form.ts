import { Endpoints } from "src/app/core/constants/endpoints";
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
import { LxListbox } from "@ui/adaptive/listbox/listbox";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

interface IDiagramForm {
  id: FormControl<string | null>;
  customerId: FormControl<string>;
  name: FormControl<string>;
  content: FormControl<string>;
  targetCustomerIds: FormControl<string[]>;
  targetRoleIds: FormControl<string[]>;
}

interface SelectItem {
  value: string;
  label: string;
}

@Component({
  selector: "app-diagram-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    WebButtonLabelSave,
    LxListbox,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./diagram-form.html",
})
export class DiagramForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private customerIdService = inject(CustomerIdService);
  private authService = inject(AuthService);

  id = "";
  submitting = signal(false);
  allRoles = signal<SelectItem[]>([]);
  allCustomers = signal<SelectItem[]>([]);

  form: FormGroup<IDiagramForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    customerId: new FormControl(this.customerIdService.customerId() || "", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    content: new FormControl("", { nonNullable: true }),
    targetCustomerIds: new FormControl([] as string[], { nonNullable: true }),
    targetRoleIds: new FormControl([] as string[], { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;
    await this.loadInitialData();
    if (this.id) {
      this.onLoadData();
    }
  }

  async loadInitialData() {
    try {
      const [roles, customers] = await Promise.all([
        this.apiResponseS.onGetSelectItem<SelectItem[]>(
          "roles-for-announcements",
        ),
        this.apiResponseS.onGetSelectItem<SelectItem[]>(
          "CustomersActiveNameShort",
        ),
      ]);

      this.allRoles.set(roles || []);
      this.allCustomers.set(this.filterCustomers(customers || []));
    } catch (error) {
      console.error("Error loading catalogs", error);
    }
  }

  private filterCustomers(customers: SelectItem[]): SelectItem[] {
    const userRole = this.authService.userToken?.roles?.[0] ?? "";
    const userCustomerId = this.customerIdService.customerId();

    const adminRoles = [
      ApplicationRole.Administrador,
      ApplicationRole.Asistente,
    ];
    const universalRoles = [
      ApplicationRole.Reclutamiento,
      ApplicationRole.Legal,
      ApplicationRole.SupervisionOperativa,
      ApplicationRole.Contador,
      ApplicationRole.SuperUsuario,
      ApplicationRole.RecursosHumanos,
    ];

    if (adminRoles.includes(userRole as ApplicationRole)) {
      return customers.filter((c) => c.value === userCustomerId);
    }
    if (universalRoles.includes(userRole as ApplicationRole)) {
      return customers;
    }
    return [];
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.RefactorOperations.diagramDrawById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "diagram-draw",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
