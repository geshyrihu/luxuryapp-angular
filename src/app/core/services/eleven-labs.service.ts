import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  ElevenLabsFrontendSettings,
  ElevenLabsSettingsService,
  ElevenLabsSubscriptionStatus,
  ElevenLabsVoiceOption,
} from "src/app/core/services/eleven-labs-settings.service";

interface ElevenLabsTextToSpeechResponse {
  audioBase64: string;
  contentType: string;
  sizeBytes: number;
  durationSeconds?: number | null;
  voiceId: string;
  modelId: string;
}

@Injectable({
  providedIn: "root",
})
export class ElevenLabsService {
  private readonly apiS = inject(ApiResponseService);
  private readonly settingsS = inject(ElevenLabsSettingsService);

  private currentAudio: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;

  getSettings(): ElevenLabsFrontendSettings {
    return this.settingsS.getSettings();
  }

  async loadSettingsFromServer(): Promise<ElevenLabsFrontendSettings> {
    return this.settingsS.loadFromServer();
  }

  async saveSettings(settings: ElevenLabsFrontendSettings): Promise<void> {
    await this.settingsS.saveSettings(settings);
  }

  async getVoices(): Promise<ElevenLabsVoiceOption[]> {
    const result =
      await this.apiS.onGetListNotLoading<ElevenLabsVoiceOption[]>(
        "eleven-labs/voices",
      );
    return result ?? [];
  }

  async getSubscriptionStatus(): Promise<ElevenLabsSubscriptionStatus | null> {
    return this.apiS.onGetItem<ElevenLabsSubscriptionStatus>(
      "eleven-labs/subscription-status",
      false,
    );
  }

  async playText(
    text: string,
    partialSettings?: Partial<ElevenLabsFrontendSettings>,
  ): Promise<boolean> {
    const normalizedText = text.trim();
    if (!normalizedText) {
      return false;
    }

    const settings = {
      ...this.getSettings(),
      ...partialSettings,
    };

    if (!settings.voiceId) {
      return false;
    }

    const response =
      await this.apiS.onPostNotLoading<ElevenLabsTextToSpeechResponse>(
        "eleven-labs/text-to-speech",
        {
          text: normalizedText,
          voiceId: settings.voiceId,
          modelId: settings.modelId,
          stability: settings.stability,
          similarity: settings.similarity,
          style: settings.style,
          speakerBoost: settings.speakerBoost,
        },
      );

    if (response === false) {
      return false;
    }

    this.stopCurrentAudio();

    const audioBlob = this.base64ToBlob(
      response.audioBase64,
      response.contentType || "audio/mpeg",
    );
    this.currentAudioUrl = URL.createObjectURL(audioBlob);
    this.currentAudio = new Audio(this.currentAudioUrl);
    this.currentAudio.onended = () => this.cleanupAudio();
    this.currentAudio.onerror = () => this.cleanupAudio();

    await this.currentAudio.play();
    return true;
  }

  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.cleanupAudio();
  }

  private cleanupAudio(): void {
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
    }

    this.currentAudio = null;
    this.currentAudioUrl = null;
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const sliceSize = 1024;
    const byteChars = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
      const slice = byteChars.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays as BlobPart[], { type: contentType });
  }
}
