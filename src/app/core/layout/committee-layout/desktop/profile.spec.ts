import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, Subject } from "rxjs";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ProfielService } from "@core/auth/services/profiel-service";
import { ConsoleLoggerService } from "@core/services/console-logger.service";
import { UpdateService } from "@core/services/update-pwa.service";
import { vi } from "vitest";
import { ProfileCommitteedesktop } from "./profile";

describe("ProfileCommitteedesktop", () => {
  let component: ProfileCommitteedesktop;
  let fixture: ComponentFixture<ProfileCommitteedesktop>;
  let authServiceMock: any;
  let updateServiceMock: any;
  let consoleLoggerMock: any;
  let profielServiceMock: any;
  let customerIdServiceMock: any;

  beforeEach(() => {
    const imagenPerfilSubject = new Subject<any>();

    authServiceMock = {
      infoUserAuth: {
        photoPath: "test-photo.jpg",
        customerId: "123",
        applicationUserId: "456",
        customer: "Test Customer",
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        phone: "555-0000",
        fullName: "Test User",
        position: "Tester",
        customerPhotoPath: "customer-photo.jpg",
      },
      logout: vi.fn().mockReturnValue(of(null)),
      customerAccess: [],
    };

    updateServiceMock = {
      activateUpdate: vi.fn(),
    };

    consoleLoggerMock = {
      custom: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      success: vi.fn(),
    };

    profielServiceMock = {
      imagenPerfilActualizada$: imagenPerfilSubject.asObservable(),
    };

    customerIdServiceMock = {
      nombreCorto: vi.fn().mockReturnValue("Test Customer"),
      customerPhotoPath: vi.fn().mockReturnValue("photo.jpg"),
      customerId: vi.fn().mockReturnValue("123"),
      setCustomerId: vi.fn().mockReturnValue(of(true)),
    };

    TestBed.overrideComponent(ProfileCommitteedesktop, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ProfileCommitteedesktop],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UpdateService, useValue: updateServiceMock },
        { provide: ConsoleLoggerService, useValue: consoleLoggerMock },
        { provide: ProfielService, useValue: profielServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ProfileCommitteedesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize profileImageUrl from authService", () => {
    expect(component.profileImageUrl()).toBe("test-photo.jpg");
  });

  it("should call authService.logout on logout", () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it("should call updateService.activateUpdate on onUpdateClick", () => {
    component.onUpdateClick();
    expect(updateServiceMock.activateUpdate).toHaveBeenCalled();
  });
});

