import { Injectable, signal } from "@angular/core";
import { AspelBudgetDTO } from "../models/presupuesto-shared.models";
import { ASPEL_AVAILABLE_YEARS, ASPEL_MONTHS } from "./presupuesto-web-aspel.shared";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

@Injectable()
export class PresupuestoWebAspelService {
  // Estado compartido
  intYear = signal<number>(new Date().getFullYear());
  availableYears: SelectItemDto[] = ASPEL_AVAILABLE_YEARS;
  
  allMonths = signal(true);
  readonly months: string[] = ASPEL_MONTHS;
  mesesSeleccionados = signal<string[]>([...this.months]);
  
  searchTerm = signal("");
  
  budgetData = signal<AspelBudgetDTO | null>(null);
  errorMensaje = signal<string | null>(null);

  // Acciones comunes
  toggleMes(mes: string): void {
    const current = this.mesesSeleccionados();
    const index = current.indexOf(mes);
    let updated: string[];
    
    if (index > -1) {
      updated = current.filter(m => m !== mes);
    } else {
      updated = [...current, mes];
      // Mantener orden cronolígico
      updated = this.months.filter(m => updated.includes(m));
    }
    
    this.mesesSeleccionados.set(updated);
    this.allMonths.set(updated.length === this.months.length);
  }

  isMesVisible(mes: string): boolean {
    return this.mesesSeleccionados().includes(mes);
  }

  mostrarTodosLosMeses(): void {
    this.allMonths.set(true);
    this.mesesSeleccionados.set([...this.months]);
  }

  ocultarTodosLosMeses(): void {
    this.allMonths.set(false);
    this.mesesSeleccionados.set([]);
  }

  resetState() {
    this.searchTerm.set("");
    this.errorMensaje.set(null);
    this.budgetData.set(null);
  }
}
