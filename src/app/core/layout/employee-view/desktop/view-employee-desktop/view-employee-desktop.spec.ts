import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewEmployeedesktop } from './view-employee-desktop';
import { MenuService } from '@core/services/menu.service';
import { HidescrollnavService } from '@core/services/hidescrollnav.service';
import { LayoutService } from '@core/services/layout.service';
import { vi } from 'vitest';

const menuServiceMock = {
  collapseSidebar: false,
  toggleSidebar: vi.fn(),
};

const hideScroolNavServiceMock = {
  headerFixed: false,
};

const layoutServiceMock = {
  config: {
    settings: {
      sidebar_type: 'compact-wrapper',
    },
  },
};

describe('ViewEmployeedesktop', () => {
  let component: ViewEmployeedesktop;
  let fixture: ComponentFixture<ViewEmployeedesktop>;

  beforeEach(() => {
    TestBed.overrideComponent(ViewEmployeedesktop, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ViewEmployeedesktop],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: HidescrollnavService, useValue: hideScroolNavServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ViewEmployeedesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set body attribute on init', () => {
    expect(document.body.getAttribute('data-layout')).toBe('vertical');
  });

  it('should return layout class from config', () => {
    expect(component.layoutClass).toBe('compact-wrapper');
  });
});

