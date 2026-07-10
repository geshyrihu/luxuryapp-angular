export interface ContratoProximoDTO {
  id: string;
  description: string;
  provider: string;
  typeOfContract: string;
  endDate: string;
  diasRestantes: number;
}

export interface ContratoPorVencerCustomerGroupDTO {
  customerName: string;
  count: number;
  contratos: ContratoProximoDTO[];
}

export interface ContratosPorVencerResumenDTO {
  total: number;
  customers: ContratoPorVencerCustomerGroupDTO[];
}

export interface ContratoVigenteDTO {
  id: string;
  description: string;
  provider: string;
  typeOfContract: string;
  startDate: string;
  endDate: string | null;
  diasRestantes: number | null;
  porVencer: boolean;
}

export interface ContratosVigentesCustomerGroupDTO {
  customerName: string;
  total: number;
  contratos: ContratoVigenteDTO[];
}

export interface ContratosVigentesResumenDTO {
  total: number;
  customers: ContratosVigentesCustomerGroupDTO[];
}
