import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerBarComponent } from './layer-bar.component';

describe('LayerBarComponent', () => {
  let component: LayerBarComponent;
  let fixture: ComponentFixture<LayerBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayerBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
