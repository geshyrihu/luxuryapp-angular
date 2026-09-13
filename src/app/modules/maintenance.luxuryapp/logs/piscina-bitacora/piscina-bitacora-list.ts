import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { PiscinaBitacoraForm } from "./piscina-bitacora-form";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import * as ExcelJS from "exceljs";
import { ExcelExportService } from "src/app/core/services/excel-export.service";

interface PiscinaBitacoraDto {
  id: string;
  dateString: string;
  cl: number;
  ph: number;
  alkalinidad: number;
  dureza: number;
  temperatura: number;
  aplicationCl: number;
  aplicationPhMas: number;
  aplicationPhMenos: number;
  cepillado: boolean;
  aspirado: boolean;
  cenefas: boolean;
}

@Component({
  selector: "app-piscina-bitacora-list",
  templateUrl: "./piscina-bitacora-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    MobileListItem,
    AppIcon,
  ],
})
export class PiscinaBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  excelS = inject(ExcelExportService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  rutaActiva = inject(ActivatedRoute);
  dataSignal = signal<PiscinaBitacoraDto[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  piscinaId: string = "";
  ngOnInit(): void {
    this.piscinaId = this.rutaActiva.snapshot.params.piscinaId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.RefactorMantenimiento.piscinabitacoraListById(
      this.piscinaId,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.RefactorMantenimiento.piscinabitacoraById(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PiscinaBitacoraForm,
        {
          id: data.id,
          piscinaId: this.piscinaId,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  readonly excelColumns = [
    { header: "Fecha", key: "fecha", width: 14 },
    { header: "Hora", key: "hora", width: 10 },
    { header: "Cl", key: "cl", width: 10 },
    { header: "Ph", key: "ph", width: 10 },
    { header: "Alkalinidad", key: "alkalinidad", width: 12 },
    { header: "Dureza", key: "dureza", width: 10 },
    { header: "Temperatura", key: "temperatura", width: 12 },
    { header: "Aplicación Cl", key: "aplicationCl", width: 12 },
    { header: "Aplicación pH+", key: "aplicationPhMas", width: 12 },
    { header: "Aplicación pH-", key: "aplicationPhMenos", width: 12 },
    { header: "Cepillado", key: "cepillado", width: 10 },
    { header: "Aspirado", key: "aspirado", width: 10 },
    { header: "Cenefas", key: "cenefas", width: 10 },
  ];

  onExportExcel(): void {
    const url = Endpoints.RefactorMantenimiento.piscinabitacoraExportExcel(this.piscinaId);
    this.apiResponseS
      .onGetList(url)
      .then((result: any) => {
        this.excelS.exportToExcel(result, this.excelColumns, "BitacoraPiscina", `bitacora-piscina-${this.piscinaId}`);
      });
  }

  async onImportExcel(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const rows = await this.parseExcel(file);
      const body = { applicationUserId: this.authS.applicationUserId, rows };
      this.apiResponseS
        .onPost(Endpoints.RefactorMantenimiento.piscinabitacoraImportExcel(this.piscinaId), body)
        .then((ok: boolean) => {
          if (ok) this.onLoadData();
        });
    } finally {
      input.value = "";
    }
  }

  parseExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx
          .load(reader.result as ArrayBuffer)
          .then(() => {
            const ws = workbook.worksheets[0];
            const keyByHeaderIndex = new Map<number, string>();
            const data: any[] = [];
            ws.eachRow((row, rowNumber) => {
              const values = row.values as any[];
              if (rowNumber === 1) {
                values.forEach((v, i) => {
                  const col = this.excelColumns.find((c) => c.header === v);
                  if (col) keyByHeaderIndex.set(i, col.key);
                });
                return;
              }
              const obj: any = {};
              values.forEach((v, i) => {
                const key = keyByHeaderIndex.get(i);
                if (key) obj[key] = v;
              });
              data.push(obj);
            });
            resolve(data);
          })
          .catch((err) => reject(err));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
}
