export class RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
}
