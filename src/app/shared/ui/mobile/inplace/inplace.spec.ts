import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileInplace } from './inplace';

describe('MobileInplace', () => {
  let component: MobileInplace;
  let fixture: ComponentFixture<MobileInplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileInplace],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileInplace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
