import { Component, inject } from "@angular/core";
import { CommentThreadBase } from "@ui/base/comment-thread.base";
import { MobileCommentThread } from "@ui/mobile/comment-thread/comment-thread";
import { AppCommentThread } from "@ui/web/comment-thread/comment-thread";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de CommentThread. Renderiza `app-comment-thread`
 * (PrimeNG) o `ili-comment-thread` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-comment-thread [comments]="..." />`.
 */
@Component({
  selector: "lx-comment-thread",

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
