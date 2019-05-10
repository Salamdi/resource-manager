import { TestBed } from '@angular/core/testing';

import { ConfResolverService } from './conf-resolver.service';

describe('ConfResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfResolverService = TestBed.get(ConfResolverService);
    expect(service).toBeTruthy();
  });
});
