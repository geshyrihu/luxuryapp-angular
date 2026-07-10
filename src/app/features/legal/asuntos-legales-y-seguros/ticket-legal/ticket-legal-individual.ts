import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { CardModule } from "primeng/card";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-ticket-legal-individual",
  templateUrl: "./ticket-legal-individual.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardModule],
})
export class TicketLegalIndividual implements OnInit {
  apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  ticketId = "";
  data: any;

  private paramsSignal = toSignal(this.route.params);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params) {
        this.ticketId = params["ticketId"];
      }
    });
  }
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.view(this.ticketId))
      .then((result: any) => {
        this.data = result;
      });
  }
}
