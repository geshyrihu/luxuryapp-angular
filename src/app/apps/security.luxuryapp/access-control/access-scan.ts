import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AccessPointDto } from "src/app/core/interfaces/access-point.dto";
import { AccessScanResultDto } from "src/app/core/interfaces/access-scan-result.dto";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IScanForm {
  accessPointId: FormControl<string | null>;
  scannedPayload: FormControl<string>;
}

@Component({
  selector: "app-access-scan",
  templateUrl: "./access-scan.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    WebButtonLabel,
  ],
})
export class AccessScan implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);

  video = viewChild<ElementRef<HTMLVideoElement>>("video");

  accessPoints = signal<SelectItemDto[]>([]);
  submitting = signal(false);
  result = signal<AccessScanResultDto | null>(null);
  cameraOn = signal(false);
  cameraSupported = signal(this.detectSupport());

  private stream: MediaStream | null = null;
  private detector: any = null;
  private rafId: number | null = null;

  form!: FormGroup<IScanForm>;

  ngOnInit(): void {
    this.onLoadAccessPoints();
    this.form = this.formB.group<IScanForm>({
      accessPointId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      scannedPayload: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  private detectSupport(): boolean {
    return (
      typeof window !== "undefined" &&
      "BarcodeDetector" in window &&
      !!navigator.mediaDevices?.getUserMedia
    );
  }

  private onLoadAccessPoints(): void {
    this.apiResponseS
      .onGetList<AccessPointDto[]>(Endpoints.AccessControlAccessPoints.getAll)
      .then((result) => {
        this.accessPoints.set(
          (result ?? []).map((a) => ({ value: a.id, label: a.name })),
        );
      });
  }

  async startCamera(): Promise<void> {
    if (!this.cameraSupported() || this.cameraOn()) return;
    if (!this.form.controls.accessPointId.value) {
      this.form.controls.accessPointId.markAsTouched();
      return;
    }
    try {
      this.detector = new (window as any).BarcodeDetector({
        formats: ["qr_code"],
      });
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const videoEl = this.video()?.nativeElement;
      if (!videoEl) return;
      videoEl.srcObject = this.stream;
      await videoEl.play();
      this.cameraOn.set(true);
      this.detectLoop(videoEl);
    } catch {
      this.stopCamera();
    }
  }

  private detectLoop(videoEl: HTMLVideoElement): void {
    const tick = async () => {
      if (!this.cameraOn()) return;
      try {
        const codes = await this.detector.detect(videoEl);
        if (codes && codes.length > 0) {
          const value = codes[0].rawValue as string;
          if (value) {
            this.form.controls.scannedPayload.setValue(value);
            this.stopCamera();
            this.scan();
            return;
          }
        }
      } catch {
        // ignora frames no decodificables
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stopCamera(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.cameraOn.set(false);
  }

  scan(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const v = this.form.getRawValue();
    this.apiResponseS
      .onPost<AccessScanResultDto>(Endpoints.AccessControlScan.scan, {
        accessPointId: v.accessPointId,
        scannedPayload: v.scannedPayload,
      })
      .then((result) => {
        this.submitting.set(false);
        if (result) {
          this.result.set(result);
          this.form.controls.scannedPayload.reset("");
        }
      });
  }
}
