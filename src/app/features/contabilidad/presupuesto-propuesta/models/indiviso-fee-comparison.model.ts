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









