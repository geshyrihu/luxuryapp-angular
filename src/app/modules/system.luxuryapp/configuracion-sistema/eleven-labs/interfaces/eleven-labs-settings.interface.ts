import { FormControl } from "@angular/forms";

export interface ElevenLabsSettingsFormGroup {
  voiceId: FormControl<string>;
  modelId: FormControl<string>;
  stability: FormControl<number>;
  similarity: FormControl<number>;
  style: FormControl<number>;
  speakerBoost: FormControl<number>;
  autoPlayResponses: FormControl<boolean>;
  sampleText: FormControl<string>;
}
