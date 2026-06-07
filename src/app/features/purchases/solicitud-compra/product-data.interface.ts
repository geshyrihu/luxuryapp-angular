/**
 * Interfaz para el tipo de dato esperado en la tabla de productos por agregar.
 * Define la estructura de un producto disponible para anexarse a la solicitud.
 */
export interface IProductData {
  productid: any;
  urlImagen: string;
  marca: string;
  producto: string;
  quantity: number;
  unitId: string | number;
  applicationUserId?: string;
}
