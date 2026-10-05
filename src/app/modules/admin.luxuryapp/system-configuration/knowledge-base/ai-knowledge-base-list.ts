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
import { AiKnowledgeBaseDto } from "@core/interfaces/ai-knowledge-base.dto";
import {
  DialogHandlerService,
  DialogService,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { AiKnowledgeBaseForm } from "./ai-knowledge-base-form";
import { AiKnowledgeBaseListDesktop } from "./desktop/ai-knowledge-base-list-desktop";
import { AiKnowledgeBaseListMobile } from "./mobile/ai-knowledge-base-list-mobile";

@Component({
  selector: "app-ai-knowledge-base-list",
  templateUrl: "./ai-knowledge-base-list.html",
  imports: [AiKnowledgeBaseListDesktop, AiKnowledgeBaseListMobile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class AiKnowledgeBaseList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  confirmS = inject(ConfirmService);
  platformS = inject(PlatformService);

  dataSignal = signal<AiKnowledgeBaseDto[]>([]);
  loading = signal(true);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  async onLoadData() {
    const result = await this.apiResponseS.onGetList<AiKnowledgeBaseDto[]>(
      Endpoints.AiKnowledgeBase.base,
    );
    if (result) {
      this.dataSignal.set(result);
      this.loading.set(false);
    }
  }

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Estás seguro de que quieres eliminar este registro?",
      "Confirmar",
    );
    if (!ok) return;
    const success = await this.apiResponseS.onDelete(
      Endpoints.AiKnowledgeBase.delete(id),
    );
    if (success) {
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    }
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        AiKnowledgeBaseForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
