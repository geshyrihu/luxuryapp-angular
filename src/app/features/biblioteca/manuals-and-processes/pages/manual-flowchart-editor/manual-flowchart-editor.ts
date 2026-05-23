import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IManualDiagramSimpleDTO } from "../../models/manuals-and-processes.dto";

// Draw.io requiere hexadecimales en el XML/config. Mantener estos valores
// sincronizados con los tokens DS: primary ERP + paleta documental/premium.
const CORPORATE_DRAWIO_CONFIG = {
  defaultFonts: [
    "IBM Plex Sans",
    "Inter",
    "Segoe UI",
    "Roboto",
    "Arial",
    "Helvetica",
  ],
  fontCss:
    '@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap");',
  defaultEdgeStyle: "orthogonalEdgeStyle",
  defaultVertexStyle: {
    fontFamily: "IBM Plex Sans",
    fontSize: 11,
    fontColor: "#1A1A1A",
    fillColor: "#FFFFFF",
    strokeColor: "#0B3164",
    rounded: 1,
  },
  // Paleta documental/premium aplicada dentro de Draw.io
  customColorSchemes: [
    [
      { fill: "#0B3164", stroke: "#072042", font: "#FFFFFF" },
      { fill: "#C9A84C", stroke: "#A0802E", font: "#1A1A1A" },
      { fill: "#065F46", stroke: "#054D38", font: "#FFFFFF" },
      { fill: "#991B1B", stroke: "#7F1616", font: "#FFFFFF" },
      { fill: "#F3F4F6", stroke: "#D1D5DB", font: "#1A1A1A" },
    ],
  ],
};

// XML base con estilo corporativo cuando el diagrama esta vacio
const CORPORATE_DEFAULT_XML = `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Inicio" style="ellipse;whiteSpace=wrap;html=1;fillColor=#0B3164;strokeColor=#072042;fontColor=#FFFFFF;fontFamily=IBM Plex Sans;fontSize=13;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="320" y="80" width="120" height="60" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>`;

@Component({
  selector: "app-manual-flowchart-editor",
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: "./manual-flowchart-editor.html",
})
export class ManualFlowchartEditor implements OnInit, OnDestroy {
  private apiS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private messageS = inject(MessageService);

  id = signal<string>("");
  returnTo = signal<string>("/library/manuals-and-processes");
  diagram = signal<IManualDiagramSimpleDTO | null>(null);
  iframeUrl: SafeResourceUrl;

  private messageHandler = this.handleMessage.bind(this);

  constructor() {
    const baseUrl =
      "https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&proto=json&configure=1";
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
  }

  ngOnInit(): void {
    this.id.set(this.route.snapshot.params["id"]);
    this.returnTo.set(
      this.route.snapshot.queryParams["returnTo"] ??
        "/library/manuals-and-processes",
    );
    this.onLoadData();
    window.addEventListener("message", this.messageHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener("message", this.messageHandler);
  }

  onLoadData(): void {
    this.apiS
      .onGetItem<IManualDiagramSimpleDTO>(
        Endpoints.ManualsPasos.getDiagrama(this.id()),
      )
      .then((result) => {
        if (result) this.diagram.set(result);
      });
  }

  handleMessage(event: MessageEvent): void {
    if (event.origin !== "https://embed.diagrams.net") return;

    let data: any;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    switch (data.event) {
      case "configure":
        this.sendAction({
          action: "configure",
          config: CORPORATE_DRAWIO_CONFIG,
        });
        break;

      case "init":
        const xml = this.diagram()?.xmlContent?.trim()
          ? this.diagram()!.xmlContent
          : CORPORATE_DEFAULT_XML;
        this.sendAction({ action: "load", xml, autosave: 1 });
        break;

      case "save":
        this.onSave(data.xml);
        break;

      case "exit":
        this.router.navigateByUrl(this.returnTo());
        break;
    }
  }

  sendAction(action: object): void {
    const iframe = document.getElementById(
      "flowchart-iframe",
    ) as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage(
      JSON.stringify(action),
      "https://embed.diagrams.net",
    );
  }

  onSave(xml: string): void {
    const current = this.diagram();
    if (!current) return;
    this.apiS
      .onPut<IManualDiagramSimpleDTO>(
        Endpoints.ManualsPasos.updateDiagrama(this.id()),
        { content: xml },
      )
      .then((res) => {
        if (res) this.diagram.set(res);
        this.messageS.add({
          severity: "success",
          summary: "Guardado",
          detail: "Diagrama guardado correctamente",
        });
      });
  }
}
