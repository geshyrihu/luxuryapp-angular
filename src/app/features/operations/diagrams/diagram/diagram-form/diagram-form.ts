import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ListboxModule } from "primeng/listbox";

import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IDiagramForm {
  id: FormControl<string | null>;
  customerId: FormControl<string>;
  name: FormControl<string>;
  content: FormControl<string>;
  targetCustomerIds: FormControl<string[]>;
  targetRoleIds: FormControl<string[]>;
}

interface ISelectItem {
  value: string;
  label: string;
}

@Component({
  selector: "app-diagram-form",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    WebButtonLabelSave,
    ListboxModule,
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
  allRoles = signal<ISelectItem[]>([]);
  allCustomers = signal<ISelectItem[]>([]);

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
        this.apiResponseS.onGetSelectItem<ISelectItem[]>(
          "roles-for-announcements",
        ),
        this.apiResponseS.onGetSelectItem<ISelectItem[]>(
          "CustomersActiveNameShort",
        ),
      ]);

      this.allRoles.set(roles || []);
      this.allCustomers.set(this.filterCustomers(customers || []));
    } catch (error) {
      console.error("Error loading catalogs", error);
    }
  }

  private filterCustomers(customers: ISelectItem[]): ISelectItem[] {
    const userRole = this.authService.userToken?.roles?.[0] ?? "";
    const userCustomerId = this.customerIdService.customerId();

    const adminRoles = [
      EApplicationRole.Administrador,
      EApplicationRole.Asistente,
    ];
    const universalRoles = [
      EApplicationRole.Reclutamiento,
      EApplicationRole.Legal,
      EApplicationRole.SupervisionOperativa,
      EApplicationRole.Contador,
      EApplicationRole.SuperUsuario,
      EApplicationRole.RecursosHumanos,
    ];

    if (adminRoles.includes(userRole as EApplicationRole)) {
      return customers.filter((c) => c.value === userCustomerId);
    }
    if (universalRoles.includes(userRole as EApplicationRole)) {
      return customers;
    }
    return [];
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`DiagramDraw/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "DiagramDraw",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
