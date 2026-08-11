import { Directive, input, output, signal } from "@angular/core";
import { avatarBackground } from "./avatar-palette";

export interface Comment {
  id: string;
  authorName: string;
  authorInitials?: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
  edited?: boolean;
  reactions?: { emoji: string; count: number }[];
}

/**
 * Base compartida de CommentThread (API + form + avatar).
 *  - web:     `app-comment-thread` (pTextarea + p-button)
 *  - mobile:  `ili-comment-thread` (ion-textarea + ion-button)
 *  - wrapper: `lx-comment-thread`  (auto runtime)
 */
@Directive()
export abstract class CommentThreadBase {
  comments = input<Comment[]>([]);
  title = input<string>("Comentarios");
  placeholder = input<string>("Escribe un comentario...");
  readonly = input<boolean>(false);

  submit = output<string>();
  react = output<{ commentId: string; emoji: string }>();

  newText = "";
  submitting = signal(false);

  submitComment(): void {
    const text = this.newText.trim();
    if (!text) return;
    this.submit.emit(text);
    this.newText = "";
  }

  avatarBg(c: Comment): string {
    return avatarBackground(c.authorName);
  }

  initials(name: string): string {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
}
