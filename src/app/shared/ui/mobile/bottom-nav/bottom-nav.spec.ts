import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileBottomNav } from './bottom-nav';

describe('MobileBottomNav', () => {
  let component: MobileBottomNav;
  let fixture: ComponentFixture<MobileBottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBottomNav],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileBottomNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
