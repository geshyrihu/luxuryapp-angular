import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-system-overview',
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './system-overview.html',
})
export default class SystemOverview {}
