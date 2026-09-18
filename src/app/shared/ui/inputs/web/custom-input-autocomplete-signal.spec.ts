import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputAutoComplete } from './custom-input-autocomplete-signal';
import { vi } from 'vitest';

describe('CustomInputAutoComplete', () => {
  let component: CustomInputAutoComplete;
  let fixture: ComponentFixture<CustomInputAutoComplete>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputAutoComplete, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputAutoComplete],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputAutoComplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default data as empty array', () => {
      expect(component.data()).toEqual([]);
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe('outputs', () => {
    it('should emit propagar output', () => {
      const spy = vi.fn();
      component.propagar.subscribe(spy);
      component.propagar.emit('test');
      expect(spy).toHaveBeenCalledWith('test');
    });
  });

  describe('onComplete (search)', () => {
    it('should filter data based on query', () => {
      fixture.componentRef.setInput('data', [
        { label: 'Mexico', value: 'MX' },
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
      ]);
      fixture.detectChanges();

      component.onComplete({ term: 'exi' });
      expect(component.resolvedSuggestions()).toEqual([
        { label: 'Mexico', value: 'MX' },
      ]);
    });

    it('should return empty array when no match found', () => {
      fixture.componentRef.setInput('data', [
        { label: 'Mexico', value: 'MX' },
      ]);
      fixture.detectChanges();

      component.onComplete({ term: 'xyz' });
      expect(component.resolvedSuggestions()).toEqual([]);
    });

    it('should be case insensitive', () => {
      fixture.componentRef.setInput('data', [
        { label: 'Mexico', value: 'MX' },
      ]);
      fixture.detectChanges();

      component.onComplete({ term: 'MEX' });
      expect(component.resolvedSuggestions()).toEqual([
        { label: 'Mexico', value: 'MX' },
      ]);
    });
  });

  describe('onSelectItem', () => {
    it('should emit propagar with selected item and set control value', () => {
      const spy = vi.fn();
      component.propagar.subscribe(spy);
      const selectedItem = { label: 'Mexico', value: 'MX' };
      component.onSelectItem(selectedItem);
      expect(spy).toHaveBeenCalledWith(selectedItem);
      expect(component.internalControl.value).toEqual(selectedItem);
    });
  });

  describe('onClear', () => {
    it('should clear control value and emit propagar with null', () => {
      const spy = vi.fn();
      component.propagar.subscribe(spy);
      component.internalControl.setValue({ label: 'Mexico', value: 'MX' });
      component.onClear();
      expect(component.internalControl.value).toBeNull();
      expect(spy).toHaveBeenCalledWith(null);
    });
  });
});
