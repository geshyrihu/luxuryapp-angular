import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { CedulaPresupuestalDetalleForm } from "src/app/core/interfaces/cedula-presupuestal-detalle-form.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

interface IPresupuestoForm {
  id: FormControl<number | null>;
  numeroCuenta: FormControl<string | null>;
  descripcion: FormControl<string | null>;
  presupuestoMensual: FormControl<number | null>;
}

@Component({
  selector: "app-presupuesto-add-partida",
  templateUrl: "./presupuesto-add-partida.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    TooltipModule,
    PrimeNgCustomCaption,
    CustomButton,
    CustomInputNumberSignal,
  ],
})
export class PresupuestoAddPartida implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);

  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((k) => `value.${k}`);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  cedulaPresupuestalId: string = "";
  submitting = signal(false);

  formArray = new FormArray<FormGroup<IPresupuestoForm>>([]);

  constructor() {
    effect(() => {
      const data = this.dataSignal();
      this.formArray.clear();
      data.forEach((cuenta) => {
        this.formArray.push(
          this.formB.group({
            id: new FormControl(cuenta.id),
            numeroCuenta: new FormControl(cuenta.numeroCuenta),
            descripcion: new FormControl(cuenta.descripcion),
            presupuestoMensual: new FormControl(0, {
              validators: [Validators.min(0)],
            }),
          }),
        );
      });
    });
  }

  ngOnInit(): void {
    this.cedulaPresupuestalId = this.config.data.idBudgetCard;
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetSelectItem(
        `AddCuentaCedulaPresupuestal/${this.config.data.idBudgetCard}`,
      )
      .then((result: any[]) => {
        const mappedData = result.map(function (cuenta: any) {
          return {
            id: cuenta.id,
            numeroCuenta: cuenta.numeroCuenta,
            descripcion: cuenta.descripcion,
          };
        });
        this.dataSignal.set(mappedData);
      });
  }

  onSubmit(rowGroup: FormGroup<IPresupuestoForm>) {
    rowGroup.markAllAsTouched();
    if (rowGroup.invalid) return;

    const value = rowGroup.getRawValue();

    let model: CedulaPresupuestalDetalleForm = {
      id: 0,
      cedulaPresupuestalid: this.cedulaPresupuestalId,
      cuentaid: value.id,
      presupuestoMensual: value.presupuestoMensual || 0,
      presupuestoEjercido: 0,
      presupuestoAcumulado: 0,
      presupuestoDisponible: 0,
      presupuestoAnual: 0,
      presupuestoRestanteAnio: 0,
      applicationUserId: this.authS.userToken.infoUserAuthDTO.applicationUserId,
    };

    this.submitting.set(true);

    this.apiResponseS
      .onPost(`CedulaPresupuestalDetalles`, model)
      .then(() => {
        this.onLoadData();
        this.submitting.set(false);
      })
      .catch(() => {
        this.submitting.set(false);
      });
  }
}
