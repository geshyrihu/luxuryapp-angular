import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "@core/auth/services/auth.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ConsoleLoggerService } from "@core/services/console-logger.service";
import { SignalRService } from "@core/services/signalr.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { NotificationsListMobile } from "./notifications-list-mobile";

const apiResponseServiceMock = {
  onGetListNotLoading: vi.fn(() => Promise.resolve([])),
  onGetItem: vi.fn(() => Promise.resolve({})),
  onDelete: vi.fn(() => Promise.resolve(true)),
};

const authServiceMock = {};

const routerMock = {
  navigateByUrl: vi.fn(() => Promise.resolve(true)),
};

const signalRServiceMock = {
  messageReceived$: new Subject<void>(),
};

const consoleLoggerServiceMock = {
  info: vi.fn(),
};

const confirmServiceMock = {
  confirm: vi.fn(() => Promise.resolve(true)),
};

describe("NotificationsListMobile", () => {
  let component: NotificationsListMobile;
  let fixture: ComponentFixture<NotificationsListMobile>;

  beforeEach(() => {
    vi.clearAllMocks();
    apiResponseServiceMock.onGetListNotLoading.mockResolvedValue([]);
    apiResponseServiceMock.onDelete.mockResolvedValue(true);
    confirmServiceMock.confirm.mockResolvedValue(true);

    TestBed.overrideComponent(NotificationsListMobile, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [NotificationsListMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SignalRService, useValue: signalRServiceMock },
        { provide: ConsoleLoggerService, useValue: consoleLoggerServiceMock },
        { provide: ConfirmService, useValue: confirmServiceMock }],
    });

    fixture = TestBed.createComponent(NotificationsListMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("onDeleteNotification should not delete when confirmation is cancelled", async () => {
    confirmServiceMock.confirm.mockResolvedValueOnce(false);

    await component.onDeleteNotification("1");

    expect(confirmServiceMock.confirm).toHaveBeenCalled();
    expect(apiResponseServiceMock.onDelete).not.toHaveBeenCalled();
  });

  it("onDeleteNotification should delete when confirmed", async () => {
    await component.onDeleteNotification("1");

    expect(apiResponseServiceMock.onDelete).toHaveBeenCalledWith(
      "notifications/1",
    );
  });
});
