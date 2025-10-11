import { Component } from '@angular/core';
import { Tour } from '../model/tour/tour';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { TourStatus } from '../model/tour/tour-status';
import { TransportDuration } from '../model/tour/transport-duration';
import { TransportType } from '../model/tour/transport-type';

@Component({
  selector: 'xp-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css'],
})
export class ToursComponent {
  tours: Tour[] = [];
  selectedTour?: Tour;
  shouldRenderForm = false;
  shouldEdit = false;

  displayedColumns: string[] = [
    'title',
    'description',
    'difficulty',
    'price',
    'lengthInKm',
    'transportDurations',
    'tourStatus',
    'actions',
  ];

  trackById = (_: number, t: Tour) => t.id ?? t.title ?? _;

  constructor(private service: TourAuthoringService, private router: Router) {}

  ngOnInit(): void {
    this.getTours();
  }

  getTours(): void {
    this.shouldRenderForm = false;
    this.service.getToursByAuthor().subscribe({
      next: (result: Tour[]) => (this.tours = result ?? []),
    });
  }

  onAddClicked(): void {
    this.selectedTour = undefined;
    this.shouldEdit = false;
    this.shouldRenderForm = true;
  }

  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldEdit = true;
    this.shouldRenderForm = true;
  }

  onTourSaved(): void {
    this.getTours();
  }

  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => this.getTours(),
    });
  }

  getTime(transportDurations: TransportDuration[]): string {
    if (transportDurations.length === 1) {
      return (
        `${transportDurations[0].time}` +
        'min (' +
        `${this.getTransportType(transportDurations[0].transportType)}` +
        ')'
      );
    }
    return '0 min';
  }

  getTransportType(transportType: TransportType): string {
    switch (transportType) {
      case TransportType.Walking:
        return 'Walking';
      default:
        return 'Walking';
    }
  }

  getTourStatus(tourStatus: TourStatus): string {
    switch (tourStatus) {
      case TourStatus.Draft:
        return 'Draft';
      case TourStatus.Published:
        return 'Published';
      case TourStatus.Archived:
        return 'Archived';
      default:
        return 'Draft';
    }
  }

  goToCheckpoints(tour: Tour): void {
    this.router.navigate(['/tour-details', tour.id]);
  }

  canPublish(t: Tour): boolean {
    return t.status === TourStatus.Draft || t.status === TourStatus.Archived;
  }

  canArchive(t: Tour): boolean {
    return t.status === TourStatus.Published;
  }

  changeStatus(tourId: number): void {
    this.service.updateTourStatus(tourId).subscribe({
      next: () => {
        this.getTours();
      },
    });
  }
}
