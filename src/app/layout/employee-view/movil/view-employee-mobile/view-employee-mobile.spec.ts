import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewEmployeeMobile } from './view-employee-mobile';
import { MenuService } from 'src/app/core/services/menu.service';
import { HidescrollnavService } from 'src/app/core/services/hidescrollnav.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import { MenuController } from '@ionic/angular/standalone';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', () => {
  class MenuControllerMock {
    close = vi.fn();
  }

  return {
    IonAccordion: class {},
    IonAccordionGroup: class {},
    IonApp: class {},
    IonAvatar: class {},
    IonBadge: class {},
    IonButton: class {},
    IonButtons: class {},
    IonContent: class {},
    IonHeader: class {},
    IonIcon: class {},
    IonItem: class {},
    IonLabel: class {},
    IonList: class {},
    IonMenu: class {},
    IonPopover: class {},
    IonSelect: class {},
    IonSelectOption: class {},
    IonSpinner: class {},
    IonTabBar: class {},
    IonTabButton: class {},
    IonTitle: class {},
    IonToolbar: class {},
    MenuController: MenuControllerMock,
  };
});

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

describe('ViewEmployeeMobile', () => {
  let component: ViewEmployeeMobile;
  let fixture: ComponentFixture<ViewEmployeeMobile>;

  beforeEach(() => {
    TestBed.overrideComponent(ViewEmployeeMobile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ViewEmployeeMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: HidescrollnavService, useValue: hideScroolNavServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: MenuController, useValue: { close: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(ViewEmployeeMobile);
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
