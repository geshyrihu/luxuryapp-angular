import { Component, inject, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TagModule } from "primeng/tag";
import { IUserCard } from "src/app/core/interfaces/user-card.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-card-employee",
  templateUrl: "./card-employee.html",
  imports: [CardModule, TagModule, DividerModule],
})
export class CardEmployee implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  urlImage: string = "";
  applicationUserId: string = "";
  applicationUser: IUserCard;

  ngOnInit(): void {
    this.onLoadData(this.config.data.applicationUserId);
  }

  onLoadData(applicationUserId: string) {
    this.apiResponseS
      .onGetItem(`application-users/CardUser/${applicationUserId}`)
      .then((result: any) => {
        if (result) {
          this.applicationUser = result;
          this.urlImage = this.applicationUser.photoPath;
        }
      });
  }
}
