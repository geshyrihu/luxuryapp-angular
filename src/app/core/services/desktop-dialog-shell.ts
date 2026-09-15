import { NgComponentOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Type,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "./dialog-handler.service";

@Component({
  selector: "lx-desktop-dialog-shell",
  imports: [NgComponentOutlet, AppIcon],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button
        type="button"
        class="lx-dialog-close"
        aria-label="Cerrar"
        (click)="dismiss()"
      >
        <app-icon icon="material-symbols-light:close" />
      </button>
    </div>
    <div class="modal-body">
      @if (formInjector) {
        <ng-container
          *ngComponentOutlet="formComponent; injector: formInjector"
        />
      }
    </div>
  `,
  styles: [
    `
      .lx-dialog-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: var(--ds-radius-md, 0.375rem);
        border: none;
        background: transparent;
        color: var(--ds-text-muted, #6c757d);
        cursor: pointer;
        font-size: 1.125rem;
        transition: all 150ms ease;
        margin-left: auto;
      }
      .lx-dialog-close:hover {
        background-color: var(--ds-bg-sunken, #f1f3f5);
        color: var(--ds-text-primary, #212529);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopDialogShell {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly parentInjector = inject(Injector);
  private finished = false;

  formComponent!: Type<unknown>;
  data: unknown;
  title = "";
  protected formInjector!: Injector;
  readonly onLoaded$ = new Subject<void>();

  initialize(formComponent: Type<unknown>, data: unknown, title: string): void {
    this.formComponent = formComponent;
    this.data = data;
    this.title = title;
    const dialogRefStub = new DynamicDialogRef(
      (result) => this.finish(result),
      () => this.activeModal.update({ fullscreen: true }),
    );
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
    queueMicrotask(() => this.onLoaded$.next());
  }

  protected dismiss(): void {
    this.finish(undefined);
  }

  private finish(result: unknown): void {
    if (this.finished) return;
    this.finished = true;
    const ref = this.formInjector.get(DynamicDialogRef);
    ref.emitClose(result);
    ref.emitDestroy();
    this.onLoaded$.complete();
    this.activeModal.close(result);
  }
}
