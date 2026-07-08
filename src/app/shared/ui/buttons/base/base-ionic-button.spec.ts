import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseIonicButton } from './base-ionic-button';

describe('BaseIonicButton', () => {
  let component: BaseIonicButton;
  let fixture: ComponentFixture<BaseIonicButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseIonicButton],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseIonicButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
