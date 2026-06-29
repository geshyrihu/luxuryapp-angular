/**
 * Interfaz para el tipo de dato esperado en la tabla de este componente.
 * Define la estructura de un producto que se puede agregar.
 */
export interface IProductData {
  // Define aqué los campos que esperas para cada 'rowItem'
  // Ejemplo basado en tu plantilla:
  productid: any;
  urlImagen: string;
  marca: string;
  producto: string;
  quantity: number; // Esta cantidad es la que el usuario ingresa en el modal
  unitId: string | number; // O el tipo que corresponda
  applicationUserId?: string; // Para el envío
  // ... otros campos que vengan de la API para mostrar
}









