import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileOrderList } from './order-list';

describe('MobileOrderList', () => {
  let component: MobileOrderList;
  let fixture: ComponentFixture<MobileOrderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileOrderList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileOrderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
