import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileStatusBadge } from './status-badge';

describe('MobileStatusBadge', () => {
  let component: MobileStatusBadge;
  let fixture: ComponentFixture<MobileStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStatusBadge],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileStatusBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
