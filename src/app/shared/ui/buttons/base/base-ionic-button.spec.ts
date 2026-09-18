import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BaseIonicButton } from './base-ionic-button';

@Directive({ selector: '[testBaseIonicButton]' })
class TestBaseIonicButton extends BaseIonicButton {}

@Component({
  selector: 'base-ionic-button-test-host',
  template: '<button testBaseIonicButton></button>',
  imports: [TestBaseIonicButton],
})
class TestHost {}

describe('BaseIonicButton', () => {
  let fixture: ComponentFixture<TestHost>;
  let component: TestBaseIonicButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    component = fixture.debugElement
      .query(By.directive(TestBaseIonicButton))
      .injector.get(TestBaseIonicButton);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expone defaults de inputs', () => {
    expect(component.disabled()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(component.type()).toBe('button');
  });

  it('no emite clicked cuando disabled', () => {
    const spy = spyOn(component.clicked, 'emit');
    (component as any).disabled = () => true;
    component.onClick(new Event('click'));
    expect(spy).not.toHaveBeenCalled();
  });
});
