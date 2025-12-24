export interface UserInput {
  schoolName: string;
  level: 'SD' | 'SMP' | 'SMA';
  className: string;
  academicYear: string;
  subject: string;
  learningObjective: string;
  subjectMatter: string;
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
}

export interface Question {
  number: number;
  type: 'Pilihan Ganda' | 'Uraian';
  text: string;
  options?: string[]; // Only for multiple choice
}

export interface BlueprintItem {
  no: number;
  competency: string;
  material: string;
  indicator: string;
  level: string; // C1, C2, etc.
  questionForm: string;
  questionNumber: number;
}

export interface ExamData {
  title: string;
  blueprints: BlueprintItem[];
  questions: Question[];
}