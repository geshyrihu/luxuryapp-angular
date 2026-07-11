import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
/**
 * Convierte un archivo File a su representación en formato base64.
 * @param file El archivo File que se va a convertir.
 * @returns Una Promise que resuelve en la representación base64 del archivo.
 */
export function imageToBase64(file: File) {
  return new Promise((resolve, rejects) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => rejects(err);
  });
}

/**
 * Convierte una enumeración TypeScript en un array de objetos ISelectItemDTO para su uso en componentes de selección.
 * @param enumeracion La enumeración TypeScript que se va a convertir en opciones select.
 * @returns Un array de objetos ISelectItemDTO que representan las opciones select.
 */
export function onGetSelectItemFromEnum(enumeracion: any): SelectItemDto[] {
  const enumeraciones: SelectItemDto[] = [];
  // Recorre las propiedades de la enumeración y crea objetos ISelectItemDTO para cada una.
  for (const [key, value] of Object.entries(enumeracion)) {
    if (isNaN(Number(key))) {
      // Ignora las propiedades numéricas y agrega las demás como opciones select.
      enumeraciones.push({ label: key, value });
    }
  }

  return enumeraciones;
}
/**
 * Convierte una enumeración TypeScript en un array de objetos ISelectItemDTO para su uso en componentes de selección.
 * @param enumeracion La enumeración TypeScript que se va a convertir en opciones select.
 * @returns Un array de objetos ISelectItemDTO que representan las opciones select.
 */









