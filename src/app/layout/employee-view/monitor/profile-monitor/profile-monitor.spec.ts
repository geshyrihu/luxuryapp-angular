import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileMonitor } from './profile-monitor';
import { UpdateService } from 'src/app/core/services/update-pwa.service';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ProfielService } from 'src/app/core/services/profiel-service';
import { Router } from '@angular/router';
import { ConsoleLoggerService } from 'src/app/core/services/console-logger.service';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';

const updateServiceMock = {
  activateUpdate: vi.fn(),
};

const apiResponseServiceMock = {};

const authServiceMock = {
  infoUserAuth: {
    customerId: '',
    applicationUserId: 'test-user-id',
    customer: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    photoPath: 'profile.jpg',
    fullName: '',
    position: '',
    customerPhotoPath: '',
  },
  logout: vi.fn(() => of(null)),
};

const aspRoleServiceMock = {
  roleSignal: vi.fn(() => vi.fn(() => false)),
};

const customerIdServiceMock = {
  customerId: vi.fn(() => 'test-customer-id'),
  customerPhotoPath: vi.fn(() => 'photo.jpg'),
};

const profielServiceMock = {
  imagenPerfilActualizada$: new Subject<any>(),
};

const routerMock = {};

const consoleLoggerServiceMock = {
  custom: vi.fn(),
};

describe('ProfileMonitor', () => {
  let component: ProfileMonitor;
  let fixture: ComponentFixture<ProfileMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(ProfileMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ProfileMonitor],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UpdateService, useValue: updateServiceMock },
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AspRoleService, useValue: aspRoleServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: ProfielService, useValue: profielServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ConsoleLoggerService, useValue: consoleLoggerServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ProfileMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have profile image from auth', () => {
    expect(component.profileImageUrl).toBe('profile.jpg');
  });

  it('should call logout', () => {
    component.logOut();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should call update on update click', () => {
    component.onUpdateClick();
    expect(updateServiceMock.activateUpdate).toHaveBeenCalled();
  });
});
