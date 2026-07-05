// ⚠️ Bridge de compatibilidad.
// El input de texto ahora es ADAPTATIVO (web PrimeNG ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-text. Este re-export
// mantiene la ruta/clase histórica (`CustomInputTextSignal`) para que los ~188
// formularios que la importan se vuelvan adaptativos sin cambios.
export { InputText as CustomInputTextSignal } from "../adaptive/input-text/input-text";
