import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { CustomInputImg } from "@ui/inputs/web/custom-input-img-signal";
import { LxCard } from "@ui/adaptive/card/card";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-employee-avatar-form",
  templateUrl: "./employee-avatar-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxCard, CustomInputImg],
})
export class EmployeeAvatarForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  applicationUserId = input<string>("");
  photoPath = signal("");
  // Cambio de imagen
  imgUpload = signal<any>(null);
  imgTemp = signal<any>(null);
  imgName: any = "";

  ngOnInit() {
    // this.applicationUserId() = this.employeeAddOrEditService.onGetId();
    if (this.applicationUserId() !== "") this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.EmployeeInternal.photoPath(this.applicationUserId()))
      .then((result: any) => {
        this.photoPath.set(result.photoPath);
      });
  }

  changeImg(file: File) {
    this.imgUpload.set(file);
    if (!file) {
      this.imgName = "";
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp.set(reader.result);
      this.imgName = file;
    };

    this.uploadImg();
  }

  uploadImg() {
    // Mostrar un mensaje de carga
    const formData = new FormData();
    formData.append("file", this.imgUpload());

    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updateImage(this.applicationUserId()),
        formData,
      )
      .then((result: any) => {
        if (result) this.photoPath.set(result.photoPath);
      });
  }
}
