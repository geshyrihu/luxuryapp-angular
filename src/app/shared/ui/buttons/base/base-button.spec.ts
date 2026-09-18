import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BaseButton } from './base-button';

@Directive({ selector: '[testBaseButton]' })
class TestBaseButton extends BaseButton {}

@Component({
  selector: 'base-button-test-host',
  template: '<button testBaseButton></button>',
  imports: [TestBaseButton],
})
class TestHost {}

describe('BaseButton', () => {
  let fixture: ComponentFixture<TestHost>;
  let component: TestBaseButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    component = fixture.debugElement
      .query(By.directive(TestBaseButton))
      .injector.get(TestBaseButton);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expone defaults de inputs', () => {
    expect(component.severity()).toBe('primary');
    expect(component.variant()).toBe('solid');
    expect(component.size()).toBe('md');
    expect(component.disabled()).toBe(false);
  });
});
