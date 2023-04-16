import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbarComponent } from './workbar.component';

describe('WorkbarComponent', () => {
  let component: WorkbarComponent;
  let fixture: ComponentFixture<WorkbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
