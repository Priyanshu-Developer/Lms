export interface UserLoginResponse {
  email: string;
  message: string;
  allowed?: boolean;
  verified?: boolean;
}