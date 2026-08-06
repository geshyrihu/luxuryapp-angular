export interface CobranzaConcepto {
  id: string;
  name: string;
  label: string;
}

export const CONCEPTS_CATALOG: CobranzaConcepto[] = [
  { id: "001", name: "CUOTA DE MTTO", label: "MTTO" },
  { id: "002", name: "DESCUENTO POR PRONTO PAGO", label: "DESC. PRONTO PAGO" },
  { id: "003", name: "CUOTA EXTRAORDINARIA", label: "EXTRAORDINARIA" },
  { id: "004", name: "INTERESES MORATORIOS", label: "INT. MORATORIOS" },
  { id: "005", name: "PENA MORATORIA", label: "PENA MORATORIA" },
  {
    id: "006",
    name: "CUOTA EXTRA NORMAS DE CONVIVENCIA",
    label: "NORMAS CONV.",
  },
  { id: "007", name: "MULTAS", label: "MULTAS" },
  { id: "008", name: "USO DE SALON", label: "SALÓN" },
  { id: "009", name: "USO DE SALON ROOM", label: "SALÓN ROOM" },
  { id: "010", name: "USO DE SALON SOCIAL", label: "SALÓN SOCIAL" },
  { id: "011", name: "USO DE JARDIN", label: "JARDÍN" },
  { id: "012", name: "USO DE MEZZANINE", label: "MEZZANINE" },
  { id: "013", name: "USO DE TERRAZA", label: "TERRAZA" },
  { id: "014", name: "USO DE ASADORES", label: "ASADORES" },
  { id: "015", name: "CUOTA RESTAURANTE", label: "RESTAURANTE" },
  { id: "016", name: "CLASES DE PILATES", label: "PILATES" },
  { id: "017", name: "SNACK BAR", label: "SNACK BAR" },
  { id: "018", name: "TARJETAS DE ACCESO", label: "TARJETAS" },
  { id: "019", name: "TAG", label: "TAG" },
  { id: "020", name: "FONDO DE RESERVA", label: "FONDO RESERVA" },
  { id: "021", name: "RECUPERACION CONSUMO DE AGUA", label: "REC. AGUA" },
  {
    id: "022",
    name: "RECUPERACION CONSUMO ENERGIA ELECTRICA",
    label: "REC. LUZ",
  },
  { id: "023", name: "CONSUMO DE AGUA", label: "AGUA" },
  { id: "024", name: "CONSUMO ENERGIA ELECTRICA", label: "LUZ" },
  { id: "025", name: "DEPOSITO EN GARANTIA", label: "DEPÓSITO GARANTÍA" },
  { id: "026", name: "CINE", label: "CINE" },
];
