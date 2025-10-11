import { Component } from '@angular/core';
import { Checkpoint } from '../model/checkpoint/checkpoint';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourMetrics } from '../model/tour/tour-metrics';
import { TransportType } from '../model/tour/transport-type';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css'],
})
export class TourDetailsComponent {
  tourId: number;
  checkpoints: Checkpoint[] = [];
  selectedCheckpoint: Checkpoint;
  shouldRenderCheckpointForm: boolean = false;
  shouldEdit: boolean = false;
  tourMetrics: TourMetrics;
  mapCheckpoints: {
    latitude: number;
    longitude: number;
    name?: string;
    description?: string;
    imageUrl?: string;
  }[] = [];

  displayedColumns: string[] = [
    'title',
    'description',
    'longitude',
    'latitude',
    'actions',
  ];
  trackById = (_: number, cp: any) => cp.id ?? cp.title ?? _;

  constructor(
    private service: TourAuthoringService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('tourId');
    this.tourId = Number(id);
    this.getCheckpoints();
  }

  deleteCheckpoint(id: number): void {
    this.service.deleteCheckpoint(id).subscribe({
      next: () => {
        this.getCheckpoints();
      },
    });
  }

  getCheckpoints(): void {
    this.shouldRenderCheckpointForm = false;
    this.service.getTourCheckpoints(this.tourId).subscribe({
      next: (result: Checkpoint[]) => {
        this.checkpoints = result;

        this.mapCheckpoints = this.checkpoints
          .filter((cp) => cp.latitude != null && cp.longitude != null)
          .map((cp) => ({
            latitude: cp.latitude!,
            longitude: cp.longitude!,
            name: cp.title,
            description: cp.description,
            imageUrl: cp.imageUrl ?? undefined,
          }));
      },
    });
  }

  onEditClicked(checkpoint: Checkpoint): void {
    this.selectedCheckpoint = checkpoint;
    this.shouldRenderCheckpointForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderCheckpointForm = true;
  }

  onDistanceCalculated(e: {
    transportType: string;
    time: number;
    distance: number;
  }) {
    this.tourMetrics = {
      tourId: this.tourId,
      lengthInKm: e.distance,
      transportDurations: [
        { time: e.time, transportType: TransportType.Walking },
      ],
    };
    console.log(this.tourMetrics);
  }

  finish(): void {
    console.log(this.tourMetrics);
    this.service.updateTourMetrics(this.tourMetrics).subscribe({
      next: () => {
        this.router.navigate(['/tours']);
      },
    });
  }
}
