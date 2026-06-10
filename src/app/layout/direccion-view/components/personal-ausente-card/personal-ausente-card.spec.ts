import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PersonalAusenteCard } from './personal-ausente-card';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { vi } from 'vitest';

describe('PersonalAusenteCard', () => {
  let component: PersonalAusenteCard;
  let fixture: ComponentFixture<PersonalAusenteCard>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.overrideComponent(PersonalAusenteCard, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [PersonalAusenteCard],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    });

    fixture = TestBed.createComponent(PersonalAusenteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
