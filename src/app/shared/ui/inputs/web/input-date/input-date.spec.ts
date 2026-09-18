import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { WebInputDate } from './input-date';

describe('WebInputDate', () => {
  let component: WebInputDate;
  let fixture: ComponentFixture<WebInputDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputDate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FlatpickrDefaults, useClass: FlatpickrDefaults }],
    });
    TestBed.overrideComponent(WebInputDate, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(WebInputDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
