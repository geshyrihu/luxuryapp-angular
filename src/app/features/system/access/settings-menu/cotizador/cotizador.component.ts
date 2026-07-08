import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputCheckSignal } from 'src/app/shared/ui/inputs/web/custom-input-check-signal';
import { CustomInputNumberSignal } from 'src/app/shared/ui/inputs/web/custom-input-number-signal';
import { FormsModule } from '@angular/forms';
import { AppIcon } from 'src/app/shared/ui/shared/app-icon/app-icon.component';

interface IModuleQuote {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomInputCheckSignal,
    CustomInputNumberSignal,
    AppIcon
  ],
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CotizadorComponent {
  // Datos mockeados temporalmente como indicó el usuario
  modules = signal<IModuleQuote[]>([
    { id: 'accounting', name: 'Contabilidad (Accounting)', price: 50, selected: false },
    { id: 'hr', name: 'Recursos Humanos (HR)', price: 60, selected: false },
    { id: 'maintenance', name: 'Mantenimiento (Maintenance)', price: 80, selected: false },
    { id: 'operations', name: 'Operaciones (Operations)', price: 70, selected: false },
    { id: 'legal', name: 'Legal', price: 40, selected: false },
    { id: 'purchasing', name: 'Compras (Purchasing)', price: 55, selected: false },
  ]);

  departmentsCount = signal<number>(1);
  pricePerDepartment = 1.5;

  // Computed signals para los calculos reactivos
  selectedModulesPrice = computed(() => {
    return this.modules().filter(m => m.selected).reduce((acc, m) => acc + m.price, 0);
  });

  departmentsPrice = computed(() => {
    // La regla: 1.5 USD por departamento.
    // Solo se cobra si hay al menos un modulo seleccionado, por ahora.
    const hasModules = this.modules().some(m => m.selected);
    if (!hasModules) return 0;
    return this.departmentsCount() * this.pricePerDepartment;
  });

  totalPrice = computed(() => {
    return this.selectedModulesPrice() + this.departmentsPrice();
  });

  toggleModule(mod: IModuleQuote, isChecked: boolean) {
    this.modules.update(mods => {
      const index = mods.findIndex(m => m.id === mod.id);
      if (index !== -1) {
        mods[index] = { ...mods[index], selected: isChecked };
      }
      return [...mods];
    });
  }

  updateDepartments(count: number) {
    // Evitar valores negativos
    this.departmentsCount.set(Math.max(1, count || 1));
  }
}
