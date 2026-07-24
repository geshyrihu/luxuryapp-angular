import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { EmptyState } from "@ui/web/empty-state/empty-state";

@Component({
  selector: "primeng-custom-table-emptymessage",

  imports: [EmptyState],
  changeDetection: ChangeDetectionStrategy.Eager,
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
        />
      </td>
    </tr>
  `,
})
export class PrimeNgCustomTableEmptyMessage {
  colspan = input<number | string>(4);
  icon = input<string>("mdi:database-off-outline");
  iconColor = input<string>("var(--ds-text-muted)");
  title = input<string>("Sin registros");
  message = input<string>("No hay registros que mostrar.");
  tag = input<string>("");
  actionLabel = input<string>("");
  actionIcon = input<string>("mdi:plus");
  actionSeverity = input<
    "primary" | "secondary" | "success" | "info" | "warn" | "danger"
  >("primary");
}
