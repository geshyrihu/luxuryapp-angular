// src/app/core/services/swal.service.ts
import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class SwalService {
  private readonly defaultCustomClass = { container: "my-swal-container" };

  showLoading(title: string = "Procesando...") {
    Swal.fire({
      title,
      icon: "info",
      text: "Espere por favor...",
      allowOutsideClick: false,
      customClass: this.defaultCustomClass,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  close() {
    Swal.close();
  }

  success(title: string, text: string = "") {
    Swal.fire({
      icon: "success",
      title,
      text,
      customClass: this.defaultCustomClass,
    });
  }

  error(title: string, text: string = "") {
    Swal.fire({
      icon: "error",
      title,
      text,
      customClass: this.defaultCustomClass,
    });
  }

  fire(options: any) {
    return Swal.fire({
      customClass: this.defaultCustomClass,
      ...options,
    });
  }

  isLoading() {
    return Swal.isLoading();
  }

  fixModalZIndex() {
    const container = Swal.getContainer();
    if (container) {
      container.style.zIndex = "9999999";
    }
  }
}









