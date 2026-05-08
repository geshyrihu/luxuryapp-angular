import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-diagram-preview",
  standalone: true,
  template: `
    @if (config) {
      <div
        #container
        class="mxgraph"
        [attr.data-mxgraph]="config"
        style="max-width:100%;border:1px solid transparent;"
      ></div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      :host ::ng-deep .mxgraph {
        max-width: 100% !important;
        display: block;
      }
    `,
  ],
})
export class DiagramPreviewComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) xml!: string;
  @ViewChild("container") container!: ElementRef;

  config: string | null = null;

  ngOnChanges(): void {
    if (this.xml) {
      this.config = JSON.stringify({
        highlight: "#0000ff",
        nav: false,
        resize: true,
        toolbar: "zoom",
        xml: this.xml,
      });
      this.render();
    }
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
      const existing = document.querySelector('script[src*="viewer-static.min.js"]') as HTMLScriptElement;
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
