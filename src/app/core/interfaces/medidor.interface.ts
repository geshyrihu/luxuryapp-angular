export interface IMedidor {
  id: any;
  customerId: string;
  medidorCategoria: {
    id: any;
    nombreMedidorCategoria: string;
  };
  medidorActivo: boolean;
  fechaRegistro: string;
  numeroMedidor: string;
  descripcion: string;
  consumoDiarioMaximo: number;
}









