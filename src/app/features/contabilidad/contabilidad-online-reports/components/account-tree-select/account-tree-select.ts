import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { AccountCatalogService } from '../../services/account-catalog.service';
import { IAccountTreeNode } from '../../models/report-definition.interface';

@Component({
  selector: 'app-account-tree-select',
  standalone: true,
  imports: [TreeModule, BadgeModule, InputTextModule],
  template: `
    <div class="flex flex-column gap-2 p-1 h-full">
      <div class="p-inputgroup w-full sticky top-0 z-1 bg-white">
        <span class="p-inputgroup-addon"><i class="pi pi-search"></i></span>
        <input 
          type="text" 
          pInputText 
          placeholder="Filtrar catálogo..." 
          class="w-full p-inputtext-sm border-none shadow-none"
          (input)="onFilter($event)" />
      </div>

      @if (loading()) {
        <div class="flex flex-column align-items-center justify-content-center p-4 gap-2">
          <i class="pi pi-spin pi-spinner text-2xl text-primary-500"></i>
          <span class="text-xs text-500 uppercase font-bold tracking-wider">Cargando...</span>
        </div>
      } @else {
        <div class="overflow-auto border-round surface-border">
          <p-tree
            [value]="filteredNodes()"
            selectionMode="checkbox"
            [(selection)]="selectedNodes"
            [scrollHeight]="scrollHeight()"
            [metaKeySelection]="false"
            class="w-full border-none">
            <ng-template pTemplate="default" let-node>
              <!-- NODO ARRASTRABLE -->
              <div 
                class="flex align-items-center gap-2 py-1 w-full account-node"
                [draggable]="isDraggable()"
                (dragstart)="onDragStart($event, node)"
                (dragend)="onDragEnd($event)"
                [class.cursor-move]="isDraggable()">
                
                <p-badge 
                  [value]="'N' + node.data.level" 
                  [severity]="getBadgeSeverity(node.data.level)" 
                  styleClass="text-xs" />
                
                <div class="flex flex-column gap-0 overflow-hidden">
                  <span class="font-mono text-xs font-bold text-primary-700 line-height-1">{{ node.data.code }}</span>
                  <span class="text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis text-700">{{ node.data.name }}</span>
                </div>
              </div>
            </ng-template>
          </p-tree>
        </div>
      }
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-tree {
      padding: 0;
      background: transparent;
    }
    :host ::ng-deep .p-tree .p-treenode-content {
      padding: 0.15rem 0.4rem;
      border-radius: 6px;
      transition: background 0.2s;
    }
    :host ::ng-deep .p-tree .p-treenode-content:hover {
      background: var(--primary-50);
    }
    .account-node:hover {
      color: var(--primary-700);
    }
    .cursor-move {
      cursor: move;
    }
  `]
})
export class AccountTreeSelect {
  private catalogS = inject(AccountCatalogService);
  private lastLoadKey = '';

  /** ID del cliente para el cual se cargará el catálogo. */
  customerId = input.required<string>();
  
  /** Año fiscal del catálogo. */
  year = input.required<number>();
  
  /** Nombre de la empresa Aspel (Contabilidad por defecto). */
  empresa = input<string>('Contabilidad');
  
  /** Altura máxima del scroll del árbol. */
  scrollHeight = input<string>('calc(100vh - 250px)');

  /** Si los nodos pueden ser arrastrados (CDK Drag) */
  isDraggable = input<boolean>(false);

  /** 
   * Códigos de cuentas seleccionados (Comunicación bidireccional). 
   * Se recomienda usarlo con [(selectedCodes)] en el padre.
   */
  selectedCodes = model<string[]>([]);

  // Estado interno reactivo
  loading = signal(false);
  nodes = signal<TreeNode[]>([]);
  filterText = signal('');

  /** Nodos del árbol filtrados según el texto ingresado. */
  filteredNodes = computed(() => {
    const text = this.filterText().toLowerCase().trim();
    if (!text) return this.nodes();
    return this.filterTree(this.nodes(), text);
  });

  /** Getter para PrimeNG Tree que vincula los códigos seleccionados con los objetos TreeNode. */
  get selectedNodes(): TreeNode[] {
    return this.mapCodesToNodes(this.nodes(), this.selectedCodes());
  }

  /** Setter para PrimeNG Tree que extrae los códigos de los nodos seleccionados. */
  set selectedNodes(val: TreeNode[] | undefined | null) {
    if (!val) {
      this.selectedCodes.set([]);
      return;
    }
    const selected = [...new Map(
      val
        .map(n => ({
          code: n.data?.code as string | undefined,
          level: n.data?.level as number | undefined,
        }))
        .filter((x): x is { code: string; level: number } =>
          typeof x.code === 'string' &&
          x.code.length > 0 &&
          typeof x.level === 'number')
        .map(x => [x.code, x])
    ).values()];

    const codes = selected
      .filter(x => x.level > 0)
      .sort((a, b) => a.level - b.level)
      .filter(x => !selected.some(other =>
        other.code !== x.code &&
        other.level > 0 &&
        other.level < x.level &&
        this.isAncestorCode(other.code, x.code)))
      .map(x => x.code);

    this.selectedCodes.set(codes);
  }

  constructor() {
    effect(() => {
      const customerId = this.customerId();
      const year = this.year();
      const empresa = this.empresa();

      if (!customerId || !year) {
        this.nodes.set([]);
        return;
      }

      const key = `${customerId}-${year}-${empresa}`;
      if (this.lastLoadKey === key) return;

      this.lastLoadKey = key;
      void this.loadCatalog(customerId, year, empresa);
    });
  }

  onFilter(event: any) {
    this.filterText.set(event.target.value);
  }

  onDragStart(event: DragEvent, node: TreeNode) {
    if (!this.isDraggable()) return;

    const code = node.data?.code;
    if (!event.dataTransfer || typeof code !== 'string' || code.length === 0) return;

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', code);
    event.dataTransfer.setData('application/x-luxuryapp-account-code', code);
  }

  onDragEnd(_event: DragEvent) {}

  private async loadCatalog(customerId: string, year: number, empresa: string) {
    this.loading.set(true);
    try {
      const tree = await this.catalogS.getTree(customerId, year, empresa);
      this.nodes.set(this.mapToTreeNodes(tree));
    } catch (error) {
      console.error('Error al cargar el catálogo de cuentas:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private mapToTreeNodes(data: IAccountTreeNode[]): TreeNode[] {
    return data.map(item => ({
      label: item.name,
      data: { code: item.code, name: item.name, level: item.level },
      expanded: item.level < 1, 
      leaf: item.children.length === 0,
      children: this.mapToTreeNodes(item.children)
    }));
  }

  private mapCodesToNodes(nodes: TreeNode[], codes: string[]): TreeNode[] {
    const result: TreeNode[] = [];
    const codeSet = new Set(codes);

    const traverse = (list: TreeNode[]) => {
      list.forEach(node => {
        if (codeSet.has(node.data.code)) result.push(node);
        if (node.children) traverse(node.children);
      });
    };

    traverse(nodes);
    return result;
  }

  private filterTree(nodes: TreeNode[], text: string): TreeNode[] {
    return nodes.map(node => {
      const match = node.data.code.toLowerCase().includes(text) || node.data.name.toLowerCase().includes(text);
      const filteredChildren = node.children ? this.filterTree(node.children, text) : [];
      
      if (match || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren, expanded: true };
      }
      return null;
    }).filter(n => n !== null) as TreeNode[];
  }

  private isAncestorCode(ancestor: string, descendant: string): boolean {
    if (ancestor === descendant) return false;
    if (ancestor.length === 1) return descendant.startsWith(ancestor);

    const parts = ancestor.split('-');
    if (parts.length !== 3) return false;

    if (parts[1] === '000' && parts[2] === '000') {
      return descendant.startsWith(`${parts[0]}-`);
    }

    if (parts[2] === '000') {
      return descendant.startsWith(`${parts[0]}-${parts[1]}-`);
    }

    return false;
  }

  getBadgeSeverity(level: number): 'info' | 'success' | 'warning' | 'secondary' {
    if (level <= 1) return 'info';
    if (level === 2) return 'success';
    return 'warning';
  }
}
