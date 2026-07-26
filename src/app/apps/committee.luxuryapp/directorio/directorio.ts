import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CommitteeDirectorioDTO } from "../interfaces/committee-directorio.dto";
import { AppImageFallback } from "@ui/web/image-fallback/image-fallback";
import {
  SegmentedControl,
  SegmentItem,
} from "@ui/shared/segmented-control/segmented-control";

@Component({
  selector: "app-committee-directorio",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./directorio.html",
  imports: [AppImageFallback, SegmentedControl],
})
export class CommitteeDirectorio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  data = signal<CommitteeDirectorioDTO[]>([]);

  /** Vista activa del directorio ("personal" | "casetas"). */
  view = signal("personal");

  readonly segments: SegmentItem[] = [
    { value: "personal", label: "Personal", icon: "mdi:account-group" },
    { value: "casetas", label: "Casetas", icon: "mdi:office-building-marker" },
  ];

  /** Personal de administración: entradas sin grupo. */
  private personalItems = computed(() =>
    this.data().filter((x) => !x.groupName),
  );

  /** Casetas u oficinas: entradas agrupadas (ubicaciones). */
  private casetasItems = computed(() => this.data().filter((x) => !!x.groupName));

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
}
