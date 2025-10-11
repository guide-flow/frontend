import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUpdateTour } from './model/tour/create-update-tour';
import { environment } from 'src/env/environment';
import { Checkpoint } from './model/checkpoint/checkpoint';
import { Tour } from './model/tour/tour';
import { TourMetrics } from './model/tour/tour-metrics';

@Injectable({
  providedIn: 'root',
})
export class TourAuthoringService {
  constructor(private http: HttpClient) {}
  getToursByAuthor(): Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.toursApiHost + 'tours/author');
  }

  createTour(tour: CreateUpdateTour): Observable<Tour> {
    return this.http.post<Tour>(environment.toursApiHost + 'tours', tour);
  }

  updateTour(tour: CreateUpdateTour): Observable<void> {
    return this.http.put<void>(
      `${environment.toursApiHost + 'tours'}/${tour.id}`,
      tour
    );
  }

  deleteTour(tourId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.toursApiHost + 'tours'}/${tourId}`
    );
  }

  updateTourMetrics(tourMetrics: TourMetrics): Observable<Tour> {
    return this.http.put<Tour>(
      `${environment.toursApiHost + 'tours/tour-metrics'}/${
        tourMetrics.tourId
      }`,
      tourMetrics
    );
  }

  updateTourStatus(tourId: number): Observable<Tour> {
    return this.http.put<Tour>(
      `${environment.toursApiHost + 'tours/tour-status'}/${tourId}`,
      {}
    );
  }

  getTourCheckpoints(tourId: number): Observable<Checkpoint[]> {
    return this.http.get<Checkpoint[]>(
      `${environment.toursApiHost + 'checkpoints/tour-checkpoints'}/${tourId}`
    );
  }

  deleteCheckpoint(checkpointId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.toursApiHost + 'checkpoints'}/${checkpointId}`
    );
  }

  createCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(
      `${environment.toursApiHost + 'checkpoints'}`,
      checkpoint
    );
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(
      `${environment.toursApiHost + 'checkpoints'}`,
      checkpoint
    );
  }
}
