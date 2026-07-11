import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  computed
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-gallery",
  imports: [
    CommonModule,
    WebButtonLabel,
    AppIcon,
    CustomInputTextSignal,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="card p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex align-items-center ">
          <h2 class="m-0">Galeróa de Diagramas</h2>
          <il-button
            label="Gestión"
            iconClass="mdi:format-list-bulleted"
            (clicked)="onOpenList()"
            severity="secondary"
            variant="text"
          />
        </div>
        <custom-input-text-signal
          placeholder="Buscar diagrama..."
          (input)="onFilter($event)"
          [horizontal]="false"
          noMargin
          onlyInput
        />
      </div>

      <div class="grid grid-nogutter">
        <div class="col-12 md:col-4 p-2" *ngFor="let diagram of paginatedDiagrams()">
          <div class="card h-full shadow-2 hover:shadow-4 transition-duration-150">
            <div class="card-header flex-column gap-1">
              <span class="card-title">{{ diagram.name }}</span>
              <span class="card-subtitle">Actualizado: {{ diagram.updateAt | date: "dd/MM/yyyy" }}</span>
            </div>
            <div
              class="card-body flex flex-column align-items-center justify-content-center py-4 bg-gray-50 border-round mb-3"
              style="min-height: 150px"
            >
              <app-icon [icon]="'mdi:image-multiple'" class="text-6xl text-primary-400" />
            </div>
            <div class="card-footer">
              <div class="flex ">
                <il-button
                  label="Visualizar"
                  iconClass="mdi:eye-outline"
                  severity="success"
                  customClass="w-full"
                  (clicked)="onView(diagram.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-content-center align-items-center mt-3 gap-2" *ngIf="diagrams().length > pageSize()">
        <il-button 
          iconClass="mdi:chevron-left" 
          variant="text" 
          (clicked)="currentPage.set(currentPage() - 1)" 
          [disabled]="currentPage() === 1" 
        />
        <span>Página {{ currentPage() }} de {{ totalPages() }}</span>
        <il-button 
          iconClass="mdi:chevron-right" 
          variant="text" 
          (clicked)="currentPage.set(currentPage() + 1)" 
          [disabled]="currentPage() === totalPages()" 
        />
      </div>
    </div>
  `,
})
export class DiagramGallery implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdService = inject(CustomerIdService);
  private router = inject(Router);

  diagrams = signal<IDiagramDraw[]>([]);
  allDiagrams: IDiagramDraw[] = [];
  loading = signal(true);
  
  currentPage = signal(1);
  pageSize = signal(9);

  paginatedDiagrams = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.diagrams().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.diagrams().length / this.pageSize()) || 1;
  });

  constructor() {
    effect(() => {
      if (this.customerIdService.customerId()) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {}

  onLoadData() {
    const customerId = this.customerIdService.customerId();
    if (!customerId) return;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<IDiagramDraw>(`DiagramDraw?customerId=${customerId}`)
      .then((result: any) => {
        this.diagrams.set(result);
        this.allDiagrams = result;
        this.currentPage.set(1);
        this.loading.set(false);
      });
  }

  onView(id: string) {
    this.router.navigate(ROUTES.DIAGRAMAS.VER(id));
  }

  onOpenList() {
    this.router.navigate(ROUTES.DIAGRAMAS.LISTA);
  }

  onFilter(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (!query) {
      this.diagrams.set(this.allDiagrams);
      return;
    }
    const filtered = this.allDiagrams.filter((d) =>
      d.name.toLowerCase().includes(query),
    );
    this.diagrams.set(filtered);
    this.currentPage.set(1);
  }
}
