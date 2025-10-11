import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUpdateTour } from '../model/tour/create-update-tour';
import { TourDifficulty } from '../model/tour/tour-difficulty';
import { TourTag } from '../model/tour/tour-tag';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { Tour } from '../model/tour/tour';

type TourFormValue = {
  title: string;
  description: string;
  difficulty: TourDifficulty | null;
  tagsText: string; // tagovi ručno, zapetama
};

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css'],
})
export class TourFormComponent implements OnChanges {
  @Input() tour?: CreateUpdateTour;
  @Input() shouldEdit = false;

  @Output() tourSaved = new EventEmitter<void>();

  difficulties = [
    { label: 'Easy', value: TourDifficulty.Easy },
    { label: 'Medium', value: TourDifficulty.Medium },
    { label: 'Hard', value: TourDifficulty.Hard },
  ];

  tourForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    difficulty: new FormControl<TourDifficulty | null>(null, {
      validators: [Validators.required],
    }),
    tagsText: new FormControl<string>('', { nonNullable: true }),
  });

  get previewTags(): string[] {
    return this.parseTags(this.tourForm.controls.tagsText.value || '');
  }

  constructor(
    private tourService: TourAuthoringService,
    private router: Router
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    this.tourForm.reset({
      title: '',
      description: '',
      difficulty: null,
      tagsText: '',
    });

    if (this.shouldEdit && this.tour) {
      this.tourForm.patchValue({
        title: this.tour.title ?? '',
        description: this.tour.description ?? '',
        difficulty: this.tour.difficulty ?? null,
        tagsText: (this.tour.tags ?? [])
          .map((t) => t.name?.trim())
          .filter(Boolean)
          .join(', '),
      });
    }
  }

  private parseTags(text: string): string[] {
    return text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  private buildPayload(): CreateUpdateTour {
    const v = this.tourForm.getRawValue() as TourFormValue;

    const tags: TourTag[] = this.parseTags(v.tagsText).map((name) => ({
      name,
    }));

    const payload: CreateUpdateTour = {
      id: this.shouldEdit ? this.tour?.id : undefined,
      title: v.title,
      description: v.description,
      difficulty: v.difficulty as TourDifficulty,
      tags,
    };

    return payload;
  }

  createTour(): void {
    if (this.tourForm.invalid) return;
    const payload = this.buildPayload();

    this.tourService.createTour(payload).subscribe({
      next: (created: Tour) => {
        const tourId = created?.id;
        if (tourId) {
          this.router.navigate(['/tour-details', tourId]);
        }
        this.tourSaved.emit();
      },
    });
  }

  updateTour(): void {
    if (this.tourForm.invalid || !this.tour?.id) return;
    const payload = this.buildPayload();
    this.tourService.updateTour(payload).subscribe({
      next: () => this.tourSaved.emit(),
    });
  }
}
