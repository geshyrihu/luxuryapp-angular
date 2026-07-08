import { NgComponentOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
  Type,
} from "@angular/core";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from "@ionic/angular/standalone";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject } from "rxjs";

/**
 * 🪟 IONIC DIALOG MODAL — shell móvil para formularios.
 *
 * Presentado por `DialogHandlerService` vía `ModalController` cuando la app está
 * en móvil. Renderiza el formulario original (mismo componente que en web) dentro
 * de un `ion-modal` nativo y le inyecta STUBS de `DynamicDialogConfig` /
 * `DynamicDialogRef`, de modo que los ~170 forms **no cambian**: siguen leyendo
 * `config.data` y llamando `ref.close(value)`.
 *
 * Al vivir en el sistema de overlays de Ionic, los `ion-select` del form abren
 * su action-sheet POR ENCIMA del modal (sin el bug de z-index del diálogo PrimeNG).
 */
@Component({
  selector: "lx-ionic-dialog-modal",

  imports: [
    NgComponentOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ng-container
        *ngComponentOutlet="formComponent; injector: formInjector"
      ></ng-container>
    </ion-content>
  `,
})
export class IonicDialogModal implements OnInit {
  private readonly modalCtrl = inject(ModalController);
  private readonly parentInjector = inject(Injector);

  /** Props pasadas vía `componentProps` desde `ModalController.create`. */
  formComponent!: Type<unknown>;
  data: unknown;
  title = "";

  protected formInjector!: Injector;

  private readonly closeSubject = new Subject<unknown>();
  private readonly destroySubject = new Subject<void>();

  ngOnInit(): void {
    const dialogRefStub = {
      onClose: this.closeSubject.asObservable(),
      onDestroy: this.destroySubject.asObservable(),
      onChildComponentLoaded: new Subject<unknown>().asObservable(),
      close: (result?: unknown) => this.finish(result),
      destroy: () => this.finish(undefined),
    } as unknown as DynamicDialogRef;

    const dialogConfigStub = {
      data: this.data,
      header: this.title,
    } as unknown as DynamicDialogConfig;

    this.formInjector = Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: DynamicDialogConfig, useValue: dialogConfigStub },
        { provide: DynamicDialogRef, useValue: dialogRefStub },
      ],
    });
  }

  /** Cierre desde el botón "Cerrar" del header (sin resultado). */
  protected dismiss(): void {
    this.finish(undefined);
  }

  /** Notifica al form (onClose/onDestroy) y descarta el modal devolviendo el resultado. */
  private finish(result: unknown): void {
    this.closeSubject.next(result);
    this.destroySubject.next();
    void this.modalCtrl.dismiss(result);
  }
}
