export const STUDENT_AUTH_URL = 'https://functions.poehali.dev/728bc52d-a39c-44ce-ab69-5c93ec031b38';
export const LOGO_URL =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg';

export interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  status: string;
}

export interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string | null;
  createdAt: string;
}

export interface Student {
  id: number;
  fullName: string;
  kidName: string;
  phone: string;
  course: string;
  homework: Homework[];
  materials: Material[];
}
