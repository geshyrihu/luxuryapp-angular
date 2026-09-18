import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MobileButtonBase } from './mobile-button-base';

@Directive({ selector: '[testMobileButtonBase]' })
class TestMobileButtonBase extends MobileButtonBase {
  fillValue() {
    return (this as any).resolvedFill();
  }
  colorValue() {
    return (this as any).resolvedColor();
  }
}

@Component({
  selector: 'mobile-button-base-test-host',
  template: '<button testMobileButtonBase></button>',
  imports: [TestMobileButtonBase],
})
class TestHost {}

describe('MobileButtonBase', () => {
  let fixture: ComponentFixture<TestHost>;
  let component: TestMobileButtonBase;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    component = fixture.debugElement
      .query(By.directive(TestMobileButtonBase))
      .injector.get(TestMobileButtonBase);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults: fill solid, color primary', () => {
    expect(component.fillValue()).toBe('solid');
    expect(component.colorValue()).toBe('primary');
  });

  it('variant tiene prioridad sobre fill/color', () => {
    component.variant = (() => 'danger') as any;
    expect(component.fillValue()).toBe('solid');
    expect(component.colorValue()).toBe('danger');
  });
});
