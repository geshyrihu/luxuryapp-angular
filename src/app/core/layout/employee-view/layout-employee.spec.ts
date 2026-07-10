import { BreakpointObserver } from "@angular/cdk/layout";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { OneSignalService } from "src/app/core/services/one-signal.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { vi } from "vitest";
import { LayoutEmployee } from "./layout-employee";

const consoleLoggerServiceMock = {
  custom: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
};

const authServiceMock = {
  applicationUserId: "test-user-id",
};

const signalRServiceMock = {
  start: vi.fn(),
};

const oneSignalServiceMock = {
  initializeAndLoginUser: vi.fn(),
};

const breakpointObserverMock = {
  observe: vi.fn(() => of({ matches: false })),
};

describe("LayoutEmployee", () => {
  let component: LayoutEmployee;
  let fixture: ComponentFixture<LayoutEmployee>;

  beforeEach(() => {
    TestBed.overrideComponent(LayoutEmployee, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
        providers: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LayoutEmployee],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ConsoleLoggerService, useValue: consoleLoggerServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: SignalRService, useValue: signalRServiceMock },
        { provide: OneSignalService, useValue: oneSignalServiceMock },
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    });

    fixture = TestBed.createComponent(LayoutEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start SignalR and OneSignal on init", () => {
    expect(signalRServiceMock.start).toHaveBeenCalled();
    expect(oneSignalServiceMock.initializeAndLoginUser).toHaveBeenCalledWith(
      "test-user-id",
    );
  });

  it("should have isMobileView signal defaulting to false", () => {
    expect(component.isMobileView()).toBe(false);
  });
});
