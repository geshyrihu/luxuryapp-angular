// ⚠️ Bridge de compatibilidad.
// El input de texto ahora es ADAPTATIVO (web Bootstrap ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-text. Este re-export
// mantiene la ruta/clase histórica (`LuxInputTextSignal`) para que los ~188
// formularios que la importan se vuelvan adaptativos sin cambios.
export { InputText as LuxInputTextSignal } from "../adaptive/input-text/input-text";
