import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomInputNumberSignal } from "src/app/core/components/web/inputs/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/web/inputs/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ElevenLabsService } from "src/app/core/services/eleven-labs.service";
import {
  ElevenLabsSettingsService,
  ElevenLabsSubscriptionStatus,
  ElevenLabsVoiceOption,
} from "src/app/core/services/eleven-labs-settings.service";

interface ElevenLabsSettingsForm {
  voiceId: FormControl<string>;
  modelId: FormControl<string>;
  stability: FormControl<number>;
  similarity: FormControl<number>;
  style: FormControl<number>;
  speakerBoost: FormControl<number>;
  autoPlayResponses: FormControl<boolean>;
  sampleText: FormControl<string>;
}

@Component({
  selector: "app-eleven-labs-settings",
  templateUrl: "./eleven-labs-settings.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    CustomButton,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputSwitch,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
})
export class ElevenLabsSettingsComponent implements OnInit {
  private readonly formB = inject(FormBuilder);
  private readonly elevenLabsS = inject(ElevenLabsService);
  private readonly elevenLabsSettingsS = inject(ElevenLabsSettingsService);
  private readonly toastS = inject(CustomToastService);

  readonly voices = signal<ElevenLabsVoiceOption[]>([]);
  readonly subscription = signal<ElevenLabsSubscriptionStatus | null>(null);
  readonly loadingVoices = signal(false);
  readonly loadingSubscription = signal(false);
  readonly testingAudio = signal(false);
  readonly selectedVoicePreview = signal<string>("");
  readonly voicesLoadError = signal<string>("");

  readonly voiceOptions = signal<{ label: string; value: string }[]>([]);
  readonly modelOptions = [
    {
      label: "Multilingual v2",
      value: "eleven_multilingual_v2",
    },
    {
      label: "Turbo v2.5",
      value: "eleven_turbo_v2_5",
    },
    {
      label: "Flash v2.5",
      value: "eleven_flash_v2_5",
    },
  ];

  readonly form: FormGroup<ElevenLabsSettingsForm> =
    this.formB.group<ElevenLabsSettingsForm>({
      voiceId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      modelId: new FormControl("eleven_multilingual_v2", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      stability: new FormControl(0.5, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(1)],
      }),
      similarity: new FormControl(0.75, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(1)],
      }),
      style: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(1)],
      }),
      speakerBoost: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(1)],
      }),
      autoPlayResponses: new FormControl(true, {
        nonNullable: true,
      }),
      sampleText: new FormControl(
        "Hola, soy el auditor financiero de LuxuryApp y esta es una prueba de lectura con ElevenLabs.",
        {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(5000)],
        },
      ),
    });

  ngOnInit(): void {
    this.loadStoredSettings();
    void this.loadVoices();
    void this.loadSettingsFromServer();

    this.form.controls.voiceId.valueChanges.subscribe((voiceId) => {
      this.updateSelectedVoicePreview(voiceId);
    });
  }

  async loadSettingsFromServer(): Promise<void> {
    const settings = await this.elevenLabsS.loadSettingsFromServer();
    this.form.patchValue({
      voiceId: settings.voiceId,
      modelId: settings.modelId,
      stability: settings.stability,
      similarity: settings.similarity,
      style: settings.style,
      speakerBoost: settings.speakerBoost,
      autoPlayResponses: settings.autoPlayResponses,
    });
    this.updateSelectedVoicePreview(settings.voiceId);
  }

  async loadVoices(): Promise<void> {
    this.loadingVoices.set(true);

    try {
      const voices = await this.elevenLabsS.getVoices();
      this.voices.set(voices);
      this.voicesLoadError.set("");
      this.voiceOptions.set(
        voices.map((voice) => ({
          label: `${voice.name}${voice.category ? ` (${voice.category})` : ""}`,
          value: voice.voiceId,
        })),
      );

      const currentVoiceId = this.form.controls.voiceId.value;
      if (!currentVoiceId && voices.length > 0) {
        this.form.controls.voiceId.setValue(voices[0].voiceId);
      }

      this.updateSelectedVoicePreview(this.form.controls.voiceId.value);
    } catch {
      this.voices.set([]);
      this.voiceOptions.set([]);
      this.voicesLoadError.set(
        "No fue posible listar las voces con esta API key. Puedes capturar manualmente el Voice ID y seguir usando text-to-speech si tu llave sí tiene permiso para generar audio.",
      );
    } finally {
      this.loadingVoices.set(false);
    }
  }

  async loadSubscription(): Promise<void> {
    this.loadingSubscription.set(true);

    try {
      this.subscription.set(await this.elevenLabsS.getSubscriptionStatus());
    } finally {
      this.loadingSubscription.set(false);
    }
  }

  async saveSettings(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastS.showError(
        "Configuración incompleta",
        "Selecciona una voz y revisa los parámetros antes de guardar.",
      );
      return;
    }

    const selectedVoice = this.voices().find(
      (voice) => voice.voiceId === this.form.controls.voiceId.value,
    );

    await this.elevenLabsS.saveSettings({
      voiceId: this.form.controls.voiceId.value,
      voiceName: selectedVoice?.name ?? "",
      modelId: this.form.controls.modelId.value,
      stability: this.form.controls.stability.value,
      similarity: this.form.controls.similarity.value,
      style: this.form.controls.style.value,
      speakerBoost: this.form.controls.speakerBoost.value,
      autoPlayResponses: this.form.controls.autoPlayResponses.value,
    });

    this.toastS.showSuccess(
      "Configuración guardada",
      "La voz predeterminada de ElevenLabs quedó lista para el Auditor IA.",
    );
  }

  async testAudio(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.testingAudio.set(true);

    try {
      await this.saveSettings();
      const success = await this.elevenLabsS.playText(
        this.form.controls.sampleText.value,
      );

      if (!success) {
        this.toastS.showError(
          "Sin audio",
          "No se pudo generar audio. Verifica la voz configurada y la API Key del backend.",
        );
      }
    } finally {
      this.testingAudio.set(false);
    }
  }

  stopAudio(): void {
    this.elevenLabsS.stopCurrentAudio();
  }

  private loadStoredSettings(): void {
    const settings = this.elevenLabsSettingsS.getSettings();
    this.form.patchValue({
      voiceId: settings.voiceId,
      modelId: settings.modelId,
      stability: settings.stability,
      similarity: settings.similarity,
      style: settings.style,
      speakerBoost: settings.speakerBoost,
      autoPlayResponses: settings.autoPlayResponses,
    });
  }

  private updateSelectedVoicePreview(voiceId: string): void {
    const selectedVoice = this.voices().find((voice) => voice.voiceId === voiceId);
    if (!selectedVoice) {
      this.selectedVoicePreview.set("");
      return;
    }

    this.selectedVoicePreview.set(
      [
        selectedVoice.description,
        selectedVoice.gender,
        selectedVoice.accent,
        selectedVoice.age,
      ]
        .filter(Boolean)
        .join(" | "),
    );
  }
}

