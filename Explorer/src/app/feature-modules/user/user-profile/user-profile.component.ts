import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user-service';
import { UserProfile } from '../types/UserProfile';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Follower } from '../types/Follower';
import { Following } from '../types/Following';
import { Recommendation } from '../types/Recommendation';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId!: string;
  hasProfile = false; // new flag
  loading = true;
  user: User | undefined;
  profileData?: UserProfile;
  canEdit = false;
  followers: Follower[] = [];
  following: Following[] = [];
  recommendations: Recommendation[] = [];
  isFollowing = false;
  previewUrl?: string;
  selectedFileBase64?: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      biography: [''],
      moto: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    this.userId = params.get('userId')!;
    this.loading = true;
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.canEdit = String(user?.id) === this.userId;
    });
    this.loadProfile();
    this.loadFollowers();
    this.loadFollowing();
    this.loadRecommendations();
    this.checkFollowing();
  });
  }

  loadProfile() {
    this.userService.getProfileById(this.userId).subscribe({
      next: (data: UserProfile) => {
        this.hasProfile = true;
        this.profileData = data;
        this.profileForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.hasProfile = false;
        this.loading = false;
        console.error('Failed to load profile', err);
      }
    });
  }

  onSubmit() {
    if (!this.canEdit || this.profileForm.invalid) return;

    const data = {
      ...this.profileForm.value,
      imageBase64: this.selectedFileBase64 || null,
      id: this.userId
    } as UserProfile;

    const request$ = this.hasProfile
      ? this.userService.updateProfile(data)
      : this.userService.createProfile(data);

    request$.subscribe({
      next: (response) => {
        alert(this.hasProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
        if (!this.hasProfile) {
          this.hasProfile = true;
        }
        this.loadProfile();
      },
      error: (err) => {
        console.error('Save failed', err);
        alert('Failed to save profile. Please try again.');
      }
    });
  }

  loadFollowers() {
    this.userService.getFollowers(this.userId).subscribe({
      next: (data) => this.followers = data,
      error: (err) => console.error('Failed to load followers', err)
    });
  }

  loadFollowing() {
    this.userService.getFollowing(this.userId).subscribe({
      next: (data) => this.following = data,
      error: (err) => console.error('Failed to load following', err)
    });
  }

  loadRecommendations() {
    this.userService.getRecommendations(this.user?.id.toString() || '').subscribe({
      next: (data) => this.recommendations = data,
      error: (err) => console.error('Failed to load recommendations', err)
    });
  }

  checkFollowing() {
    this.userService.getFollowing(this.user?.id.toString() || '').subscribe({
      next: (data) => {
        this.isFollowing = data.some(f => String(f.id) === this.userId);
      },
      error: (err) => console.error('Failed to check following status', err)
    });
  }

  onFollow() {
    const following: Following = { id: this.userId, username: this.profileData?.username || '' };
    this.userService.follow(following).subscribe({
      next: () => {
        this.isFollowing = true;
        this.loadFollowers();
      },
      error: (err) => console.error('Follow failed', err)
    });
  }

  onUnfollow() {
    this.userService.unfollow(this.userId).subscribe({
      next: () => {
        this.isFollowing = false;
        this.loadFollowers();
      },
      error: (err) => console.error('Unfollow failed', err)
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // skini prefix
      this.selectedFileBase64 = base64;
      this.previewUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  getImageUrl(profilePictureUrl: string): string {
    // Convert /images/users/file.jpg to api/user-profiles/images/users/file.jpg
    if (profilePictureUrl.startsWith('/images/')) {
      return `api/api/user-profiles${profilePictureUrl}`;
    }
    return profilePictureUrl;
  }
}
