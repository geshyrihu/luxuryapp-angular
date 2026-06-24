import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { EStatus, StatusBadge } from "src/app/core/components/status-badge/status-badge";
import { CustomButtonDelete, CustomButtonEdit } from "src/app/core/components/buttons/web";

const PATTERNS_LABELS: Record<string, string> = {
  complexcard: "Complex Card",
  datatablehybrid: "Data Table Hybrid",
  loginreference: "Login Reference",
  navigationreference: "Navigation Reference",
};

@Component({
  selector: "app-catalog-patterns-item",
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DividerModule, InputTextModule, MessageModule, TableModule, TabsModule, ActionMenu, AppIcon, StatusBadge, CustomButtonDelete, CustomButtonEdit],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ('complexcard') {
          <p-card header="Complex Card Item">
            <div class="surface-card shadow-1 border-round-lg border-left-3 border-primary p-3">
              <h3 class="m-0">Medidor Eléctrico A1</h3>
              <div class="flex align-items-center gap-2 mb-3 mt-2">
                <app-icon icon="mdi:flash-outline" class="text-xl text-primary" />
                <span class="text-xl font-bold">120 kWh</span>
              </div>
              <app-status-badge [status]="EStatus.Concluido" />
            </div>
          </p-card>
        }
        @case ('datatablehybrid') {
          <p-card header="Data Table Hybrid">
            <p-table [value]="[{id:1,name:'Test'}]" class="mt-2">
              <ng-template #header><tr><th>Elemento</th><th>Status</th></tr></ng-template>
              <ng-template #body let-item><tr><td>{{item.name}}</td><td><app-status-badge [status]="EStatus.Proceso" /></td></tr></ng-template>
            </p-table>
          </p-card>
        }
        @case ('loginreference') {
          <p-card header="Login de Referencia">
            <div class="surface-ground border-round p-4" style="max-width:400px">
              <div class="text-center mb-3"><h3 class="m-0">LuxuryApp</h3></div>
              <input pInputText [(ngModel)]="email" placeholder="admin@luxuryapp.com" class="w-full mb-2" />
              <input pInputText type="password" [(ngModel)]="password" placeholder="Contraseña" class="w-full mb-2" />
              <p-button label="Iniciar Sesión" class="w-full" styleClass="w-full" />
            </div>
          </p-card>
        }
        @case ('navigationreference') {
          <p-card header="Navegación de Referencia">
            <p-tabs value="0">
              <p-tablist>
                <p-tab value="0">Dashboard</p-tab>
                <p-tab value="1">Reportes</p-tab>
              </p-tablist>
              <p-tabpanels>
                <p-tabpanel value="0"><p>Contenido Dashboard.</p></p-tabpanel>
                <p-tabpanel value="1"><p>Reportes.</p></p-tabpanel>
              </p-tabpanels>
            </p-tabs>
          </p-card>
        }
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogPatternsItem {
  private route = inject(ActivatedRoute);
  item = signal(this.route.snapshot.paramMap.get('item') ?? '');
  label = PATTERNS_LABELS[this.item()] ?? this.item();
  EStatus = EStatus;
  email = '';
  password = '';
}
