import { Injectable } from "@angular/core";
// Definimos una interfaz para la configuración de estilo para mayor claridad.
interface LogStyleConfig {
  icon: string;
  color: string;
  fontStyle?: "italic" | "normal";
}

@Injectable({
  providedIn: "root",
})
export class ConsoleLoggerService {
  // private isProduction = environment.production;
  private isProduction = false;

  /**
   * Imprime un mensaje de éxito en la consola.
   * @param message El mensaje principal a mostrar.
   * @param data Datos adicionales para mostrar junto al mensaje.
   */
  success(message: string, ...data: any[]): void {
    this.styledLog(
      { icon: "✅", color: "green", fontStyle: "italic" },
      message,
      ...data,
    );
  }

  /**
   * Imprime un mensaje de error en la consola.
   * @param message El mensaje principal a mostrar.
   * @param data Datos adicionales para mostrar junto al mensaje.
   */
  error(message: string, ...data: any[]): void {
    this.styledLog(
      { icon: "🚫", color: "red", fontStyle: "italic" },
      message,
      ...data,
    );
  }

  /**
   * Imprime un mensaje de información en la consola.
   * @param message El mensaje principal a mostrar.
   * @param data Datos adicionales para mostrar junto al mensaje.
   */
  info(message: string, ...data: any[]): void {
    this.styledLog(
      { icon: "ℹ️", color: "dodgerblue", fontStyle: "italic" },
      message,
      ...data,
    );
  }

  /**
   * Imprime un mensaje de advertencia en la consola.
   * @param message El mensaje principal a mostrar.
   * @param data Datos adicionales para mostrar junto al mensaje.
   */
  warn(message: string, ...data: any[]): void {
    this.styledLog(
      { icon: "⚠️", color: "orange", fontStyle: "italic" },
      message,
      ...data,
    );
  }

  /**
   * Imprime un log con un ícono y color personalizados, aplicando siempre el estilo itálico.
   * @param icon El ícono (emoji) a mostrar.
   * @param color El color CSS para aplicar (ej. 'purple', '#FF5722').
   * @param message El mensaje principal a mostrar.
   * @param data Datos adicionales para mostrar junto al mensaje.
   */
  custom(icon: string, color: string, message: string, ...data: any[]): void {
    if (this.isProduction) {
      return;
    }
    const style = `color: ${color}; font-style: italic;`;
    console.log(`%c${icon} ${message}`, style, ...data);
  }

  /**
   * Método privado para generar el log estilizado.
   */
  private styledLog(
    config: LogStyleConfig,
    message: string,
    ...data: any[]
  ): void {
    if (this.isProduction) {
      return;
    }

    const style = [
      `color: ${config.color}`,
      `font-style: ${config.fontStyle || "normal"}`,
    ].join(";");

    console.log(`%c${config.icon} ${message}`, style, ...data);
  }
}









