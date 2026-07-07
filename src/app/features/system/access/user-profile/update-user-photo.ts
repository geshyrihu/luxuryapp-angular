import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import { CardModule } from "primeng/card";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputImg } from "@ui/inputs/web/custom-input-img-signal";
import { InfoAccountAuthDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ProfielService } from "src/app/core/services/profiel-service";

@Component({
  selector: "app-actualizar-foto-usuario-aplicacion",
  templateUrl: "./update-user-photo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardModule, CustomInputImg, WebButtonLabel],
})
export class UpdateUserPhotoComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  public profielServiceService = inject(ProfielService);

  applicationUserId: string = this.authS.applicationUserId;
  infoEmployeeDTO: InfoAccountAuthDTO;

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
