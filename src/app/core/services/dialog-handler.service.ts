import { Injectable, inject } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogSize } from "../enums/dialog-size";
@Injectable({
  providedIn: "root",
})
export class DialogHandlerService {
  dialogS = inject(DialogService);

  openDialog<T = boolean>(
    component: any,
    data: any,
    title: string,
    size: DialogSize,
    autoMaximize: boolean = false,
  ): Promise<T> {
    const dialogConfig = this.getDialogConfig(size);

    const ref: DynamicDialogRef = this.dialogS.open(component, {
      data,
      header: title,
      width: dialogConfig.width,
      height: dialogConfig.height,
      breakpoints: dialogConfig.breakpoints,
      contentStyle: { overflow: "auto" },
      closeOnEscape: true,
      maximizable: true,
      closable: true,
      draggable: true,
      resizable: true,
      baseZIndex: 1100,
      modal: true,
      // 📱 En móvil montamos el diálogo DENTRO de <ion-app>. Motivo: ion-app
      // tiene `contain: layout size style` (contexto de apilamiento en z-index 0).
      // Los overlays de Ionic (action-sheet del ion-select, pickers) se montan ahí
      // dentro; si el diálogo vive en <body> quedan atrapados por debajo. Al
      // compartir contexto, el z-index de esos overlays (20001) gana al diálogo.
      appendTo: this.mobileMountTarget(),
    });

    if (autoMaximize && ref) {
      ref.onChildComponentLoaded.subscribe(() => {
        const dialogInstance = this.dialogS.getInstance(ref);
        if (dialogInstance && !dialogInstance.maximized) {
          dialogInstance.maximize();
        }
      });
    }

    return this.subscribeToDialogClose<T>(ref);
  }

  openDialogCustom<T = any>(component: any, config: DialogConfig): Promise<T> {
    const dialogConfig = config.width
      ? { width: config.width, breakpoints: config.breakpoints }
      : this.getDialogConfig(config.size);

    const ref: DynamicDialogRef = this.dialogS.open(component, {
      data: config.data,
      header: config.title,
      width: dialogConfig.width,
      height: config.height || dialogConfig.height,
      breakpoints: dialogConfig.breakpoints,
      contentStyle: config.contentStyle || { overflow: "auto" },
      closeOnEscape: config.closeOnEscape ?? true,
      maximizable: config.maximizable ?? true,
      closable: config.closable ?? true,
      draggable: config.draggable ?? true,
      resizable: config.resizable ?? true,
      baseZIndex: config.baseZIndex || 1100,
      modal: config.modal ?? true,
      dismissableMask: config.dismissableMask,
      position: config.position,
      appendTo: this.mobileMountTarget(),
      ...config.extraOptions,
    });

    return this.subscribeToDialogClose<T>(ref);
  }

  /**
   * Objetivo de montaje del diálogo. En móvil existe `<ion-app>` (vista Ionic):
   * montar ahí evita que los overlays de Ionic queden detrás. En desktop no hay
   * `<ion-app>`, así que cae a `"body"` (comportamiento normal de PrimeNG).
   */
  private mobileMountTarget(): HTMLElement | "body" {
    return document.querySelector("ion-app") ?? "body";
  }

  private subscribeToDialogClose<T>(ref: DynamicDialogRef): Promise<T> {
    if (!ref) {
      return Promise.resolve(null);
    }
    return new Promise<T>((resolve) => {
      let lastValue: T;
      const closeSub = ref.onClose.subscribe((resp: T) => {
        lastValue = resp;
      });
      ref.onDestroy.subscribe(() => {
        closeSub.unsubscribe();
        resolve(lastValue);
      });
    });
  }

  // NUEVO: Método para obtener configuración según el tamaño
  private getDialogConfig(size: DialogSize): DialogConfigSize {
    switch (size) {
      case DialogSize.sm:
        return {
          width: "700px", // Era 400px
          breakpoints: { "992px": "95vw" },
        };
      case DialogSize.md:
        return {
          width: "1000px", // Era 600px
          breakpoints: { "992px": "95vw" },
        };
      case DialogSize.lg:
        return {
          width: "1200px", // Era 800px
          breakpoints: { "992px": "95vw" },
        };
      case DialogSize.full:
        return {
          width: "100vw",
          height: "100vh",
        };
      default:
        return {
          width: "800px", // Era 600px (default a md)
          breakpoints: { "992px": "95vw" },
        };
    }
  }

  readonly sizeSm: DialogSize = DialogSize.sm;
  readonly sizeMd: DialogSize = DialogSize.md;
  readonly sizeLg: DialogSize = DialogSize.lg;
  readonly sizeFull: DialogSize = DialogSize.full;
}

// Interface para la configuración de tamaño del diálogo
interface DialogConfigSize {
  width: string;
  height?: string;
  breakpoints?: { [key: string]: string };
}

export interface DialogConfig {
  data: any;
  title: string;
  size: DialogSize;
  contentStyle?: any;
  closeOnEscape?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  baseZIndex?: number;
  modal?: boolean;
  dismissableMask?: boolean;
  width?: string;
  height?: string;
  breakpoints?: { [key: string]: string };
  position?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  extraOptions?: any;
}









