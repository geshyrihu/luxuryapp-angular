// Bridge de compatibilidad.
// El input de password ahora es ADAPTATIVO (web Bootstrap ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-password. Este re-export
// mantiene la ruta/clase histórica (`LuxInputPassword`) para que los formularios
// que la importan se vuelvan adaptativos sin cambios.
export { InputPassword as LuxInputPassword } from "../adaptive/input-password/input-password";
