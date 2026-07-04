import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileUserMobile } from './profile-user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UpdateService } from 'src/app/core/services/update-pwa.service';
import { ConsoleLoggerService } from 'src/app/core/services/console-logger.service';
import { ProfielService } from 'src/app/core/services/profiel-service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { vi } from 'vitest';
import { of, Subject } from 'rxjs';

vi.mock('@ionic/angular/standalone', () => ({
  IonAvatar: class {},
  IonContent: class {},
  IonIcon: class {},
  IonItem: class {},
  IonLabel: class {},
  IonList: class {},
  IonPopover: class {},
  IonSelect: class {},
  IonSelectOption: class {},
}));

describe('ProfileUserMobile', () => {
  let component: ProfileUserMobile;
  let fixture: ComponentFixture<ProfileUserMobile>;
  let updateServiceMock: any;
  let apiResponseServiceMock: any;
  let authServiceMock: any;
  let aspRoleServiceMock: any;
  let customerIdServiceMock: any;
  let menuServiceMock: any;
  let profielServiceMock: any;
  let routerMock: any;
  let consoleLoggerMock: any;

  beforeEach(() => {
    const imagenPerfilSubject = new Subject<any>();

    updateServiceMock = {
      activateUpdate: vi.fn(),
    };

    apiResponseServiceMock = {};

    authServiceMock = {
      infoUserAuth: {
        photoPath: 'test-photo.jpg',
        customerId: '123',
        applicationUserId: '456',
        customer: 'Test Customer',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-0000',
        fullName: 'Test User',
        position: 'Tester',
        customerPhotoPath: 'customer-photo.jpg',
      },
      logout: vi.fn().mockReturnValue(of(null)),
      customerAccess: [],
    };

    aspRoleServiceMock = {
      roleSignal: vi.fn().mockReturnValue(vi.fn().mockReturnValue(false)),
    };

    customerIdServiceMock = {
      nombreCorto: vi.fn().mockReturnValue('Test Customer'),
      customerPhotoPath: vi.fn().mockReturnValue('photo.jpg'),
      customerId: vi.fn().mockReturnValue('123'),
      setCustomerId: vi.fn().mockReturnValue(of(true)),
    };

    menuServiceMock = {};

    profielServiceMock = {
      imagenPerfilActualizada$: imagenPerfilSubject.asObservable(),
    };

    routerMock = {
      navigateByUrl: vi.fn(),
    };

    consoleLoggerMock = {
      custom: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      success: vi.fn(),
    };

    TestBed.overrideComponent(ProfileUserMobile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ProfileUserMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UpdateService, useValue: updateServiceMock },
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AspRoleService, useValue: aspRoleServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: MenuService, useValue: menuServiceMock },
        { provide: ProfielService, useValue: profielServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ConsoleLoggerService, useValue: consoleLoggerMock },
      ],
    });

    fixture = TestBed.createComponent(ProfileUserMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profileImageUrl from authService', () => {
    expect(component.profileImageUrl).toBe('test-photo.jpg');
  });

  it('should initialize customerName from customerIdService', () => {
    expect(component.customerName()).toBe('Test Customer');
  });

  it('should call authService.logout on logOut', () => {
    component.logOut();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should call selectCustomer on customer change', () => {
    component.selectCustomer('new-customer-id');
    expect(customerIdServiceMock.setCustomerId).toHaveBeenCalledWith('new-customer-id');
  });
});
