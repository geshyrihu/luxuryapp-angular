import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

/**
 * AppSignaturePad — Canvas interactivo para captura de firma digital.
 * Soporta mouse y touch. Emite base64 PNG al terminar o al llamar getData().
 */
@Component({
  selector: "app-signature-pad",
  standalone: true,
  imports: [CommonModule, ButtonModule, AppIcon],
  template: `
    <div class="sig-root">
      @if (label()) {
        <label class="sig-label">{{ label() }}</label>
      }

      <div class="sig-canvas-wrap" [class.sig-disabled]="disabled()">
        <canvas
          #canvas
          [width]="width()"
          [height]="height()"
          class="sig-canvas"
          (mousedown)="startDraw($event)"
          (mousemove)="draw($event)"
          (mouseup)="stopDraw()"
          (mouseleave)="stopDraw()"
          (touchstart)="startDrawTouch($event)"
          (touchmove)="drawTouch($event)"
          (touchend)="stopDraw()"
        ></canvas>

        @if (isEmpty()) {
          <div class="sig-placeholder">
            <app-icon icon="mdi:draw-pen" class="text-2xl" />
            <span>{{ placeholder() }}</span>
          </div>
        }
      </div>

      <div class="sig-actions">
        <p-button
          label="Limpiar"
          icon="mdi:eraser"
          severity="secondary"
          [outlined]="true"
          size="small"
          [disabled]="disabled() || isEmpty()"
          (onClick)="clear()"
        />
        <p-button
          label="Confirmar"
          icon="mdi:check"
          size="small"
          [disabled]="disabled() || isEmpty()"
          (onClick)="confirm()"
        />
      </div>

      @if (hint()) {
        <span class="sig-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [`
    .sig-root { display: flex; flex-direction: column; gap: 0.5rem; }
    .sig-label { font-size: var(--ds-font-size-label, 0.875rem); color: var(--ds-text-secondary); font-weight: 500; }
    .sig-canvas-wrap {
      position: relative;
      border: 1.5px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 6px);
      overflow: hidden;
      background: var(--ds-bg-surface, #fff);
      cursor: crosshair;
    }
    .sig-disabled { opacity: 0.55; pointer-events: none; }
    .sig-canvas { display: block; touch-action: none; }
    .sig-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--ds-text-muted);
      font-size: var(--ds-font-size-help, 0.8125rem);
      pointer-events: none;
    }
    .sig-actions { display: flex; gap: 0.5rem; }
    .sig-hint { font-size: var(--ds-font-size-micro, 0.75rem); color: var(--ds-text-muted); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppSignaturePad implements AfterViewInit, OnDestroy {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;

  label       = input<string>("");
  hint        = input<string>("");
  placeholder = input<string>("Firma aquí");
  width       = input<number>(400);
  height      = input<number>(160);
  lineWidth   = input<number>(2);
  lineColor   = input<string>("#041b3c");
  disabled    = input<boolean>(false);

  signed   = output<string>();
  cleared  = output<void>();

  isEmpty  = signal(true);

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.strokeStyle = this.lineColor();
    this.ctx.lineWidth   = this.lineWidth();
    this.ctx.lineCap     = "round";
    this.ctx.lineJoin    = "round";
  }

  ngOnDestroy(): void { /* nothing to clean */ }

  startDraw(e: MouseEvent): void {
    this.drawing = true;
    const { x, y } = this.relativePos(e.clientX, e.clientY);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  draw(e: MouseEvent): void {
    if (!this.drawing) return;
    const { x, y } = this.relativePos(e.clientX, e.clientY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.isEmpty.set(false);
  }

  startDrawTouch(e: TouchEvent): void {
    e.preventDefault();
    this.drawing = true;
    const t = e.touches[0];
    const { x, y } = this.relativePos(t.clientX, t.clientY);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  drawTouch(e: TouchEvent): void {
    e.preventDefault();
    if (!this.drawing) return;
    const t = e.touches[0];
    const { x, y } = this.relativePos(t.clientX, t.clientY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.isEmpty.set(false);
  }

  stopDraw(): void { this.drawing = false; }

  clear(): void {
    const c = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, c.width, c.height);
    this.isEmpty.set(true);
    this.cleared.emit();
  }

  confirm(): void {
    const dataUrl = this.canvasRef.nativeElement.toDataURL("image/png");
    this.signed.emit(dataUrl);
  }

  getData(): string {
    return this.canvasRef.nativeElement.toDataURL("image/png");
  }

  private relativePos(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }
}
