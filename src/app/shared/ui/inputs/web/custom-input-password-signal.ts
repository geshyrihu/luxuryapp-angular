// Bridge de compatibilidad.
// El input de password ahora es ADAPTATIVO (web PrimeNG ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-password. Este re-export
// mantiene la ruta/clase histórica (`CustomInputPassword`) para que los formularios
// que la importan se vuelvan adaptativos sin cambios.
export { InputPassword as CustomInputPassword } from "../adaptive/input-password/input-password";
