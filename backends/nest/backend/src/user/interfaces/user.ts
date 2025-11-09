export interface UserLoginResponse {
  id: string;
  email: string;
  message: string;
  allowed?: boolean;
  verified?: boolean;
}