// src/app/core/services/swal.service.ts
import { Injectable } from "@angular/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class SwalService {
  private static readonly defaultCustomClass = { container: "my-swal-container" };

  static show<T = unknown>(options: SweetAlertOptions) {
    return Swal.fire({
      customClass: this.defaultCustomClass,
      ...options,
    });
  }

  static openLoadingIndicator(): void {
    Swal.showLoading();
  }

  static closeDialog(): void {
    Swal.close();
  }

  static showValidationMessage(message: string): void {
    Swal.showValidationMessage(message);
  }

  static notify(
    icon: "success" | "error" | "warning" | "info",
    title: string,
    text: string = "",
  ): void {
    void this.show({ icon, title, text });
  }

  showLoading(title: string = "Procesando...") {
    return this.fire({
      title,
      icon: "info",
      text: "Espere por favor...",
      allowOutsideClick: false,
      didOpen: () => {
        SwalService.openLoadingIndicator();
      },
    });
  }

  close() {
    SwalService.closeDialog();
  }

  success(title: string, text: string = "") {
    this.notify("success", title, text);
  }

  error(title: string, text: string = "") {
    this.notify("error", title, text);
  }

  fire<T = unknown>(options: SweetAlertOptions) {
    return SwalService.show(options);
  }

  async confirm(
    options: SweetAlertOptions = {},
  ): Promise<boolean> {
    const result = await this.fire({
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      ...options,
    });
    return result.isConfirmed;
  }

  async prompt<T = string>(
    options: SweetAlertOptions,
  ): Promise<T | null> {
    const result: SweetAlertResult<T> = await this.fire<T>(options);
    return result.isConfirmed ? (result.value ?? null) : null;
  }

  notify(
    icon: "success" | "error" | "warning" | "info",
    title: string,
    text: string = "",
  ): void {
    void this.fire({ icon, title, text });
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





