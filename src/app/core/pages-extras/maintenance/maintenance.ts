import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-maintenance",
  changeDetection: ChangeDetectionStrategy.Eager,
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









