import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DiagramPreviewComponent } from "../components/diagram-preview";
import { IManualTemplateDetalleDTO } from "../models/manuals-and-processes.dto";

@Component({
  selector: "app-manuals-and-processes-detail",
  templateUrl: "./manuals-and-processes-detail.html",
  styleUrl: "./manuals-and-processes-detail.scss",
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, DiagramPreviewComponent],
})
export class ManualsAndProcessesDetail implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public aspRoleS = inject(AspRoleService);

  readonly EApplicationRole = EApplicationRole;

  manual = signal<IManualTemplateDetalleDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.onLoadData(id);
  }

  onLoadData(id: string) {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<IManualTemplateDetalleDTO>(Endpoints.ManualsPasos.getById(id))
      .then((result) => {
        this.manual.set(result ?? null);
        this.loading.set(false);
      });
  }

  onBack() {
    this.router.navigate(["/library/manuals-and-processes"]);
  }

  onOpenEditor(id: string) {
    this.router.navigate(["/library/manuals-and-processes/editor", id]);
  }
}
