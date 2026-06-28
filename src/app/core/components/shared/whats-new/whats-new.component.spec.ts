import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WhatsNew } from './whats-new.component';
import { FeatureAnnouncementService } from '../../services/feature-announcement.service';
import { vi } from 'vitest';

const featureAnnouncementServiceMock = {
  showDialog: vi.fn().mockReturnValue(false),
  markAsSeen: vi.fn(),
};

describe('WhatsNew', () => {
  let component: WhatsNew;
  let fixture: ComponentFixture<WhatsNew>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WhatsNew],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FeatureAnnouncementService, useValue: featureAnnouncementServiceMock },
      ],
    });
    fixture = TestBed.createComponent(WhatsNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject FeatureAnnouncementService', () => {
    expect(component.service).toBeDefined();
  });

  it('should call markAsSeen on close', () => {
    component.onClose();
    expect(featureAnnouncementServiceMock.markAsSeen).toHaveBeenCalled();
  });
});
