import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiobooksComponent } from './audiobooks.component';

describe('AudiobooksComponent', () => {
  let component: AudiobooksComponent;
  let fixture: ComponentFixture<AudiobooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudiobooksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudiobooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
