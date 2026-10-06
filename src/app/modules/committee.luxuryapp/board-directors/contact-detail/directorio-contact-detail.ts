import { ButtonMobile } from "@ui/buttons/mobile";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { AppImageFallback } from "@ui/web/image-fallback/image-fallback";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { CommitteeDirectorioDTO } from "../../interfaces/committee-directorio.dto";

@Component({
  selector: "app-directorio-contact-detail",
  imports: [ButtonMobile, 
    LxCard,
    AppImageFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./directorio-contact-detail.html",
})
export class DirectorioContactDetail {
  private config = inject(DynamicDialogConfig);

  readonly person = this.config.data?.person as CommitteeDirectorioDTO;

  call(phone: string): void {
    const digits = phone.replace(/\D/g, "");
    if (digits) window.location.href = "tel:" + digits;
  }

  whatsapp(phone: string): void {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return;
    // MX: si es un móvil de 10 dígitos, anteponemos el código de país 52.
    const num = digits.length === 10 ? "52" + digits : digits;
    window.open("https://wa.me/" + num, "_blank", "noopener");
  }

  email(): void {
    if (this.person?.email)
      window.location.href = "mailto:" + this.person.email;
  }
}
