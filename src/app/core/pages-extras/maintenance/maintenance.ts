import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-maintenance",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./maintenance.html",
  imports: [AppIcon],
})

/**
 * Maintenance Component
 */
export class Maintenance implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
