import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { UserProfile } from './types/UserProfile';
import { Follower } from './types/Follower';
import { Following } from './types/Following';
import { Recommendation } from './types/Recommendation';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly base = `${environment.gatewayHost}api`;

  constructor(private http: HttpClient) {}

  createProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.base}/user-profiles/create-user-profile`, profileData);
  }

  getProfileById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/user-profiles/user-profile/${userId}`);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/user-profiles/user-profile`);
  }

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.base}/user-profiles/all`);
  }

  updateProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.base}/user-profiles/user-profile`, profileData);
  }

  follow(following: Following): Observable<any> {
    return this.http.post(`${this.base}/followers/follow`, following);
  }

  unfollow(targetId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/followers/unfollow/${targetId}`);
  }

  getFollowers(id: string): Observable<Follower[]> {
    return this.http.get<Follower[]>(`${this.base}/followers/followers/${id}`);
  }

  getFollowing(id: string): Observable<Following[]> {
    return this.http.get<Following[]>(`${this.base}/followers/following/${id}`);
  }

  getRecommendations(id: string): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.base}/followers/recommendations/${id}`);
  }
}
