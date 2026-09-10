import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";

import { LxSpinner } from "@ui/adaptive/spinner/spinner";

import { LxSidebar } from "@ui/adaptive/sidebar/sidebar";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ElevenLabsService } from "src/app/core/services/eleven-labs.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { reportFilterState } from "../state/financial-report-filter.state";

interface AiMessage {
  role: "user" | "assistant";
  content: SafeHtml | string;
  isHtml?: boolean;
  rawContent?: string;
}

@Component({
  selector: "app-contabilidad-ai-agent",

  imports: [
    WebButtonIcon,
    WebButtonLabel,
    CommonModule,
    FormsModule,
    ButtonModule,
    CustomInputTextSignal,
    LxSpinner,
    LxSidebar,
    AppIcon,
  ],
  templateUrl: "./ai-agent.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AiAgentComponent {
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
        "Hola, soy tu Auditor Contable IA. Estoy analizando el reporte actual. óEn quó te puedo ayudar?",
    },
  ]);

  suggestedQuestions = [
    "óLos estados financieros fueron elaborados bajo principios contables consistentes?",
    "óExisten variaciones significativas y cuóles son sus causas?",
    "óLa balanza de comprobación concilia correctamente con el balance?",
    "óSe realizaron ajustes contables posteriores al cierre?",
    "óCuól es el porcentaje de cobranza del periodo y cómo se compara?",
    "óExisten diferencias entre ingresos en bancos y contables?",
    "óQuó desviaciones presupuestales se presentaron y justificaciones?",
    "óExisten pagos duplicados o anticipos pendientes?",
    "óLas conciliaciones bancarias estén actualizadas?",
    "óExisten partidas en trónsito mayores a 30 días?",
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
      const responseHtml = await this.apiResponseS.onPost<string>(
        Endpoints.ContabilidadOnline.askAi,
        {
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
    } catch (error) {
      this.messages.update((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Ocurrié un error al procesar tu pregunta. Por favor, intenta de nuevo mós tarde.",
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
          "La respuesta se recibié, pero no fue posible generar el audio con ElevenLabs.",
        );
      }
    } catch {
      this.toastS.showError(
        "Error de audio",
        "Ocurrié un problema al reproducir la respuesta con ElevenLabs.",
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
