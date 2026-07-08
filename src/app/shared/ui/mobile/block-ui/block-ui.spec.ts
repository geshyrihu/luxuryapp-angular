import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileBlockUI } from './block-ui';

describe('MobileBlockUI', () => {
  let component: MobileBlockUI;
  let fixture: ComponentFixture<MobileBlockUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBlockUI],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileBlockUI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
