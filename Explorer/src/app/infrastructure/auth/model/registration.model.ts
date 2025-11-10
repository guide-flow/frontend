export enum Role {
  Admin = 'Admin',
  Author = 'Author',
  Tourist = 'Tourist'
}

export interface Registration {
  username: string;
  password: string;
  confirmPassword: string;
  role: Role;
}
