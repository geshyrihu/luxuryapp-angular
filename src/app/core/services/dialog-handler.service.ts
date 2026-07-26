import { Injectable, inject } from "@angular/core";
import { ModalController } from "@ionic/angular/standalone";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { DialogSize } from "../enums/dialog-size.enum";
import { IonicDialogModal } from "./ionic-dialog-modal";
import { PlatformService } from "./platform.service";
export { DialogService, DynamicDialogConfig, DynamicDialogRef, DialogSize };
@Injectable({
  providedIn: "root",
})
export class DialogHandlerService {
  dialogS = inject(DialogService);
  private readonly platform = inject(PlatformService);
  private readonly modalCtrl = inject(ModalController);

  openDialog<T = boolean>(
    component: any,
    data: any,
    title: string,
    size: DialogSize,
    autoMaximize: boolean = false,
  ): Promise<T> {
    if (this.platform.isMobile()) {
      return this.openMobileModal<T>(component, data, title);
    }
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
    if (this.platform.isMobile()) {
      return this.openMobileModal<T>(component, config.data, config.title);
    }
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
      ...config.extraOptions,
    });

    return this.subscribeToDialogClose<T>(ref);
  }

  /**
   * En móvil abre el formulario en un `ion-modal` nativo (vía `ModalController`)
   * en lugar del diálogo PrimeNG. El wrapper `IonicDialogModal` inyecta stubs de
   * `DynamicDialogConfig`/`DynamicDialogRef`, así que los forms no cambian.
   * Resuelve con el resultado que el form pase a `ref.close(value)`.
   */
  private async openMobileModal<T>(
    component: any,
    data: any,
    title: string,
  ): Promise<T> {
    const modal = await this.modalCtrl.create({
      component: IonicDialogModal,
      componentProps: { formComponent: component, data, title },
      cssClass: "lx-form-modal",
    });
    await modal.present();
    const { data: result } = await modal.onDidDismiss();
    return result as T;
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
