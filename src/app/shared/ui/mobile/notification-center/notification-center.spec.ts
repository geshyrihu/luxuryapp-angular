import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileNotificationCenter } from './notification-center';

describe('MobileNotificationCenter', () => {
  let component: MobileNotificationCenter;
  let fixture: ComponentFixture<MobileNotificationCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNotificationCenter],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileNotificationCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
