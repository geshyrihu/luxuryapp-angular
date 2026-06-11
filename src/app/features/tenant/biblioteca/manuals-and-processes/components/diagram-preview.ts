import {
  AfterViewInit,
  Component,
  effect,
  input,
} from "@angular/core";

@Component({
  selector: "app-diagram-preview",

  template: `
    @if (config) {
      <div
        #container
        class="mxgraph w-full block"
        [attr.data-mxgraph]="config"
        style="max-width: 100%; border: 1px solid transparent"
      ></div>
    }
  `,
})
export class DiagramPreviewComponent implements AfterViewInit {
  xml = input.required<string>();

  config: string | null = null;

  constructor() {
    effect(() => {
      const xml = this.xml();
      if (xml) {
        this.config = JSON.stringify({
          highlight: "#0000ff",
          nav: false,
          resize: true,
          toolbar: "zoom",
          xml,
        });
        this.render();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadScript();
  }

  private loadScript(): void {
    if ((window as any).GraphViewer) {
      this.render();
      return;
    }
    if (document.querySelector('script[src*="viewer-static.min.js"]')) {
      const existing = document.querySelector(
        'script[src*="viewer-static.min.js"]',
      ) as HTMLScriptElement;
      existing.addEventListener("load", () => this.render());
      return;
    }
    const script = document.createElement("script");
    script.src = "https://viewer.diagrams.net/js/viewer-static.min.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => this.render();
    document.body.appendChild(script);
  }

  private render(): void {
    if (!(window as any).GraphViewer?.processElements) return;
    (window as any).GraphViewer.processElements();
  }
}
