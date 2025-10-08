import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUpdateTour } from './model/tour/create-update-tour';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root',
})
export class TourAuthoringService {
  private readonly baseUrl = '/api/tours';

  constructor(private http: HttpClient) {}

  createTour(tour: CreateUpdateTour): Observable<void> {
    return this.http.post<void>(environment.toursApiHost + 'tours', tour);
  }

  updateTour(tour: CreateUpdateTour): Observable<void> {
    return this.http.put<void>(
      `${environment.toursApiHost + 'tours'}/${tour.id}`,
      tour
    );
  }
}
