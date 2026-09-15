import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Subject, of } from "rxjs";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ProfielService } from "@core/auth/services/profiel-service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ConsoleLoggerService } from "@core/services/console-logger.service";
import { UpdateService } from "@core/services/update-pwa.service";
import { vi } from "vitest";
import { Profiledesktop } from "./profile-desktop";

const updateServiceMock = {
  activateUpdate: vi.fn(),
};

const apiResponseServiceMock = {};

const authServiceMock = {
  infoUserAuth: {
    customerId: "",
    applicationUserId: "test-user-id",
    customer: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photoPath: "profile.jpg",
    fullName: "",
    position: "",
    customerPhotoPath: "",
  },
  logout: vi.fn(() => of(null)),
};

const aspRoleServiceMock = {
  roleSignal: vi.fn(() => vi.fn(() => false)),
};

const customerIdServiceMock = {
  customerId: vi.fn(() => "test-customer-id"),
  customerPhotoPath: vi.fn(() => "photo.jpg"),
};

const profielServiceMock = {
  imagenPerfilActualizada$: new Subject<any>(),
};

const routerMock = {};

const consoleLoggerServiceMock = {
  custom: vi.fn(),
};

describe("Profiledesktop", () => {
  let component: Profiledesktop;
  let fixture: ComponentFixture<Profiledesktop>;

  beforeEach(() => {
    TestBed.overrideComponent(Profiledesktop, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Profiledesktop],
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

    fixture = TestBed.createComponent(Profiledesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have profile image from auth", () => {
    expect(component.profileImageUrl).toBe("profile.jpg");
  });

  it("should call logout", () => {
    component.logOut();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it("should call update on update click", () => {
    component.onUpdateClick();
    expect(updateServiceMock.activateUpdate).toHaveBeenCalled();
  });
});

