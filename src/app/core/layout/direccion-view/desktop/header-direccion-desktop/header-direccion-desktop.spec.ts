import { Location } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { vi } from "vitest";
import { HeaderDirecciondesktop } from "./header-direccion-desktop";

describe("HeaderDirecciondesktop", () => {
  let component: HeaderDirecciondesktop;
  let fixture: ComponentFixture<HeaderDirecciondesktop>;

  const authServiceMock = {
    customerAccess: [],
  };

  const customerIdServiceMock = {
    customerId: vi.fn(() => ""),
    nombreCorto: vi.fn(() => ""),
    customerPhotoPath: vi.fn(() => ""),
    setCustomerId: vi.fn().mockReturnValue(of(true)),
  };

  const themeServiceMock = {
    toggleTheme: vi.fn(),
    getCurrentTheme: vi.fn().mockReturnValue("light"),
    themeMode: vi.fn(() => "light"),
  };

  const locationMock = {
    back: vi.fn(),
    forward: vi.fn(),
  };

  const routerMock = {
    events: of(null),
    navigateByUrl: vi.fn().mockResolvedValue(true),
  };

  const activatedRouteMock = {
    snapshot: { data: {} },
    parent: null,
    firstChild: null,
    outlet: "primary",
  };

  beforeEach(() => {
    TestBed.overrideComponent(HeaderDirecciondesktop, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [HeaderDirecciondesktop],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: Location, useValue: locationMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    fixture = TestBed.createComponent(HeaderDirecciondesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
