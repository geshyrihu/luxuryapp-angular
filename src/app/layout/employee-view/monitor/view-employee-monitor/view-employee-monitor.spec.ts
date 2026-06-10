import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewEmployeeMonitor } from './view-employee-monitor';
import { MenuService } from 'src/app/core/services/menu.service';
import { HidescrollnavService } from 'src/app/core/services/hidescrollnav.service';
import { LayoutService } from 'src/app/core/services/layout.service';
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

describe('ViewEmployeeMonitor', () => {
  let component: ViewEmployeeMonitor;
  let fixture: ComponentFixture<ViewEmployeeMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(ViewEmployeeMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ViewEmployeeMonitor],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: HidescrollnavService, useValue: hideScroolNavServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ViewEmployeeMonitor);
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
