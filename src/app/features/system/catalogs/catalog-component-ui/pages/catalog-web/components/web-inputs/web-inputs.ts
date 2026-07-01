import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CardModule } from "primeng/card";

import {
  CustomInputAutoComplete,
  CustomInputAutoMultiple,
  CustomInputCheckSignal,
  CustomInputCurrencySignal,
  CustomInputDateSignal,
  CustomInputDateTimeSignal,
  CustomInputDecimal,
  CustomInputFile,
  CustomInputHour,
  CustomInputImg,
  CustomInputMaskSignal,
  CustomInputMonth,
  CustomInputMultiselectSignal,
  CustomInputNgSelect,
  CustomInputNumberSignal,
  CustomInputPassword,
  CustomInputPhonePrefix,
  CustomInputSelectBool,
  CustomInputSelectPrefix,
  CustomInputSelectSignal,
  CustomInputSwitch,
  CustomInputTextAreaSignal,
  CustomInputTextSignal,
  CustomInputTime,
  CustomInputUrl,
  CustomSearchInput,
} from "src/app/core/components/inputs/web";

@Component({
  selector: "app-web-inputs",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CustomInputAutoMultiple,
    CustomInputAutoComplete,
    CustomInputCheckSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputDateTimeSignal,
    CustomInputDecimal,
    CustomInputFile,
    CustomInputHour,
    CustomInputImg,
    CustomInputMaskSignal,
    CustomInputMonth,
    CustomInputMultiselectSignal,
    CustomInputNgSelect,
    CustomInputNumberSignal,
    CustomInputPassword,
    CustomInputPhonePrefix,
    CustomInputSelectBool,
    CustomInputSelectPrefix,
    CustomInputSelectSignal,
    CustomInputSwitch,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputTime,
    CustomInputUrl,
    CustomSearchInput,
  ],
  template: `
    <form [formGroup]="webForm" class="flex flex-column gap-3">
      <!-- Texto, Búsqueda y Contraseña -->
      <p-card header="Texto, Búsqueda y Contraseña">
        <div class="grid">
          <div class="col-12 lg:col-6">
            <custom-input-text-signal
              [control]="webForm.controls['nombre']"
              label="Texto libre"
              placeholder="Nombre de usuario..."
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-6">
            <custom-search-input-signal placeholder="Buscar..." />
          </div>
          <div class="col-12 lg:col-6">
            <custom-input-password-signal
              [control]="webForm.controls['password']"
              label="Contraseña"
              [showStrengthIndicator]="true"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-6">
            <custom-input-textarea-signal
              [control]="webForm.controls['comentarios']"
              label="Observaciones"
              [rows]="3"
              [horizontal]="false"
            />
          </div>
        </div>
      </p-card>

      <!-- Numéricos -->
      <p-card header="Numéricos y Moneda">
        <div class="grid">
          <div class="col-12 lg:col-3">
            <custom-input-number-signal
              [control]="webForm.controls['edad']"
              label="Número entero"
              [showButtons]="true"
              [min]="0"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-3">
            <custom-input-currency-signal
              [control]="webForm.controls['precio']"
              label="Moneda (MXN)"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-3">
            <custom-input-decimal-signal
              [control]="webForm.controls['peso']"
              label="Decimal"
              [maxFractionDigits]="3"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-3">
            <custom-input-hour-signal
              [control]="webForm.controls['horaCorta']"
              label="Hora HH:mm"
              [horizontal]="false"
            />
          </div>
        </div>
      </p-card>

      <!-- Fechas y Tiempos -->
      <p-card header="Fechas y Tiempos">
        <div class="grid">
          <div class="col-12 lg:col-3">
            <custom-input-date-signal
              [control]="webForm.controls['fecha']"
              label="Fecha"
              placeholder="dd/mm/aaaa"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-3">
            <custom-input-date-time-signal
              [control]="webForm.controls['fechaHora']"
              label="Fecha y Hora"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-3">
            <custom-input-month
              [control]="webForm.controls['mes']"
              label="Mes"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-3">
            <custom-input-time-signal
              [control]="webForm.controls['hora']"
              label="Hora (picker)"
              [horizontal]="false"
            />
          </div>
        </div>
      </p-card>

      <!-- Selección -->
      <p-card header="Selección y Búsqueda Avanzada">
        <div class="grid">
          <div class="col-12 lg:col-4">
            <custom-input-select-signal
              [control]="webForm.controls['categoria']"
              [data]="options"
              label="Select simple"
              [filter]="true"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-4">
            <custom-input-multiselect-signal
              [control]="webForm.controls['roles']"
              [options]="options"
              label="Multiselect"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-4">
            <custom-input-select-signal-bool
              [control]="webForm.controls['activoBool']"
              label="Activo / Inactivo"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-6">
            <custom-input-ng-select
              [control]="webForm.controls['ngSelect']"
              [items]="options"
              label="Ng-Select (búsqueda avanzada)"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-6">
            <custom-input-select-signal-prefix
              [control]="webForm.controls['prefijo']"
              [data]="options"
              label="Select + prefijo de texto"
              inputPlaceholder="Detalle..."
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-6">
            <custom-input-autocomplete-signal
              [control]="webForm.controls['autocomplete']"
              label="Autocomplete (sugerencias)"
              [data]="options"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-6">
            <custom-input-autocomplete-multiple-signal
              [control]="webForm.controls['autoMultiple']"
              label="Autocomplete múltiple"
              [data]="options"
              [horizontal]="false"
            />
          </div>
        </div>
      </p-card>

      <!-- Especiales -->
      <p-card header="Especiales — Máscara, URL y Teléfono">
        <div class="grid">
          <div class="col-12 lg:col-4">
            <custom-input-mask-signal
              [control]="webForm.controls['codigoPostal']"
              label="Código postal"
              [customMask]="'99999'"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-4">
            <custom-input-url
              [control]="webForm.controls['sitioWeb']"
              label="URL"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-4">
            <custom-input-phone-prefix
              [control]="webForm.controls['telefono']"
              label="Teléfono con lada"
              [horizontal]="false"
            />
          </div>
        </div>
      </p-card>

      <!-- Archivos e Imágenes -->
      <p-card header="Archivos e Imágenes">
        <div class="grid">
          <div class="col-12 lg:col-4">
            <custom-input-file-signal
              [control]="webForm.controls['archivo']"
              label="Archivo genérico"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-4">
            <custom-input-img-signal
              [control]="webForm.controls['imagen']"
              label="Imagen con vista previa"
              title="Vista previa"
              [horizontal]="false"
            />
          </div>
          <div class="col-12 lg:col-4">
            <div class="flex flex-column gap-1">
              <label class="block text-sm font-medium text-color-secondary"
                >PDF masivo</label
              >
              <div
                class="p-3 border-1 border-dashed border-round surface-ground text-center text-xs text-color-secondary"
              >
                <span class="block font-semibold mb-1"
                  >app-custom-input-upload-pdf-signal</span
                >
                Componente de diálogo — se abre vía
                <code>DynamicDialogService</code>, no como input directo.
              </div>
            </div>
          </div>
        </div>
      </p-card>

      <!-- Toggles y Checks -->
      <p-card header="Toggles y Checkboxes">
        <div class="flex flex-wrap align-items-center gap-4">
          <custom-input-switch-signal
            [control]="webForm.controls['activo']"
            label="Activo"
          />
          <custom-input-check-signal
            [control]="webForm.controls['terminos']"
            label="Acepto términos y condiciones"
          />
        </div>
      </p-card>
    </form>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebInputs {
  private fb = inject(FormBuilder);

  webForm: FormGroup = this.fb.group({
    nombre: [""],
    comentarios: [""],
    buscar: [""],
    password: [""],
    edad: [null],
    precio: [null],
    peso: [null],
    fecha: [null],
    fechaHora: [null],
    mes: [null],
    hora: [null],
    horaCorta: ["08:30"],
    categoria: [null],
    roles: [[]],
    activoBool: [null],
    ngSelect: [null],
    sitioWeb: [""],
    codigoPostal: [""],
    telefono: [""],
    prefijo: [""],
    autocomplete: [null],
    autoMultiple: [[]],
    archivo: [null],
    imagen: [""],
    pdf: [""],
    activo: [true],
    terminos: [false],
  });

  readonly options = [
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];
}
