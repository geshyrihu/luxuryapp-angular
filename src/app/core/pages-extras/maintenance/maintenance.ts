import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
@Component({
  selector: "app-maintenance",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./maintenance.html",
  imports: [LxIcon],
})

/**
 * Maintenance Component
 */
export class Maintenance implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

