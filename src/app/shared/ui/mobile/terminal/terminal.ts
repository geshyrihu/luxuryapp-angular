import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TerminalBase } from "@ui/base/terminal.base";

@Component({
  selector: "ili-terminal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ili-terminal">
      <div class="ili-terminal-header">{{ welcomeMessage() }}</div>
      <div class="ili-terminal-body">
        <div class="ili-terminal-output">
          <ng-content />
        </div>
        <div class="ili-terminal-input-line">
          <span class="ili-terminal-prompt">{{ prompt() }}</span>
          <input
            class="ili-terminal-input"
            type="text"
            #input
            (keydown.enter)="onCommand(input.value); input.value = ''"
            placeholder="Escribe un comando..."
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ili-terminal {
      display: block;
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 8px);
      overflow: hidden;
      font-family: monospace;
      background: var(--ds-bg-terminal, #1e1e2e);
      color: var(--ds-text-terminal, #cdd6f4);
    }
    .ili-terminal-header {
      padding: 0.5rem 0.75rem;
      font-size: var(--ds-font-size-caption, 0.8125rem);
      font-weight: 600;
      background: var(--ds-bg-elevated, #181825);
      border-bottom: 1px solid var(--ds-border, #313244);
      color: var(--ds-text-muted, #6c7086);
    }
    .ili-terminal-body {
      padding: 0.75rem;
    }
    .ili-terminal-output {
      min-height: 4rem;
      margin-bottom: 0.5rem;
      font-size: var(--ds-font-size-body, 0.9375rem);
      white-space: pre-wrap;
    }
    .ili-terminal-input-line {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .ili-terminal-prompt {
      color: var(--ds-primary, #89b4fa);
      font-weight: 600;
    }
    .ili-terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
    }
    .ili-terminal-input::placeholder {
      color: var(--ds-text-muted, #6c7086);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileTerminal extends TerminalBase {
  protected onCommand(value: string): void {
    if (value.trim()) {
      console.log("[ili-terminal] command:", value);
    }
  }
}
