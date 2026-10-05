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
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { MachineryClassificationListDesktop } from "./desktop/machinery-classification-list-desktop";
import { MachineryClassificationForm } from "./machinery-classification-form";
import { MachineryClassificationListMobile } from "./mobile/machinery-classification-list-mobile";
@Component({
  selector: "app-machinery-classification-list",
  templateUrl: "./machinery-classification-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MachineryClassificationListDesktop,
    MachineryClassificationListMobile,
  ],
})
export class MachineryClassificationList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  data = signal<any[]>([]);
  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.MachineryClassification.getAll)
      .then((result: any) => {
        this.data.set(result);
      });
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.MachineryClassification.delete(id))
      .then((result: boolean) => {
        if (result)
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        MachineryClassificationForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
