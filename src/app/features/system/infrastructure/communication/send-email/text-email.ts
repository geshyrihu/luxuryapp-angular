import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabelSendEmail } from "src/app/core/components/buttons/web/label/button-send-email";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-text-email",
  templateUrl: "./text-email.html",
  imports: [ReactiveFormsModule, CustomInputTextSignal, WebButtonLabelSendEmail],
})
export class TextEmail {
  apiResponseS = inject(ApiResponseService);
  // Campo para capturar el correo
  emailControl = new FormControl<string>("");

  onSendEmail() {
    if (!this.emailControl.value) {
      alert("Por favor, ingresa un correo vólido");
      return;
    }

    // Endpoint: api/test/test-email/{email}
    const urlApi = `SendEmail/test-email/${this.emailControl.value}`;

    this.apiResponseS
      .onPost(urlApi, {})
      .then((result: any) => {
        console.log("? Respuesta del servidor:", result);
        alert("Correo enviado de prueba correctamente");
      })
      .catch((error: any) => {
        console.error("? Error al enviar el correo:", error);
        alert("Hubo un problema al enviar el correo");
      });
  }
}
