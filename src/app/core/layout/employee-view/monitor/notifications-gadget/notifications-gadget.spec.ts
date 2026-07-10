import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { vi } from "vitest";
import { NotificationsGadget } from "./notifications-gadget";

const apiResponseServiceMock = {
  onGetListNotLoading: vi.fn((endpoint: string) => {
    if (endpoint === "notifications/unread-count") return Promise.resolve(0);
    return Promise.resolve([]);
  }),
  onGetItem: vi.fn(() => Promise.resolve({})),
};

const routerMock = {
  navigate: vi.fn(() => Promise.resolve(true)),
};

const signalRServiceMock = {
  messageReceived$: new Subject<void>(),
};

const consoleLoggerServiceMock = {
  info: vi.fn(),
};

describe("NotificationsGadget", () => {
  let component: NotificationsGadget;
  let fixture: ComponentFixture<NotificationsGadget>;

  beforeEach(() => {
    TestBed.overrideComponent(NotificationsGadget, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [NotificationsGadget],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SignalRService, useValue: signalRServiceMock },
        { provide: ConsoleLoggerService, useValue: consoleLoggerServiceMock },
      ],
    });

    fixture = TestBed.createComponent(NotificationsGadget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load notifications on init", () => {
    expect(apiResponseServiceMock.onGetListNotLoading).toHaveBeenCalledWith(
      "notifications",
    );
    expect(apiResponseServiceMock.onGetListNotLoading).toHaveBeenCalledWith(
      "notifications/unread-count",
    );
  });

  it("should start with 0 unread messages", () => {
    expect(component.messageInNotRead()).toBe(0);
  });
});
