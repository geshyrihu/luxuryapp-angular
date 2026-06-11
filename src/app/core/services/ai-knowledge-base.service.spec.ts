import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AiKnowledgeBaseService } from './ai-knowledge-base.service';

describe('AiKnowledgeBaseService', () => {
  let service: AiKnowledgeBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AiKnowledgeBaseService,
      ],
    });
    service = TestBed.inject(AiKnowledgeBaseService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
