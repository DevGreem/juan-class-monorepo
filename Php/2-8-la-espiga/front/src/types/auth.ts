export type AuthUser = {
  id: number;
  name: string;
  role_id: number;
};

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role_id: number;
};
