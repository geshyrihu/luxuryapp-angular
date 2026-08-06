import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { addIcons } from "ionicons";
import { appsOutline } from "ionicons/icons";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { candidateStageLabel } from "../recruitment-shared/candidate-stage-labels";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { CandidateApplicationForm } from "./candidate-application-form";
import { CandidateStageChangeModal } from "./candidate-stage-change-modal";
import {
  CandidateApplicationListItem,
} from "./interfaces/candidate-application";
import { CandidateApplicationListDesktop } from "./desktop/candidate-application-list-desktop";
import { CandidateApplicationListMobile } from "./mobile/candidate-application-list-mobile";

@Component({
  selector: "app-candidate-application-list",
  standalone: true,
  templateUrl: "./candidate-application-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CandidateApplicationListDesktop, CandidateApplicationListMobile],
})
export class CandidateApplicationList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<CandidateApplicationListItem[]>([]);
  stages = signal<SelectItemDto[]>([]);
  activeStage = signal<CandidateApplicationStage | null>(null);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ appsOutline });
  }

  ngOnInit(): void {
    this.onLoadStages();
    this.onLoadData();
  }

  onLoadStages() {
    const options: SelectItemDto[] = Object.keys(CandidateApplicationStage)
      .filter((key) => Number.isNaN(Number(key)))
      .map((key) => {
        const stage =
          CandidateApplicationStage[
            key as keyof typeof CandidateApplicationStage
          ] as CandidateApplicationStage;
        return {
          label: candidateStageLabel(stage),
          value: stage as number,
        };
      });
    this.stages.set(options);
  }

  onLoadData() {
    const query = this.activeStage() !== null
      ? { page: 1, recordsNumber: 200 }
      : { page: 1, recordsNumber: 200 };

    const endpoint = this.activeStage() !== null
      ? EndpointsReclutamiento.CandidateApplications.listByStage(
          this.activeStage()!,
        )
      : EndpointsReclutamiento.CandidateApplications.list;

    this.apiResponseS
      .onGetList<CandidateApplicationListItem[]>(endpoint, query)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onStageChange(stage: CandidateApplicationStage | null) {
    this.activeStage.set(stage);
    this.onLoadData();
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        CandidateApplicationForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onChangeStageModal(data: {
    id: string;
    fromStage: CandidateApplicationStage;
    customerId: string;
  }) {
    this.dialogHandlerS
      .openDialog(
        CandidateStageChangeModal,
        data,
        "Cambiar etapa",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
