import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { UserCard } from "@core/interfaces/user-card.interface";
@Component({
  selector: "app-card-employee",
  templateUrl: "./card-employee.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxCard, LxTag, LxDivider],
})
export class CardEmployee implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  urlImage = computed(() => this.applicationUser()?.photoPath || "");
  applicationUserId: string = "";
  applicationUser = signal<UserCard | null>(null);

  ngOnInit(): void {
    this.onLoadData(this.config.data.applicationUserId);
  }

  onLoadData(applicationUserId: string) {
    this.apiResponseS
      .onGetItem(Endpoints.EmployeeInternal.cardUser(applicationUserId))
      .then((result: any) => {
        if (result) {
          this.applicationUser.set(result);
        }
      });
  }
}

