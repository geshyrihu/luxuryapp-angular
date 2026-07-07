import { CommonModule } from "@angular/common";
import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MarkdownModule } from "ngx-markdown";
import { AiChatService } from "src/app/core/services/ai-chat.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-ai-chat-widget",
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: "./ai-chat-widget.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .chat-bubble {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          #6366f1 0%,
          #a855f7 100%
        ); /* Indigo to Purple */
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }
      .chat-bubble:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
      }
      .chat-window {
        position: fixed;
        bottom: 90px;
        right: 20px;
        z-index: 9999;
        width: 380px;
        height: 600px;
        max-height: 80vh;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
      }
      .message-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        background-color: #f8fafc;
      }
      .message {
        display: flex;
        margin-bottom: 1rem;
      }
      .message.user {
        justify-content: flex-end;
      }
      .message.assistant {
        justify-content: flex-start;
      }
      .bubble {
        max-width: 80%;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      .message.user .bubble {
        background-color: #6366f1;
        color: white;
        border-bottom-right-radius: 2px;
      }
      .message.assistant .bubble {
        background-color: white;
        color: #1e293b;
        border: 1px solid #e2e8f0;
        border-bottom-left-radius: 2px;
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .typing-indicator span {
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: #94a3b8;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
        margin: 0 2px;
      }
      .typing-indicator span:nth-child(1) {
        animation-delay: -0.32s;
      }
      .typing-indicator span:nth-child(2) {
        animation-delay: -0.16s;
      }
      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `,
  ],
})
export class AiChatWidget {
  chatS = inject(AiChatService);
  authS = inject(AuthService);

  isOpen = signal<boolean>(false);
  newMessage = signal<string>("");

  @ViewChild("scrollContainer") private scrollContainer!: ElementRef;

  constructor() {
    effect(() => {
      // Auto-scroll on new messages
      if (this.chatS.messages().length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  toggleChat() {
    this.isOpen.update((v) => !v);
    if (this.isOpen() && this.chatS.sessions().length === 0) {
      this.chatS.loadSessions();
    }
  }

  async sendMessage() {
    if (!this.newMessage().trim()) return;
    const msg = this.newMessage();
    this.newMessage.set("");
    await this.chatS.sendMessage(msg);
  }

  startNew() {
    this.chatS.startNewSession();
  }

  selectSession(id: string) {
    this.chatS.selectSession(id);
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
