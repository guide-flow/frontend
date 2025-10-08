import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursComponent } from './tours/tours.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AdministrationModule } from "../administration/administration.module";

@NgModule({
  declarations: [ToursComponent, TourFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    AdministrationModule
],
})
export class TourAuthoringModule {}
