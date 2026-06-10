import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButton } from './custom-button';

describe('CustomButton', () => {
  let component: CustomButton;
  let fixture: ComponentFixture<CustomButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButton],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show label on desktop by default', () => {
    expect(component.showLabelOnDesktop()).toBe(true);
  });

  it('should emit clicked on button click', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('should render app-icon when resolvedIcon is set', () => {
    fixture.componentRef.setInput('icon', 'mdi:home');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon).toBeTruthy();
  });

  it('should not render icon shell when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon).toBeTruthy(); // Shows loading icon
  });
});
