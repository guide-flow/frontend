import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorGuard } from '../auth/author.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ToursComponent } from 'src/app/feature-modules/tour-authoring/tours/tours.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { FollowingToursFeedComponent } from 'src/app/feature-modules/tour-authoring/following-tours-feed/following-tours-feed.component';
import { UserProfileComponent } from 'src/app/feature-modules/user/user-profile/user-profile.component';
import { ExploreUsersComponent } from 'src/app/feature-modules/user/explore-users/explore-users.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'equipment',
    component: EquipmentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'tours', component: ToursComponent, canActivate: [AuthorGuard] },
  { path: 'tour-details/:tourId', component: TourDetailsComponent, canActivate: [AuthorGuard] },
  { path: 'following-feed', component: FollowingToursFeedComponent, canActivate: [AuthGuard] },
  { path: 'user-profile/:userId', component: UserProfileComponent },
  { path: 'explore-users', component: ExploreUsersComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
