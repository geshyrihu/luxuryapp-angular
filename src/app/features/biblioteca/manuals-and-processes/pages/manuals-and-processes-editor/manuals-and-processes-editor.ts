import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { SelectButtonModule } from "primeng/selectbutton";
import { TagModule } from "primeng/tag";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DiagramPreviewComponent } from "../../components/diagram-preview";
import {
  IManualAdjuntoSimpleDTO,
  IManualDiagramSimpleDTO,
  IManualPasoAddDTO,
  IManualPasoDTO,
  IManualPasoImagenDTO,
  IManualTemplateDetalleDTO,
  IManualVersionAddDTO,
  IManualVersionSimpleDTO,
} from "../../models/manuals-and-processes.dto";

type EditorTab = "pasos" | "versiones" | "adjuntos";

interface IPasoForm {
  titulo: FormControl<string>;
  descripcion: FormControl<string>;
  responsableRoleId: FormControl<string | null>;
  tipoNota: FormControl<number>;
}

interface IVersionForm {
  version: FormControl<string>;
  fechaCambio: FormControl<string>;
  autor: FormControl<string>;
  descripcionCambio: FormControl<string>;
}

@Component({
  selector: "app-manuals-and-processes-editor",
  templateUrl: "./manuals-and-processes-editor.html",

  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    ButtonModule,
    TagModule,
    SelectButtonModule,
    FileUploadModule,
    CustomButtonSave,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSelectSignal,
    DiagramPreviewComponent,
  ],
})
export class ManualsAndProcessesEditor implements OnInit {
  private apiS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

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
    responsableRoleId: new FormControl<string | null>(null),
    tipoNota: new FormControl(0, { nonNullable: true }),
  });

  versionForm: FormGroup<IVersionForm> = this.fb.group({
    version: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaCambio: new FormControl(new Date().toISOString().substring(0, 10), {
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
      .then((result) => this.roles.set(result ?? []));
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
      responsableRoleId: paso.responsableRoleId,
      tipoNota: paso.tipoNota,
    });
  }

  onNewPaso(): void {
    this.isNewPaso.set(true);
    this.selectedPaso.set(null);
    this.pasoForm.reset({
      titulo: "",
      descripcion: "",
      responsableRoleId: null,
      tipoNota: 0,
    });
    this.activeTab.set("pasos");
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
        responsableRoleId: raw.responsableRoleId,
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
        responsableRoleId: raw.responsableRoleId,
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
    const paso = this.selectedPaso();
    if (!paso) return;
    const file = event.files?.[0];
    if (!file) return;

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
          uploader.clear();
        }
        this.uploadingImagen.set(false);
      })
      .catch(() => {
        this.uploadingImagen.set(false);
        uploader.clear();
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
        fechaCambio: new Date().toISOString().substring(0, 10),
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
    this.router.navigate(["/library/manuals-and-processes"]);
  }
}
