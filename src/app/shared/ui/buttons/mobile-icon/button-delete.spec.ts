import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconDelete } from './button-delete';

describe('MobileButtonIconDelete', () => {
  let component: MobileButtonIconDelete;
  let fixture: ComponentFixture<MobileButtonIconDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconDelete],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
