import { ChangeDetectionStrategy, Component, input, inject } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DebugConsoleService } from "src/app/core/services/debug-console.service";

interface LogEntry {
  level: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: string;
  details?: string;
}

/**
 * Componente para mostrar logs en pantalla (debugging en producción).
 * Se muestra como un overlay flotante en la esquina inferior.
 */
@Component({
  selector: "lx-debug-console",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-96 bg-gray-900 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-700"
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800">
        <span class="text-white font-bold text-sm">🐛 Debug Console</span>
        <div class="flex gap-2">
          <button
            (click)="debugConsole.clearLogs()"
            class="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
          <button
            (click)="debugConsole.toggleConsole()"
            class="text-white hover:text-gray-300"
          >
            <app-icon icon="mdi:close" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Logs -->
      <div class="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
        @if (logs().length === 0) {
        <div class="text-gray-500 text-center py-8">No logs yet...</div>
        } @else { @for (log of logs(); track log.timestamp) {
        <div
          [class]="
            'px-2 py-1 rounded break-words ' +
            getLogColor(log.level)
          "
        >
          <span class="text-gray-400">{{ log.timestamp }}</span>
          <span class="text-gray-500">[{{ log.level.toUpperCase() }}]</span>
          <span class="text-white">{{ log.message }}</span>
          @if (log.details) {
          <div class="text-gray-400 ml-4 mt-1">{{ log.details }}</div>
          }
        </div>
        } }
      </div>

      <!-- Stats -->
      <div class="border-t border-gray-700 p-2 bg-gray-800 text-xs text-gray-400">
        {{ logs().length }} logs
      </div>
    </div>
  `,
})
export class LxDebugConsole {
  logs = input<any[]>([]);
  debugConsole = inject(DebugConsoleService);

  getLogColor(level: string): string {
    switch (level) {
      case "error":
        return "bg-red-900/30 text-red-400";
      case "warn":
        return "bg-yellow-900/30 text-yellow-400";
      case "info":
        return "bg-blue-900/30 text-blue-400";
      default:
        return "bg-gray-800/50 text-gray-300";
    }
  }
}
