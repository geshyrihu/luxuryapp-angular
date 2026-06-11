import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-view",
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="card p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="m-0">{{ diagram()?.name }}</h2>
        <p-button
          label="Volver"
          icon="mdi:arrow-left"
          (click)="goBack()"
          [text]="true"
          severity="secondary"
        />
      </div>

      <div
        class="diagram-wrapper shadow-2 border-round overflow-hidden bg-white"
      >
        @if (config(); as viewerConfig) {
          <div
            #container
            class="mxgraph"
            [attr.data-mxgraph]="viewerConfig"
            style="max-width:100%;border:1px solid transparent;"
          ></div>
        } @else {
          <div
            class="flex align-items-center justify-content-center h-full text-500"
          >
            Cargando diagrama...
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .diagram-wrapper {
        min-height: 600px;
        width: 100%;
        position: relative;
      }
      :host ::ng-deep .mxgraph {
        max-width: 100% !important;
        display: block;
        margin: 0 auto;
      }
    `,
  ],
})
export class DiagramView implements OnInit, AfterViewInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);

  diagram = signal<IDiagramDraw | null>(null);
  config = signal<string | null>(null);

  container = viewChild<ElementRef>("container");

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    this.onLoadDiagram(id);
  }

  onLoadDiagram(id: string) {
    this.apiResponseS.onGetItem(`DiagramDraw/${id}`).then((result: any) => {
      this.diagram.set(result);
      this.setupConfig(result.content);
      setTimeout(() => this.renderDiagram());
    });
  }

  setupConfig(xml: string) {
    const configObj = {
      highlight: "#0000ff",
      nav: true,
      resize: true,
      toolbar: "zoom layers",
      edit: "_blank",
      xml: xml,
    };
    this.config.set(JSON.stringify(configObj));
  }

  ngAfterViewInit(): void {
    this.loadViewerScript();
  }

  loadViewerScript() {
    // Si el script ya está cargado, lo reinicializamos
    if ((window as any).GraphViewer) {
      this.renderDiagram();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://viewer.diagrams.net/js/viewer-static.min.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      this.renderDiagram();
    };
    document.body.appendChild(script);
  }

  renderDiagram() {
    if (!this.config() || !this.container()?.nativeElement) {
      return;
    }

    // El script de draw.io busca elementos con clase 'mxgraph' al cargar
    // Si lo cargamos dinámicamente, podemos forzar el procesamiento
    if (
      (window as any).GraphViewer &&
      (window as any).GraphViewer.processElements
    ) {
      (window as any).GraphViewer.processElements();
    }
  }

  goBack() {
    window.history.back();
  }
}
