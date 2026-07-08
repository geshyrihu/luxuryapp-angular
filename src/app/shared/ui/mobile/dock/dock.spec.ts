import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileDock } from './dock';

describe('MobileDock', () => {
  let component: MobileDock;
  let fixture: ComponentFixture<MobileDock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileDock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileDock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
