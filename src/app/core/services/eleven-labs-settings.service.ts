import { Injectable, inject } from "@angular/core";
import { StorageService } from "src/app/core/services/storage.service";

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

  readonly defaultSettings: ElevenLabsFrontendSettings = {
    voiceId: "",
    voiceName: "",
    modelId: "eleven_multilingual_v2",
    stability: 0.5,
    similarity: 0.75,
    style: 0,
    speakerBoost: 0,
    autoPlayResponses: true,
  };

  getSettings(): ElevenLabsFrontendSettings {
    const stored = this.storageS.retrieve(this.storageKey);
    if (!stored || typeof stored !== "object") {
      return { ...this.defaultSettings };
    }

    return {
      ...this.defaultSettings,
      ...stored,
    };
  }

  saveSettings(settings: ElevenLabsFrontendSettings): void {
    this.storageS.store(this.storageKey, settings);
  }
}
