import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ToggleSwitchModule } from "primeng/toggleswitch";

import {
  MobileButtonIconActiveDesactive,
  MobileButtonIconAdd,
  MobileButtonIconConfirm,
  MobileButtonIconDelete,
  MobileButtonIconDownload,
  MobileButtonIconEdit,
  MobileButtonIconSave,
  MobileButtonIconSendEmail,
  MobileButtonIconTracking,
  MobileButtonIconViewPdf,
} from "@ui/buttons/mobile-icon";

import {
  WebButtonLabelActiveDesactive,
  WebButtonLabelAdd,
  WebButtonLabelConfirm,
  WebButtonLabelDelete,
  WebButtonLabelDownload,
  WebButtonLabelEdit,
  WebButtonLabelItem,
  WebButtonLabelSave,
  WebButtonLabelSendEmail,
  WebButtonLabelTracking,
  WebButtonLabelViewPdf,
} from "@ui/buttons/web-label";

import {
  MobileButtonLabelActiveDesactive,
  MobileButtonLabelAdd,
  MobileButtonLabelConfirm,
  MobileButtonLabelDelete,
  MobileButtonLabelDownload,
  MobileButtonLabelEdit,
  MobileButtonLabelItem,
  MobileButtonLabelSave,
  MobileButtonLabelSendEmail,
  MobileButtonLabelTracking,
  MobileButtonLabelViewPdf,
} from "@ui/buttons/mobile-label";

import {
  WebButtonIconActiveDesactive,
  WebButtonIconAdd,
  WebButtonIconConfirm,
  WebButtonIconDelete,
  WebButtonIconDownload,
  WebButtonIconEdit,
  WebButtonIconSave,
  WebButtonIconSendEmail,
  WebButtonIconTracking,
  WebButtonIconViewPdf,
} from "@ui/buttons/web-icon";

type WebSize = "sm" | "md" | "lg";
type IonicSize = "small" | "default" | "large";

interface SemanticEntry {
  id: string;
  selector: string;
  defaultSeverity: string;
  defaultVariant: string;
}

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
  },
];

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
  },
];

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
  },
];

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
  },
];

@Component({
  selector: "app-button-catalog",
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    SelectButtonModule,
    ToggleSwitchModule,
    MobileButtonIconAdd,
    MobileButtonIconEdit,
    MobileButtonIconDelete,
    MobileButtonIconSave,
    MobileButtonIconDownload,
    MobileButtonIconConfirm,
    MobileButtonIconSendEmail,
    MobileButtonIconViewPdf,
    MobileButtonIconTracking,
    MobileButtonIconActiveDesactive,
    WebButtonLabelAdd,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelSave,
    WebButtonLabelDownload,
    WebButtonLabelConfirm,
    WebButtonLabelSendEmail,
    WebButtonLabelViewPdf,
    WebButtonLabelTracking,
    WebButtonLabelItem,
    WebButtonLabelActiveDesactive,
    MobileButtonLabelAdd,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelSave,
    MobileButtonLabelDownload,
    MobileButtonLabelConfirm,
    MobileButtonLabelSendEmail,
    MobileButtonLabelViewPdf,
    MobileButtonLabelTracking,
    MobileButtonLabelItem,
    MobileButtonLabelActiveDesactive,
    WebButtonIconAdd,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconSave,
    WebButtonIconDownload,
    WebButtonIconConfirm,
    WebButtonIconSendEmail,
    WebButtonIconViewPdf,
    WebButtonIconTracking,
    WebButtonIconActiveDesactive,
  ],
  template: `
    <section class="fadein">
      <!-- ── Controls ─────────────────────────────────────────────── -->
      <p-card class="mb-5">
        <div class="flex gap-5 flex-wrap align-items-center">
          <div>
            <label class="text-xs font-semibold text-color-secondary block mb-2"
              >Size (Web)</label
            >
            <p-selectbutton
              [options]="webSizeCtrl"
              [ngModel]="webSize()"
              (ngModelChange)="webSize.set($event)"
              optionLabel="label"
              optionValue="value"
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-color-secondary block mb-2"
              >Size (Ionic)</label
            >
            <p-selectbutton
              [options]="ionicSizeCtrl"
              [ngModel]="ionicSize()"
              (ngModelChange)="ionicSize.set($event)"
              optionLabel="label"
              optionValue="value"
            />
          </div>
          <div class="flex align-items-center gap-2">
            <p-toggleswitch
              [ngModel]="isDisabled()"
              (ngModelChange)="isDisabled.set($event)"
              inputId="btn-dis"
            />
            <label for="btn-dis" class="font-semibold text-sm">Disabled</label>
          </div>
          <div class="flex align-items-center gap-2">
            <p-toggleswitch
              [ngModel]="isLoading()"
              (ngModelChange)="isLoading.set($event)"
              inputId="btn-load"
            />
            <label for="btn-load" class="font-semibold text-sm">Loading</label>
          </div>
        </div>
      </p-card>

      <!-- ══════════════════════════════════════════════════════════════
       1. buttons-icon-label  (il-*)  —  Icon + Label  Web
       ══════════════════════════════════════════════════════════════ -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-label <code class="ml-2 text-base">il-button-*</code>
          </h3>
          <small class="text-color-secondary"
            >Icon + Label · Web (PrimeNG)</small
          >
        </div>

        <p-card class="mb-4" header="Paleta completa de colores">
          <div class="flex flex-column gap-3">
            @for (variant of webVariants; track variant; let first = $first) {
              <div class="flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ variant }}</code>
                <div class="flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <il-button-add
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
        </p-card>

        <p-table [value]="ilSemantic" dataKey="id">
          <ng-template #caption>
            Semántica por defecto
            <small class="text-color-secondary ml-2"
              >(sin overrides de color/variante)</small
            >
          </ng-template>
          <ng-template #header>
            <tr>
              <th style="width:160px">Vista previa</th>
              <th style="width:280px">Selector</th>
              <th style="width:200px">severity / variant</th>
              <th>Ejemplo de uso</th>
            </tr>
          </ng-template>
          <ng-template #body let-r>
            <tr>
              <td>
                @switch (r.id) {
                  @case ("il-add") {
                    <il-button-add
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-edit") {
                    <il-button-edit
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-delete") {
                    <il-button-delete
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-save") {
                    <il-button-save
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-download") {
                    <il-button-download
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-confirm") {
                    <il-button-confirm
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-send-email") {
                    <il-button-send-email
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-view-pdf") {
                    <il-button-view-pdf
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-tracking") {
                    <il-button-tracking
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-item") {
                    <il-button-item
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-active-t") {
                    <il-button-active-desactive
                      [state]="true"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("il-active-f") {
                    <il-button-active-desactive
                      [state]="false"
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
                <span class="catalog-badge catalog-badge--variant ml-1">{{
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
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- ══════════════════════════════════════════════════════════════
       2. buttons-icon-web  (iw-*)  —  Icon-only  Web
       ══════════════════════════════════════════════════════════════ -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-web <code class="ml-2 text-base">iw-button-*</code>
          </h3>
          <small class="text-color-secondary">Solo icono · Web (PrimeNG)</small>
        </div>

        <p-card class="mb-4" header="Paleta completa de colores">
          <div class="flex flex-column gap-3">
            @for (variant of webVariants; track variant; let first = $first) {
              <div class="flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ variant }}</code>
                <div class="flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <iw-button-add
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
        </p-card>

        <p-table [value]="iwSemantic" dataKey="id">
          <ng-template #caption>Semántica por defecto</ng-template>
          <ng-template #header>
            <tr>
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
                    <iw-button-add
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-edit") {
                    <iw-button-edit
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-delete") {
                    <iw-button-delete
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-save") {
                    <iw-button-save
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-download") {
                    <iw-button-download
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-confirm") {
                    <iw-button-confirm
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-send-email") {
                    <iw-button-send-email
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-view-pdf") {
                    <iw-button-view-pdf
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-tracking") {
                    <iw-button-tracking
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-active-t") {
                    <iw-button-active-desactive
                      [state]="true"
                      [size]="webSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("iw-active-f") {
                    <iw-button-active-desactive
                      [state]="false"
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
                <span class="catalog-badge catalog-badge--variant ml-1">{{
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
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- ══════════════════════════════════════════════════════════════
       3. buttons-icon-ionic  (ii-*)  —  Icon-only  Ionic
       ══════════════════════════════════════════════════════════════ -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-ionic <code class="ml-2 text-base">ii-button-*</code>
          </h3>
          <small class="text-color-secondary">Solo icono · Ionic</small>
        </div>

        <p-card class="mb-4" header="Paleta completa de colores">
          <div class="flex flex-column gap-3">
            @for (fill of ionicFills; track fill; let first = $first) {
              <div class="flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ fill }}</code>
                <div class="flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <ii-button-add
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
        </p-card>

        <p-table [value]="iiSemantic" dataKey="id">
          <ng-template #caption>Semántica por defecto</ng-template>
          <ng-template #header>
            <tr>
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
                    <ii-button-add
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-edit") {
                    <ii-button-edit
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-delete") {
                    <ii-button-delete
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-save") {
                    <ii-button-save
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-download") {
                    <ii-button-download
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-confirm") {
                    <ii-button-confirm
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-send-email") {
                    <ii-button-send-email
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-view-pdf") {
                    <ii-button-view-pdf
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-tracking") {
                    <ii-button-tracking
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-active-t") {
                    <ii-button-active-desactive
                      [state]="true"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ii-active-f") {
                    <ii-button-active-desactive
                      [state]="false"
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
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- ══════════════════════════════════════════════════════════════
       4. buttons-icon-label-ionic  (ili-*)  —  Icon + Label  Ionic
       ══════════════════════════════════════════════════════════════ -->
      <div class="catalog-section mb-6">
        <div class="catalog-section-header">
          <h3 class="m-0">
            buttons-icon-label-ionic
            <code class="ml-2 text-base">ili-button-*</code>
          </h3>
          <small class="text-color-secondary">Icon + Label · Ionic</small>
        </div>

        <p-card class="mb-4" header="Paleta completa de colores">
          <div class="flex flex-column gap-3">
            @for (fill of ionicFills; track fill; let first = $first) {
              <div class="flex align-items-start gap-3">
                <code class="catalog-variant-tag mt-1">{{ fill }}</code>
                <div class="flex gap-2 flex-wrap">
                  @for (sev of severities; track sev) {
                    <div class="catalog-color-cell">
                      <ili-button-add
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
        </p-card>

        <p-table [value]="iliSemantic" dataKey="id">
          <ng-template #caption>Semántica por defecto</ng-template>
          <ng-template #header>
            <tr>
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
                    <ili-button-add
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-edit") {
                    <ili-button-edit
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-delete") {
                    <ili-button-delete
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-save") {
                    <ili-button-save
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-download") {
                    <ili-button-download
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-confirm") {
                    <ili-button-confirm
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-send-email") {
                    <ili-button-send-email
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-view-pdf") {
                    <ili-button-view-pdf
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-tracking") {
                    <ili-button-tracking
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-item") {
                    <ili-button-item
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-active-t") {
                    <ili-button-active-desactive
                      [state]="true"
                      [size]="ionicSize()"
                      [disabled]="isDisabled()"
                      [loading]="isLoading()"
                    />
                  }
                  @case ("ili-active-f") {
                    <ili-button-active-desactive
                      [state]="false"
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
            </tr>
          </ng-template>
        </p-table>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    "contrast",
  ];
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
