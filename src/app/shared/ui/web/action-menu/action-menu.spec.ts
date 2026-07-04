import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ActionMenu } from './action-menu';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock de Ionicons
vi.mock('ionicons', () => ({
  addIcons: vi.fn(),
}));
vi.mock('ionicons/icons', () => ({
  ellipsisVertical: 'ellipsis-vertical',
}));

// Mock de Ionic
vi.mock('@ionic/angular/standalone', async () => {
  const { Component, input } = await import('@angular/core');
  
  @Component({ selector: 'ion-popover', template: '<ng-content></ng-content>', standalone: true })
  class IonPopoverMock {
    isOpen = input<boolean>(false);
    event = input<any>(null);
  }
  
  @Component({ selector: 'ion-content', template: '<ng-content></ng-content>', standalone: true })
  class IonContentMock {}
  
  @Component({ selector: 'ion-list', template: '<ng-content></ng-content>', standalone: true })
  class IonListMock {}
  
  @Component({ selector: 'ion-button', template: '<ng-content></ng-content>', standalone: true })
  class IonButtonMock {}
  
  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return {
    IonPopover: IonPopoverMock,
    IonContent: IonContentMock,
    IonList: IonListMock,
    IonButton: IonButtonMock,
    IonIcon: IonIconMock,
  };
});

describe('ActionMenu', () => {
  let component: ActionMenu;
  let fixture: ComponentFixture<ActionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionMenu, PopoverModule, ButtonModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el botón de escritorio por defecto', () => {
    const desktopBtn = fixture.nativeElement.querySelector('.action-menu-button');
    const mobileBtn = fixture.nativeElement.querySelector('ion-button');
    
    expect(desktopBtn).not.toBeNull();
    expect(mobileBtn).toBeNull();
  });

  it('debe mostrar el botón móvil cuando mobileMode es true', () => {
    fixture.componentRef.setInput('mobileMode', true);
    fixture.detectChanges();

    const desktopBtn = fixture.nativeElement.querySelector('.action-menu-button');
    const mobileBtn = fixture.nativeElement.querySelector('ion-button');
    
    expect(desktopBtn).toBeNull();
    expect(mobileBtn).not.toBeNull();
  });

  it('debe abrir el popover móvil al hacer click en el botón móvil', () => {
    fixture.componentRef.setInput('mobileMode', true);
    fixture.detectChanges();

    const mobileBtn = fixture.nativeElement.querySelector('ion-button');
    mobileBtn.click();
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
  });
});
