import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login';
import { vi } from 'vitest';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ConsoleLoggerService } from 'src/app/core/services/console-logger.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { LoginSliderService } from 'src/app/core/services/login-slider.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.overrideComponent(LoginComponent, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { login: vi.fn() } },
        { provide: CustomerIdService, useValue: { initializeCustomerStateAfterLogin: vi.fn() } },
        { provide: SecurityService, useValue: { resetAuthData: vi.fn() } },
        { provide: LoaderService, useValue: { show: vi.fn(), hide: vi.fn() } },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn() } },
        { provide: AspRoleService, useValue: { getRoles: vi.fn().mockReturnValue([]) } },
        { provide: LoginSliderService, useValue: { getVisibleImages$: () => of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });

  it('should have isSubmitDisabled true initially', () => {
    expect(component.isSubmitDisabled()).toBe(true);
  });

  it('should toggle show password', () => {
    expect(component.show).toBe(false);
    component.showPassword();
    expect(component.show).toBe(true);
  });
});
