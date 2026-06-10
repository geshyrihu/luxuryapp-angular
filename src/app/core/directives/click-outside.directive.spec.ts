import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `
    <div (clickOutside)="onClickOutside($event)">
      <button id="inside">Inside</button>
    </div>
    <div id="outside">Outside</div>
  `,
  imports: [ClickOutsideDirective],
  standalone: true,
})
class TestHostComponent {
  clicked = false;

  onClickOutside(_event: Event) {
    this.clicked = true;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.children[0].injector.get(ClickOutsideDirective);
    expect(directive).toBeTruthy();
  });

  it('should emit clickOutside when clicking outside the element', () => {
    const outsideEl = fixture.nativeElement.querySelector('#outside') as HTMLElement;
    outsideEl.click();
    expect(component.clicked).toBe(true);
  });

  it('should not emit clickOutside when clicking inside the element', () => {
    const insideEl = fixture.nativeElement.querySelector('#inside') as HTMLElement;
    insideEl.click();
    expect(component.clicked).toBe(false);
  });
});
