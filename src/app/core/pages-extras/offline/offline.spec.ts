import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Offline } from './offline';
import { ConnectivityService } from '../../services/connectivity.service';
import { RedirectService } from '../../services/redirect.service';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

describe('Offline', () => {
  let component: Offline;
  let fixture: ComponentFixture<Offline>;
  let mockConnectivityService: Partial<ConnectivityService>;
  let mockRedirectService: Partial<RedirectService>;
  let onlineSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    onlineSubject = new BehaviorSubject<boolean>(false);

    mockConnectivityService = {
      isOnline$: onlineSubject.asObservable(),
      isOnline: false,
    };

    mockRedirectService = {
      returnUrl: '/dashboard',
    };

    TestBed.overrideComponent(Offline, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Offline],
      providers: [
        { provide: ConnectivityService, useValue: mockConnectivityService },
        { provide: RedirectService, useValue: mockRedirectService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Offline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isRetrying default to false', () => {
    expect(component.isRetrying).toBe(false);
  });
});
