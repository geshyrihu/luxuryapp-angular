import { computed, signal } from "@angular/core";
import {
  ICanvasRow,
  ICanvasSection,
  ILivePreviewResult,
} from "../interfaces/live-preview.interface";
import { IReportDataSource } from "../interfaces/report-definition.interface";

type LivePreviewPayload = {
  customerId: string;
  year: number;
  period: number;
  empresa: string;
  sections: {
    label: string;
    rows: {
      rowId: string;
      label: string;
      rowType: string;
      accountNumbers: string[];
      formula?: string;
      multiplier: number;
    }[];
  }[];
};

class LivePreviewState {
  readonly draggingType = signal<'account' | 'row' | null>(null);
  readonly sections = signal<ICanvasSection[]>([]);
  readonly customerId = signal<string>("");
  readonly year = signal<number>(new Date().getFullYear());
  readonly period = signal<number>(1);
  readonly empresa = signal<string>("Contabilidad");

  readonly previewResult = signal<ILivePreviewResult | null>(null);
  readonly computing = signal(false);
  readonly warnings = computed(() => this.previewResult()?.warnings ?? []);
  readonly grandTotal = computed(() => this.previewResult()?.grandTotal ?? 0);
  readonly computeToken = signal(0);

  triggerCompute() {
    this.computeToken.update((value) => value + 1);
  }

  init(customerId: string, year: number, empresa: string = "Contabilidad") {
    this.setContext(customerId, year, empresa);
    this.sections.set([]);
    this.previewResult.set(null);
    this.triggerCompute();
  }

  setContext(customerId: string, year: number, empresa: string = "Contabilidad") {
    this.customerId.set(customerId);
    this.year.set(year);
    this.empresa.set(empresa);
    this.triggerCompute();
  }

  reset(customerId: string, year: number, empresa: string = "Contabilidad") {
    this.setContext(customerId, year, empresa);
    this.sections.set([]);
    this.previewResult.set(null);
    this.triggerCompute();
  }

  setDataSource(dataSource: IReportDataSource) {
    this.empresa.set(dataSource === "cobranza" ? "Cobranza" : "Contabilidad");
    this.triggerCompute();
  }

  addSection() {
    const title = `Seccion ${this.sections().length + 1}`;
    this.sections.update((sections) => [...sections, this.newSection(title)]);
    this.triggerCompute();
  }

  removeSection(sectionId: string) {
    this.sections.update((sections) =>
      sections.filter((section) => section.sectionId !== sectionId),
    );
    this.triggerCompute();
  }

  dropAccountOnRow(sectionId: string, rowId: string, accountCode: string, accountName?: string) {
    let updated = false;
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.map((row) => {
            if (row.rowId !== rowId || row.rowType !== "account") return row;
            if (row.accountNumbers.includes(accountCode)) return row;
            updated = true;
            
            // If the label is currently a default "Fila X" or the same as the account code, update it to the account name
            let newLabel = row.label;
            if (accountName && (newLabel.startsWith("Fila ") || newLabel === rowId || newLabel === row.accountNumbers[0] || newLabel === accountCode)) {
              newLabel = accountName;
            }

            return {
              ...row,
              label: newLabel,
              accountNumbers: [...row.accountNumbers, accountCode],
            };
          }),
        };
      }),
    );
    if (updated) this.triggerCompute();
  }

  addAccountToRow(sectionId: string, rowId: string, accountCode: string) {
    this.dropAccountOnRow(sectionId, rowId, accountCode);
  }

  dropAccountOnSection(sectionId: string, accountCode: string, accountName?: string) {
    const normalizedCode = accountCode.trim();
    if (!normalizedCode) return;

    let updated = false;
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;

        const existingRow = section.rows.find(
          (row) =>
            row.rowType === "account" &&
            row.accountNumbers.includes(normalizedCode),
        );
        if (existingRow) return section;

        updated = true;
        const rowId = this.uid();
        const newRow: ICanvasRow = {
          rowId,
          label: accountName || normalizedCode,
          rowType: "account",
          accountNumbers: [normalizedCode],
          multiplier: 1,
        };

        return { ...section, rows: [...section.rows, newRow] };
      }),
    );
    if (updated) this.triggerCompute();
  }

  moveRow(sectionId: string, previousIndex: number, currentIndex: number) {
    if (previousIndex === currentIndex) return;
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        const newRows = [...section.rows];
        const [movedItem] = newRows.splice(previousIndex, 1);
        newRows.splice(currentIndex, 0, movedItem);
        return { ...section, rows: newRows };
      }),
    );
    this.triggerCompute();
  }

  removeAccountFromRow(sectionId: string, rowId: string, accountCode: string) {
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.map((row) => {
            if (row.rowId !== rowId) return row;
            return {
              ...row,
              accountNumbers: row.accountNumbers.filter(
                (code) => code !== accountCode,
              ),
            };
          }),
        };
      }),
    );
    this.triggerCompute();
  }

  addAccountRow(sectionId: string) {
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        const rowId = this.uid();
        const newRow: ICanvasRow = {
          rowId,
          label: `Fila ${section.rows.length + 1}`,
          rowType: "account",
          accountNumbers: [],
          multiplier: 1,
        };
        return { ...section, rows: [...section.rows, newRow] };
      }),
    );
    this.triggerCompute();
  }

  addFormulaRow(sectionId: string, formula: string = "") {
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        const rowId = this.uid();
        const newRow: ICanvasRow = {
          rowId,
          label: "Total",
          rowType: "formula",
          accountNumbers: [],
          formula,
          multiplier: 1,
        };
        return { ...section, rows: [...section.rows, newRow] };
      }),
    );
    this.triggerCompute();
  }

  removeRow(sectionId: string, rowId: string) {
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.filter((row) => row.rowId !== rowId),
        };
      }),
    );
    this.triggerCompute();
  }

  updateRowLabel(sectionId: string, rowId: string, label: string) {
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.map((row) =>
            row.rowId === rowId ? { ...row, label } : row,
          ),
        };
      }),
    );
    this.triggerCompute();
  }

  toggleMultiplier(sectionId: string, rowId: string) {
    this.sections.update((sections) =>
      sections.map((section) => {
        if (section.sectionId !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.map((row) =>
            row.rowId === rowId
              ? { ...row, multiplier: row.multiplier * -1 }
              : row,
          ),
        };
      }),
    );
    this.triggerCompute();
  }

  getRowValue(rowId: string): number {
    const values = this.previewResult()?.rowValues;
    if (!values) return 0;

    // Fast path: direct lookup
    if (values[rowId] !== undefined) return values[rowId];

    // Fallback: case-insensitive lookup to handle ASP.NET Core camelCasing of dictionary keys
    const lowerRowId = rowId.toLowerCase();
    const key = Object.keys(values).find(k => k.toLowerCase() === lowerRowId);
    return key ? values[key] : 0;
  }

  buildPayload(): LivePreviewPayload | null {
    const customerId = this.customerId();
    if (!customerId) return null;

    const sections = this.sections();
    const hasContent = sections.some((section) =>
      section.rows.some(
        (row) => row.accountNumbers.length > 0 || Boolean(row.formula),
      ),
    );
    if (!hasContent) return null;

    return {
      customerId,
      year: this.year(),
      period: this.period(),
      empresa: this.empresa(),
      sections: sections.map((section) => ({
        label: section.title,
        rows: section.rows.map((row) => ({
          rowId: row.rowId,
          label: row.label,
          rowType: row.rowType,
          accountNumbers: row.accountNumbers,
          formula: row.formula,
          multiplier: row.multiplier,
        })),
      })),
    };
  }

  private newSection(title: string): ICanvasSection {
    return { sectionId: this.uid(), title, rows: [] };
  }

  private uid(): string {
    return `r${Date.now().toString(36).toLowerCase()}`;
  }
}

export const livePreviewState = new LivePreviewState();
