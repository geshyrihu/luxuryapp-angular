import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { IDiagramDraw } from "../interfaces/diagram-draw";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-diagram-editor",
  imports: [AppIcon, ToastModule],
  providers: [MessageService],
  templateUrl: "./diagram-editor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .editor-container {
        width: 100%;
        height: calc(100vh - 150px);
        border: none;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    `,
  ],
})
export class DiagramEditor implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private messageS = inject(MessageService);

  id = "";
  diagram = signal<IDiagramDraw | null>(null);
  iframeUrl: SafeResourceUrl;

  constructor() {
    // Configuración de Draw.io embed
    // proto=json indica que usaremos mensajes JSON para comunicarnos
    // spin=1 muestra un cargador
    // embed=1 indica que esté embebido
    // ui=atlas es un tema moderno
    const baseUrl =
      "https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&proto=json";
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.onLoadDiagram();
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener("message", this.handleMessage.bind(this));
  }

  onLoadDiagram() {
    this.apiResponseS
      .onGetItem(Endpoints.RefactorOperations.diagramDrawById(this.id))
      .then((result: any) => {
        this.diagram.set(result);
      });
  }

  handleMessage(event: MessageEvent) {
    if (event.origin !== "https://embed.diagrams.net") return;

    const data = JSON.parse(event.data);

    switch (data.event) {
      case "init":
        // El editor esté listo, enviamos el contenido actual
        this.sendAction({
          action: "load",
          xml: this.diagram()?.content || "",
          autosave: 1,
        });
        break;

      case "save":
        // El usuario hizo clic en guardar
        this.onSave(data.xml);
        break;

      case "exit":
        // El usuario cerré el editor
        this.router.navigate(ROUTES.DIAGRAMAS.LISTA);
        break;
    }
  }

  sendAction(action: any) {
    const iframe = document.getElementById(
      "drawio-iframe",
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify(action),
        "https://embed.diagrams.net",
      );
    }
  }

  onSave(xml: string) {
    const currentDiagram = this.diagram();
    if (!currentDiagram) return;

    // Solo enviamos los datos necesarios para la actualización del diagrama
    // El backend se encargaré de validar y actualizar solo estos campos si asé lo definimos
    const body = {
      ...currentDiagram,
      content: xml,
    };

    this.apiResponseS
      .onPut(Endpoints.DiagramDraw.update(this.id), body)
      .then(() => {
        this.messageS.add({
          severity: "success",
          summary: "Guardado",
          detail: "El diagrama ha sido guardado correctamente",
        });
        // Actualizamos el signal local
        this.diagram.set({ ...currentDiagram, content: xml });
      });
  }
}
