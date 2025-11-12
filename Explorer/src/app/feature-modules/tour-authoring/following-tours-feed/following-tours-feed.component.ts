import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from '../../user/user-service';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour/tour';
import { TourStatus } from '../model/tour/tour-status';

@Component({
  selector: 'xp-following-tours-feed',
  templateUrl: './following-tours-feed.component.html',
  styleUrls: ['./following-tours-feed.component.css'],
})
export class FollowingToursFeedComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private tourService: TourAuthoringService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFollowingTours();
  }

  loadFollowingTours(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const currentUserId = this.authService.user$.value.id?.toString();

    if (!currentUserId) {
      this.errorMessage = 'Please log in to see tours from authors you follow.';
      this.isLoading = false;
      return;
    }

    this.userService.getFollowing(currentUserId).subscribe({
      next: (following) => {
        if (following.length === 0) {
          this.tours = [];
          this.filteredTours = [];
          this.isLoading = false;
          return;
        }

        const authorIds = following.map(f => f.id);

        this.tourService.getToursByAuthors(authorIds).subscribe({
          next: (tours) => {
            this.tours = tours.filter(t => t.status === TourStatus.Published);
            this.filteredTours = [...this.tours];
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading tours:', err);
            this.errorMessage = 'Failed to load tours. Please try again later.';
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error loading following list:', err);
        this.errorMessage = 'Failed to load your following list. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredTours = [...this.tours];
      return;
    }

    this.filteredTours = this.tours.filter(tour =>
      tour.title.toLowerCase().includes(term) ||
      tour.description.toLowerCase().includes(term)
    );
  }

  viewTourDetails(tour: Tour): void {
    this.router.navigate(['/tour-details', tour.id]);
  }

  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Medium';
      case 2:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }
}
