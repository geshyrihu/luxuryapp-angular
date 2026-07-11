import { Injectable, inject, signal } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomerIdService } from "../auth/services/customer-id.service";

export interface ChatSessionDto {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessageDto {
  id: string;
  sessionId: string;
  role: string; // 'User' | 'Assistant'
  content: string;
  timestamp: string;
}

export interface SendMessageDto {
  sessionId?: string;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class AiChatService {
  private api = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  // State
  currentSessionId = signal<string | null>(null);
  sessions = signal<ChatSessionDto[]>([]);
  messages = signal<ChatMessageDto[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    this.loadSessions();
  }

  async loadSessions() {
    const res = await this.api.onGetList<ChatSessionDto[]>("AiChat/Sessions");
    this.sessions.set(res || []);
  }

  async startNewSession() {
    this.isLoading.set(true);
    const res = await this.api.onPost<ChatSessionDto>(
      "AiChat/StartSession",
      {},
    );
    if (res) {
      this.sessions.update((s) => [res, ...s]);
      this.currentSessionId.set(res.id);
      this.messages.set([]); // New session empty
    }
    this.isLoading.set(false);
  }

  async selectSession(sessionId: string) {
    this.currentSessionId.set(sessionId);
    this.isLoading.set(true);
    const res = await this.api.onGetList<ChatMessageDto[]>(
      `AiChat/History/${sessionId}`,
    );
    this.messages.set(res || []);
    this.isLoading.set(false);
  }

  async sendMessage(message: string) {
    if (!message.trim()) return;

    // Optimistic UI update
    const tempMsg: ChatMessageDto = {
      id: crypto.randomUUID(),
      sessionId: this.currentSessionId() || "",
      role: "User",
      content: message,
      timestamp: new Date().toISOString(),
    };

    this.messages.update((msgs) => [...msgs, tempMsg]);
    this.isLoading.set(true);

    const payload: SendMessageDto = {
      sessionId: this.currentSessionId() || undefined,
      message: message,
    };

    // Call API
    // Note: onPost normally returns the T response. My backend returns generic ApiResponseDto<string>.
    // The ApiResponseService unwraps it.
    const responseText = await this.api.onPost<string>(
      "AiChat/SendMessage",
      payload,
    );

    // Add AI response
    if (responseText) {
      const aiMsg: ChatMessageDto = {
        id: crypto.randomUUID(),
        sessionId: this.currentSessionId() || "",
        role: "Assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      this.messages.update((msgs) => [...msgs, aiMsg]);

      // If it was a new session created implicitly, reload sessions to get the ID and Title
      if (!this.currentSessionId()) {
        await this.loadSessions();
        // Try to guess which one is active (most recent)
        if (this.sessions().length > 0) {
          this.currentSessionId.set(this.sessions()[0].id);
        }
      }
    }

    this.isLoading.set(false);
  }
}
