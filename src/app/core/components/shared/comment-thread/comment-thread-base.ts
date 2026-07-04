import { Directive, input, output, signal } from "@angular/core";

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
    const colors = ["#003d9b", "#006477", "#006837", "#b45309", "#7c3aed", "#ba1a1a"];
    let h = 0;
    for (const ch of c.authorName) h = ch.charCodeAt(0) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
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
