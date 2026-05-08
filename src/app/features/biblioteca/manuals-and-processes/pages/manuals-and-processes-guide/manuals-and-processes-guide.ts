import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";

import { CardModule } from "primeng/card";
import { PanelModule } from "primeng/panel";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { FieldsetModule } from "primeng/fieldset";

@Component({
  selector: "app-manuals-and-processes-guide",
  templateUrl: "./manuals-and-processes-guide.html",
  styleUrl: "./manuals-and-processes-guide.scss",
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    CardModule, 
    PanelModule, 
    DividerModule, 
    TagModule, 
    FieldsetModule
  ],
})
export class ManualsAndProcessesGuide {
  private router = inject(Router);

  onBack(): void {
    this.router.navigate(["/library/manuals-and-processes/list"]);
  }
}
