import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { EquipmentInspectionExecutionForm } from "./equipment-inspection-execution-form";
import { EquipmentQrResolveDTO } from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

@Component({
  selector: "app-equipment-inspection-qr-entry",
  templateUrl: "./equipment-inspection-qr-entry.html",
  imports: [CommonModule, WebButtonLabel, EquipmentInspectionExecutionForm],
})
export class EquipmentInspectionQrEntry implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  loading = signal(true);
  error = signal("");
  context = signal<EquipmentQrResolveDTO | null>(null);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get("code");
    if (!code) {
      this.error.set("No se recibio un codigo QR valido.");
      this.loading.set(false);
      return;
    }

    this.onResolve(code);
  }

  async onResolve(code: string): Promise<void> {
    this.loading.set(true);
    this.error.set("");
    try {
      const result = await this.equipmentInspectionS.resolveQrLabel(code);
      if (!result) {
        this.error.set("No fue posible resolver el QR del equipo.");
        return;
      }
      this.context.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  onBack(): void {
    this.router.navigate(ROUTES.INVENTARIOS.EQUIPOS_AREAS);
  }
}
