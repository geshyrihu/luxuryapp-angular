import { CommonModule } from "@angular/common";
import {
  Component,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { DrawerModule } from "primeng/drawer";
import { InputTextModule } from "primeng/inputtext";
import { ProgressSpinnerModule } from "primeng/progressspinner";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ElevenLabsService } from "src/app/core/services/eleven-labs.service";
import { reportFilterState } from "../../state/financial-report-filter.state";

interface AiMessage {
  role: "user" | "assistant";
  content: SafeHtml | string;
  isHtml?: boolean;
  rawContent?: string;
}

@Component({
  selector: "app-contabilidad-online-ai-agent",
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
  ],
  templateUrl: "./ai-agent-contabilidad-online.html",
  encapsulation: ViewEncapsulation.None,
})
export class AiAgentContabilidadOnlineComponent {
  public filterS = reportFilterState;
  private apiResponseS = inject(ApiResponseService);
  private toastS = inject(CustomToastService);
  private sanitizer = inject(DomSanitizer);
  private elevenLabsS = inject(ElevenLabsService);

  autoReadResponses = input(true);

  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  speaking = signal<boolean>(false);
  currentQuery = signal<string>("");

  messages = signal<AiMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy tu Auditor IA de Contabilidad Online. Puedo ayudarte a interpretar EPF, resultados, presupuesto, extraordinarias, flujo y cobranza con las reglas reales de este módulo.",
    },
  ]);

  suggestedQuestions = [
    "¿Qué hallazgo relevante ves en este reporte y por qué importa?",
    "¿Hay cuentas o saldos atípicos que debería revisar primero?",
    "¿Cómo se explica la variación principal del periodo?",
    "¿Ves riesgo de déficit, presión de cobranza o desfase presupuestal?",
    "¿Qué cuenta o bloque explica más el resultado del periodo?",
    "¿Hay alguna inconsistencia entre lo que muestra el reporte y su lógica esperada?",
    "Si este es EPF, ¿cómo impactan 104, 302, 303 o 205/206?",
    "Si este es Estado de Resultados, ¿qué cuentas dominan ingresos o gastos?",
    "Si este es P vs R, ¿cuál es la desviación más importante?",
    "Si este es Cobranza, ¿qué lectura operativa harías del corte?",
  ];

  togglePanel() {
    this.visible.update((v) => !v);
  }

  setQuery(query: string) {
    this.currentQuery.set(query);
  }

  async sendQuery() {
    const query = this.currentQuery().trim();
    if (!query) return;

    if (!this.filterS.currentReportContext()) {
      this.toastS.showError(
        "Atención",
        "Espera a que cargue el reporte actual o selecciona uno con datos para poder analizarlo.",
      );
      return;
    }

    this.messages.update((m) => [...m, { role: "user", content: query }]);
    this.currentQuery.set("");
    this.loading.set(true);

    try {
      const responseHtml = await this.apiResponseS.onPost<string>(
        Endpoints.ContabilidadOnline.askAiContabilidadOnline,
        {
          reportName: this.filterS.currentReportName(),
          reportData: this.filterS.currentReportContext(),
          userQuery: query,
        },
      );

      if (!responseHtml || typeof responseHtml !== "string") {
        throw new Error("No AI response");
      }

      const safeHtml = this.sanitizer.bypassSecurityTrustHtml(responseHtml);
      this.messages.update((m) => [
        ...m,
        {
          role: "assistant",
          content: safeHtml,
          isHtml: true,
          rawContent: responseHtml,
        },
      ]);

      const shouldReadResponse =
        this.autoReadResponses() &&
        this.elevenLabsS.getSettings().autoPlayResponses;

      if (shouldReadResponse) {
        await this.readAssistantResponse(responseHtml);
      }
    } catch {
      this.messages.update((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Ocurrió un error al procesar tu pregunta en el agente de Contabilidad Online. Intenta nuevamente más tarde.",
        },
      ]);
    } finally {
      this.loading.set(false);
    }
  }

  async replayMessage(message: AiMessage) {
    const plainText = this.getMessageAsPlainText(message);
    if (!plainText) {
      this.toastS.showInfo(
        "Sin contenido de voz",
        "Este mensaje no contiene texto suficiente para reproducirse.",
      );
      return;
    }

    await this.readAssistantResponse(plainText);
  }

  stopAudio() {
    this.elevenLabsS.stopCurrentAudio();
    this.speaking.set(false);
  }

  private async readAssistantResponse(content: string) {
    const plainText = this.extractPlainText(content);
    if (!plainText) return;

    const settings = this.elevenLabsS.getSettings();
    if (!settings.voiceId) {
      this.toastS.showInfo(
        "ElevenLabs sin configurar",
        "Configura una voz en Configuración > Configuración ElevenLabs para escuchar las respuestas.",
      );
      return;
    }

    this.speaking.set(true);

    try {
      const played = await this.elevenLabsS.playText(plainText);
      if (!played) {
        this.toastS.showError(
          "No se pudo reproducir",
          "La respuesta se recibió, pero no fue posible generar el audio con ElevenLabs.",
        );
      }
    } catch {
      this.toastS.showError(
        "Error de audio",
        "Ocurrió un problema al reproducir la respuesta con ElevenLabs.",
      );
    } finally {
      this.speaking.set(false);
    }
  }

  private getMessageAsPlainText(message: AiMessage): string {
    if (message.rawContent) {
      return this.extractPlainText(message.rawContent);
    }

    if (!message.isHtml) {
      return String(message.content ?? "");
    }

    return this.extractPlainText(String(message.content ?? ""));
  }

  private extractPlainText(htmlContent: string): string {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;
    return (tempElement.textContent || tempElement.innerText || "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
