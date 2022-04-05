export interface Session {
  id: string;
  data: any;
  userId: number | null;
  service: string | null;
  createdAt: number;
}
