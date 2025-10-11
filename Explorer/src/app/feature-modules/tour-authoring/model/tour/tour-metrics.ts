import { TransportDuration } from './transport-duration';

export interface TourMetrics {
  tourId: number;
  lengthInKm: number;
  transportDurations: TransportDuration[];
}
