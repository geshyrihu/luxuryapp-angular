import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ProfielService } from "src/app/core/auth/services/profiel-service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InfoAccountAuthDto } from "src/app/core/interfaces/auth-user-token.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-actualizar-foto-usuario-aplicacion",
  templateUrl: "./update-user-photo.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppIcon, LxCard, InputImg, WebButtonLabel],
})
export class UpdateUserPhotoComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  public profielServiceService = inject(ProfielService);
  private imageProcessing = inject(ImageProcessingService);
  private toast = inject(CustomToastService);

  applicationUserId: string = this.authS.applicationUserId;
  infoEmployeeDTO: InfoAccountAuthDto;

  public imgUpload: any;
  public imgTemp: any;
  imgName: any = "";

  @ViewChild("cameraInput") cameraInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.infoEmployeeDTO = this.authS.infoUserAuth;
  }

  triggerCamera(): void {
    this.cameraInput?.nativeElement.click();
  }

  onCameraCapture(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (file) void this.changeImg(file);
  }

  async changeImg(file: File): Promise<void> {
    try {
      const processed = await this.imageProcessing.processImage(file, {
        maxBytes: 2 * 1024 * 1024,
        maxDimension: 1920,
      });
      this.imgUpload = processed;
      const reader = new FileReader();
      reader.readAsDataURL(processed);
      reader.onloadend = () => {
        this.imgTemp = reader.result;
        this.imgName = processed;
      };
      this.uploadImg();
    } catch (error) {
      this.toast.showError(
        "No se pudo procesar la imagen",
        error instanceof Error
          ? error.message
          : "Selecciona una imagen valida.",
      );
    }
  }

  uploadImg() {
    const formData = new FormData();
    formData.append("file", this.imgUpload);
    this.apiResponseS
      .onPut(Endpoints.Users.updateImage(this.applicationUserId), formData)
      .then((result: any) => {
        if (result) {
          this.infoEmployeeDTO.photoPath = result.photoPath;
          this.profielServiceService.actualizarImagenPerfil(
            this.infoEmployeeDTO.photoPath,
          );
        }
      });
  }
}
