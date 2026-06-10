import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationsListWeb } from './notifications-list-web';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { Router } from '@angular/router';
import { SignalRService } from 'src/app/core/services/signalr.service';
import { ConsoleLoggerService } from 'src/app/core/services/console-logger.service';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

const apiResponseServiceMock = {
  onGetListNotLoading: vi.fn(() => Promise.resolve([])),
  onGetItem: vi.fn(() => Promise.resolve({})),
};

const routerMock = {
  navigateByUrl: vi.fn(() => Promise.resolve(true)),
};

const signalRServiceMock = {
  messageReceived$: new Subject<void>(),
};

const consoleLoggerServiceMock = {
  info: vi.fn(),
};

describe('NotificationsListWeb', () => {
  let component: NotificationsListWeb;
  let fixture: ComponentFixture<NotificationsListWeb>;

  beforeEach(() => {
    TestBed.overrideComponent(NotificationsListWeb, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [NotificationsListWeb],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SignalRService, useValue: signalRServiceMock },
        { provide: ConsoleLoggerService, useValue: consoleLoggerServiceMock },
      ],
    });

    fixture = TestBed.createComponent(NotificationsListWeb);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', () => {
    expect(apiResponseServiceMock.onGetListNotLoading).toHaveBeenCalled();
  });

  it('should start with loading false', () => {
    expect(component.loading()).toBe(false);
  });
});
