// Bridge de compatibilidad.
// El input de fecha ahora es ADAPTATIVO (web Bootstrap ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-date. Este re-export
// mantiene la ruta/clase histórica (`LuxInputDateSignal`) para que los formularios
// que la importan se vuelvan adaptativos sin cambios.
export { InputDate as LuxInputDateSignal } from "../adaptive/input-date/input-date";
