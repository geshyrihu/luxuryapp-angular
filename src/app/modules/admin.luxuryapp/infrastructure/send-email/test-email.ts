import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SwalService } from "@core/services/swal.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
@Component({
  selector: "app-test-email",
  templateUrl: "./test-email.html",
  imports: [ReactiveFormsModule, LuxInputTextSignal, ButtonWeb],
})
export class TestEmail {
  apiResponseS = inject(ApiResponseService);
  swalS = inject(SwalService);
  // Campo para capturar el correo
  emailControl = new FormControl<string>("");

  async onSendEmail() {
    if (!this.emailControl.value) {
      alert("Por favor, ingresa un correo vólido");
      return;
    }

    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "Deseas enviar el correo electronico ahora?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;

    // Endpoint: api/test/test-email/{email}
    const urlApi = Endpoints.Catalogs.EmailData.sendTestEmail(
      this.emailControl.value,
    );

    this.apiResponseS
      .onPost(urlApi, {})
      .then((result: any) => {
        console.log("? Respuesta del servidor:", result);
        alert("Correo enviado de prueba correctamente");
      })
      .catch((error: any) => {
        console.error("¿ Error al enviar el correo:", error);
        alert("Hubo un problema al enviar el correo");
      });
  }
}
