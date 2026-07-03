import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import {
  CustomBtnActiveDesactive,
  CustomButton,
  CustomButtonAdd,
  CustomButtonConfirm,
  CustomButtonDelete,
  CustomButtonDownload,
  CustomButtonEdit,
  CustomButtonItem,
  CustomButtonSave,
  CustomButtonSendEmail,
  CustomButtonTracking,
  CustomButtonViewPdf,
} from "src/app/core/components/buttons/legacy/buttons";
import {
  CustomInputAutoComplete,
  CustomInputAutoMultiple,
  CustomInputCheckSignal,
  CustomInputCurrencySignal,
  CustomInputDateSignal,
  CustomInputDateTimeNative,
  CustomInputDateTimeSignal,
  CustomInputDecimal,
  CustomInputFile,
  CustomInputHour,
  CustomInputImg,
  CustomInputMaskSignal,
  CustomInputMonth,
  CustomInputMultiselectSignal,
  CustomInputNgSelect,
  CustomInputNumberSignal,
  CustomInputPassword,
  CustomInputPhonePrefix,
  CustomInputSelectBool,
  CustomInputSelectPrefix,
  CustomInputSelectSignal,
  CustomInputSwitch,
  CustomInputTextAreaSignal,
  CustomInputTextSignal,
  CustomInputTime,
  CustomInputUrl,
  CustomSearchInput,
} from "src/app/core/components/inputs/web";

@Component({
  selector: "app-web-core-coverage",
  standalone: true,
  styles: [
    `
      .web-showcase {
        display: grid;
        gap: 1.5rem;
      }

      .web-hero {
        padding: 1.5rem;
        border-radius: 1.5rem;
        background:
          radial-gradient(
            circle at top left,
            color-mix(in srgb, var(--ds-primary) 14%, transparent),
            transparent 48%
          ),
          linear-gradient(
            180deg,
            var(--ds-bg-surface, #ffffff),
            var(--ds-bg-sunken, #f8fafc)
          );
        border: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 78%, transparent);
        box-shadow: var(--ds-shadow-sm, 0 10px 30px rgba(15, 23, 42, 0.06));
      }

      .web-hero__eyebrow,
      .web-panel__eyebrow {
        display: inline-flex;
        margin-bottom: 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ds-text-secondary, #64748b);
      }

      .web-hero__title,
      .web-panel__title {
        margin: 0;
        color: var(--ds-text-primary, #0f172a);
      }

      .web-hero__copy,
      .web-panel__copy {
        margin: 0.75rem 0 0;
        max-width: 64rem;
        color: var(--ds-text-secondary, #64748b);
        line-height: 1.65;
      }

      .web-panel {
        padding: 1.5rem;
        border-radius: 1.5rem;
        background: var(--ds-bg-surface, #ffffff);
        border: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 82%, transparent);
        box-shadow: var(--ds-shadow-xs, 0 8px 24px rgba(15, 23, 42, 0.05));
      }

      .web-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .web-screen {
        display: grid;
        gap: 0.75rem;
        min-height: 320px;
        padding: 1rem;
        border-radius: 1.25rem;
        background: linear-gradient(
          180deg,
          var(--ds-bg-surface, #ffffff),
          var(--ds-bg-sunken, #f8fafc)
        );
        border: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 78%, transparent);
        box-shadow: var(--ds-shadow-xs, 0 8px 24px rgba(15, 23, 42, 0.06));
      }

      .web-screen--dark {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ds-text-primary, #0f172a) 96%, black),
          color-mix(in srgb, var(--ds-text-primary, #0f172a) 88%, black)
        );
        border-color: color-mix(in srgb, var(--ds-primary) 16%, transparent);
        color: var(--ds-text-on-primary, #ffffff);
      }

      .web-screen__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .web-screen__meta {
        display: grid;
        gap: 0.25rem;
      }

      .web-screen__eyebrow {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ds-text-muted, #94a3b8);
      }

      .web-screen__title {
        font-size: 1rem;
        font-weight: 700;
        color: inherit;
      }

      .web-screen__badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2rem;
        padding: 0 0.75rem;
        border-radius: 999px;
        background: color-mix(
          in srgb,
          var(--ds-primary) 12%,
          var(--ds-bg-surface, #ffffff)
        );
        color: var(--ds-primary, #0b3164);
        font-size: 0.76rem;
        font-weight: 700;
      }

      .web-screen--dark .web-screen__badge {
        background: color-mix(in srgb, var(--ds-primary) 24%, transparent);
        color: var(--ds-text-on-primary, #ffffff);
      }

      .web-screen__hero {
        display: grid;
        gap: 0.35rem;
        padding: 1rem;
        border-radius: 1rem;
        background: color-mix(
          in srgb,
          var(--ds-primary) 6%,
          var(--ds-bg-surface, #ffffff)
        );
        border: 1px solid color-mix(in srgb, var(--ds-primary) 10%, transparent);
      }

      .web-screen__hero span,
      .web-screen__muted {
        color: var(--ds-text-secondary, #64748b);
        line-height: 1.5;
      }

      .web-screen__actions,
      .web-screen__stats,
      .web-screen__toolbar,
      .web-screen__list,
      .web-screen__table,
      .web-screen__metrics {
        display: grid;
        gap: 0.75rem;
      }

      .web-screen__actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .web-screen__cta {
        min-height: 2.8rem;
        border: 0;
        border-radius: 0.95rem;
        font-weight: 700;
        cursor: pointer;
      }

      .web-screen__cta--primary {
        background: var(--ds-primary, #0b3164);
        color: var(--ds-text-on-primary, #ffffff);
      }

      .web-screen__cta--secondary {
        background: transparent;
        color: var(--ds-primary, #0b3164);
        border: 1px solid color-mix(in srgb, var(--ds-primary) 18%, transparent);
      }

      .web-screen__stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .web-screen__metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .web-screen__stat {
        display: grid;
        gap: 0.3rem;
        padding: 0.9rem;
        border-radius: 1rem;
        background: var(--ds-bg-sunken, #f8fafc);
        border: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 70%, transparent);
      }

      .web-screen__stat strong {
        font-size: 1.15rem;
        color: var(--ds-text-primary, #0f172a);
      }

      .web-screen__metric-card {
        display: grid;
        gap: 0.45rem;
        padding: 0.95rem;
        border-radius: 1rem;
        background: linear-gradient(
          180deg,
          var(--ds-bg-surface, #ffffff),
          color-mix(in srgb, var(--ds-primary) 4%, var(--ds-bg-sunken, #f8fafc))
        );
        border: 1px solid color-mix(in srgb, var(--ds-primary) 12%, transparent);
      }

      .web-screen__metric-trend {
        font-size: 0.76rem;
        font-weight: 700;
        color: var(--ds-success, #15803d);
      }

      .web-screen__toolbar {
        grid-template-columns: 1.4fr 0.9fr auto;
        align-items: center;
      }

      .web-screen__input,
      .web-screen__filter {
        min-height: 2.65rem;
        border-radius: 0.9rem;
        border: 1px solid var(--ds-border, #dbe3f0);
        background: var(--ds-bg-surface, #ffffff);
      }

      .web-screen__list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.9rem 1rem;
        border-radius: 1rem;
        background: var(--ds-bg-surface, #ffffff);
        border: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 70%, transparent);
      }

      .web-screen__list-item-main {
        display: grid;
        gap: 0.2rem;
      }

      .web-screen__list-item-main strong {
        color: var(--ds-text-primary, #0f172a);
      }

      .web-screen__table {
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 75%, transparent);
        background: var(--ds-bg-surface, #ffffff);
      }

      .web-screen__table-head,
      .web-screen__table-row {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr 0.8fr;
        gap: 0.75rem;
        align-items: center;
        padding: 0.85rem 1rem;
      }

      .web-screen__table-head {
        background: var(--ds-bg-sunken, #f8fafc);
        color: var(--ds-text-secondary, #64748b);
        font-size: 0.74rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .web-screen__table-row + .web-screen__table-row {
        border-top: 1px solid
          color-mix(in srgb, var(--ds-border, #dbe3f0) 70%, transparent);
      }

      .web-screen__status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 1.75rem;
        padding: 0 0.65rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .web-screen__status--active {
        background: color-mix(in srgb, var(--ds-success) 14%, transparent);
        color: var(--ds-success, #15803d);
      }

      .web-screen__status--review {
        background: color-mix(in srgb, var(--ds-warning) 16%, transparent);
        color: var(--ds-warning, #b7791f);
      }

      .web-screen__pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 1.8rem;
        padding: 0 0.65rem;
        border-radius: 999px;
        background: color-mix(in srgb, var(--ds-warning) 16%, transparent);
        color: var(--ds-warning, #b7791f);
        font-size: 0.75rem;
        font-weight: 700;
      }

      .web-screen__dark-card {
        display: grid;
        gap: 0.8rem;
        padding: 1rem;
        border-radius: 1rem;
        background: color-mix(in srgb, white 5%, transparent);
        border: 1px solid color-mix(in srgb, white 8%, transparent);
      }

      .web-screen__dark-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: color-mix(in srgb, white 88%, transparent);
      }

      .web-screen__dark-track {
        width: 100%;
        height: 0.55rem;
        border-radius: 999px;
        background: color-mix(in srgb, white 10%, transparent);
        overflow: hidden;
      }

      .web-screen__dark-fill {
        width: 78%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(
          90deg,
          var(--ds-info, #38bdf8),
          var(--ds-primary, #0b3164)
        );
      }

      .web-screen__tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .web-screen__tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2rem;
        padding: 0 0.75rem;
        border-radius: 999px;
        background: var(--ds-bg-sunken, #eef2ff);
        color: var(--ds-text-secondary, #64748b);
        font-size: 0.76rem;
        font-weight: 700;
      }

      .web-screen__tab--active {
        background: color-mix(
          in srgb,
          var(--ds-primary) 12%,
          var(--ds-bg-surface, #ffffff)
        );
        color: var(--ds-primary, #0b3164);
      }
    `,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    CustomButton,
    CustomBtnActiveDesactive,
    CustomButtonAdd,
    CustomButtonConfirm,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButtonSave,
    CustomButtonSendEmail,
    CustomButtonTracking,
    CustomButtonViewPdf,
    CustomInputAutoComplete,
    CustomInputAutoMultiple,
    CustomInputCheckSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputDateTimeNative,
    CustomInputDateTimeSignal,
    CustomInputDecimal,
    CustomInputFile,
    CustomInputHour,
    CustomInputImg,
    CustomInputMaskSignal,
    CustomInputMonth,
    CustomInputMultiselectSignal,
    CustomInputNgSelect,
    CustomInputNumberSignal,
    CustomInputPassword,
    CustomInputPhonePrefix,
    CustomInputSelectBool,
    CustomInputSelectPrefix,
    CustomInputSelectSignal,
    CustomInputSwitch,
    CustomInputTextAreaSignal,
    CustomInputTextSignal,
    CustomInputTime,
    CustomInputUrl,
    CustomSearchInput,
  ],
  template: `
    <div class="web-showcase">
      <section class="web-hero">
        <div class="web-hero__eyebrow">Web System</div>
        <h3 class="web-hero__title">
          Pantallas objetivo antes que inventario plano
        </h3>
        <p class="web-hero__copy">
          La cobertura web debe demostrar cómo viven juntos los componentes
          dentro de módulos reales: filtros, tablas, mítricas, acciones
          contextuales y navegación de detalle.
        </p>
      </section>

      <section class="web-panel">
        <div class="web-panel__eyebrow">Target Views</div>
        <h4 class="web-panel__title">
          Showroom de vistas objetivo para escritorio
        </h4>
        <p class="web-panel__copy">
          Igual que en mobile, el catálogo web debe enseóar pantallas armadas y
          no sílo una parrilla de controles sueltos.
        </p>

        <div class="web-gallery">
          <article class="web-screen">
            <div class="web-screen__header">
              <div class="web-screen__meta">
                <span class="web-screen__eyebrow">Actions & Forms</span>
                <span class="web-screen__title">Solicitud corporativa</span>
              </div>
              <span class="web-screen__badge">Ready</span>
            </div>
            <div class="web-screen__hero">
              <strong>Autorización de presupuesto</strong>
              <span
                >Formulario con CTA primario, guardado parcial y datos clave en
                contexto.</span
              >
            </div>
            <div class="web-screen__actions">
              <button
                class="web-screen__cta web-screen__cta--primary"
                type="button"
              >
                Enviar aprobación
              </button>
              <button
                class="web-screen__cta web-screen__cta--secondary"
                type="button"
              >
                Guardar borrador
              </button>
            </div>
            <div class="web-screen__metrics">
              <div class="web-screen__metric-card">
                <span class="web-screen__muted">Monto solicitado</span>
                <strong>$245,000 MXN</strong>
                <span class="web-screen__metric-trend">+12% vs trimestre</span>
              </div>
              <div class="web-screen__metric-card">
                <span class="web-screen__muted">Centro de costo</span>
                <strong>Infraestructura</strong>
                <span class="web-screen__muted">Capex 2026</span>
              </div>
            </div>
            <div class="web-screen__table">
              <div class="web-screen__table-head">
                <span>Área</span>
                <span>Estado</span>
                <span>Monto</span>
              </div>
              <div class="web-screen__table-row">
                <strong>Compras</strong>
                <span class="web-screen__status web-screen__status--active"
                  >Validado</span
                >
                <strong>$120k</strong>
              </div>
              <div class="web-screen__table-row">
                <strong>Finanzas</strong>
                <span class="web-screen__status web-screen__status--review"
                  >Revisión</span
                >
                <strong>$125k</strong>
              </div>
            </div>
          </article>

          <article class="web-screen">
            <div class="web-screen__header">
              <div class="web-screen__meta">
                <span class="web-screen__eyebrow">Task Overview</span>
                <span class="web-screen__title">Panel operativo</span>
              </div>
              <span class="web-screen__badge">Sprint</span>
            </div>
            <div class="web-screen__stats">
              <div class="web-screen__stat">
                <span class="web-screen__muted">Pendientes</span>
                <strong>12</strong>
              </div>
              <div class="web-screen__stat">
                <span class="web-screen__muted">En revisión</span>
                <strong>04</strong>
              </div>
              <div class="web-screen__stat">
                <span class="web-screen__muted">Cumplimiento</span>
                <strong>98%</strong>
              </div>
            </div>
            <div class="web-screen__list">
              <div class="web-screen__list-item">
                <div class="web-screen__list-item-main">
                  <strong>QA infraestructura</strong>
                  <span class="web-screen__muted"
                    >Validación de wrappers y patrones base</span
                  >
                </div>
                <span class="web-screen__pill">Alta</span>
              </div>
              <div class="web-screen__list-item">
                <div class="web-screen__list-item-main">
                  <strong>Actualizar checklist de despliegue</strong>
                  <span class="web-screen__muted"
                    >Cobertura release candidate</span
                  >
                </div>
                <span class="web-screen__pill">Media</span>
              </div>
            </div>
          </article>

          <article class="web-screen web-screen--dark">
            <div class="web-screen__header">
              <div class="web-screen__meta">
                <span class="web-screen__eyebrow">Operations Live</span>
                <span class="web-screen__title">Operational review</span>
              </div>
              <span class="web-screen__badge">Live</span>
            </div>
            <div class="web-screen__dark-card">
              <div class="web-screen__dark-row">
                <span>Open tasks</span>
                <strong>08</strong>
              </div>
              <div class="web-screen__dark-row">
                <span>Critical alerts</span>
                <strong>02</strong>
              </div>
              <div class="web-screen__dark-row">
                <span>System health</span>
                <strong>78%</strong>
              </div>
              <div class="web-screen__dark-track">
                <div class="web-screen__dark-fill"></div>
              </div>
            </div>
            <div class="web-screen__table">
              <div class="web-screen__table-head">
                <span>Queue</span>
                <span>SLA</span>
                <span>Owner</span>
              </div>
              <div class="web-screen__table-row">
                <strong>Incidents P1</strong>
                <strong>22m</strong>
                <strong>NOC</strong>
              </div>
              <div class="web-screen__table-row">
                <strong>Deploy checks</strong>
                <strong>11m</strong>
                <strong>Platform</strong>
              </div>
            </div>
          </article>

          <article class="web-screen">
            <div class="web-screen__header">
              <div class="web-screen__meta">
                <span class="web-screen__eyebrow">Navigation & Lists</span>
                <span class="web-screen__title">Infrastructure dashboard</span>
              </div>
              <span class="web-screen__badge">Flow</span>
            </div>
            <div class="web-screen__tabs">
              <span class="web-screen__tab web-screen__tab--active"
                >Overview</span
              >
              <span class="web-screen__tab">Security</span>
              <span class="web-screen__tab">History</span>
            </div>
            <div class="web-screen__toolbar">
              <input class="web-screen__input" />
              <div class="web-screen__filter"></div>
              <button
                class="web-screen__cta web-screen__cta--primary"
                type="button"
              >
                Nuevo
              </button>
            </div>
            <div class="web-screen__list">
              <div class="web-screen__list-item">
                <div class="web-screen__list-item-main">
                  <strong>Actividad reciente</strong>
                  <span class="web-screen__muted"
                    >14 movimientos en las óltimas 4 horas</span
                  >
                </div>
                <strong>14 items</strong>
              </div>
              <div class="web-screen__list-item">
                <div class="web-screen__list-item-main">
                  <strong>Feedback systems</strong>
                  <span class="web-screen__muted"
                    >Canales y automatizaciones saludables</span
                  >
                </div>
                <strong>Online</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div class="grid">
        <div class="col-12">
          <p-card header="All Web Buttons">
            <p class="m-0 mb-4 text-sm text-600 line-height-3">
              Catalogo completo de acciones web para escritorio, con variantes
              primarias, contextuales y de estado.
            </p>

            <div class="surface-ground border-round p-3">
              <div class="text-xs font-semibold uppercase text-500 mb-3">
                Button Inventory
              </div>

              <div class="flex flex-wrap gap-2">
                <custom-button label="Generico" />
                <custom-button-add label="Agregar" />
                <custom-button-edit label="Editar" />
                <custom-button-delete label="Eliminar" />
                <custom-button-save label="Guardar" />
                <custom-button-download />
                <custom-button-confirm label="Confirmar" />
                <custom-button-view-pdf
                  [url]="'/demo.pdf'"
                  [fileName]="'demo.pdf'"
                />
                <custom-button-send-email />
                <custom-button-tracking [badgeCount]="4" [ticketId]="128" />
                <custom-button-item icon="mdi:star" label="Item" />
                <custom-button-active-desactive [state]="true" />
                <custom-button-active-desactive [state]="false" />
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12">
          <p-card header="All Web Inputs">
            <p class="m-0 mb-4 text-sm text-600 line-height-3">
              Inventario completo de inputs web organizado por captura de texto,
              cantidades, fechas, seleccion y archivos.
            </p>

            <form [formGroup]="form" class="flex flex-column gap-4">
              <div class="surface-ground border-round p-3">
                <div class="text-xs font-semibold uppercase text-500 mb-3">
                  Text And Search
                </div>

                <div class="grid">
                  <div class="col-12 lg:col-4">
                    <custom-input-text-signal
                      [control]="form.controls['texto']"
                      label="Texto"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-search-input-signal
                      placeholder="Buscar componente"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-password-signal
                      [control]="form.controls['password']"
                      label="Contrasena"
                      [showStrengthIndicator]="true"
                    />
                  </div>
                </div>
              </div>

              <div class="surface-ground border-round p-3">
                <div class="text-xs font-semibold uppercase text-500 mb-3">
                  Numeric And Amount
                </div>

                <div class="grid">
                  <div class="col-12 lg:col-3">
                    <custom-input-number-signal
                      [control]="form.controls['numero']"
                      label="Numero"
                      [showButtons]="true"
                      [min]="0"
                      [max]="99"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-currency-signal
                      [control]="form.controls['monto']"
                      label="Monto"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-decimal-signal
                      [control]="form.controls['decimal']"
                      label="Decimal"
                      [maxFractionDigits]="3"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-hour-signal
                      [control]="form.controls['horaCorta']"
                      label="Hora corta"
                    />
                  </div>
                </div>
              </div>

              <div class="surface-ground border-round p-3">
                <div class="text-xs font-semibold uppercase text-500 mb-3">
                  Date And Time
                </div>

                <div class="grid">
                  <div class="col-12 lg:col-3">
                    <custom-input-date-signal
                      [control]="form.controls['fecha']"
                      label="Fecha"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-date-time-signal
                      [control]="form.controls['fechaHora']"
                      label="Fecha y hora"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-date-time-native
                      [control]="form.controls['fechaHoraNative']"
                      label="DateTime nativo"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-month
                      [control]="form.controls['mes']"
                      label="Mes"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-time-signal
                      [control]="form.controls['hora']"
                      label="Hora"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-hour-signal
                      [control]="form.controls['horaCorta']"
                      label="Hora HH:mm"
                    />
                  </div>
                </div>
              </div>

              <div class="surface-ground border-round p-3">
                <div class="text-xs font-semibold uppercase text-500 mb-3">
                  Mask, Url And Prefix
                </div>

                <div class="grid">
                  <div class="col-12 lg:col-4">
                    <custom-input-mask-signal
                      [control]="form.controls['cp']"
                      label="Codigo postal"
                      [customMask]="'99999'"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-url
                      [control]="form.controls['url']"
                      label="Sitio web"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-phone-prefix
                      [control]="form.controls['lada']"
                      label="Lada"
                    />
                  </div>
                </div>
              </div>

              <div class="surface-ground border-round p-3">
                <div class="text-xs font-semibold uppercase text-500 mb-3">
                  Selection And Autocomplete
                </div>

                <div class="grid">
                  <div class="col-12 lg:col-4">
                    <custom-input-select-signal
                      [control]="form.controls['categoria']"
                      label="Select"
                      [data]="options"
                      [filter]="true"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-multiselect-signal
                      [control]="form.controls['multi']"
                      label="Multiselect"
                      [options]="options"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-select-signal-bool
                      [control]="form.controls['estado']"
                      label="Activo/Inactivo"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-ng-select
                      [control]="form.controls['ngSelect']"
                      label="Ng Select wrapper"
                      [items]="options"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-autocomplete-signal
                      [control]="form.controls['autocomplete']"
                      label="Autocomplete"
                      [data]="options"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <custom-input-autocomplete-multiple-signal
                      [control]="form.controls['autocompleteMulti']"
                      label="Autocomplete multiple"
                      [data]="options"
                    />
                  </div>
                  <div class="col-12 lg:col-6">
                    <custom-input-select-signal-prefix
                      [control]="form.controls['prefijoTexto']"
                      label="Select + texto"
                      [data]="options"
                      inputPlaceholder="Detalle"
                    />
                  </div>
                </div>
              </div>

              <div class="surface-ground border-round p-3">
                <div class="text-xs font-semibold uppercase text-500 mb-3">
                  Long Text, Files And Toggles
                </div>

                <div class="grid">
                  <div class="col-12 lg:col-6">
                    <custom-input-textarea-signal
                      [control]="form.controls['descripcion']"
                      label="Textarea"
                      [rows]="4"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-file-signal
                      [control]="form.controls['archivo']"
                      label="Archivo"
                    />
                  </div>
                  <div class="col-12 lg:col-3">
                    <custom-input-img-signal
                      [control]="form.controls['imagen']"
                      label="Imagen"
                      title="Vista previa"
                    />
                  </div>
                  <div class="col-12 lg:col-4">
                    <div class="flex flex-column gap-3 pt-2">
                      <custom-input-switch-signal
                        [control]="form.controls['toggle']"
                        label="Switch"
                      />
                      <custom-input-check-signal
                        [control]="form.controls['check']"
                        label="Checkbox"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </p-card>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebCoreCoverage {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    texto: [""],
    busqueda: [""],
    password: [""],
    numero: [12],
    monto: [2450.55],
    decimal: [18.375],
    horaCorta: ["08:30"],
    fecha: [new Date()],
    fechaHora: [new Date()],
    fechaHoraNative: ["2026-06-20T12:30"],
    mes: ["2026-06"],
    hora: ["14:45"],
    cp: ["76160"],
    url: ["https://luxury-app.com"],
    lada: ["+52"],
    categoria: [1],
    multi: [[1, 2]],
    estado: [true],
    ngSelect: [2],
    autocomplete: [1],
    autocompleteMulti: [[1, 3]],
    prefijoTexto: ["Detalle con prefijo"],
    descripcion: ["Campo extendido para observaciones."],
    archivo: [null],
    imagen: [""],
    toggle: [true],
    check: [true],
  });

  readonly options = [
    { label: "Administrador", value: 1 },
    { label: "Supervisor", value: 2 },
    { label: "Operador", value: 3 },
  ];
}
