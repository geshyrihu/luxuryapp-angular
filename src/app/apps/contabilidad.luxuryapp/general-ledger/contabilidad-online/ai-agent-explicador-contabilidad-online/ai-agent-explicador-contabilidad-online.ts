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
import { ButtonModule } from "primeng/button";

import { LxSpinner } from "@ui/adaptive/spinner/spinner";

import { LxSidebar } from "@ui/adaptive/sidebar/sidebar";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ElevenLabsService } from "src/app/core/services/eleven-labs.service";
import { reportFilterState } from "../state/financial-report-filter.state";

interface AiMessage {
  role: "user" | "assistant";
  content: SafeHtml | string;
  isHtml?: boolean;
  rawContent?: string;
}

@Component({
  selector: "app-explicador-contabilidad-online-ai-agent",
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
  templateUrl: "./ai-agent-explicador-contabilidad-online.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AiAgentExplicadorContabilidadOnlineComponent {
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
        "Hola, soy tu Explicador IA de Contabilidad Online. Puedo resumir y explicar lo que significa este informe en lenguaje claro, usando solo las descripciones de los rubros y sin hablar en claves contables.",
    },
  ]);

  suggestedQuestions = [
    "Explócame este reporte en palabras sencillas.",
    "éQué me esté diciendo este informe sobre la situación actual?",
    "óCuóles son los rubros que mós pesan en el resultado?",
    "óQuó variación importante se observa en este periodo?",
    "óCómo debería interpretar el resultado final de este reporte?",
    "Explócame quó significa este bloque dentro del informe.",
    "Si se lo explicara a un administrador no contable, ócómo lo resumirías?",
    "óQuó lectura operativa harías de este reporte?",
    "óQuó datos llaman mós la atención y cómo se entienden?",
    "Dame un resumen ejecutivo de este informe sin tecnicismos.",
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
        "Espera a que cargue el reporte actual o selecciona uno con datos para poder explicarlo.",
      );
      return;
    }

    this.messages.update((m) => [...m, { role: "user", content: query }]);
    this.currentQuery.set("");
    this.loading.set(true);

    try {
      const responseHtml = await this.apiResponseS.onPost<string>(
        Endpoints.ContabilidadOnline.explainAiContabilidadOnline,
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
            "Ocurrié un error al procesar tu pregunta en el explicador de Contabilidad Online. Intenta nuevamente mós tarde.",
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
