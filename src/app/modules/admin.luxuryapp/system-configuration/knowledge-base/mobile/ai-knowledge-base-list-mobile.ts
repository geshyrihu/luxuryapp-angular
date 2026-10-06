import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AiKnowledgeBaseDto } from "@core/interfaces/ai-knowledge-base.dto";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-ai-knowledge-base-list-mobile",
  templateUrl: "./ai-knowledge-base-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class AiKnowledgeBaseListMobile {
  data = input.required<AiKnowledgeBaseDto[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);

  add = output<any>();
  edit = output<any>();
  delete = output<string>();
}
