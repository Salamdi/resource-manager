import { TestBed } from '@angular/core/testing';

import { VolunteerAdapterService } from './volunteer-adapter.service';

describe('VolunteerAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VolunteerAdapterService = TestBed.get(VolunteerAdapterService);
    expect(service).toBeTruthy();
  });
});
