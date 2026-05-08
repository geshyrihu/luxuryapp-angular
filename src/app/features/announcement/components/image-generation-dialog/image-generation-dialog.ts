import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { TextareaModule } from "primeng/textarea";
import { TooltipModule } from "primeng/tooltip";
import { AiService } from "src/app/core/services/ai.service";
import { SwalService } from "src/app/core/services/swal.service";

@Component({
  selector: "app-image-generation-dialog",
  templateUrl: "./image-generation-dialog.html",
  styleUrls: ["./image-generation-dialog.scss"],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomButton,
    TextareaModule,
    TooltipModule,
  ],
})
export class ImageGenerationDialog {
  private ref = inject(DynamicDialogRef);
  private aiService = inject(AiService);
  private swalService = inject(SwalService);

  currentStep = signal(1);
  selectedStyle = signal("");
  selectedMood = signal("");
  selectedElement = signal("");
  additionalPromptControl = new FormControl<string>("");
  isListening = signal(false);
  generating = signal(false);

  // Web Speech API
  recognition: any;

  styles = [
    {
      label: "Realista",
      value: "photorealistic, high quality, 4k",
      icon: "pi pi-camera",
    },
    {
      label: "Ilustración",
      value: "digital illustration, vector art, vibrant",
      icon: "pi pi-pencil",
    },
    {
      label: "3D Render",
      value: "3d render, blender, unreal engine, isometric",
      icon: "pi pi-box",
    },
    {
      label: "Minimalista",
      value: "minimalist, clean lines, flat colors, modern",
      icon: "pi pi-minus-circle",
    },
  ];

  moods = [
    {
      label: "Luminoso",
      value: "bright, sunny, natural lighting",
      emoji: "☀️",
    },
    {
      label: "Elegante",
      value: "elegant, luxury, golden hour, warm tones",
      emoji: "✨",
    },
    {
      label: "Profesional",
      value: "corporate, clean, white background, office",
      emoji: "🏢",
    },
    { label: "Nocturno", value: "night, neon lights, dark mode", emoji: "🌙" },
  ];

  elements = [
    {
      label: "Edificio",
      value: "modern luxury building facade",
      icon: "pi pi-building",
    },
    {
      label: "Interiores",
      value: "luxury interior, lobby, marble",
      icon: "pi pi-home",
    },
    {
      label: "Personas",
      value: "professional people, happy residents, diverse",
      icon: "pi pi-users",
    },
    {
      label: "Abstracto",
      value: "abstract shapes, branding colors",
      icon: "pi pi-palette",
    },
  ];

  constructor() {
    this.initSpeechRecognition();
  }

  getStepTitle() {
    switch (this.currentStep()) {
      case 1:
        return "Estilo Visual";
      case 2:
        return "Ambiente";
      case 3:
        return "Elemento Principal";
      case 4:
        return "Detalles Extra";
      default:
        return "";
    }
  }

  selectStyle(val: string) {
    this.selectedStyle.set(val);
    setTimeout(() => this.nextStep(), 300);
  }
  selectMood(val: string) {
    this.selectedMood.set(val);
    setTimeout(() => this.nextStep(), 300);
  }
  selectElement(val: string) {
    this.selectedElement.set(val);
    setTimeout(() => this.nextStep(), 300);
  }

  canProceed(): boolean {
    if (this.currentStep() === 1 && !this.selectedStyle()) return false;
    if (this.currentStep() === 2 && !this.selectedMood()) return false;
    if (this.currentStep() === 3 && !this.selectedElement()) return false;
    return true;
  }

  nextStep() {
    if (this.currentStep() < 4) this.currentStep.update((s) => s + 1);
  }
  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update((s) => s - 1);
  }

  toggleListing() {
    if (!this.recognition) return;
    if (this.isListening()) {
      this.recognition.stop();
      this.isListening.set(false);
    } else {
      this.recognition.start();
      this.isListening.set(true);
    }
  }

  initSpeechRecognition() {
    if ("webkitSpeechRecognition" in window) {
      const vWindow = window as any;
      this.recognition = new vWindow.webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = "es-MX";
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const currentVal = this.additionalPromptControl.value || "";
        this.additionalPromptControl.setValue(currentVal + (currentVal ? " " : "") + transcript);
        this.isListening.set(false);
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech error", event);
        this.isListening.set(false);
      };

      this.recognition.onend = () => {
        this.isListening.set(false);
      };
    } else {
      console.warn("Web Speech API not supported");
    }
  }

  async generate() {
    this.generating.set(true);

    // Construct Prompt
    const prompt = `Create an image for a luxury building announcement. 
    Style: ${this.selectedStyle()}. 
    Mood: ${this.selectedMood()}. 
    Main Element: ${this.selectedElement()}. 
    Additional details: ${this.additionalPromptControl.value}.
    Make it professional, high resolution.`;

    try {
      const blob = await this.aiService.generateImage(prompt);
      // Close with result
      this.ref.close(blob);
    } catch (error) {
      console.error(error);
      this.swalService.error("Error al generar la imagen. Intenta de nuevo.");
    } finally {
      this.generating.set(false);
    }
  }
}









