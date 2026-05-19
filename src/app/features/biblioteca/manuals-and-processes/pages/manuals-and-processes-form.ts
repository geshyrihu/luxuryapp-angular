import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ListboxModule } from "primeng/listbox";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IManualTemplateDetalleDTO } from "../models/manuals-and-processes.dto";

interface IManualTemplateForm {
  folio: FormControl<string>;
  description: FormControl<string>;
  objetivo: FormControl<string>;
  marcoLegal: FormControl<string>;
  departament: FormControl<number | null>;
  currentVersion: FormControl<string>;
  isGlobal: FormControl<boolean>;
  roleIds: FormControl<string[]>;
  customerIds: FormControl<string[]>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-manuals-and-processes-form",
  templateUrl: "./manuals-and-processes-form.html",

  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    ListboxModule,
  ],
})
export class ManualsAndProcessesForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id = signal<string | null>(null);
  submitting = signal(false);

  roles = signal<ISelectItem[]>([]);
  customers = signal<ISelectItem[]>([]);
  departments = signal<ISelectItem[]>([]);

  form: FormGroup<IManualTemplateForm> = this.fb.group({
    folio: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl("", { nonNullable: true }),
    objetivo: new FormControl("", { nonNullable: true }),
    marcoLegal: new FormControl("", { nonNullable: true }),
    departament: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    currentVersion: new FormControl("1.0", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isGlobal: new FormControl(true, { nonNullable: true }),
    roleIds: new FormControl([] as string[], { nonNullable: true }),
    customerIds: new FormControl([] as string[], { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.id.set(this.config.data?.id ?? null);
    this.loadCatalogos();
    if (this.id()) this.loadData();
  }

  async loadCatalogos() {
    const [roles, customers, depts] = await Promise.all([
      this.apiS.onGetSelectItem<ISelectItem[]>("roles-for-announcements"),
      this.apiS.onGetSelectItem<ISelectItem[]>("CustomersActiveNameShort"),
      this.apiS.onGetItem<ISelectItem[]>("select-item-enum/EDepartament"),
    ]);
    this.roles.set(roles ?? []);
    this.customers.set(customers ?? []);
    this.departments.set(depts ?? []);
  }

  async loadData() {
    const res = await this.apiS.onGetItem<IManualTemplateDetalleDTO>(
      Endpoints.ManualsPasos.getById(this.id()!),
    );
    if (!res) return;
    this.form.patchValue({
      folio: res.folio,
      description: res.description,
      objetivo: res.objetivo,
      marcoLegal: res.marcoLegal ?? "",
      departament: res.departamentValue,
      currentVersion: res.currentVersion,
      isGlobal: res.isGlobal,
      isActive: res.isActive,
      roleIds: res.roleIds ?? [],
      customerIds: res.customerIds ?? [],
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.ManualsPasos.create,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
