import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableListComponent } from './available-list.component';

describe('AvailableListComponent', () => {
  let component: AvailableListComponent;
  let fixture: ComponentFixture<AvailableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
