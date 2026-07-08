import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileBreadcrumbs } from './breadcrumbs';

describe('MobileBreadcrumbs', () => {
  let component: MobileBreadcrumbs;
  let fixture: ComponentFixture<MobileBreadcrumbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBreadcrumbs, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileBreadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
