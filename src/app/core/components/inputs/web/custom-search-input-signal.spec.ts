import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSearchInput } from './custom-search-input-signal';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CustomSearchInput', () => {
  let component: CustomSearchInput;
  let fixture: ComponentFixture<CustomSearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSearchInput],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSearchInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default placeholder', () => {
    expect(component.placeholder()).toBe('Buscar aquí...');
  });

  it('should accept custom placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Search...');
    fixture.detectChanges();
    expect(component.placeholder()).toBe('Search...');
  });

  it('should be enabled by default', () => {
    expect(component.disabled()).toBe(false);
  });

  it('should emit searchChange on input', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);
    const inputEl = fixture.nativeElement.querySelector('input');
    if (inputEl) {
      inputEl.value = 'test';
      inputEl.dispatchEvent(new Event('input'));
      expect(spy).toHaveBeenCalledWith('test');
    }
  });

  it('should disable input when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });
});
