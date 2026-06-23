import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import {
  CustomBtnActiveDesactive,
  CustomButton,
  CustomButtonAdd,
  CustomButtonConfirm,
  CustomButtonDelete,
  CustomButtonDownload,
  CustomButtonEdit,
  CustomButtonItem,
  CustomButtonSave,
  CustomButtonSendEmail,
  CustomButtonTracking,
  CustomButtonViewPdf,
} from "src/app/core/components/buttons/web";
import {
  CustomInputAutoComplete,
  CustomInputAutoMultiple,
  CustomInputCheckSignal,
  CustomInputCurrencySignal,
  CustomInputDateSignal,
  CustomInputDateTimeNative,
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
  selector: "app-web-core-coverage",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    CustomButton,
    CustomBtnActiveDesactive,
    CustomButtonAdd,
    CustomButtonConfirm,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButtonSave,
    CustomButtonSendEmail,
    CustomButtonTracking,
    CustomButtonViewPdf,
    CustomInputAutoComplete,
    CustomInputAutoMultiple,
    CustomInputCheckSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputDateTimeNative,
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
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card header="All Web Buttons">
          <p class="m-0 mb-4 text-sm text-600 line-height-3">
            Catalogo completo de acciones web para escritorio, con variantes
            primarias, contextuales y de estado.
          </p>

          <div class="surface-ground border-round p-3">
            <div class="text-xs font-semibold uppercase text-500 mb-3">
              Button Inventory
            </div>

            <div class="flex flex-wrap gap-2">
              <custom-button label="Generico" />
              <custom-button-add label="Agregar" />
              <custom-button-edit label="Editar" />
              <custom-button-delete label="Eliminar" />
              <custom-button-save label="Guardar" />
              <custom-button-download />
              <custom-button-confirm label="Confirmar" />
              <custom-button-view-pdf [url]="'/demo.pdf'" [fileName]="'demo.pdf'" />
              <custom-button-send-email />
              <custom-button-tracking [badgeCount]="4" [ticketId]="128" />
              <custom-button-item icon="mdi:star" label="Item" />
              <custom-button-active-desactive [state]="true" />
              <custom-button-active-desactive [state]="false" />
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12">
        <p-card header="All Web Inputs">
          <p class="m-0 mb-4 text-sm text-600 line-height-3">
            Inventario completo de inputs web organizado por captura de texto,
            cantidades, fechas, seleccion y archivos.
          </p>

          <form [formGroup]="form" class="flex flex-column gap-4">
            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Text And Search
              </div>

              <div class="grid">
                <div class="col-12 lg:col-4">
                  <custom-input-text-signal
                    [control]="form.controls['texto']"
                    label="Texto"
                    placeholder="Nombre completo"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-search-input-signal placeholder="Buscar componente" />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-password-signal
                    [control]="form.controls['password']"
                    label="Contrasena"
                    [showStrengthIndicator]="true"
                  />
                </div>
              </div>
            </div>

            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Numeric And Amount
              </div>

              <div class="grid">
                <div class="col-12 lg:col-3">
                  <custom-input-number-signal
                    [control]="form.controls['numero']"
                    label="Numero"
                    [showButtons]="true"
                    [min]="0"
                    [max]="99"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-currency-signal
                    [control]="form.controls['monto']"
                    label="Monto"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-decimal-signal
                    [control]="form.controls['decimal']"
                    label="Decimal"
                    [maxFractionDigits]="3"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-hour-signal
                    [control]="form.controls['horaCorta']"
                    label="Hora corta"
                  />
                </div>
              </div>
            </div>

            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Date And Time
              </div>

              <div class="grid">
                <div class="col-12 lg:col-3">
                  <custom-input-date-signal
                    [control]="form.controls['fecha']"
                    label="Fecha"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-date-time-signal
                    [control]="form.controls['fechaHora']"
                    label="Fecha y hora"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-date-time-native
                    [control]="form.controls['fechaHoraNative']"
                    label="DateTime nativo"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-month
                    [control]="form.controls['mes']"
                    label="Mes"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-time-signal
                    [control]="form.controls['hora']"
                    label="Hora"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-hour-signal
                    [control]="form.controls['horaCorta']"
                    label="Hora HH:mm"
                  />
                </div>
              </div>
            </div>

            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Mask, Url And Prefix
              </div>

              <div class="grid">
                <div class="col-12 lg:col-4">
                  <custom-input-mask-signal
                    [control]="form.controls['cp']"
                    label="Codigo postal"
                    [customMask]="'99999'"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-url
                    [control]="form.controls['url']"
                    label="Sitio web"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-phone-prefix
                    [control]="form.controls['lada']"
                    label="Lada"
                  />
                </div>
              </div>
            </div>

            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Selection And Autocomplete
              </div>

              <div class="grid">
                <div class="col-12 lg:col-4">
                  <custom-input-select-signal
                    [control]="form.controls['categoria']"
                    label="Select"
                    [data]="options"
                    [filter]="true"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-multiselect-signal
                    [control]="form.controls['multi']"
                    label="Multiselect"
                    [options]="options"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-select-signal-bool
                    [control]="form.controls['estado']"
                    label="Activo/Inactivo"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-ng-select
                    [control]="form.controls['ngSelect']"
                    label="Ng Select wrapper"
                    [items]="options"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-autocomplete-signal
                    [control]="form.controls['autocomplete']"
                    label="Autocomplete"
                    [data]="options"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <custom-input-autocomplete-multiple-signal
                    [control]="form.controls['autocompleteMulti']"
                    label="Autocomplete multiple"
                    [data]="options"
                  />
                </div>
                <div class="col-12 lg:col-6">
                  <custom-input-select-signal-prefix
                    [control]="form.controls['prefijoTexto']"
                    label="Select + texto"
                    [data]="options"
                    inputPlaceholder="Detalle"
                  />
                </div>
              </div>
            </div>

            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Long Text, Files And Toggles
              </div>

              <div class="grid">
                <div class="col-12 lg:col-6">
                  <custom-input-textarea-signal
                    [control]="form.controls['descripcion']"
                    label="Textarea"
                    [rows]="4"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-file-signal
                    [control]="form.controls['archivo']"
                    label="Archivo"
                  />
                </div>
                <div class="col-12 lg:col-3">
                  <custom-input-img-signal
                    [control]="form.controls['imagen']"
                    label="Imagen"
                    title="Vista previa"
                  />
                </div>
                <div class="col-12 lg:col-4">
                  <div class="flex flex-column gap-3 pt-2">
                    <custom-input-switch-signal
                      [control]="form.controls['toggle']"
                      label="Switch"
                    />
                    <custom-input-check-signal
                      [control]="form.controls['check']"
                      label="Checkbox"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebCoreCoverage {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    texto: [""],
    busqueda: [""],
    password: [""],
    numero: [12],
    monto: [2450.55],
    decimal: [18.375],
    horaCorta: ["08:30"],
    fecha: [new Date()],
    fechaHora: [new Date()],
    fechaHoraNative: ["2026-06-20T12:30"],
    mes: ["2026-06"],
    hora: ["14:45"],
    cp: ["76160"],
    url: ["https://luxury-app.com"],
    lada: ["+52"],
    categoria: [1],
    multi: [[1, 2]],
    estado: [true],
    ngSelect: [2],
    autocomplete: [1],
    autocompleteMulti: [[1, 3]],
    prefijoTexto: ["Detalle con prefijo"],
    descripcion: ["Campo extendido para observaciones."],
    archivo: [null],
    imagen: [""],
    toggle: [true],
    check: [true],
  });

  readonly options = [
    { label: "Administrador", value: 1 },
    { label: "Supervisor", value: 2 },
    { label: "Operador", value: 3 },
  ];
}
