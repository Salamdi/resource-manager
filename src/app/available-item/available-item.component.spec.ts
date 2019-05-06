import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableItemComponent } from './available-item.component';

describe('AvailableItemComponent', () => {
  let component: AvailableItemComponent;
  let fixture: ComponentFixture<AvailableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
