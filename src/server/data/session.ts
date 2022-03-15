export interface Session {
  id: string;
  data: SessionData;
  userId: number | null;
  service: string | null;
  createdAt: number;
}

export interface SessionData {}
