import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebInputDatepicker } from "@ui/inputs/web/input-datepicker/input-datepicker";
import { WebInputNumber } from "@ui/inputs/web/input-number/input-number";
import { WebInputPassword } from "@ui/inputs/web/input-password/input-password";
import { WebInputText } from "@ui/inputs/web/input-text/input-text";
import { WebInputTextarea } from "@ui/inputs/web/input-textarea/input-textarea";
import { WebInputToggleSwitch } from "@ui/inputs/web/input-toggle-switch/input-toggle-switch";

@Component({
  selector: "app-forms-showcase",
  imports: [
    FormsModule,
    WebInputText,
    WebInputNumber,
    WebInputPassword,
    WebInputToggleSwitch,
    WebInputTextarea,
    WebInputDatepicker,
  ],
  template: `
    <div class="p-4 fadein">
      <h2 class="text-2xl font-bold mb-4">Inputs & Forms</h2>
      <p class="text-secondary mb-6">
        Visualización de los controles de formulario estándar de la plataforma.
      </p>

      <!-- Web Inputs -->
      <section class="mb-8">
        <h3 class="section-header">Text Inputs</h3>
        <div class="flex flex-column gap-4 max-w-25rem">
          <web-input-text
            label="Nombre"
            placeholder="Ingresa tu nombre"
            [(ngModel)]="textValue"
          />
          <web-input-text
            label="Error State"
            placeholder="Campo con error"
            error="Este campo es requerido"
            [(ngModel)]="textError"
          />
          <web-input-text
            label="Disabled"
            placeholder="No editable"
            [disabled]="true"
          />
        </div>
      </section>

      <!-- Numeric & Specialized Inputs -->
      <section class="mb-8">
        <h3 class="section-header">Numeric & Special Inputs</h3>
        <div class="flex flex-column gap-4 max-w-25rem">
          <web-input-number
            label="Cantidad"
            placeholder="0.00"
            [(ngModel)]="numValue"
          />
          <web-input-password
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            [(ngModel)]="passValue"
          />
          <web-input-datepicker
            label="Fecha"
            placeholder="Selecciona una fecha"
            [(ngModel)]="dateValue"
          />
        </div>
      </section>

      <!-- Textarea & Switches -->
      <section class="mb-8">
        <h3 class="section-header">Textarea & Switches</h3>
        <div class="flex flex-column gap-4 max-w-25rem">
          <web-input-textarea
            label="Comentarios"
            placeholder="Escribe aquí..."
            [(ngModel)]="textValue"
            [rows]="4"
          />
          <web-input-toggle-switch
            label="Activar notificaciones"
            [(ngModel)]="switchValue"
          />
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsShowcaseComponent {
  textValue = "";
  textError = "";
  numValue = 0;
  passValue = "";
  dateValue = null;
  switchValue = false;
}
