import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import {
  ICanvasRow,
  ICanvasSection,
  ILivePreviewResult,
} from '../models/live-preview.interface';
import { IReportDataSource } from '../models/report-definition.interface';

@Injectable({ providedIn: 'root' })
export class LivePreviewService {
  private api = inject(ApiResponseService);

  // ── Estado del canvas ────────────────────────────────────────────────────
  readonly sections = signal<ICanvasSection[]>([]);
  readonly customerId = signal<string>('');
  readonly year = signal<number>(new Date().getFullYear());
  readonly period = signal<number>(1);
  readonly empresa = signal<string>('Contabilidad');

  // ── Estado del preview ────────────────────────────────────────────────────
  readonly previewResult = signal<ILivePreviewResult | null>(null);
  readonly computing = signal(false);
  readonly warnings = computed(() => this.previewResult()?.warnings ?? []);
  readonly grandTotal = computed(() => this.previewResult()?.grandTotal ?? 0);

  // ── Debounce trigger ─────────────────────────────────────────────────────
  private readonly _trigger$ = new Subject<void>();

  /** Dispara manualmente el calculo (usado cuando se editan propiedades internas de objetos) */
  triggerCompute() {
    this._trigger$.next();
  }

  constructor() {
    // Dispara peticion de preview con debounce de 500ms tras cada cambio del canvas
    this._trigger$.pipe(debounceTime(500)).subscribe(() => {
      void this._compute();
    });

    // Efecto reactivo: cada vez que las secciones cambien, dispara el debounce
    effect(() => {
      this.sections();
      this.customerId();
      this.year();
      this.period();
      this.empresa();
      this._trigger$.next();
    });
  }

  // ── API publica para el canvas ────────────────────────────────────────────

  /** Inicializa el contexto del builder */
  init(customerId: string, year: number, empresa: string = 'Contabilidad') {
    this.setContext(customerId, year, empresa);
    this.sections.set([]);
    this.previewResult.set(null);
  }

  setContext(customerId: string, year: number, empresa: string = 'Contabilidad') {
    this.customerId.set(customerId);
    this.year.set(year);
    this.empresa.set(empresa);
  }

  reset(customerId: string, year: number, empresa: string = 'Contabilidad') {
    this.setContext(customerId, year, empresa);
    this.sections.set([]);
    this.previewResult.set(null);
  }

  setDataSource(dataSource: IReportDataSource) {
    this.empresa.set(dataSource === 'cobranza' ? 'Cobranza' : 'Contabilidad');
  }

  /** Agrega una nueva seccion al canvas */
  addSection() {
    const title = `Seccion ${this.sections().length + 1}`;
    this.sections.update(s => [...s, this._newSection(title)]);
  }

  /** Elimina una seccion por su ID */
  removeSection(sectionId: string) {
    this.sections.update(s => s.filter(x => x.sectionId !== sectionId));
  }

  /** Agrega una cuenta a una fila via drag & drop */
  dropAccountOnRow(sectionId: string, rowId: string, accountCode: string) {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        return {
          ...s,
          rows: s.rows.map(r => {
            if (r.rowId !== rowId || r.rowType !== 'account') return r;
            if (r.accountNumbers.includes(accountCode)) return r;
            return { ...r, accountNumbers: [...r.accountNumbers, accountCode] };
          }),
        };
      })
    );
  }

  /** Agrega una cuenta directamente a una fila (desde el panel lateral) */
  addAccountToRow(sectionId: string, rowId: string, accountCode: string) {
    this.dropAccountOnRow(sectionId, rowId, accountCode);
  }

  /** Agrega una cuenta creando una fila nueva dentro de una seccion vacia o existente */
  dropAccountOnSection(sectionId: string, accountCode: string) {
    const normalizedCode = accountCode.trim();
    if (!normalizedCode) return;

    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;

        const existingRow = s.rows.find(r =>
          r.rowType === 'account' && r.accountNumbers.includes(normalizedCode));
        if (existingRow) return s;

        const rowId = this._uid();
        const newRow: ICanvasRow = {
          rowId,
          label: normalizedCode,
          rowType: 'account',
          accountNumbers: [normalizedCode],
          multiplier: 1,
        };

        return { ...s, rows: [...s.rows, newRow] };
      }),
    );
  }

  /** Remueve una cuenta de una fila */
  removeAccountFromRow(sectionId: string, rowId: string, accountCode: string) {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        return {
          ...s,
          rows: s.rows.map(r => {
            if (r.rowId !== rowId) return r;
            return {
              ...r,
              accountNumbers: r.accountNumbers.filter(c => c !== accountCode),
            };
          }),
        };
      })
    );
  }

  /** Agrega una nueva fila de tipo account a una seccion */
  addAccountRow(sectionId: string) {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        const rowId = this._uid();
        const newRow: ICanvasRow = {
          rowId,
          label: `Fila ${s.rows.length + 1}`,
          rowType: 'account',
          accountNumbers: [],
          multiplier: 1,
        };
        return { ...s, rows: [...s.rows, newRow] };
      })
    );
  }

  /** Agrega una fila de formula a una seccion */
  addFormulaRow(sectionId: string, formula: string = '') {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        const rowId = this._uid();
        const newRow: ICanvasRow = {
          rowId,
          label: 'Total',
          rowType: 'formula',
          accountNumbers: [],
          formula,
          multiplier: 1,
        };
        return { ...s, rows: [...s.rows, newRow] };
      })
    );
  }

  /** Elimina una fila de una seccion */
  removeRow(sectionId: string, rowId: string) {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        return { ...s, rows: s.rows.filter(r => r.rowId !== rowId) };
      })
    );
  }

  /** Actualiza la etiqueta de una fila */
  updateRowLabel(sectionId: string, rowId: string, label: string) {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        return {
          ...s,
          rows: s.rows.map(r => (r.rowId === rowId ? { ...r, label } : r)),
        };
      })
    );
  }

  /** Invierte el signo (suma/resta) de una fila */
  toggleMultiplier(sectionId: string, rowId: string) {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.sectionId !== sectionId) return s;
        return {
          ...s,
          rows: s.rows.map(r =>
            r.rowId === rowId ? { ...r, multiplier: r.multiplier * -1 } : r
          ),
        };
      })
    );
  }

  /** Obtiene el valor calculado de una fila del ultimo preview */
  getRowValue(rowId: string): number {
    return this.previewResult()?.rowValues?.[rowId] ?? 0;
  }

  // ── Privados ─────────────────────────────────────────────────────────────

  private async _compute() {
    const cid = this.customerId();
    if (!cid) return;

    const sections = this.sections();
    const hasContent = sections.some(s =>
      s.rows.some(r => r.accountNumbers.length > 0 || r.formula)
    );
    if (!hasContent) {
      this.previewResult.set(null);
      return;
    }

    this.computing.set(true);

    const payload = {
      customerId: cid,
      year: this.year(),
      period: this.period(),
      empresa: this.empresa(),
      sections: sections.map(s => ({
        label: s.title,
        rows: s.rows.map(r => ({
          rowId: r.rowId,
          label: r.label,
          rowType: r.rowType,
          accountNumbers: r.accountNumbers,
          formula: r.formula,
          multiplier: r.multiplier,
        })),
      })),
    };

    try {
      const result = await this.api.onPostNotLoading<ILivePreviewResult>(
        'dynamic-reports/live-preview',
        payload
      );
      if (result) this.previewResult.set(result);
    } finally {
      this.computing.set(false);
    }
  }

  private _newSection(title: string): ICanvasSection {
    return { sectionId: this._uid(), title, rows: [] };
  }

  private _uid(): string {
    return `R${Date.now().toString(36).toUpperCase()}`;
  }
}
