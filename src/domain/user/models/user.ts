export class User {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  password: string;
  email: string;
  isVerified: boolean;
  picUrl?: string | null;
  picId?: string | null;
}
