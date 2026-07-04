import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppCommentThread } from "@ui/web/comment-thread/comment-thread";
import { MobileCommentThread } from "@ui/mobile/comment-thread/comment-thread";
import { CommentThreadBase } from "@ui/base/comment-thread.base";

/**
 * Wrapper multiplataforma de CommentThread. Renderiza `app-comment-thread`
 * (PrimeNG) o `ili-comment-thread` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-comment-thread [comments]="..." />`.
 */
@Component({
  selector: "lx-comment-thread",
  standalone: true,
  imports: [AppCommentThread, MobileCommentThread],
  template: `
    @if (platform.isMobile()) {
      <ili-comment-thread
        [comments]="comments()"
        [title]="title()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        (submit)="submit.emit($event)"
        (react)="react.emit($event)"
      />
    } @else {
      <app-comment-thread
        [comments]="comments()"
        [title]="title()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        (submit)="submit.emit($event)"
        (react)="react.emit($event)"
      />
    }
  `,
})
export class LxCommentThread extends CommentThreadBase {
  protected platform = inject(PlatformService);
}
