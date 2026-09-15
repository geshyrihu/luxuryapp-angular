import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
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

