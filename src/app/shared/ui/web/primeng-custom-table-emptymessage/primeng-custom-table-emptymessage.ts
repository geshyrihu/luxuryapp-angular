import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { EmptyState } from "@ui/web/empty-state/empty-state";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

@Component({
  selector: "primeng-custom-table-emptymessage",

  imports: [EmptyState],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host > td {
        text-align: center !important;
      }
    `,
  ],
  template: `
    <tr>
      <td [attr.colspan]="colspan()" style="text-align: center">
        <app-empty-state
          [icon]="icon()"
          [iconColor]="iconColor()"
          [title]="title()"
          [message]="message()"
          [tag]="tag()"
          [actionLabel]="actionLabel()"
          [actionIcon]="actionIcon()"
          [actionSeverity]="actionSeverity()"
          style="display: inline-block"
        />
      </td>
    </tr>
  `,
})
export class PrimeNgCustomTableEmptyMessage {
  colspan = input<number | string>(4);
  icon = input<AppIconName>("material-symbols-light:database-off-outline");
  iconColor = input<string>("var(--ds-text-muted)");
  title = input<string>("Sin registros");
  message = input<string>("No hay registros que mostrar.");
  tag = input<string>("");
  actionLabel = input<string>("");
  actionIcon = input<AppIconName>("material-symbols-light:add");
  actionSeverity = input<
    "primary" | "secondary" | "success" | "info" | "warn" | "danger"
  >("primary");
}
