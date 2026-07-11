import { TokenColor } from "./token-color.interface";

export interface TokenGroup {
  titulo: string;
  descripcion: string;
  tokens: TokenColor[];
}
