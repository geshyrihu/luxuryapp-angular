import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FaqsFondeo } from './faqs-fondeo';

describe('FaqsFondeo', () => {
  let component: FaqsFondeo;
  let fixture: ComponentFixture<FaqsFondeo>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FaqsFondeo],
      schemas: [NO_ERRORS_SCHEMA],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(FaqsFondeo);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all faqs when searchTerm is empty', () => {
    component.searchTerm = '';
    expect(component.filteredFaqs.length).toBe(component.faqs.length);
  });

  it('should filter faqs by pregunta', () => {
    component.searchTerm = 'retención';
    const result = component.filteredFaqs;
    expect(result.length).toBe(1);
    expect(result[0].pregunta.toLowerCase()).toContain('retención');
  });

  it('should filter faqs by respuesta', () => {
    component.searchTerm = 'caja chica';
    const result = component.filteredFaqs;
    expect(result.length).toBe(1);
    expect(result[0].pregunta.toLowerCase()).toContain('caja chica');
  });

  it('should return empty array when no match', () => {
    component.searchTerm = 'xyz-nothing-matches';
    expect(component.filteredFaqs.length).toBe(0);
  });

  it('should be case insensitive', () => {
    component.searchTerm = 'RETENCIóN';
    expect(component.filteredFaqs.length).toBe(1);
  });
});
