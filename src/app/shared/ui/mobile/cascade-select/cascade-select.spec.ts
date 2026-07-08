import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileCascadeSelect } from './cascade-select';

describe('MobileCascadeSelect', () => {
  let component: MobileCascadeSelect;
  let fixture: ComponentFixture<MobileCascadeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCascadeSelect],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileCascadeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
