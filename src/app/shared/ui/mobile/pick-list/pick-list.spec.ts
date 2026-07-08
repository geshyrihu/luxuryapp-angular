import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobilePickList } from './pick-list';

describe('MobilePickList', () => {
  let component: MobilePickList;
  let fixture: ComponentFixture<MobilePickList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePickList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobilePickList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
