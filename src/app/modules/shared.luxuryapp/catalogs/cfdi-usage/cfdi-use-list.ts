import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { CfdiUseForm } from "./cfdi-use-form";
import { CfdiUseListDesktop } from "./desktop/cfdi-use-list-desktop";
import { CfdiUseDto } from "./interfaces/cfdi-use.dto";
import { CfdiUseListMobile } from "./mobile/cfdi-use-list-mobile";

@Component({
  selector: "app-cfdi-use-list",
  templateUrl: "./cfdi-use-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfdiUseListDesktop, CfdiUseListMobile],
})
export class CfdiUseList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  dataSignal = signal<CfdiUseDto[]>([]);
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<CfdiUseDto[]>(Endpoints.Catalogs.CfdiUses.getAll)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  async onDelete(id: any): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.CfdiUses.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(CfdiUseForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
