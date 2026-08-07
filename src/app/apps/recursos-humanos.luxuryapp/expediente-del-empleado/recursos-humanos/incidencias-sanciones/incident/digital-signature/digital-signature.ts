import {
  Component,
  ElementRef,
  HostListener,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-digital-signature",
  imports: [AppIcon, FormsModule, WebButtonLabel],
  templateUrl: "./digital-signature.html",
})
export class DigitalSignatureComponent {
  canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>("signatureCanvas");

  signatureSaved = output<string>();
  canvasWidth = 400;
  canvasHeight = 200;

  isDrawing = signal(false);
  hasSignature = signal(false);

  private ctx!: CanvasRenderingContext2D;
  private lastX = 0;
  private lastY = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext("2d")!;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  @HostListener("canvasRef.mousedown", ["$event"])
  @HostListener("canvasRef.touchstart", ["$event"])
  startSigning(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isDrawing.set(true);
    const { x, y } = this.getCoordinates(event);
    this.lastX = x;
    this.lastY = y;
  }

  @HostListener("canvasRef.mousemove", ["$event"])
  @HostListener("canvasRef.touchmove", ["$event"])
  sign(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing()) return;
    event.preventDefault();

    const { x, y } = this.getCoordinates(event);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
    this.hasSignature.set(true);
  }

  @HostListener("canvasRef.mouseup")
  @HostListener("canvasRef.touchend")
  @HostListener("canvasRef.mouseout")
  stopSigning(): void {
    this.isDrawing.set(false);
  }

  private getCoordinates(event: MouseEvent | TouchEvent): {
    x: number;
    y: number;
  } {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (event instanceof TouchEvent) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: event.offsetX * scaleX,
      y: event.offsetY * scaleY,
    };
  }

  clearSignature(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.hasSignature.set(false);
  }

  saveSignature(): void {
    if (!this.hasSignature()) return;

    const canvas = this.canvasRef().nativeElement;
    const dataUrl = canvas.toDataURL("image/png");
    this.signatureSaved.emit(dataUrl);
  }
}
