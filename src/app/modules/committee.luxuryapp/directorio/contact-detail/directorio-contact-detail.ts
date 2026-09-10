import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { MobileButtonLabel } from "@ui/buttons/mobile-label/button";
import { AppRealtimeIndicator } from "@ui/shared/realtime-indicator/realtime-indicator";
import { AppImageFallback } from "@ui/web/image-fallback/image-fallback";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CommitteeDirectorioDTO } from "../../interfaces/committee-directorio.dto";

@Component({
  selector: "app-directorio-contact-detail",
  imports: [
    LxCard,
    MobileButtonLabel,
    AppImageFallback,
    AppIcon,
    AppRealtimeIndicator,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./directorio-contact-detail.html",
})
export class DirectorioContactDetail {
  private config = inject(DynamicDialogConfig);

  readonly person = this.config.data?.person as CommitteeDirectorioDTO;

  /** Solo dígitos del teléfono, para tel:/wa.me. */
  readonly digits = (this.person?.phoneNumber ?? "").replace(/\D/g, "");

  call(): void {
    if (this.digits) window.location.href = "tel:" + this.digits;
  }

  whatsapp(): void {
    if (!this.digits) return;
    // MX: si es un móvil de 10 dígitos, anteponemos el código de país 52.
    const num = this.digits.length === 10 ? "52" + this.digits : this.digits;
    window.open("https://wa.me/" + num, "_blank", "noopener");
  }

  email(): void {
    if (this.person?.email)
      window.location.href = "mailto:" + this.person.email;
  }
}
