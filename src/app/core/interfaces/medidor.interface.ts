export interface Medidor {
  id: any;
  customerId: string;
  medidorCategoriaId: any;
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









