import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { InputDate } from './input-date';

describe('InputDate', () => {
  let component: InputDate;
  let fixture: ComponentFixture<InputDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
