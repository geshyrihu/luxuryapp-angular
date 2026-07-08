import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileFluid } from './fluid';

describe('MobileFluid', () => {
  let component: MobileFluid;
  let fixture: ComponentFixture<MobileFluid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFluid],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileFluid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
