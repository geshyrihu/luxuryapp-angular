import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileMeterGroup } from './meter-group';

describe('MobileMeterGroup', () => {
  let component: MobileMeterGroup;
  let fixture: ComponentFixture<MobileMeterGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMeterGroup],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMeterGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
