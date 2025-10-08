import { TourDifficulty } from './tour-difficulty';
import { TourTag } from './tour-tag';

export interface CreateUpdateTour {
  id?: number;
  title: string;
  description: string;
  difficulty: TourDifficulty;
  tags: TourTag[];
}
