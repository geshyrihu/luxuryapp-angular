import { BusquedaCategoria } from "./busqueda-categoria.interface";
export interface BusquedaProveedor {
  providerId: any;
  nameProvider: string;
  nameComercial: string;
  pathPhoto: string;
  activo: boolean;
  user: string;
  categorias: BusquedaCategoria[];
}









