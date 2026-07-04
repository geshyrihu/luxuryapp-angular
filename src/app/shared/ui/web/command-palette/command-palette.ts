import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

export interface PaletteCommand {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
  shortcut?: string;
  action: () => void;
}

@Component({
  selector: "app-command-palette",
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, AppIcon],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '520px', maxWidth: '95vw' }"
      [dismissableMask]="true"
      [draggable]="false"
      [resizable]="false"
      [closeOnEscape]="true"
      [showHeader]="false"
      (onShow)="onOpen()"
      (onHide)="onClose()"
    >
      <div class="palette-root" (keydown)="onKeydown($event)">
        <div class="palette-search">
          <app-icon icon="mdi:magnify" class="palette-search-icon" />
          <input
            #searchInput
            type="text"
            class="palette-input"
            [(ngModel)]="query"
            placeholder="Buscar comandos..."
            autocomplete="off"
            spellcheck="false"
          />
          @if (query()) {
            <button class="palette-clear" (click)="query.set('')">
              <app-icon icon="mdi:close" />
            </button>
          }
        </div>

        <div class="palette-results">
          @if (filtered().length === 0) {
            <div class="palette-empty">
              <app-icon icon="mdi:magnify-minus" class="text-2xl" />
              <span>Sin resultados</span>
            </div>
          }

          @for (group of grouped(); track group.category) {
            @if (group.commands.length) {
              <div class="palette-category">{{ group.category || "General" }}</div>
              @for (cmd of group.commands; track cmd.id; let i = $index) {
                <button
                  class="palette-item"
                  [class.palette-item-active]="selectedIndex() === globalIndex(grouped(), cmd.id)"
                  (click)="execute(cmd)"
                  (mouseenter)="setHover(cmd.id)"
                >
                  @if (cmd.icon) {
                    <app-icon [icon]="cmd.icon" class="palette-item-icon" />
                  }
                  <div class="palette-item-text">
                    <strong>{{ cmd.label }}</strong>
                    @if (cmd.description) {
                      <span class="palette-item-desc">{{ cmd.description }}</span>
                    }
                  </div>
                  @if (cmd.shortcut) {
                    <kbd class="palette-shortcut">{{ cmd.shortcut }}</kbd>
                  }
                </button>
              }
            }
          }
        </div>

        <div class="palette-footer">
          <span><kbd>↑↓</kbd> Navegar</span>
          <span><kbd>â†µ</kbd> Seleccionar</span>
          <span><kbd>Esc</kbd> Cerrar</span>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    .palette-root {
      display: flex;
      flex-direction: column;
      max-height: 70vh;
    }
    .palette-search {
      position: relative;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--ds-border, #e2e8f0);
      padding: 0.75rem;
    }
    .palette-search-icon {
      font-size: 1.25rem;
      color: var(--ds-text-muted);
      margin-right: 0.5rem;
      flex-shrink: 0;
    }
    .palette-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      background: transparent;
      color: var(--ds-text-primary);
    }
    .palette-clear {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--ds-text-muted);
      padding: 0.25rem;
    }
    .palette-results {
      flex: 1;
      overflow-y: auto;
      padding: 0.25rem 0;
    }
    .palette-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      color: var(--ds-text-muted);
    }
    .palette-category {
      padding: 0.5rem 0.75rem 0.25rem;
      font-size: var(--ds-font-size-micro, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ds-text-muted);
    }
    .palette-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
      color: var(--ds-text-primary);
      font-size: var(--ds-font-size-body, 0.9375rem);
      transition: background 0.1s;
    }
    .palette-item:hover,
    .palette-item-active {
      background: var(--ds-bg-hover, #f0f4ff);
    }
    .palette-item-icon {
      font-size: 1.125rem;
      color: var(--ds-text-secondary);
      flex-shrink: 0;
      width: 20px;
      text-align: center;
    }
    .palette-item-text {
      flex: 1;
      min-width: 0;
    }
    .palette-item-text strong {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .palette-item-desc {
      display: block;
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-muted);
      margin-top: 0.125rem;
    }
    .palette-shortcut {
      flex-shrink: 0;
    }
    .palette-footer {
      display: flex;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-top: 1px solid var(--ds-border, #e2e8f0);
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-muted);
    }
    .palette-footer kbd,
    .palette-shortcut {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 4px;
      background: var(--ds-bg-elevated, #f4f5f8);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: inherit;
      color: var(--ds-text-muted);
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class CommandPalette {
  commands = input.required<PaletteCommand[]>();
  visible = model(false);

  query = signal("");
  selectedIndex = signal(0);

  searchInput = viewChild<ElementRef<HTMLInputElement>>("searchInput");

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.commands();
    return this.commands().filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
    );
  });

  grouped = computed(() => {
    const groups = new Map<string, PaletteCommand[]>();
    for (const cmd of this.filtered()) {
      const cat = cmd.category || "General";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(cmd);
    }
    return Array.from(groups.entries()).map(([category, commands]) => ({
      category,
      commands,
    }));
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        setTimeout(() => this.searchInput()?.nativeElement?.focus(), 50);
      }
    });
  }

  onOpen(): void {
    this.query.set("");
    this.selectedIndex.set(0);
  }

  onClose(): void {
    this.visible.set(false);
  }

  @HostListener("document:keydown.meta.k", ["$event"])
  @HostListener("document:keydown.control.k", ["$event"])
  handleShortcut(event: KeyboardEvent): void {
    event.preventDefault();
    this.visible.update((v) => !v);
  }

  globalIndex(groups: { category: string; commands: PaletteCommand[] }[], cmdId: string): number {
    let idx = 0;
    for (const g of groups) {
      for (const c of g.commands) {
        if (c.id === cmdId) return idx;
        idx++;
      }
    }
    return 0;
  }

  setHover(cmdId: string): void {
    let idx = 0;
    for (const g of this.grouped()) {
      for (const c of g.commands) {
        if (c.id === cmdId) {
          this.selectedIndex.set(idx);
          return;
        }
        idx++;
      }
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.selectedIndex.update((i) => Math.min(i + 1, this.filtered().length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.selectedIndex.update((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const flat = this.filtered();
      const idx = this.selectedIndex();
      if (flat[idx]) {
        this.execute(flat[idx]);
      }
    }
  }

  execute(cmd: PaletteCommand): void {
    this.visible.set(false);
    cmd.action();
  }
}
