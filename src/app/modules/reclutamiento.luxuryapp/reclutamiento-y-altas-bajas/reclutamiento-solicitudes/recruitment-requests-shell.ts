import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-recruitment-requests-shell",
  template: `
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule],
})
export class RecruitmentRequestsShell {}
