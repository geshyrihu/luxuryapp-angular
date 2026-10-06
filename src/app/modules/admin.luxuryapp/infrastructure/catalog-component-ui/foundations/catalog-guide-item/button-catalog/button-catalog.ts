import { ButtonMobile } from "@ui/buttons/mobile";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppSelectButton } from "@ui/web/select-button/select-button";
import { AppToggleSwitch } from "@ui/web/toggle-switch/toggle-switch";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";


import { ButtonWeb } from "@ui/buttons/web";


import { SemanticEntry } from "./interfaces/semantic-entry.interface";

type WebSize = "sm" | "md" | "lg";
type IonicSize = "small" | "default" | "large";

const IL_SEMANTIC: SemanticEntry[] = [
  {
    id: "il-add",
    selector: "il-button-add",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "il-edit",
    selector: "il-button-edit",
    defaultSeverity: "info",
    defaultVariant: "ghost",
  },
  {
    id: "il-delete",
    selector: "il-button-delete",
    defaultSeverity: "danger",
    defaultVariant: "ghost",
  },
  {
    id: "il-save",
    selector: "il-button-save",
    defaultSeverity: "success",
    defaultVariant: "outline",
  },
  {
    id: "il-download",
    selector: "il-button-download",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  },
  {
    id: "il-confirm",
    selector: "il-button-confirm",
    defaultSeverity: "success",
    defaultVariant: "ghost",
  },
  {
    id: "il-send-email",
    selector: "il-button-send-email",
    defaultSeverity: "info",
    defaultVariant: "ghost",
  },
  {
    id: "il-view-pdf",
    selector: "il-button-view-pdf",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  },
  {
    id: "il-tracking",
    selector: "il-button-tracking",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "il-item",
    selector: "il-button-item",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  },
  {
    id: "il-active-t",
    selector: "il-button-active-desactive [state]=true",
    defaultSeverity: "secondary",
    defaultVariant: "outline",
  },
  {
    id: "il-active-f",
    selector: "il-button-active-desactive [state]=false",
    defaultSeverity: "secondary",
    defaultVariant: "outline",
  }];

const IW_SEMANTIC: SemanticEntry[] = [
  {
    id: "iw-add",
    selector: "iw-button-add",
    defaultSeverity: "primary",
    defaultVariant: "ghost",
  },
  {
    id: "iw-edit",
    selector: "iw-button-edit",
    defaultSeverity: "info",
    defaultVariant: "ghost",
  },
  {
    id: "iw-delete",
    selector: "iw-button-delete",
    defaultSeverity: "danger",
    defaultVariant: "ghost",
  },
  {
    id: "iw-save",
    selector: "iw-button-save",
    defaultSeverity: "success",
    defaultVariant: "ghost",
  },
  {
    id: "iw-download",
    selector: "iw-button-download",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  },
  {
    id: "iw-confirm",
    selector: "iw-button-confirm",
    defaultSeverity: "success",
    defaultVariant: "ghost",
  },
  {
    id: "iw-send-email",
    selector: "iw-button-send-email",
    defaultSeverity: "info",
    defaultVariant: "ghost",
  },
  {
    id: "iw-view-pdf",
    selector: "iw-button-view-pdf",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  },
  {
    id: "iw-tracking",
    selector: "iw-button-tracking",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "iw-active-t",
    selector: "iw-button-active-desactive [state]=true",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  },
  {
    id: "iw-active-f",
    selector: "iw-button-active-desactive [state]=false",
    defaultSeverity: "secondary",
    defaultVariant: "ghost",
  }];

const II_SEMANTIC: SemanticEntry[] = [
  {
    id: "ii-add",
    selector: "ii-button-add",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-edit",
    selector: "ii-button-edit",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-delete",
    selector: "ii-button-delete",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-save",
    selector: "ii-button-save",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-download",
    selector: "ii-button-download",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-confirm",
    selector: "ii-button-confirm",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-send-email",
    selector: "ii-button-send-email",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-view-pdf",
    selector: "ii-button-view-pdf",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-tracking",
    selector: "ii-button-tracking",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-active-t",
    selector: "ii-button-active-desactive [state]=true",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ii-active-f",
    selector: "ii-button-active-desactive [state]=false",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  }];

const ILI_SEMANTIC: SemanticEntry[] = [
  {
    id: "ili-add",
    selector: "ili-button-add",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-edit",
    selector: "ili-button-edit",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-delete",
    selector: "ili-button-delete",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-save",
    selector: "ili-button-save",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-download",
    selector: "ili-button-download",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-confirm",
    selector: "ili-button-confirm",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-send-email",
    selector: "ili-button-send-email",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-view-pdf",
    selector: "ili-button-view-pdf",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-tracking",
    selector: "ili-button-tracking",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-item",
    selector: "ili-button-item",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-active-t",
    selector: "ili-button-active-desactive [state]=true",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  },
  {
    id: "ili-active-f",
    selector: "ili-button-active-desactive [state]=false",
    defaultSeverity: "primary",
    defaultVariant: "solid",
  }];

@Component({
  selector: "app-button-catalog",
  imports: [ButtonMobile, 
    CommonModule,
    FormsModule,
    AppTable,
    AppSelectButton,
    AppToggleSwitch,
    ButtonWeb],
  template: `
    <section class="fadein">
      <!-- -- Controls ----------------------------------------------- -->
      <div class="card mb-5">
        <div class="d-flex gap-5 flex-wrap align-items-center">
          <div>
            <label
              class="text-xs font-semibold text-color-secondary d-block mb-2"
              >Size (Web)</label
            >
            <lux-select-button-web
              [options]="webSizeCtrl"
              [value]="webSize()"
              (valueChange)="webSize.set($event)"
            />
          </div>
          <div>
            <label
              class="text-xs font-semibold text-color-secondary d-block mb-2"
              >Size (Ionic)</label
            >
            <lux-select-button-web
              [options]="ionicSizeCtrl"
              [value]="ionicSize()"
              (valueChange)="ionicSize.set($event)"
            />
          </div>
          <div class="d-flex align-items-center gap-2">
            <lux-toggle-switch-web
              [checked]="isDisabled()"
              (checkedChange)="isDisabled.set($event)"
              inputId="btn-dis"
            />
            <label for="btn-dis" class="font-semibold text-sm">Disabled</label>
          </div>
          <div class="d-flex align-items-center gap-2">
            <lux-toggle-switch-web
              [checked]="isLoading()"
              (checkedChange)="isLoading.set($event)"
              inputId="btn-load"
            />
            <label for="btn-load" class="font-semibold text-sm">Loading</label>
          </div>
        </div>
      </div>

      <!-- --------------------------------------------------------------
       1. buttons-icon-label  (il-*)  é  Icon + Label  Web
       -------------------------------------------------------------- -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-label <code class="ms-2 text-base">il-button-*</code>
          </h3>
          <small class="text-color-secondary"
            >Icon + Label é Web (Bootstrap)</small
          >
        </div>

        <div class="card mb-4">
          <div class="card-header">Paleta completa de colores</div>
          <div class="d-flex flex-column gap-3">
            @for (variant of webVariants; track variant; let first = $first) {
              <div class="d-flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ variant }}</code>
                <div class="d-flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <lux-button-web kind="add"
                        [severity]="$any(sev)"
                        [variant]="$any(variant)"
                        [size]="webSize()"
                        [disabled]="isDisabled()"
                        [loading]="isLoading()"
                      />
                      <span
                        class="catalog-color-label"
                        [style.visibility]="first ? 'visible' : 'hidden'"
                        >{{ sev }}</span
                      >
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <lux-table [value]="ilSemantic" dataKey="id">
          <ng-template #caption>
            Semóntica por defecto
            <small class="text-color-secondary ms-2"
              >(sin overrides de color/variante)</small
            >
          </ng-template>
          <ng-template #header
            ><tr>
              <th style="width:160px">Vista previa</th>
              <th style="width:280px">Selector</th>
              <th style="width:200px">severity / variant</th>
              <th>Ejemplo de uso</th>
            </tr></ng-template
          ><ng-template #body let-r>
            <tr>
              <td>
                @switch (r.id) {
                  @case ("il-add") {
                    <lux-button-web kind="add"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-edit") {
                    <lux-button-web kind="edit"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-delete") {
                    <lux-button-web kind="delete"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-save") {
                    <lux-button-web
                      kind="save"
                      type="button"
                      severity="info"
                      variant="soft"
                      displayMode="both"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-download") {
                    <lux-button-web kind="download"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-confirm") {
                    <lux-button-web kind="confirm"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-send-email") {
                    <lux-button-web kind="send-email"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-view-pdf") {
                    <lux-button-web kind="view-pdf"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-tracking") {
                    <lux-button-web kind="tracking"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-item") {
                    <lux-button-web kind="item"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-active-t") {
                    <lux-button-web kind="active-desactive"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                    <small class="text-color-secondary d-block mt-1"
                      >[state] retirado: kind="active-desactive" no distingue
                      estado activo/inactivo.</small
                    >
                  }
                  @case ("il-active-f") {
                    <lux-button-web kind="active-desactive"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                }
              </td>
              <td>
                <code>{{ r.selector }}</code>
              </td>
              <td>
                <span class="catalog-badge catalog-badge--severity">{{
                  r.defaultSeverity
                }}</span>
                <span class="catalog-badge catalog-badge--variant ms-1">{{
                  r.defaultVariant
                }}</span>
              </td>
              <td>
                <code class="text-xs"
                  >&lt;il-button-*<br />&nbsp;&nbsp;severity="{{
                    r.defaultSeverity
                  }}"<br />&nbsp;&nbsp;variant="{{ r.defaultVariant }}"
                  /&gt;</code
                >
              </td>
            </tr></ng-template
          ></lux-table
        >
      </div>

      <!-- --------------------------------------------------------------
       2. buttons-icon-web  (iw-*)  é  Icon-only  Web
       -------------------------------------------------------------- -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-web <code class="ms-2 text-base">iw-button-*</code>
          </h3>
          <small class="text-color-secondary"
            >Solo icono é Web (Bootstrap)</small
          >
        </div>

        <div class="card mb-4">
          <div class="card-header">Paleta completa de colores</div>
          <div class="d-flex flex-column gap-3">
            @for (variant of webVariants; track variant; let first = $first) {
              <div class="d-flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ variant }}</code>
                <div class="d-flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <lux-button-web kind="add" displayMode="icon"
                        [severity]="$any(sev)"
                        [variant]="$any(variant)"
                        [size]="webSize()"
                        [disabled]="isDisabled()"
                        [loading]="isLoading()"
                      />
                      <span
                        class="catalog-color-label"
                        [style.visibility]="first ? 'visible' : 'hidden'"
                        >{{ sev }}</span
                      >
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <lux-table [value]="iwSemantic" dataKey="id">
          <ng-template #caption>Semóntica por defecto</ng-template>
          <ng-template #header
            ><tr>
              <th style="width:100px">Vista previa</th>
              <th style="width:280px">Selector</th>
              <th style="width:200px">severity / variant</th>
              <th>Ejemplo de uso</th>
            </tr>
          </ng-template>
          <ng-template #body let-r>
            <tr>
              <td>
                @switch (r.id) {
                  @case ("iw-add") {
                    <lux-button-web kind="add" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-edit") {
                    <lux-button-web kind="edit" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-delete") {
                    <lux-button-web kind="delete" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-save") {
                    <lux-button-web kind="save" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-download") {
                    <lux-button-web kind="download" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-confirm") {
                    <lux-button-web kind="confirm" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-send-email") {
                    <lux-button-web kind="send-email" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-view-pdf") {
                    <lux-button-web kind="view-pdf" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-tracking") {
                    <lux-button-web kind="tracking" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-active-t") {
                    <lux-button-web kind="active-desactive" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                    <small class="text-color-secondary d-block mt-1"
                      >[state] retirado: kind="active-desactive" no distingue
                      estado activo/inactivo.</small
                    >
                  }
                  @case ("iw-active-f") {
                    <lux-button-web kind="active-desactive" displayMode="icon"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                }
              </td>
              <td>
                <code>{{ r.selector }}</code>
              </td>
              <td>
                <span class="catalog-badge catalog-badge--severity">{{
                  r.defaultSeverity
                }}</span>
                <span class="catalog-badge catalog-badge--variant ms-1">{{
                  r.defaultVariant
                }}</span>
              </td>
              <td>
                <code class="text-xs"
                  >&lt;iw-button-*<br />&nbsp;&nbsp;severity="{{
                    r.defaultSeverity
                  }}"<br />&nbsp;&nbsp;variant="{{ r.defaultVariant }}"
                  /&gt;</code
                >
              </td>
            </tr></ng-template
          ></lux-table
        >
      </div>

      <!-- --------------------------------------------------------------
       3. buttons-icon-ionic  (ii-*)  é  Icon-only  Ionic
       -------------------------------------------------------------- -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-ionic <code class="ms-2 text-base">ii-button-*</code>
          </h3>
          <small class="text-color-secondary">Solo icono é Ionic</small>
        </div>

        <div class="card mb-4">
          <div class="card-header">Paleta completa de colores</div>
          <div class="d-flex flex-column gap-3">
            @for (fill of ionicFills; track fill; let first = $first) {
              <div class="d-flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ fill }}</code>
                <div class="d-flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <lux-button-mobile kind="add" displayMode="icon"
                        [color]="$any(sev)"
                        [fill]="$any(fill)"
                        [size]="ionicSize()"
                        [disabled]="isDisabled()"
                        [loading]="isLoading()"
                      />
                      <span
                        class="catalog-color-label"
                        [style.visibility]="first ? 'visible' : 'hidden'"
                        >{{ sev }}</span
                      >
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <lux-table [value]="iiSemantic" dataKey="id">
          <ng-template #caption>Semóntica por defecto</ng-template>
          <ng-template #header
            ><tr>
              <th style="width:100px">Vista previa</th>
              <th style="width:280px">Selector</th>
              <th>Ejemplo de uso</th>
            </tr>
          </ng-template>
          <ng-template #body let-r>
            <tr>
              <td>
                @switch (r.id) {
                  @case ("ii-add") {
                    <lux-button-mobile kind="add" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-edit") {
                    <lux-button-mobile kind="edit" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-delete") {
                    <lux-button-mobile kind="delete" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-save") {
                    <lux-button-mobile kind="save" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-download") {
                    <lux-button-mobile kind="download" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-confirm") {
                    <lux-button-mobile kind="confirm" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-send-email") {
                    <lux-button-mobile kind="send-email" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-view-pdf") {
                    <lux-button-mobile kind="view-pdf" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-tracking") {
                    <lux-button-mobile kind="tracking" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-active-t") {
                    <lux-button-mobile kind="active-desactive" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                    <small class="text-color-secondary d-block mt-1"
                      >[state] retirado: kind="active-desactive" no distingue
                      estado activo/inactivo.</small
                    >
                  }
                  @case ("ii-active-f") {
                    <lux-button-mobile kind="active-desactive" displayMode="icon"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                }
              </td>
              <td>
                <code>{{ r.selector }}</code>
              </td>
              <td>
                <code class="text-xs"
                  >&lt;ii-button-*<br />&nbsp;&nbsp;color="primary"<br />&nbsp;&nbsp;fill="solid"
                  /&gt;</code
                >
              </td>
            </tr></ng-template
          ></lux-table
        >
      </div>

      <!-- --------------------------------------------------------------
       4. buttons-icon-label-ionic  (ili-*)  é  Icon + Label  Ionic
       -------------------------------------------------------------- -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-label-ionic
            <code class="ms-2 text-base">ili-button-*</code>
          </h3>
          <small class="text-color-secondary">Icon + Label é Ionic</small>
        </div>

        <div class="card mb-4">
          <div class="card-header">Paleta completa de colores</div>
          <div class="d-flex flex-column gap-3">
            @for (fill of ionicFills; track fill; let first = $first) {
              <div class="d-flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ fill }}</code>
                <div class="d-flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <lux-button-mobile kind="add"
                        [color]="$any(sev)"
                        [fill]="$any(fill)"
                        [size]="ionicSize()"
                        [disabled]="isDisabled()"
                        [loading]="isLoading()"
                      />
                      <span
                        class="catalog-color-label"
                        [style.visibility]="first ? 'visible' : 'hidden'"
                        >{{ sev }}</span
                      >
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <lux-table [value]="iliSemantic" dataKey="id">
          <ng-template #caption>Semóntica por defecto</ng-template>
          <ng-template #header
            ><tr>
              <th style="width:160px">Vista previa</th>
              <th style="width:280px">Selector</th>
              <th>Ejemplo de uso</th>
            </tr>
          </ng-template>
          <ng-template #body let-r>
            <tr>
              <td>
                @switch (r.id) {
                  @case ("ili-add") {
                    <lux-button-mobile kind="add"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-edit") {
                    <lux-button-mobile kind="edit"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-delete") {
                    <lux-button-mobile kind="delete"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-save") {
                    <lux-button-mobile kind="save"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-download") {
                    <lux-button-mobile kind="download"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-confirm") {
                    <lux-button-mobile kind="confirm"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-send-email") {
                    <lux-button-mobile kind="send-email"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-view-pdf") {
                    <lux-button-mobile kind="view-pdf"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-tracking") {
                    <lux-button-mobile kind="tracking"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-item") {
                    <lux-button-mobile kind="item"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-active-t") {
                    <lux-button-mobile kind="active-desactive"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                    <small class="text-color-secondary d-block mt-1"
                      >[state] retirado: kind="active-desactive" no distingue
                      estado activo/inactivo.</small
                    >
                  }
                  @case ("ili-active-f") {
                    <lux-button-mobile kind="active-desactive"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                }
              </td>
              <td>
                <code>{{ r.selector }}</code>
              </td>
              <td>
                <code class="text-xs"
                  >&lt;ili-button-*<br />&nbsp;&nbsp;color="primary"<br />&nbsp;&nbsp;fill="solid"
                  /&gt;</code
                >
              </td>
            </tr></ng-template
          ></lux-table
        >
      </div>
    </section>
  `,
  styles: [
    `
      .catalog-section-header {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid var(--surface-border);
      }
      .catalog-variant-tag {
        display: inline-block;
        min-width: 4.5rem;
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        flex-shrink: 0;
      }
      .catalog-color-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }
      .catalog-color-label {
        font-size: 0.65rem;
        font-family: monospace;
        color: var(--text-color-secondary);
        white-space: nowrap;
        line-height: 1;
      }
      .catalog-badge {
        display: inline-block;
        padding: 0.1rem 0.5rem;
        border-radius: 4px;
        font-size: 0.72rem;
        font-weight: 600;
      }
      .catalog-badge--severity {
        background: var(--primary-50, #eff6ff);
        color: var(--primary-700, #1d4ed8);
        border: 1px solid var(--primary-200, #bfdbfe);
      }
      .catalog-badge--variant {
        background: var(--surface-100);
        color: var(--text-color-secondary);
        border: 1px solid var(--surface-border);
      }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonCatalog {
  protected readonly severities = [
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "help",
    "contrast"];
  protected readonly webVariants = ["solid", "outline", "ghost", "text"];
  protected readonly ionicFills = ["solid", "outline", "clear"];

  protected readonly webSizeCtrl = ["sm", "md", "lg"].map((s) => ({
    label: s,
    value: s,
  }));
  protected readonly ionicSizeCtrl = ["small", "default", "large"].map((s) => ({
    label: s,
    value: s,
  }));

  webSize = signal<WebSize>("md");
  ionicSize = signal<IonicSize>("default");
  isDisabled = signal(false);
  isLoading = signal(false);

  protected readonly ilSemantic = IL_SEMANTIC;
  protected readonly iwSemantic = IW_SEMANTIC;
  protected readonly iiSemantic = II_SEMANTIC;
  protected readonly iliSemantic = ILI_SEMANTIC;
}
