import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconDelete } from './button-delete';
import { ConfirmService } from '../shared/confirm.service';

describe('MobileButtonIconDelete', () => {
  let component: MobileButtonIconDelete;
  let fixture: ComponentFixture<MobileButtonIconDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconDelete],
      providers: [
        { provide: ConfirmService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
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
