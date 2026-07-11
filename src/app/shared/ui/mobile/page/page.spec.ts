import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobilePage } from './page';

describe('MobilePage', () => {
  let component: MobilePage;
  let fixture: ComponentFixture<MobilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
