import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";
import { vi } from "vitest";
import { Sidebar } from "./sidebar";

const menuServiceMock = {
  collapseSidebar: false,
  toggleSidebar: vi.fn(),
  sidebarMenuItems: vi.fn(() => []),
  menuLoading: vi.fn(() => false),
};

const customerIdServiceMock = {
  customerId: vi.fn(() => "test-customer-id"),
  nombreCorto: vi.fn(() => "Test Customer"),
  customerPhotoPath: vi.fn(() => "photo.jpg"),
};

const authServiceMock = {
  infoUserAuth: { photoPath: "profile.jpg" },
};

const routerMock = {
  events: new Subject(),
  url: "/dashboard",
};

const layoutServiceMock = {
  config: {
    settings: {
      sidebar_type: "compact-wrapper",
    },
  },
};

describe("Sidebar", () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(() => {
    TestBed.overrideComponent(Sidebar, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Sidebar],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: LayoutService, useValue: layoutServiceMock },
      ],
    });

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have profile image from auth", () => {
    expect(component.profileImageUrl).toBe("profile.jpg");
  });

  it("should toggle sidebar collapse property", () => {
    const initial = component.menuService.collapseSidebar;
    component.sidebarToggle();
    expect(component.menuService.collapseSidebar).toBe(!initial);
  });

  it("should search menu items", () => {
    component.searchText = "test";
    component.searchTerm();
    expect(component.isSearching).toBe(true);
  });

  it("should clear search", () => {
    component.searchText = "test";
    component.searchResults = [
      {
        id: "test-id",
        label: "test",
        routerLink: "/test",
        nameModule: "test-module",
      },
    ];
    component.isSearching = true;
    component.clearSearch();
    expect(component.searchText).toBe("");
    expect(component.searchResults.length).toBe(0);
    expect(component.isSearching).toBe(false);
  });
});
