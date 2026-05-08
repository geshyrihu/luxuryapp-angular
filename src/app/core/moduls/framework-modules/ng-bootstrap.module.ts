import { NgModule } from "@angular/core";
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbProgressbar,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
@NgModule({
  imports: [
    NgbAlertModule,
    NgbDropdownModule,
    NgbModule,
    NgbNavModule,
    NgbProgressbar,
    NgbTooltipModule,
    NgSelectModule,
  ],
  exports: [
    NgbAlertModule,
    NgbDropdownModule,
    NgbModule,
    NgbNavModule,
    NgbProgressbar,
    NgbTooltipModule,
    NgSelectModule,
  ],
})
export class NgBootstrapModule {}









