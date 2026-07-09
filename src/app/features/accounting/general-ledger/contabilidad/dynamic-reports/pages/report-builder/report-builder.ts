import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { ROUTES } from "src/app/routing/route-paths";
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ChangeDetectionStrategy
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AccordionModule } from "primeng/accordion";
import { AutoCompleteModule } from "primeng/autocomplete";
import { BadgeModule } from "primeng/badge";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxChip } from "@ui/adaptive/chip/chip";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";

import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { MultiSelectModule } from "primeng/multiselect";
import { LxPopover } from "@ui/adaptive/popover/popover";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";

import { TooltipModule } from "primeng/tooltip";
import { startWith } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { AccountTreeSelect } from "../../components/account-tree-select/account-tree-select";
import {
  ICanvasRow,
  ICanvasSection,
  ILivePreviewResult,
} from "../../models/live-preview.interface";
import {
  IAccountFlatItem,
  IReportBody,
  IReportColumn,
  IReportDataSource,
  IReportDefinition,
  IReportSection,
} from "../../models/report-definition.interface";
import { livePreviewState } from "../../state/live-preview.state";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxModal } from "@ui/adaptive/modal/modal";
import { InputSelect } from "@ui/inputs/adaptive/input-select/input-select";

const flatCatalogCache = new Map<string, IAccountFlatItem[]>();

@Component({
  selector: "app-report-builder",
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AccordionModule,
    AutoCompleteModule,
    TooltipModule,
    CustomInputSelectSignal,
    MultiSelectModule,
    CustomInputCheckSignal,
    ProgressSpinnerModule,
    BadgeModule,
    LxPopover,
    WebButtonLabel,
    WebButtonIcon,
    LxChip,
    InputGroupModule,
    InputGroupAddonModule,
    AccountTreeSelect,
    CurrencyPipe,
   AppIcon, LxTag, LxModal],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./report-builder.html",
})
export class ReportBuilder implements OnInit, OnDestroy {
  protected readonly Math = Math;
  private fb = inject(NonNullableFormBuilder);
  private api = inject(ApiResponseService);
  protected customerIdS = inject(CustomerIdService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected livePreviewS = livePreviewState;
  private toast = inject(CustomToastService);
  private previewDebounceHandle: ReturnType<typeof setTimeout> | null = null;

  id = signal<string | null>(null);
  loading = signal(false);
  guardando = signal(false);
  showExamples = signal(false);

  catalogoCuentas = signal<IAccountFlatItem[]>([]);
  cargandoCatalogo = signal(false);

  selectedCatalogCodes = signal<string[]>([]);
  previewYear = signal(new Date().getFullYear());
  private lastContextKey = "";


  form = this.fb.group({
    name: this.fb.control("", [Validators.required]),
    description: this.fb.control(""),
    visualizationType:
      this.fb.control<IReportDefinition["visualizationType"]>("table-simple"),
    dataSource: this.fb.control<IReportDataSource>("contabilidad"),
    isTemplate: this.fb.control(false),
  });

  private dataSourceValue = toSignal(
    this.form.controls.dataSource.valueChanges.pipe(
      startWith(this.form.controls.dataSource.getRawValue()),
    ),
    { initialValue: this.form.controls.dataSource.getRawValue() },
  );

  private visualizationTypeValue = toSignal(
    this.form.controls.visualizationType.valueChanges.pipe(
      startWith(this.form.controls.visualizationType.getRawValue()),
    ),
    { initialValue: this.form.controls.visualizationType.getRawValue() },
  );

  sections = this.livePreviewS.sections;
  columns = signal<IReportColumn[]>([]);

  tiposVisualizacion = [
    { label: "Tabla simple", value: "table-simple" },
    { label: "Dos columnas", value: "table-twoColumn" },
    { label: "Comparativo", value: "table-comparative" },
    { label: "Presupuesto vs Real", value: "table-budgetVsActual" },
    { label: "Tarjetas KPI", value: "summary-cards" }
  ];

  fuentesAspel = [
    { label: "Contabilidad", value: "contabilidad" },
    { label: "Cobranza", value: "cobranza" }
  ];

  empresaAspel = computed(() => this.toEmpresaAspel(this.dataSourceValue()));
  visualizationMode = computed(() => this.visualizationTypeValue());

  meses = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 }
  ];

  aniosPreview = Array.from({ length: 7 }, (_, idx) => {
    const year = new Date().getFullYear() - 3 + idx;
    return { label: `${year}`, value: year };
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const year = this.previewYear();
      const empresa = this.empresaAspel();
      const contextKey = `${customerId}|${year}|${empresa}`;

      if (!customerId) return;

      this.livePreviewS.setContext(customerId, year, empresa);
      this.syncColumnsWithPreviewContext();

      if (this.lastContextKey !== contextKey) {
        this.lastContextKey = contextKey;
        this.catalogoCuentas.set([]);
        this.selectedCatalogCodes.set([]);
      }
    });

    effect(() => {
      this.visualizationMode();
      this.previewYear();
      this.livePreviewS.period();
      this.syncColumnsWithPreviewContext();
      this.livePreviewS.triggerCompute();
    });

    effect(() => {
      this.livePreviewS.computeToken();
      if (this.previewDebounceHandle) {
        clearTimeout(this.previewDebounceHandle);
      }
      this.previewDebounceHandle = setTimeout(() => {
        void this.computePreview();
      }, 500);
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.id.set(idParam);
      this.livePreviewS.reset(
        this.customerIdS.customerId()!,
        this.previewYear(),
        this.empresaAspel(),
      );
      this.cargar(idParam);
    } else if (this.customerIdS.customerId()) {
      this.livePreviewS.init(
        this.customerIdS.customerId()!,
        this.previewYear(),
        this.empresaAspel(),
      );
    }
  }

  ngOnDestroy() {
    if (this.previewDebounceHandle) {
      clearTimeout(this.previewDebounceHandle);
      this.previewDebounceHandle = null;
    }
  }

  private async cargar(id: string) {
    this.loading.set(true);
    const d = await this.api.onGetItem<IReportDefinition>(
      Endpoints.DynamicReports.getById(id),
    );
    if (d) {
      this.form.patchValue({
        name: d.name,
        description: d.description,
        visualizationType: d.visualizationType,
        dataSource: d.dataSource,
        isTemplate: d.isTemplate,
      });
      this.previewYear.set(
        d.body.columns?.find((x) => x.dataSource !== "budget")?.year ??
          new Date().getFullYear(),
      );
      this.livePreviewS.period.set(
        d.body.columns?.find((x) => typeof x.month === "number")?.month ?? 1,
      );

      const canvasSections: ICanvasSection[] = d.body.sections.map((s) => ({
        sectionId: s.id,
        title: s.title,
        rows: s.rows.map((r) => ({
          rowId: r.id,
          label: r.label,
          rowType: r.type as any,
          accountNumbers: r.accountFilter?.accountNumbers ?? [],
          formula: r.formula,
          multiplier: r.sign,
        })),
      }));
      this.livePreviewS.sections.set(canvasSections);
      this.columns.set(d.body.columns ?? []);
      this.livePreviewS.triggerCompute();
    }
    this.loading.set(false);
  }

  agregarSeccion() {
    this.livePreviewS.addSection();
  }

  eliminarSeccion(seccionId: string) {
    this.livePreviewS.removeSection(seccionId);
  }

  agregarRenglon(seccionId: string, tipo: "account" | "formula" = "account") {
    if (tipo === "account") {
      this.livePreviewS.addAccountRow(seccionId);
    } else {
      this.livePreviewS.addFormulaRow(seccionId);
    }
  }

  eliminarRenglon(seccionId: string, rowId: string) {
    this.livePreviewS.removeRow(seccionId, rowId);
  }

  onRowReorder(sectionId: string, event: CdkDragDrop<any>) {
    if (event.previousIndex === event.currentIndex) return;
    this.livePreviewS.moveRow(sectionId, event.previousIndex, event.currentIndex);
  }

  onAccountCdkDropToRow(
    sectionId: string,
    rowId: string,
    event: CdkDragDrop<any>,
  ) {
    const data = event.item.data;
    const accountCode = typeof data === "object" ? data?.code : data;
    const accountName = typeof data === "object" ? data?.name : undefined;
    
    if (typeof accountCode === "string" && accountCode.trim()) {
      this.livePreviewS.dropAccountOnRow(sectionId, rowId, accountCode.trim(), accountName);
    }
  }

  onAccountCdkDropToSection(sectionId: string, event: CdkDragDrop<any>) {
    const data = event.item.data;
    const accountCode = typeof data === "object" ? data?.code : data;
    const accountName = typeof data === "object" ? data?.name : undefined;
    
    if (typeof accountCode === "string" && accountCode.trim()) {
      this.livePreviewS.dropAccountOnSection(sectionId, accountCode.trim(), accountName);
    }
  }

  addSelectedAccountsToRow(sectionId: string, rowId: string) {
    const selectedCodes = this.selectedCatalogCodes();
    if (selectedCodes.length === 0) return;

    selectedCodes.forEach((code) =>
      this.livePreviewS.addAccountToRow(sectionId, rowId, code),
    );
    this.selectedCatalogCodes.set([]);
  }

  async cargarCatalogo() {
    if (this.catalogoCuentas().length > 0) return;
    this.cargandoCatalogo.set(true);
    const customerId = this.customerIdS.customerId()!;
    const year = this.livePreviewS.year();
    const empresa = this.empresaAspel();
    const key = `${customerId}-${year}-${empresa}`;
    const cachedCatalog = flatCatalogCache.get(key);
    const data =
      cachedCatalog ??
      (await this.api.onGetItem<IAccountFlatItem[]>(
        Endpoints.DynamicReports.Accounts.flat(customerId, year, empresa),
      )) ??
      [];
    if (!cachedCatalog && data.length > 0) {
      flatCatalogCache.set(key, data);
    }
    if (data) this.catalogoCuentas.set(data);
    this.cargandoCatalogo.set(false);
  }

  eliminarCuenta(sectionId: string, rowId: string, code: string) {
    this.livePreviewS.removeAccountFromRow(sectionId, rowId, code);
  }

  todasLasFilas(): ICanvasRow[] {
    return this.livePreviewS.sections().flatMap((s) => s.rows);
  }

  isSimplePreview() {
    return this.visualizationMode() === "table-simple";
  }

  isTwoColumnPreview() {
    return this.visualizationMode() === "table-twoColumn";
  }

  isComparativePreview() {
    return this.visualizationMode() === "table-comparative";
  }

  isBudgetPreview() {
    return this.visualizationMode() === "table-budgetVsActual";
  }

  isSummaryCardsPreview() {
    return this.visualizationMode() === "summary-cards";
  }

  get comparativeReferenceLabel() {
    return this.isBudgetPreview() ? "Presupuesto" : "Referencia";
  }

  async guardar() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.showError(
        "Error de validación",
        "El nombre del reporte es obligatorio.",
      );
      return;
    }

    this.guardando.set(true);
    const { name, description, visualizationType, dataSource, isTemplate } =
      this.form.getRawValue();

    const reportSections: IReportSection[] = this.livePreviewS
      .sections()
      .map((s, idx) => ({
        id: s.sectionId,
        title: s.title,
        position: idx + 1,
        rows: s.rows.map((r, rIdx) => ({
          id: r.rowId,
          type: r.rowType as any,
          label: r.label,
          accountFilter:
            r.rowType === "account"
              ? { accountNumbers: r.accountNumbers, excludeAccounts: [] }
              : undefined,
          sign: r.multiplier,
          sourceRowIds: [],
          position: rIdx + 1,
          bold: false,
          indent: 0,
          showZero: false,
          formula: r.formula,
        })),
      }));

    const body: IReportBody = {
      sections: reportSections,
      columns: this.columns(),
    };

    const dto: Partial<IReportDefinition> = {
      name,
      description,
      isTemplate,
      visualizationType,
      dataSource,
      periodType: "monthly",
      body,
      customerId: this.customerIdS.customerId()!,
    };

    const result = this.id()
      ? await this.api.onPut<IReportDefinition>(
          Endpoints.DynamicReports.update(this.id()!),
          dto,
        )
      : await this.api.onPost<IReportDefinition>(
          Endpoints.DynamicReports.create,
          dto,
        );

    this.guardando.set(false);
    if (result) this.router.navigate(ROUTES.CONTABILIDAD.REPORTES);
  }

  cancelar() {
    this.router.navigate(ROUTES.CONTABILIDAD.REPORTES);
  }

  aplicarEjemplo(tipo: "egp" | "balance") {
    if (tipo === "egp") {
      this.form.patchValue({
        name: "Estado de Ganancias y Pórdidas (Ejemplo)",
        description: "Reporte dinámico de Ingresos vs Gastos operativos",
        visualizationType: "table-simple",
      });

      const exampleSections: ICanvasSection[] = [
        {
          sectionId: "S1",
          title: "1. INGRESOS OPERATIVOS",
          rows: [
            {
              rowId: "R1",
              label: "Ventas de Servicios",
              rowType: "account",
              accountNumbers: ["401"],
              multiplier: 1,
            },
            {
              rowId: "R2",
              label: "Otros Ingresos",
              rowType: "account",
              accountNumbers: ["402"],
              multiplier: 1,
            },
            {
              rowId: "S1_TOTAL",
              label: "TOTAL INGRESOS",
              rowType: "formula",
              accountNumbers: [],
              formula: "{R1} + {R2}",
              multiplier: 1,
            }
          ],
        },
        {
          sectionId: "S2",
          title: "2. GASTOS",
          rows: [
            {
              rowId: "R3",
              label: "Sueldos y Salarios",
              rowType: "account",
              accountNumbers: ["601"],
              multiplier: -1,
            },
            {
              rowId: "R4",
              label: "Mantenimiento",
              rowType: "account",
              accountNumbers: ["602"],
              multiplier: -1,
            },
            {
              rowId: "S2_TOTAL",
              label: "TOTAL GASTOS",
              rowType: "formula",
              accountNumbers: [],
              formula: "{R3} + {R4}",
              multiplier: 1,
            }
          ],
        },
        {
          sectionId: "S3",
          title: "RESULTADO",
          rows: [
            {
              rowId: "F1",
              label: "UTILIDAD OPERATIVA",
              rowType: "formula",
              accountNumbers: [],
              formula: "{S1_TOTAL} + {S2_TOTAL}",
              multiplier: 1,
            }
          ],
        }
      ];
      this.livePreviewS.sections.set(exampleSections);
      this.livePreviewS.triggerCompute();
    }
    this.showExamples.set(false);
  }

  private toEmpresaAspel(
    dataSource: IReportDataSource,
  ): "Contabilidad" | "Cobranza" {
    return dataSource === "cobranza" ? "Cobranza" : "Contabilidad";
  }

  private syncColumnsWithPreviewContext() {
    const year = this.previewYear();
    const period = this.livePreviewS.period();
    const monthLabel =
      this.meses.find((m) => m.value === period)?.label ?? `Mes ${period}`;
    const actualLabel = `${monthLabel} ${year}`;
    const mode = this.visualizationMode();

    if (mode === "table-comparative") {
      this.columns.set([
        {
          id: "actual",
          label: actualLabel,
          periodType: "month",
          dataSource: "contabilidad",
          year,
          month: period,
        },
        {
          id: "reference",
          label: "Referencia",
          periodType: "month",
          dataSource: "contabilidad",
          year,
          month: period,
        }
      ]);
      return;
    }

    if (mode === "table-budgetVsActual") {
      this.columns.set([
        {
          id: "actual",
          label: actualLabel,
          periodType: "month",
          dataSource: "contabilidad",
          year,
          month: period,
        },
        {
          id: "budget",
          label: "Presupuesto",
          periodType: "month",
          dataSource: "budget",
          year,
          month: period,
        }
      ]);
      return;
    }

    this.columns.set([
      {
        id: "actual",
        label: actualLabel,
        periodType: "month",
        dataSource: "contabilidad",
        year,
        month: period,
      }
    ]);
  }

  private async computePreview() {
    const payload = this.livePreviewS.buildPayload();
    if (!payload) {
      this.livePreviewS.previewResult.set(null);
      return;
    }

    this.livePreviewS.computing.set(true);
    try {
      const result = await this.api.onPostNotLoading<ILivePreviewResult>(
        Endpoints.DynamicReports.livePreview,
        payload,
      );
      this.livePreviewS.previewResult.set(result === false ? null : result);
    } finally {
      this.livePreviewS.computing.set(false);
    }
  }
}
