export interface ContratoProximoDto {
  id: string;
  description: string;
  provider: string;
  typeOfContract: string;
  endDate: string;
  diasRestantes: number;
}

export interface ContratoPorVencerCustomerGroupDto {
  customerName: string;
  count: number;
  contratos: ContratoProximoDto[];
}

export interface ContratosPorVencerResumenDto {
  total: number;
  customers: ContratoPorVencerCustomerGroupDto[];
}

export interface ContratoVigenteDto {
  id: string;
  description: string;
  provider: string;
  typeOfContract: string;
  startDate: string;
  endDate: string | null;
  diasRestantes: number | null;
  porVencer: boolean;
}

export interface ContratosVigentesCustomerGroupDto {
  customerName: string;
  total: number;
  contratos: ContratoVigenteDto[];
}

export interface ContratosVigentesResumenDto {
  total: number;
  customers: ContratosVigentesCustomerGroupDto[];
}
