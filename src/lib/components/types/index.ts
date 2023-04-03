import type { FieldValue, Timestamp } from "firebase/firestore";

type DBTimestamp = string | FieldValue | Timestamp;

export interface IUser {
  id: string;
  username: string;
}

export interface IDeck {
  id?: string;
  ownerId: string;
  permissions: string[];
  title: string;
  description: string;
  createdAt: DBTimestamp;
  cards: ICard[];
  isPublic: boolean;
}

export interface ICard {
  id: string;
  question: string;
  answer: string;
  difficulty: number;
}

export interface IReport {
  numEasy: number;
  numHard: number;
  total: number;
  date: DBTimestamp;
}


export interface ISummary {
  id?: string;
  deckId: string;
  userId: string;
  pastReports: IReport[];
  lastUpdated: DBTimestamp;
}

