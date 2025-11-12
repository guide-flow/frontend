import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToursComponent } from './tours/tours.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AdministrationModule } from '../administration/administration.module';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { FollowingToursFeedComponent } from './following-tours-feed/following-tours-feed.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ToursComponent,
    TourFormComponent,
    TourDetailsComponent,
    CheckpointFormComponent,
    FollowingToursFeedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    AdministrationModule,
    SharedModule,
  ],
})
export class TourAuthoringModule {}
