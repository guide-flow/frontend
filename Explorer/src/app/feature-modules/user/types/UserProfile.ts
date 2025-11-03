export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictureUrl?: string;
  biography?: string;
  moto?: string;
  imageBase64?: string;
}