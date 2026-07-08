import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-role-description",
  templateUrl: "./role-description.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class RoleDescription implements OnInit {
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  data: any;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.JobDescriptions.getByWorkPosition(this.config.data.id))
      .then((result: any) => {
        this.data = result;
      });
  }
}

