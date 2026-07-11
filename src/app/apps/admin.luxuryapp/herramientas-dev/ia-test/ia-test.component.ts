import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { LxCard } from "@ui/adaptive/card/card";
import { IaTestService } from "./ia-test.service";
import { AiTestResultDto } from "./interfaces/ai-test-result.interface";

@Component({
  selector: "app-ia-test",

  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebButtonLabel,
    LxCard,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    AppIcon,
  ],
  templateUrl: "./ia-test.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./ia-test.component.css",
})
export default class IaTestComponent {
  private iaTestService = inject(IaTestService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    profile: ["Local", Validators.required],
    prompt: [
      "Hola, óqué modelo eres? Responde brevemente.",
      Validators.required,
    ],
  });

  profiles = signal<{ label: string; value: string }[]>([
    { label: "Local (Ollama/Llama3)", value: "Local" },
    { label: "Nvidia (Llama 3.1 8B)", value: "Nvidia" },
    { label: "Gemini 2.5 Flash", value: "GeminiFlash" },
    { label: "Gemini 3 Flash Preview", value: "Gemini3Flash" },
    { label: "GPT-4o (Abacus)", value: "Abacus" },
  ]);

  isLoading = signal<boolean>(false);
  result = signal<AiTestResultDto | null>(null);

  async onTestProfile() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { profile, prompt } = this.form.value;
    if (!profile || !prompt) return;

    this.isLoading.set(true);
    this.result.set(null);

    const response = await this.iaTestService.testProfile(profile, prompt);

    if (response) {
      this.result.set(response);
    }

    this.isLoading.set(false);
  }
}
