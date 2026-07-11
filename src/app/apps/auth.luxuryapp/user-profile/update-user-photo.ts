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
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InfoAccountAuthDto } from "src/app/core/interfaces/auth-user-token.dto";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-actualizar-foto-usuario-aplicacion",
  templateUrl: "./update-user-photo.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,LxCard, InputImg, WebButtonLabel],
})
export class UpdateUserPhotoComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  public profielServiceService = inject(ProfielService);

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
    if (file) this.changeImg(file);
  }

  changeImg(file: File) {
    this.imgUpload = file;
    if (!file) {
      this.imgName = "";
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.imgName = file;
    };
    this.uploadImg();
  }

  uploadImg() {
    const formData = new FormData();
    formData.append("file", this.imgUpload);
    this.apiResponseS
      .onPut("Users/UpdateImage/" + this.applicationUserId, formData)
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
