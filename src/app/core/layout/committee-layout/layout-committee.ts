import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { CommitteeDesktop } from "./committee-desktop";
import { CommitteeMobil } from "./committee-mobile";

@Component({
  selector: "app-layout-committee",
  templateUrl: "./layout-committee.html",
  imports: [CommitteeDesktop, CommitteeMobil],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ion-app {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class LayoutCommittee implements OnInit {
  public breakpointObserver = inject(BreakpointObserver);

  public isMobileView = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    document.body.setAttribute("data-layout", "vertical");
  }
}
