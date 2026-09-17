import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
} from "@angular/core";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";

interface HeaderEmployeeAiModalData {
  content: TemplateRef<unknown>;
}

@Component({
  selector: "app-header-employee-ai-modal",
  imports: [NgTemplateOutlet],
  template: `
    <ng-container
      *ngTemplateOutlet="content; context: { close: close }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderEmployeeAiModal {
  private readonly config = inject(
    DynamicDialogConfig<HeaderEmployeeAiModalData>,
  );
  private readonly ref = inject(DynamicDialogRef);

  protected readonly content = this.config.data.content;
  protected readonly close = () => this.ref.close();
}
