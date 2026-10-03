import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppRealtimeIndicator } from "@ui/shared/realtime-indicator/realtime-indicator";
import {
  SegmentedControl,
  SegmentItem,
} from "@ui/shared/segmented-control/segmented-control";
import { AppImageFallback } from "@ui/web/image-fallback/image-fallback";
import { CommitteeDirectorioDTO } from "../interfaces/committee-directorio.dto";
import { DirectorioContactDetail } from "./contact-detail/directorio-contact-detail";

@Component({
  selector: "app-committee-directorio",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./directorio.html",
  imports: [AppImageFallback, SegmentedControl, AppRealtimeIndicator, AppIcon],
})
export class CommitteeDirectorio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  data = signal<CommitteeDirectorioDTO[]>([]);

  /** Vista activa del directorio ("personal" | "casetas"). */
  view = signal("personal");

  readonly segments: SegmentItem[] = [
    {
      value: "personal",
      label: "Personal",
      icon: "material-symbols-light:group",
    },
    {
      value: "casetas",
      label: "Casetas",
      icon: "material-symbols-light:location-city",
    },
  ];

  /** Personal de administración: entradas sin grupo. */
  private personalItems = computed(() =>
    this.data().filter((x) => !x.groupName),
  );

  /** Casetas u oficinas: entradas agrupadas (ubicaciones). */
  private casetasItems = computed(() =>
    this.data().filter((x) => !!x.groupName),
  );

  /** Elementos de la vista activa. */
  items = computed(() =>
    this.view() === "casetas" ? this.casetasItems() : this.personalItems(),
  );

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.apiResponseS
      .onGetList<CommitteeDirectorioDTO[]>(
        Endpoints.Committee.Directorio.byCustomer(customerId),
      )
      .then((result) => this.data.set(result ?? []));
  }

  /** Abre el detalle de contacto (teléfono, correo, horario). */
  openContact(person: CommitteeDirectorioDTO): void {
    if (person.isLocation) return;

    this.dialogHandlerS.openDialogCustom(DirectorioContactDetail, {
      title: `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim(),
      size: this.dialogHandlerS.sizeMd,
      data: { person },
    });
  }
}
