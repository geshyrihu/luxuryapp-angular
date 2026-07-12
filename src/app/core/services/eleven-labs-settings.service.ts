import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Endpoints } from "../constants/endpoints";

export interface ElevenLabsVoiceOption {
  voiceId: string;
  name: string;
  category?: string;
  description?: string;
  accent?: string;
  gender?: string;
  age?: string;
}

export interface ElevenLabsSubscriptionStatus {
  characterCount: number;
  characterLimit: number;
  usagePercentage: number;
  remainingCharacters: number;
  tier: string;
  nextBillingDate?: string | null;
}

export interface ElevenLabsFrontendSettings {
  voiceId: string;
  voiceName: string;
  modelId: string;
  stability: number;
  similarity: number;
  style: number;
  speakerBoost: number;
  autoPlayResponses: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ElevenLabsSettingsService {
  private readonly storageKey = "eleven_labs_frontend_settings";
  private readonly storageS = inject(StorageService);
  private readonly apiS = inject(ApiResponseService);

  readonly defaultSettings: ElevenLabsFrontendSettings = {
    voiceId: "CwhRBWXzGAHq8TQ4Fs17",
    voiceName: "Roger - Laid-Back, Casual, Resonant",
    modelId: "eleven_multilingual_v2",
    stability: 0.5,
    similarity: 0.75,
    style: 0,
    speakerBoost: 0,
    autoPlayResponses: true,
  };

  // Lee desde el cache local (uso sincrónico en servicios que no pueden esperar)
  getSettings(): ElevenLabsFrontendSettings {
    const stored = this.storageS.retrieve(this.storageKey);
    if (!stored || typeof stored !== "object") {
      return { ...this.defaultSettings };
    }
    return { ...this.defaultSettings, ...stored };
  }

  // Carga la configuración desde el servidor y actualiza el cache local
  async loadFromServer(): Promise<ElevenLabsFrontendSettings> {
    try {
      const result = await this.apiS.onGetItem<ElevenLabsFrontendSettings>(
        Endpoints.ElevenLabs.settings,
        false,
      );
      if (result) {
        // Si el servidor no devuelve voiceName, conservar el del cache local
        const cached = this.getSettings();
        const merged: ElevenLabsFrontendSettings = {
          ...this.defaultSettings,
          ...result,
          voiceName:
            result.voiceName ||
            cached.voiceName ||
            this.defaultSettings.voiceName,
        };
        this.storageS.store(this.storageKey, merged);
        return merged;
      }
    } catch {
      // Si falla el servidor, usar el cache local
    }
    return this.getSettings();
  }

  // Guarda en el servidor y actualiza el cache local
  async saveSettings(settings: ElevenLabsFrontendSettings): Promise<void> {
    this.storageS.store(this.storageKey, settings);
    try {
      await this.apiS.onPostNotLoading(Endpoints.ElevenLabs.settings, settings);
    } catch {
      // El dato queda en localStorage como respaldo
    }
  }
}
