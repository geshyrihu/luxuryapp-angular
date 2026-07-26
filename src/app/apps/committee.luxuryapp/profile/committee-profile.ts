import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { MobileButtonLabelSave } from "@ui/buttons/mobile-label/button-save";
import { IonInputPassword } from "@ui/inputs/mobile/ion-input-password";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ProfielService } from "src/app/core/auth/services/profiel-service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { passwordValidation } from "src/app/core/directives/password-validation.directive";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ChangePassword } from "src/app/core/interfaces/change-password.interface";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";

@Component({
  selector: "app-committee-profile",
  imports: [LxCard, AppIcon, IonInputPassword, MobileButtonLabelSave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-profile.html",
})
export class CommitteeProfile {
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private profielServiceService = inject(ProfielService);
  private formB = inject(FormBuilder);
  private logger = inject(ConsoleLoggerService);

  private info = this.authS.infoUserAuth;
  private applicationUserId: string = this.authS.applicationUserId;

  public readonly defaultAvatar = "assets/images/default-avatar.png";
  public readonly fullName =
    `${this.info?.firstName ?? ""} ${this.info?.lastName ?? ""}`.trim();
  public readonly position = this.info?.position ?? "";

  public photoPreview = signal(this.info?.photoPath ?? "");
  public submitting = signal(false);

  public fileInput = viewChild<ElementRef<HTMLInputElement>>("fileInput");

  public form: UntypedFormGroup = this.formB.group(
    {
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, passwordValidation()]],
      confirm: ["", Validators.required],
    },
    { validators: this.passwordEqual("newPassword", "confirm") },
  );

  // ── Foto de perfil ──────────────────────────────────────────────
  triggerFile(): void {
    this.fileInput()?.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    // Preview inmediato del original mientras se procesa/sube.
    this.photoPreview.set(URL.createObjectURL(file));
    const processed = await this.compressImage(file);
    this.uploadImg(processed);
  }

  /**
   * Redimensiona (máx 1024px) y comprime a JPEG (≤ ~1MB) en el cliente antes de subir.
   * Evita que el proxy de producción rechace fotos grandes de teléfono.
   * Si el archivo no se puede procesar (p. ej. HEIC sin soporte), sube el original.
   */
  private async compressImage(
    file: File,
    maxBytes = 1024 * 1024,
    maxDim = 1024,
  ): Promise<File> {
    if (!file.type.startsWith("image/")) return file;
    try {
      return await new Promise<File>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
          const outName = file.name.replace(/\.[^.]+$/, "") + ".jpg";

          const tryQuality = (quality: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Canvas toBlob failed"));
                  return;
                }
                if (blob.size <= maxBytes || quality <= 0.4) {
                  resolve(new File([blob], outName, { type: "image/jpeg" }));
                } else {
                  tryQuality(+(quality - 0.1).toFixed(1));
                }
              },
              "image/jpeg",
              quality,
            );
          };
          tryQuality(0.85);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Image load failed"));
        };
        img.src = url;
      });
    } catch {
      return file;
    }
  }

  private async uploadImg(file: File): Promise<void> {
    // Log de diagnóstico (tamaño/tipo): útil si el proxy de prod rechaza subidas grandes.
    this.logger.info(
      `[CommitteeProfile] Subiendo foto: ${(file.size / 1024).toFixed(0)} KB · ${file.type}`,
    );

    const formData = new FormData();
    formData.append("file", file);

    const result: any = await this.apiResponseS.onPut(
      Endpoints.Users.updateImage(this.applicationUserId),
      formData,
    );

    if (result?.photoPath) {
      // Cache-busting: en prod el Service Worker cachea /api/** (freshness),
      // así la imagen nueva se muestra aunque el SW tenga la anterior.
      const busted = this.withCacheBust(result.photoPath);
      this.photoPreview.set(busted);
      this.profielServiceService.actualizarImagenPerfil(busted);
      this.logger.success("[CommitteeProfile] Foto actualizada", result.photoPath);
    } else {
      // onPut ya mostró el toast de error; dejamos rastro en consola.
      this.logger.error(
        "[CommitteeProfile] No se pudo actualizar la foto (revisa Network: status del PUT users/update-image).",
      );
    }
  }

  private withCacheBust(url: string): string {
    return url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src.indexOf(this.defaultAvatar) === -1) {
      img.src = this.defaultAvatar;
    }
  }

  // ── Cambio de contraseña ────────────────────────────────────────
  updatePassword(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const model: ChangePassword = {
      currentPassword: this.form.get("currentPassword").value,
      newPassword: this.form.get("newPassword").value,
    };
    const id = this.authS.userToken.infoUserAuthDTO.applicationUserId;

    this.submitting.set(true);
    this.apiResponseS
      .onPut(Endpoints.Users.changePassword(id), model)
      .then((result: boolean) => {
        this.submitting.set(false);
        if (result) this.authS.logout();
      });
  }

  private passwordEqual(pass1: string, pass2: string) {
    return (formGroup: UntypedFormGroup) => {
      const c1 = formGroup.get(pass1);
      const c2 = formGroup.get(pass2);
      if (c1.value === c2.value) c2.setErrors(null);
      else c2.setErrors({ notIsEqual: true });
    };
  }
}
