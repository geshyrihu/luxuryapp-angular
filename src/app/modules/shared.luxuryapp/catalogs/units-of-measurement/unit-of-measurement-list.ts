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
import { UnitOfMeasurementListDesktop } from "./desktop/unit-of-measurement-list-desktop";
import { UnitOfMeasurementListMobile } from "./mobile/unit-of-measurement-list-mobile";
import { UnitOfMeasurementForm } from "./unit-of-measurement-form";

@Component({
  selector: "app-unit-of-measurement-list",
  templateUrl: "./unit-of-measurement-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UnitOfMeasurementListDesktop, UnitOfMeasurementListMobile],
})
export class UnitOfMeasurementList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  dataSignal = signal<any[]>([]);
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.Catalogs.UnitsOfMeasurement.getAll)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  async onDelete(id: any): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.UnitsOfMeasurement.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        UnitOfMeasurementForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
