import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { OneSignalService } from "src/app/core/services/one-signal.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { ViewDireccionMonitor } from "./monitor/view-direccion-monitor/view-direccion-monitor";
import { ViewDireccionMobile } from "./movil/view-direccion-mobile/view-direccion-mobile";

@Component({
  selector: "app-layout-direccion",
  templateUrl: "./layout-direccion.html",
  imports: [ViewDireccionMonitor, ViewDireccionMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [SignalRService, OneSignalService],
})
export class LayoutDireccion implements OnInit {
  private authService = inject(AuthService);
  private signalRService = inject(SignalRService);
  private oneSignalService = inject(OneSignalService);
  private breakpointObserver = inject(BreakpointObserver);

  isMobileView = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    this.signalRService.start();
    const userId = this.authService.applicationUserId;
    if (userId) {
      this.oneSignalService.initializeAndLoginUser(userId);
    }
  }
}
