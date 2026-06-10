import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderEmployeeMonitor } from './header-employee-monitor';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { HidescrollnavService } from 'src/app/core/services/hidescrollnav.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { SearchService } from 'src/app/core/services/search.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { UpdateService } from 'src/app/core/services/update-pwa.service';
import { FeatureAnnouncementService } from 'src/app/core/services/feature-announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';

const aspRoleServiceMock = {
  roleSignal: vi.fn(() => vi.fn(() => false)),
};

const authServiceMock = {
  applicationUserId: 'test-user-id',
  infoUserAuth: { photoPath: 'profile.jpg' },
  customerAccess: [],
};

const customerIdServiceMock = {
  customerId: vi.fn(() => 'test-customer-id'),
  nombreCorto: vi.fn(() => 'Test Customer'),
  customerPhotoPath: vi.fn(() => 'photo.jpg'),
  setCustomerId: vi.fn(() => of(null)),
};

const hideScroolNavServiceMock = {
  headerFixed: false,
};

const locationMock = {
  back: vi.fn(),
  forward: vi.fn(),
};

const menuServiceMock = {
  collapseSidebar: false,
  toggleSidebar: vi.fn(),
};

const routerMock = {
  events: new Subject(),
  url: '',
  navigateByUrl: vi.fn(() => Promise.resolve(true)),
  routeReuseStrategy: { shouldReuseRoute: vi.fn(() => true) },
  routerState: { snapshot: {} },
};

const searchServiceMock = {
  text: '',
  itemsData: vi.fn(() => []),
  menuItems: [],
  searchResult: false,
  searchResultEmpty: false,
};

const themeServiceMock = {
  toggleTheme: vi.fn(),
  getCurrentTheme: vi.fn(() => 'light'),
};

const updateServiceMock = {
  forceCheckUpdate: undefined,
  updateAvailable$: of(false),
  activateUpdate: vi.fn(),
};

const featureAnnouncementServiceMock = {
  showDialog: { set: vi.fn(), update: vi.fn() },
};

const activatedRouteMock = {
  data: of({}),
  snapshot: { data: {} },
  firstChild: null,
  outlet: 'primary',
  parent: { snapshot: { data: {} } },
};

describe('HeaderEmployeeMonitor', () => {
  let component: HeaderEmployeeMonitor;
  let fixture: ComponentFixture<HeaderEmployeeMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(HeaderEmployeeMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [HeaderEmployeeMonitor],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AspRoleService, useValue: aspRoleServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: HidescrollnavService, useValue: hideScroolNavServiceMock },
        { provide: Location, useValue: locationMock },
        { provide: MenuService, useValue: menuServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: UpdateService, useValue: updateServiceMock },
        { provide: FeatureAnnouncementService, useValue: featureAnnouncementServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    fixture = TestBed.createComponent(HeaderEmployeeMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize display nav icons on init', () => {
    expect(component.displayNavIcons.length).toBeGreaterThan(0);
  });

  it('should navigate to home', () => {
    component.onHome();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate back', () => {
    component.onBack();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should navigate forward', () => {
    component.onNext();
    expect(locationMock.forward).toHaveBeenCalled();
  });

  it('should refresh current route', () => {
    component.onRefresh();
    expect(routerMock.navigateByUrl).toHaveBeenCalled();
  });
});
