import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service';
import { UserProfile } from '../types/UserProfile';
import { Following } from '../types/Following';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'app-explore-users',
  templateUrl: './explore-users.component.html',
  styleUrls: ['./explore-users.component.css']
})
export class ExploreUsersComponent implements OnInit {
  users: UserProfile[] = [];
  filteredUsers: UserProfile[] = [];
  searchTerm: string = '';
  currentUserId: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.user$.value?.id?.toString() || '';
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filter out current user
        this.users = users.filter(u => u.id !== this.currentUserId);
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username?.toLowerCase().includes(search) ||
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search)
    );
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/user-profile', userId]);
  }

  getImageUrl(profilePictureUrl?: string): string {
    if (!profilePictureUrl) return '';
    if (profilePictureUrl.startsWith('/images/')) {
      return `api/api/user-profiles${profilePictureUrl}`;
    }
    return profilePictureUrl;
  }
}
