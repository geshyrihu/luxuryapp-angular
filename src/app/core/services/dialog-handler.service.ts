import { Injectable, inject } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subject } from "rxjs";
import { DialogSize } from "../enums/dialog-size.enum";
import { DesktopDialogShell } from "./desktop-dialog-shell";
import { IonicDialogModal } from "./ionic-dialog-modal";
import { PlatformService } from "./platform.service";
export class DynamicDialogConfig<T = any> {
  data: T;
  header?: string;
}

export class DynamicDialogRef {
  private readonly closeSubject = new Subject<unknown>();
  private readonly destroySubject = new Subject<void>();
  private readonly loadedSubject = new Subject<void>();

  readonly onClose: Observable<unknown> = this.closeSubject.asObservable();
  readonly onDestroy: Observable<void> = this.destroySubject.asObservable();
  readonly onChildComponentLoaded: Observable<void> =
    this.loadedSubject.asObservable();
  maximized = false;

  constructor(
    private readonly closeHandler?: (result?: unknown) => void,
    private readonly maximizeHandler?: () => void,
  ) {}

  close(result?: unknown): void {
    this.closeHandler?.(result);
  }

  destroy(): void {
    this.closeHandler?.(undefined);
  }

  maximize(): void {
    this.maximizeHandler?.();
    this.maximized = true;
  }

  emitClose(result: unknown): void {
    this.closeSubject.next(result);
  }

  emitDestroy(): void {
    this.destroySubject.next();
  }

  emitLoaded(): void {
    this.loadedSubject.next();
  }
}

export class DialogService {
  getInstance(ref: DynamicDialogRef): DynamicDialogRef {
    return ref;
  }
}
export { DialogSize };
@Injectable({
  providedIn: "root",
})
export class DialogHandlerService {
  private readonly platform = inject(PlatformService);
  private readonly modalCtrl = inject(ModalController);
  private readonly ngbModal = inject(NgbModal);

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
    const modalRef = this.ngbModal.open(
      DesktopDialogShell,
      this.getDesktopModalOptions(size),
    );
    modalRef.componentInstance.initialize(component, data, title);

    if (autoMaximize) {
      modalRef.componentInstance.onLoaded$.subscribe(() =>
        modalRef.update({ fullscreen: true }),
      );
    }

    return modalRef.result.catch(() => undefined as T);
  }

  openDialogCustom<T = any>(component: any, config: DialogConfig): Promise<T> {
    if (this.platform.isMobile()) {
      return this.openMobileModal<T>(component, config.data, config.title);
    }
    const modalRef = this.ngbModal.open(
      DesktopDialogShell,
      this.getDesktopModalOptions(config.size, config),
    );
    modalRef.componentInstance.initialize(component, config.data, config.title);
    return modalRef.result.catch(() => undefined as T);
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

  private getDesktopModalOptions(
    size: DialogSize,
    config?: DialogConfig,
  ) {
    const isFullscreen = size === DialogSize.full;

    return {
      centered: true,
      scrollable: true,
      backdrop: config?.dismissableMask === false ? ("static" as const) : true,
      keyboard: config?.closeOnEscape !== false,
      fullscreen: isFullscreen,
      // Bootstrap has no modal-md class; default modal width is Lagos' medium size.
      modalDialogClass:
        size === DialogSize.md || isFullscreen ? undefined : size,
    };
  }

  readonly sizeSm: DialogSize = DialogSize.sm;
  readonly sizeMd: DialogSize = DialogSize.md;
  readonly sizeLg: DialogSize = DialogSize.lg;
  readonly sizeFull: DialogSize = DialogSize.full;
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
