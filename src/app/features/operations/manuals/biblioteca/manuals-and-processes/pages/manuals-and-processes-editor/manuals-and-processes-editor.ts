import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, OnInit, signal } from "@angular/core";
import { ROUTES } from "src/app/routing/route-paths";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { CustomInputSelectButton } from "src/app/core/components/inputs/web/custom-input-select-button-signal";
import { TagModule } from "primeng/tag";
import {
  WebButtonLabelDelete,
  WebButtonLabelSave,
} from "src/app/core/components/buttons/web-label";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomInputMultiselectSignal } from "src/app/core/components/inputs/web/custom-input-multiselect-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DiagramPreviewComponent } from "../../components/diagram-preview";
import {
  IManualAdjuntoSimpleDTO,
  IManualDiagramSimpleDTO,
  IManualPasoAddDTO,
  IManualPasoDTO,
  IManualPasoEnlaceAddDTO,
  IManualPasoEnlaceDTO,
  IManualPasoImagenDTO,
  IManualTemplateDetalleDTO,
  IManualVersionAddDTO,
  IManualVersionSimpleDTO,
} from "../../models/manuals-and-processes.dto";

type EditorTab = "pasos" | "versiones" | "adjuntos";

interface IPasoForm {
  titulo: FormControl<string>;
  descripcion: FormControl<string>;
  responsableRoleIds: FormControl<string[]>;
  tipoNota: FormControl<number>;
}

interface IEnlaceForm {
  urlEnlace: FormControl<string>;
  esVideo: FormControl<boolean>;
}

interface IVersionForm {
  version: FormControl<string>;
  fechaCambio: FormControl<string>;
  autor: FormControl<string>;
  descripcionCambio: FormControl<string>;
}

import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-manuals-and-processes-editor",
  templateUrl: "./manuals-and-processes-editor.html",

  imports: [
    WebButtonIcon,
    TooltipModule,
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    ButtonModule,
    TagModule,
    CustomInputSelectButton,
    CustomInputSwitch,
    FileUploadModule,
    WebButtonLabel,
    WebButtonLabelDelete,
    WebButtonLabelSave,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputMultiselectSignal,
    DiagramPreviewComponent,
    AppIcon,
  ],
})
export class ManualsAndProcessesEditor implements OnInit {
  private apiS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);

  id = signal<string>("");
  manual = signal<IManualTemplateDetalleDTO | null>(null);
  activeTab = signal<EditorTab>("pasos");

  // Pasos
  pasos = signal<IManualPasoDTO[]>([]);
  selectedPaso = signal<IManualPasoDTO | null>(null);
  isNewPaso = signal(false);
  savingPaso = signal(false);
  uploadingImagen = signal(false);
  creatingDiagram = signal(false);
  savingEnlace = signal(false);

  // Versiones
  versiones = signal<IManualVersionSimpleDTO[]>([]);
  savingVersion = signal(false);
  showVersionForm = signal(false);

  // Adjuntos
  adjuntos = signal<IManualAdjuntoSimpleDTO[]>([]);
  uploadingAdjunto = signal(false);

  roles = signal<ISelectItem[]>([]);

  tipoNotaOpciones = [
    { label: "Normal", value: 0 },
    { label: "Nota", value: 1 },
    { label: "Advertencia", value: 2 },
    { label: "Buenas Practicas", value: 3 },
  ];

  pasoForm: FormGroup<IPasoForm> = this.fb.group({
    titulo: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    descripcion: new FormControl("", { nonNullable: true }),
    responsableRoleIds: new FormControl<string[]>([], { nonNullable: true }),
    tipoNota: new FormControl(0, { nonNullable: true }),
  });

  enlaceForm: FormGroup<IEnlaceForm> = this.fb.group({
    urlEnlace: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    esVideo: new FormControl(false, { nonNullable: true }),
  });

  versionForm: FormGroup<IVersionForm> = this.fb.group({
    version: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaCambio: new FormControl(this.dateS.getDateNow(), {
      nonNullable: true,
    }),
    autor: new FormControl("", { nonNullable: true }),
    descripcionCambio: new FormControl("", { nonNullable: true }),
  });

  ngOnInit(): void {
    this.id.set(this.route.snapshot.params["id"]);
    this.onLoadManual();
    this.onLoadRoles();
  }

  onLoadManual(): void {
    this.apiS
      .onGetItem<IManualTemplateDetalleDTO>(
        Endpoints.ManualsPasos.getById(this.id()),
      )
      .then((result) => {
        if (!result) return;
        this.manual.set(result);
        this.pasos.set(
          [...(result.pasos ?? [])].sort((a, b) => a.orden - b.orden),
        );
        this.versiones.set([...(result.versiones ?? [])]);
        this.adjuntos.set([...(result.adjuntos ?? [])]);
      });
  }

  onLoadRoles(): void {
    this.apiS
      .onGetSelectItem<ISelectItem[]>("roles-for-announcements")
      .then((res) => {
        const groupedRoles = (res || []).reduce((acc: any[], curr) => {
          const groupName = curr.group || "Otros";
          let groupObj = acc.find((g) => g.label === groupName);
          if (!groupObj) {
            groupObj = { label: groupName, items: [] };
            acc.push(groupObj);
          }
          groupObj.items.push(curr);
          return acc;
        }, []);
        this.roles.set(groupedRoles);
      });
  }

  // ----------------------------------------------------------------
  // PASOS
  // ----------------------------------------------------------------

  onDropPaso(event: CdkDragDrop<IManualPasoDTO[]>): void {
    const updated = [...this.pasos()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);
    this.pasos.set(updated);
    const ordenIds = updated.map((p) => p.id);
    this.apiS.onPatch(
      Endpoints.ManualsPasos.reordenarPasos(this.id()),
      ordenIds,
    );
  }

  onSelectPaso(paso: IManualPasoDTO): void {
    this.isNewPaso.set(false);
    this.selectedPaso.set(paso);
    this.pasoForm.patchValue({
      titulo: paso.titulo,
      descripcion: paso.descripcion ?? "",
      responsableRoleIds: paso.responsableRoleIds ?? [],
      tipoNota: paso.tipoNota,
    });
  }

  onNewPaso(): void {
    this.isNewPaso.set(true);
    this.selectedPaso.set(null);
    this.pasoForm.reset({
      titulo: "",
      descripcion: "",
      responsableRoleIds: [],
      tipoNota: 0,
    });
    this.activeTab.set("pasos");
  }

  // ==========================================
  // ENLACES
  // ==========================================

  async onAddEnlace(): Promise<void> {
    if (this.enlaceForm.invalid || !this.selectedPaso()) {
      this.enlaceForm.markAllAsTouched();
      return;
    }
    this.savingEnlace.set(true);
    const raw = this.enlaceForm.getRawValue();
    const body: IManualPasoEnlaceAddDTO = {
      urlEnlace: raw.urlEnlace,
      esVideo: raw.esVideo,
    };

    const pasoId = this.selectedPaso()!.id;
    const res = await this.apiS.onPost<IManualPasoEnlaceDTO>(
      Endpoints.ManualsPasos.addEnlace(this.id(), pasoId),
      body,
    );

    if (res) {
      this.pasos.update((list) =>
        list.map((p) => {
          if (p.id === pasoId) {
            const updated = { ...p, enlaces: [...(p.enlaces || []), res] };
            if (this.selectedPaso()?.id === pasoId) {
              this.selectedPaso.set(updated);
            }
            return updated;
          }
          return p;
        }),
      );
      this.enlaceForm.reset({ urlEnlace: "", esVideo: false });
    }
    this.savingEnlace.set(false);
  }

  async onDeleteEnlace(enlaceId: string): Promise<void> {
    const pasoId = this.selectedPaso()!.id;
    const res = await this.apiS.onDelete(
      Endpoints.ManualsPasos.deleteEnlace(this.id(), pasoId, enlaceId),
    );

    if (res) {
      this.pasos.update((list) =>
        list.map((p) => {
          if (p.id === pasoId) {
            const updated = {
              ...p,
              enlaces: p.enlaces.filter((e) => e.id !== enlaceId),
            };
            if (this.selectedPaso()?.id === pasoId) {
              this.selectedPaso.set(updated);
            }
            return updated;
          }
          return p;
        }),
      );
    }
  }

  async onSavePaso(): Promise<void> {
    if (this.pasoForm.invalid) {
      Object.values(this.pasoForm.controls).forEach((c) => c.markAsTouched());
      return;
    }
    this.savingPaso.set(true);
    const raw = this.pasoForm.getRawValue();

    if (this.isNewPaso()) {
      const body: IManualPasoAddDTO = {
        titulo: raw.titulo,
        descripcion: raw.descripcion || null,
        responsableRoleIds: raw.responsableRoleIds,
        tipoNota: raw.tipoNota,
        orden: this.pasos().length + 1,
      };
      const res = await this.apiS.onPost<IManualPasoDTO>(
        Endpoints.ManualsPasos.addPaso(this.id()),
        body,
      );
      if (res) {
        this.pasos.update((list) => [...list, res]);
        this.onSelectPaso(res);
        this.isNewPaso.set(false);
      }
    } else {
      const paso = this.selectedPaso()!;
      const body: IManualPasoAddDTO = {
        titulo: raw.titulo,
        descripcion: raw.descripcion || null,
        responsableRoleIds: raw.responsableRoleIds,
        tipoNota: raw.tipoNota,
        orden: paso.orden,
      };
      const res = await this.apiS.onPut<IManualPasoDTO>(
        Endpoints.ManualsPasos.updatePaso(this.id(), paso.id),
        body,
      );
      if (res) {
        this.pasos.update((list) =>
          list.map((p) =>
            p.id === paso.id ? { ...res, imagenes: paso.imagenes } : p,
          ),
        );
        this.selectedPaso.set({ ...res, imagenes: paso.imagenes });
      }
    }
    this.savingPaso.set(false);
  }

  onDeletePaso(paso: IManualPasoDTO): void {
    this.apiS
      .onDelete(Endpoints.ManualsPasos.deletePaso(this.id(), paso.id))
      .then((ok) => {
        if (!ok) return;
        this.pasos.update((list) => list.filter((p) => p.id !== paso.id));
        if (this.selectedPaso()?.id === paso.id) {
          this.selectedPaso.set(null);
          this.isNewPaso.set(false);
        }
      });
  }

  // ----------------------------------------------------------------
  // IMAGENES
  // ----------------------------------------------------------------

  onSubirImagen(event: any, uploader: any): void {
    const file = event.files?.[0];
    if (!file) return;
    this.uploadImageFile(file);
    uploader.clear();
  }

  @HostListener("window:paste", ["$event"])
  onPaste(event: ClipboardEvent): void {
    if (
      this.activeTab() !== "pasos" ||
      !this.selectedPaso() ||
      this.isNewPaso()
    )
      return;
    const items = event.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (blob) {
          const ext = item.type === "image/png" ? "png" : "jpg";
          this.uploadImageFile(
            new File([blob], `paste-${Date.now()}.${ext}`, { type: blob.type }),
          );
        }
        break;
      }
    }
  }

  private uploadImageFile(file: File): void {
    const paso = this.selectedPaso();
    if (!paso || this.uploadingImagen()) return;

    this.uploadingImagen.set(true);
    const formData = new FormData();
    formData.append("imagen", file);

    this.apiS
      .onPostFile<IManualPasoImagenDTO>(
        Endpoints.ManualsPasos.subirImagen(this.id(), paso.id),
        formData,
      )
      .then((res) => {
        if (res) {
          const updated = {
            ...paso,
            imagenes: [...(paso.imagenes ?? []), res],
          };
          this.pasos.update((list) =>
            list.map((p) => (p.id === paso.id ? updated : p)),
          );
          this.selectedPaso.set(updated);
        }
        this.uploadingImagen.set(false);
      })
      .catch(() => {
        this.uploadingImagen.set(false);
      });
  }

  onEliminarImagen(imagenId: string): void {
    const paso = this.selectedPaso();
    if (!paso) return;
    this.apiS
      .onDelete(
        Endpoints.ManualsPasos.eliminarImagen(this.id(), paso.id, imagenId),
      )
      .then((ok) => {
        if (!ok) return;
        const updated = {
          ...paso,
          imagenes: paso.imagenes.filter((i) => i.id !== imagenId),
        };
        this.pasos.update((list) =>
          list.map((p) => (p.id === paso.id ? updated : p)),
        );
        this.selectedPaso.set(updated);
      });
  }

  // ----------------------------------------------------------------
  // DIAGRAMA
  // ----------------------------------------------------------------

  async onAbrirDiagrama(paso: IManualPasoDTO): Promise<void> {
    this.creatingDiagram.set(true);
    let diagramaId = paso.diagramaId;

    if (!diagramaId) {
      const res = await this.apiS.onPost<IManualDiagramSimpleDTO>(
        Endpoints.ManualsPasos.crearDiagrama(this.id(), paso.id),
        { nombre: paso.titulo },
      );
      if (!res) {
        this.creatingDiagram.set(false);
        return;
      }
      diagramaId = res.id;
      const updated = { ...paso, diagramaId };
      this.pasos.update((list) =>
        list.map((p) => (p.id === paso.id ? updated : p)),
      );
      this.selectedPaso.set(updated);
    }

    this.creatingDiagram.set(false);
    this.router.navigate(
      ["/library/manuals-and-processes/flowchart-editor", diagramaId],
      { queryParams: { source: "diagram" } },
    );
  }

  // ----------------------------------------------------------------
  // VERSIONES
  // ----------------------------------------------------------------

  async onAgregarVersion(): Promise<void> {
    if (this.versionForm.invalid) {
      Object.values(this.versionForm.controls).forEach((c) =>
        c.markAsTouched(),
      );
      return;
    }
    this.savingVersion.set(true);
    const raw = this.versionForm.getRawValue();
    const body: IManualVersionAddDTO = {
      version: raw.version,
      fechaCambio: raw.fechaCambio,
      autor: raw.autor,
      descripcionCambio: raw.descripcionCambio,
    };
    const res = await this.apiS.onPost<IManualVersionSimpleDTO>(
      Endpoints.ManualsPasos.addVersion(this.id()),
      body,
    );
    if (res) {
      this.versiones.update((list) => [res, ...list]);
      this.versionForm.reset({
        version: "",
        fechaCambio: this.dateS.getDateNow(),
        autor: "",
        descripcionCambio: "",
      });
      this.showVersionForm.set(false);
    }
    this.savingVersion.set(false);
  }

  onEliminarVersion(versionId: string): void {
    this.apiS
      .onDelete(Endpoints.ManualsPasos.deleteVersion(this.id(), versionId))
      .then((ok) => {
        if (ok)
          this.versiones.update((list) =>
            list.filter((v) => v.id !== versionId),
          );
      });
  }

  // ----------------------------------------------------------------
  // ADJUNTOS
  // ----------------------------------------------------------------

  onSubirAdjunto(
    event: any,
    uploader: any,
    nombreInput: HTMLInputElement,
  ): void {
    const file = event.files?.[0];
    const nombre = nombreInput.value?.trim();
    if (!file || !nombre) {
      uploader.clear();
      return;
    }

    this.uploadingAdjunto.set(true);
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("archivo", file);

    this.apiS
      .onPostFile<IManualAdjuntoSimpleDTO>(
        Endpoints.ManualsPasos.addAdjunto(this.id()),
        formData,
      )
      .then((res) => {
        if (res) {
          this.adjuntos.update((list) => [...list, res]);
          nombreInput.value = "";
          uploader.clear();
        }
        this.uploadingAdjunto.set(false);
      })
      .catch(() => {
        this.uploadingAdjunto.set(false);
        uploader.clear();
      });
  }

  onEliminarAdjunto(adjuntoId: string): void {
    this.apiS
      .onDelete(Endpoints.ManualsPasos.deleteAdjunto(this.id(), adjuntoId))
      .then((ok) => {
        if (ok)
          this.adjuntos.update((list) =>
            list.filter((a) => a.id !== adjuntoId),
          );
      });
  }

  // ----------------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------------

  tipoNotaLabel(tipoNota: number): string {
    return (
      this.tipoNotaOpciones.find((o) => o.value === tipoNota)?.label ?? "Normal"
    );
  }

  tipoNotaSeverity(tipoNota: number): string {
    switch (tipoNota) {
      case 1:
        return "info";
      case 2:
        return "warn";
      case 3:
        return "success";
      default:
        return "secondary";
    }
  }

  onGoBack(): void {
    this.router.navigate(ROUTES.BIBLIOTECA.MANUALES_Y_PROCESOS);
  }

  safeUrl(url: string | null): SafeResourceUrl | null {
    if (!url) return null;
    let embedUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      embedUrl = url.replace("youtube.com/watch?v=", "youtube.com/embed/");
      const ampersandPosition = embedUrl.indexOf("&");
      if (ampersandPosition !== -1) {
        embedUrl = embedUrl.substring(0, ampersandPosition);
      }
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
      const questionPosition = embedUrl.indexOf("?");
      if (questionPosition !== -1) {
        embedUrl = embedUrl.substring(0, questionPosition);
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
