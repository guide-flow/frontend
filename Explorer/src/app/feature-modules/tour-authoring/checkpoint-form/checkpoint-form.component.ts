import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Checkpoint } from '../model/checkpoint/checkpoint';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css'],
})
export class CheckpointFormComponent implements OnChanges, AfterViewInit {
  @Input() shouldEdit = false;
  @Input() checkpoint?: Checkpoint;
  @Input() tourId: number;

  @Output() checkpointUpdated = new EventEmitter<void>();

  @ViewChild(MapComponent) xpMap?: MapComponent;

  previewBase64?: string;

  mapCheckpoints: Array<{
    latitude: number;
    longitude: number;
    name?: string;
    description?: string;
    imageUrl?: string;
  }> = [];

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    longitude: [0, Validators.required],
    latitude: [0, Validators.required],
    imageBase64: [''],
    tourId: [0, Validators.required],
  });

  constructor(private fb: FormBuilder, private service: TourAuthoringService) {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.xpMap?.['map']?.invalidateSize(true);
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkpoint'] && this.checkpoint) {
      this.form.patchValue({
        ...this.checkpoint,
        imageBase64:
          this.checkpoint.imageBase64?.replace(/^data:[^;]+;base64,/, '') || '',
      });

      const img = this.checkpoint.imageBase64 || '';
      this.previewBase64 = img.startsWith('data:')
        ? img
        : img
        ? `data:image/*;base64,${img}`
        : undefined;

      setTimeout(() => this.xpMap?.['map']?.invalidateSize(true), 300);
    } else if (!this.shouldEdit) {
      this.form.reset({
        title: '',
        description: '',
        longitude: 0,
        latitude: 0,
        imageBase64: '',
        tourId: this.tourId,
      });
      this.previewBase64 = undefined;
      this.mapCheckpoints = [];
      setTimeout(() => this.xpMap?.['map']?.invalidateSize(true), 300);
    }
  }

  onMapSelect(e: { latitude: number; longitude: number }) {
    this.form.patchValue({
      latitude: e.latitude,
      longitude: e.longitude,
    });

    const v = this.form.value;
    this.mapCheckpoints = [
      {
        latitude: e.latitude,
        longitude: e.longitude,
        name: v.title ?? '',
        description: v.description ?? '',
      },
    ];
  }

  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const pureBase64 = dataUrl.split(',')[1] ?? dataUrl;
      this.form.patchValue({ imageBase64: pureBase64 });
      this.previewBase64 = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Checkpoint;

    if (this.shouldEdit && this.checkpoint?.id) {
      payload.id = this.checkpoint.id;
      this.service.updateCheckpoint(payload).subscribe(() => {
        this.checkpointUpdated.emit();
      });
    } else {
      this.service.createCheckpoint(payload).subscribe(() => {
        this.checkpointUpdated.emit();
      });
    }
  }
}
