import { TestBed } from '@angular/core/testing';

import { VolunteersResolverService } from './volunteers-resolver.service';

describe('VolunteersResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VolunteersResolverService = TestBed.get(VolunteersResolverService);
    expect(service).toBeTruthy();
  });
});
