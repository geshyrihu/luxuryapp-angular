import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TerminalBase } from "@ui/base/terminal.base";

@Component({
  selector: "ili-terminal",

  imports: [],
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
  styles: [
    `
      .ili-terminal {
        display: block;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        overflow: hidden;
        font-family: monospace;
        background: var(--ds-bg-terminal);
        color: var(--ds-text-terminal);
      }
      .ili-terminal-header {
        padding: 0.5rem 0.75rem;
        font-size: var(--ds-font-size-help);
        font-weight: 600;
        background: var(--ds-bg-elevated);
        border-bottom: 1px solid var(--ds-border);
        color: var(--ds-text-muted);
      }
      .ili-terminal-body {
        padding: 0.75rem;
      }
      .ili-terminal-output {
        min-height: 4rem;
        margin-bottom: 0.5rem;
        font-size: var(--ds-font-size-body);
        white-space: pre-wrap;
      }
      .ili-terminal-input-line {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .ili-terminal-prompt {
        color: var(--ds-primary);
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
        color: var(--ds-text-muted);
      }
    `,
  ],
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
