import { Component, inject, OnInit } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CardModule } from "primeng/card";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { InfoAccountAuthDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ProfielService } from "src/app/core/services/profiel-service";
@Component({
  selector: "app-actualizar-foto-usuario-aplicacion",
  templateUrl: "./update-user-photo.html",
  imports: [NgbModule, CardModule, CustomInputImg],
})
export class UpdateUserPhotoComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  public profielServiceService = inject(ProfielService);
  applicationUserId: string = this.authS.applicationUserId;
  infoEmployeeDTO: InfoAccountAuthDTO;

  ngOnInit(): void {
    this.infoEmployeeDTO = this.authS.infoUserAuth;
  }

  // Cambio de imagen
  public imgUpload: any;
  public imgTemp: any;
  imgName: any = "";

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
    // Mostrar un mensaje de carga
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
