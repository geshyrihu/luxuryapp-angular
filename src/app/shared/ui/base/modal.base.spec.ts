import { TestBed } from '@angular/core/testing';
import { ModalBase } from './modal.base';
import { vi } from 'vitest';

describe('ModalBase', () => {
  it('creates an instance via a concrete subclass', () => {
    @vi.component({ template: '<div>Mock</div>' })
    class ConcreteModal extends ModalBase {}
    TestBed.configureTestingModule({ imports: [ConcreteModal] });
    const fixture = TestBed.createComponent(ConcreteModal);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('dismiss sets visible to false and emits', () => {
    @vi.component({ template: '<div>Mock</div>' })
    class ConcreteModal extends ModalBase {}
    TestBed.configureTestingModule({ imports: [ConcreteModal] });
    const fixture = TestBed.createComponent(ConcreteModal);
    const component = fixture.componentInstance;
    const fn = vi.fn();
    component.dismiss.subscribe(fn);
    component.visible.set(true);
    component.onDismiss();
    expect(component.visible()).toBe(false);
    expect(fn).toHaveBeenCalled();
  });
});
