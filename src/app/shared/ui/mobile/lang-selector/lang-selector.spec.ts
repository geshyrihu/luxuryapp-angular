import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileLangSelector } from './lang-selector';

describe('MobileLangSelector', () => {
  let component: MobileLangSelector;
  let fixture: ComponentFixture<MobileLangSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileLangSelector],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileLangSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
