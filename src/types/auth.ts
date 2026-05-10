export interface WorkerLoginRequest {
  loginId: string;
  password: string;
}

export interface WorkerLoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface OAuthLoginResponse {
  accessToken: string;
  tokenType: string;
  isNewUser: boolean;
}
