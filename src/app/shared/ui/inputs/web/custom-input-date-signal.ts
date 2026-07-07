// Bridge de compatibilidad.
// El input de fecha ahora es ADAPTATIVO (web PrimeNG ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-date. Este re-export
// mantiene la ruta/clase histórica (`CustomInputDateSignal`) para que los formularios
// que la importan se vuelvan adaptativos sin cambios.
export { InputDate as CustomInputDateSignal } from "../adaptive/input-date/input-date";
