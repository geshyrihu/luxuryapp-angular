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

import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ElevenLabsService } from "src/app/core/services/eleven-labs.service";
import { ContabilidadAiService } from "../../services/contabilidad-ai.service";
import { ReportFilterService } from "../../services/financial-report-filter.service";

interface AiMessage {
  role: "user" | "assistant";
  content: SafeHtml | string;
  isHtml?: boolean;
  rawContent?: string;
}

@Component({
  selector: "app-contabilidad-ai-agent",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
  ],
  templateUrl: "./ai-agent.html",
  encapsulation: ViewEncapsulation.None,
})
export class AiAgentComponent {
  public filterS = inject(ReportFilterService);
  private aiService = inject(ContabilidadAiService);
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
        "Hola, soy tu Auditor Contable IA. Estoy analizando el reporte actual. ¿En qué te puedo ayudar?",
    },
  ]);

  suggestedQuestions = [
    "¿Los estados financieros fueron elaborados bajo principios contables consistentes?",
    "¿Existen variaciones significativas y cuáles son sus causas?",
    "¿La balanza de comprobación concilia correctamente con el balance?",
    "¿Se realizaron ajustes contables posteriores al cierre?",
    "¿Cuál es el porcentaje de cobranza del periodo y cómo se compara?",
    "¿Existen diferencias entre ingresos en bancos y contables?",
    "¿Qué desviaciones presupuestales se presentaron y justificaciones?",
    "¿Existen pagos duplicados o anticipos pendientes?",
    "¿Las conciliaciones bancarias están actualizadas?",
    "¿Existen partidas en tránsito mayores a 30 días?",
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

    // Add user message
    this.messages.update((m) => [...m, { role: "user", content: query }]);
    this.currentQuery.set("");
    this.loading.set(true);

    try {
      const responseHtml = await this.aiService.askAi(
        this.filterS.currentReportContext(),
        query,
      );

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
    } catch (error) {
      this.messages.update((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.",
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
