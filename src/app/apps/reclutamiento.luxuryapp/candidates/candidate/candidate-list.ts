import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { addIcons } from "ionicons";
import { personOutline } from "ionicons/icons";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { CandidateForm } from "./candidate-form";
import { CandidateDetail } from "./candidate-detail";
import { CandidateApplicationForm } from "../candidate-application/candidate-application-form";
import { CandidateListDesktop } from "./desktop/candidate-list-desktop";
import { CandidateListMobile } from "./mobile/candidate-list-mobile";
import { CandidateDetail as CandidateDetailDto, CandidateListItem } from "./interfaces/candidate.dto";

@Component({
  selector: "app-candidate-list",
  templateUrl: "./candidate-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CandidateListDesktop, CandidateListMobile],
})
export class CandidateList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<CandidateListItem[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ personOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<CandidateListItem[]>(EndpointsReclutamiento.Candidates.list, {
        page: 1,
        recordsNumber: 200,
      })
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onArchive(id: string) {
    this.apiResponseS
      .onPatch(EndpointsReclutamiento.Candidates.archive(id), {})
      .then((response: boolean | false) => {
        if (response) {
          this.dataSignal.update((currentData) =>
            currentData.map((item) =>
              item.id === id
                ? { ...item, status: CandidateStatus.Archived }
                : item,
            ),
          );
        }
      });
  }

  async onModalForm(data: { id: string; title: string }) {
    const result = await this.dialogHandlerS.openDialog<
      CandidateDetailDto | boolean
    >(CandidateForm, data, data.title, this.dialogHandlerS.sizeLg);

    if (!result) return;

    this.onLoadData();

    if (typeof result === "boolean" || data.id) return;

    await this.dialogHandlerS.openDialog(
      CandidateApplicationForm,
      {
        id: "",
        title: "Asignar vacante y entrevista",
        candidateId: result.id,
        allowCreateCandidate: false,
      },
      "Asignar vacante y entrevista",
      this.dialogHandlerS.sizeLg,
    );

    this.onLoadData();
  }

  onDetail(id: string) {
    this.dialogHandlerS.openDialog(
      CandidateDetail,
      { id },
      "Detalle del candidato",
      this.dialogHandlerS.sizeLg,
    );
  }
}
