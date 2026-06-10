import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BaseIonicButton } from './base-ionic-button';

@Component({
  template: `<button (click)="onClick($event)">{{ label() }}</button>`,
  standalone: true,
})
class TestIonicButton extends BaseIonicButton {}

describe('BaseIonicButton', () => {
  let component: TestIonicButton;
  let fixture: ComponentFixture<TestIonicButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestIonicButton],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(TestIonicButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default color primary', () => {
    expect(component.color()).toBe('primary');
  });

  it('should have default fill outline', () => {
    expect(component.fill()).toBe('outline');
  });

  it('should emit clicked on onClick', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const event = new MouseEvent('click');
    component.onClick(event);
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should navigate when routerLink is provided', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.componentRef.setInput('routerLink', '/test-route');
    fixture.detectChanges();

    component.onClick(new MouseEvent('click'));
    expect(navigateSpy).toHaveBeenCalledWith(['/test-route']);
  });
});
