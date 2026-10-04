import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AppCheckbox } from "@ui/web/checkbox/checkbox";
import { AppChip } from "@ui/web/chip/chip";
import { Carousel } from "@ui/web/carousel/carousel";
import { AppEditor } from "@ui/web/editor/editor";
import { FileUpload } from "@ui/web/file-upload/file-upload";
import { AppImage } from "@ui/web/image/image";
import { AppImageFallback } from "@ui/web/image-fallback/image-fallback";
import { InfiniteScroll } from "@ui/web/infinite-scroll/infinite-scroll";
import { AppMenu } from "@ui/web/menu/menu";
import { AppPanel } from "@ui/web/panel/panel";
import { AppPopover } from "@ui/web/popover/popover";
import { AppRadioButton } from "@ui/web/radio-button/radio-button";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { Tree } from "@ui/web/tree/tree";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

const LABELS: Record<string, string> = { forms: "Forms & Inputs", data: "Data Display", feedback: "Feedback & Status", navigation: "Navigation", overlays: "Overlays & Surfaces" };

@Component({
  selector: "app-catalog-web-extras",
  imports: [FormsModule, AppCheckbox, AppChip, Carousel, AppEditor, FileUpload, AppImage, AppImageFallback, InfiniteScroll, AppMenu, AppPanel, AppPopover, AppRadioButton, AppSpinner, Tree, AppIcon],
  template: `
    <section class="fadein"><div class="section-header mb-4"><h2 class="text-3xl fw-bold m-0">{{ label() }}</h2></div>
      @switch (item()) {
        @case ("forms") { <div class="row g-3"><div class="col-12 col-md-6"><div class="card"><div class="card-body d-flex flex-column gap-3"><lux-checkbox-web label="Option A" [checked]="true" /><lux-radio-button-web value="1" label="Option 1" /><lux-editor-web placeholder="Escribe aquí..." /><lux-file-upload-web chooseLabel="Subir archivos" [multiple]="true" /></div></div></div></div> }
        @case ("data") { <div class="card"><div class="card-body d-flex flex-column gap-3"><lux-carousel-web [value]="carouselItems" [numVisible]="2" /><lux-tree-web [value]="treeData" /></div></div> }
        @case ("feedback") { <div class="card"><div class="card-body d-flex align-items-center gap-4"><lux-spinner-web [size]="40" /><lux-infinite-scroll-web [loading]="false" threshold="100px" /><lux-chip-web label="Activo" color="primary" /></div></div> }
        @case ("navigation") { <div class="card"><div class="card-body"><lux-menu-web [model]="menuItems" /><lux-image-web src="https://via.placeholder.com/150" alt="Placeholder" width="150" /></div></div> }
        @case ("overlays") { <div class="card"><div class="card-body"><lux-panel-web header="Panel de ejemplo" [toggleable]="true"><lux-popover-web dismissable="true"><p>Contenido del popover.</p></lux-popover-web></lux-panel-web><lux-image-fallback-web src="https://invalid.example/image.png" alt="Fallback" width="150" height="150" /></div></div> }
        @default { <div class="card"><div class="card-body"><lux-icon icon="material-symbols-light:info" /> Demo no disponible.</div></div> }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogWebExtras {
  private readonly route = inject(ActivatedRoute);
  readonly item = signal("");
  readonly label = () => LABELS[this.item()] ?? this.item();
  readonly carouselItems = ["Slide 1", "Slide 2", "Slide 3"];
  readonly treeData = [{ label: "Root", children: [{ label: "Child 1" }, { label: "Child 2" }] }];
  readonly menuItems = [{ label: "Nuevo" }, { label: "Abrir" }, { label: "Guardar" }];
  constructor() { this.route.paramMap.subscribe((params) => this.item.set(params.get("item") ?? "forms")); }
}
