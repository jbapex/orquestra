export type UserRole = "maestro" | "musico";

export type AssignmentStatus =
  | "pendente"
  | "em_andamento"
  | "concluida"
  | "avaliada";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  instrument: string | null;
  phone: string | null;
  start_date: string | null;
  notes: string | null;
}

export interface Level {
  id: string;
  name: string;
  position: number;
  description: string | null;
}

export interface Subject {
  id: string;
  name: string;
  description: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  level_id: string | null;
  subject_id: string | null;
  content: string | null;
  materials_url: string | null;
  position: number | null;
  created_at: string;
}

export interface ClassSession {
  id: string;
  scheduled_at: string;
  topic: string;
  lesson_id: string | null;
  notes: string | null;
}

export interface Attendance {
  class_id: string;
  musico_id: string;
  present: boolean;
  notes: string | null;
}

export interface Assignment {
  id: string;
  musico_id: string;
  lesson_id: string;
  status: AssignmentStatus;
  score: number | null;
  feedback: string | null;
  assigned_at: string;
  completed_at: string | null;
}
