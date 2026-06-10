import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Touchspin } from './touchspin';

describe('Touchspin', () => {
  let component: Touchspin;
  let fixture: ComponentFixture<Touchspin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Touchspin, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Touchspin);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl(3));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment value', () => {
    component.control().setValue(1);
    component.increment();
    expect(component.control().value).toBe(2);
  });

  it('should decrement value', () => {
    component.control().setValue(3);
    component.decrement();
    expect(component.control().value).toBe(2);
  });

  it('should not exceed max value on increment', () => {
    component.control().setValue(5);
    component.increment();
    expect(component.control().value).toBe(5);
  });

  it('should not go below min value on decrement', () => {
    component.control().setValue(1);
    component.decrement();
    expect(component.control().value).toBe(1);
  });

  it('should emit valueChanged on increment', () => {
    const spy = vi.fn();
    component.valueChanged.subscribe(spy);
    component.control().setValue(2);
    component.increment();
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should emit valueChanged on decrement', () => {
    const spy = vi.fn();
    component.valueChanged.subscribe(spy);
    component.control().setValue(3);
    component.decrement();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should mark control as touched and dirty on update', () => {
    component.control().setValue(1);
    component.increment();
    expect(component.control().touched).toBe(true);
    expect(component.control().dirty).toBe(true);
  });

  it('isMin should return true when value equals min', () => {
    component.control().setValue(1);
    expect(component.isMin()).toBe(true);
  });

  it('isMax should return true when value equals max', () => {
    component.control().setValue(5);
    expect(component.isMax()).toBe(true);
  });

  it('should not increment when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.control().setValue(2);
    component.increment();
    expect(component.control().value).toBe(2);
  });
});
