// Bridge de compatibilidad.
// La importación histórica `Loader` desde `@ui/mobile/loader/loader`
// resuelve al componente web `app-loader` (glassmorphism).
// Para el adaptativo automático usar `lx-loader` / `LxLoader`.
export { AppLoader as Loader } from "../../web/loader/loader";
