import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { TagSeverity } from "@ui/base/tag.base";

export interface MappedTagOption {
  value: string | number | boolean;
  label: string;
  severity: TagSeverity;
}

@Component({
  selector: "app-mapped-p-tag",
  standalone: true,
  imports: [TagModule],
  template: `
    <p-tag
      [value]="resolvedLabel()"
      [severity]="resolvedSeverity()"
      [rounded]="rounded()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MappedPTag {
  value = input<string | number | boolean | null | undefined>(null);
  options = input<MappedTagOption[]>([]);
  rounded = input<boolean>(true);
  fallbackLabel = input<string>("Sin estado");
  fallbackSeverity = input<TagSeverity>("secondary");

  private readonly selected = computed(() =>
    this.options().find((item) => Object.is(item.value, this.value())),
  );

  protected readonly resolvedLabel = computed(() => {
    const selected = this.selected();
    if (selected) return selected.label;

    const value = this.value();
    return value === null || value === undefined || value === ""
      ? this.fallbackLabel()
      : String(value);
  });

  protected readonly resolvedSeverity = computed(
    () => this.selected()?.severity ?? this.fallbackSeverity(),
  );
}
