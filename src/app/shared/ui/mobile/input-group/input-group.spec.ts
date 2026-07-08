import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileInputGroup } from './input-group';

describe('MobileInputGroup', () => {
  let component: MobileInputGroup;
  let fixture: ComponentFixture<MobileInputGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileInputGroup],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileInputGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
