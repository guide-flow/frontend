import { Checkpoint } from '../checkpoint/checkpoint';
import { TourDifficulty } from './tour-difficulty';
import { TourStatus } from './tour-status';
import { TourTag } from './tour-tag';
import { TransportDuration } from './transport-duration';

export interface Tour {
  id: number;
  title: string;
  description: string;
  difficulty: TourDifficulty;
  price: number;
  lengthInKm: number;
  status: TourStatus;
  statusChangeDate?: Date;
  tags: TourTag[];
  transportDurations: TransportDuration[];
  checkpoints: Checkpoint[];
}
