vi.mock("@ionic/angular/standalone", () => ({}));
vi.mock("@ionic/core", () => ({}));
vi.mock("@ionic/core/components", () => ({}));

import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { AiChatService } from "src/app/core/services/ai-chat.service";
import { AiChatWidget } from "./ai-chat-widget";

describe("AiChatWidget", () => {
  let component: AiChatWidget;
  let fixture: ComponentFixture<AiChatWidget>;
  let chatS: AiChatService;
  let authS: AuthService;

  beforeEach(() => {
    chatS = {
      messages: signal([]),
      sessions: signal([]),
      currentSessionId: signal(null),
      isLoading: signal(false),
      loadSessions: vi.fn(),
      sendMessage: vi.fn(),
      startNewSession: vi.fn(),
      selectSession: vi.fn(),
    } as any;

    authS = { applicationUserId: "user-1" } as any;

    TestBed.configureTestingModule({
      imports: [AiChatWidget, NoopAnimationsModule],
      providers: [
        { provide: AiChatService, useValue: chatS },
        { provide: AuthService, useValue: authS },
      ],
    });
    fixture = TestBed.createComponent(AiChatWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start with chat closed", () => {
    expect(component.isOpen()).toBe(false);
  });

  it("should start with empty newMessage", () => {
    expect(component.newMessage()).toBe("");
  });

  it("toggleChat should open and close", () => {
    component.toggleChat();
    expect(component.isOpen()).toBe(true);
    component.toggleChat();
    expect(component.isOpen()).toBe(false);
  });

  it("toggleChat should load sessions when opening with no sessions", () => {
    component.toggleChat();
    expect(chatS.loadSessions).toHaveBeenCalled();
  });

  it("toggleChat should not load sessions when sessions exist", () => {
    (chatS.sessions as any).set([{ id: "1" }]);
    component.toggleChat();
    expect(chatS.loadSessions).not.toHaveBeenCalled();
  });

  it("sendMessage should do nothing for empty message", async () => {
    component.newMessage.set("   ");
    await component.sendMessage();
    expect(chatS.sendMessage).not.toHaveBeenCalled();
  });

  it("sendMessage should call service and clear input", async () => {
    component.newMessage.set("Hello AI");
    await component.sendMessage();
    expect(chatS.sendMessage).toHaveBeenCalledWith("Hello AI");
    expect(component.newMessage()).toBe("");
  });

  it("startNew should call service", () => {
    component.startNew();
    expect(chatS.startNewSession).toHaveBeenCalled();
  });

  it("selectSession should call service with id", () => {
    component.selectSession("session-1");
    expect(chatS.selectSession).toHaveBeenCalledWith("session-1");
  });

  it("onKeydown with Enter should send message", async () => {
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    component.newMessage.set("test");
    component.onKeydown(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(chatS.sendMessage).toHaveBeenCalledWith("test");
  });

  it("onKeydown with Shift+Enter should not send", () => {
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      shiftKey: true,
    });
    component.onKeydown(event);
    expect(chatS.sendMessage).not.toHaveBeenCalled();
  });
});
