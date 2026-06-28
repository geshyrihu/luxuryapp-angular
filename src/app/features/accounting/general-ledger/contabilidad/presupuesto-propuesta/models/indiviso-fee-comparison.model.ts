/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100% 
 * FUNCIONAL y ESTABLE. 
 * 
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lógica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explícita del Ing. Ricardo Marques.
 * 
 * Por favor, NO rompan el código.
 * ============================================================================
 */
export interface PropertyIndivisoDetail {
  propertyName: string;
  indivisoPercentage: number;
  monthlyFeeShare: number;
  currentMonthlyFeeShare: number;
}

export interface IndivisoFeeComparisonDTO {
  currentTotalBudget: number;
  newTotalBudget: number;
  totalIndivisoPercentage: number;
  currentMonthlyFeeByIndiviso: number;
  newMonthlyFeeByIndiviso: number;
  monthlyFeeDifference: number; // Diferencia mensual entre presupuesto propuesto y actual
  monthlyFeePercentageChange: number; // Porcentaje de cambio entre presupuesto propuesto y actual
  propertyIndivisoDetails: PropertyIndivisoDetail[]; // Nuevo: Detalles de indiviso por propiedad
}









