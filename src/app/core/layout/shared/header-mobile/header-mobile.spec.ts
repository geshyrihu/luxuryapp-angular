import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderMobile } from './header-mobile';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { vi } from 'vitest';

vi.mock('@ionic/angular', () => ({
  IonToolbar: class {},
  IonButtons: class {},
  IonButton: class {},
  IonIcon: class {},
  IonAvatar: class {},
  IonPopover: class {},
  IonContent: class {},
  IonItem: class {},
  IonLabel: class {},
  IonList: class {},
  IonNote: class {},
  IonSpinner: class {},
  IonChip: class {},
  IonText: class {},
  IonHeader: class {},
  IonTitle: class {},
  IonMenuButton: class {},
  IonCard: class {},
  IonCardContent: class {},
  IonInput: class {},
  IonSelect: class {},
  IonSelectOption: class {},
}));

describe('HeaderMobile', () => {
  let component: HeaderMobile;
  let fixture: ComponentFixture<HeaderMobile>;
  let locationMock: any;
  let navigationServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    locationMock = {
      back: vi.fn(),
    };

    navigationServiceMock = {
      canGoBack: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
    };

    TestBed.overrideComponent(HeaderMobile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [HeaderMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    fixture = TestBed.createComponent(HeaderMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back when canGoBack returns true', () => {
    navigationServiceMock.canGoBack.mockReturnValue(true);
    component.onBack();
    expect(locationMock.back).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to default dashboard when cannot go back', () => {
    navigationServiceMock.canGoBack.mockReturnValue(false);
    component.onBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard/default']);
    expect(locationMock.back).not.toHaveBeenCalled();
  });
});

