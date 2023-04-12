import type { FieldValue, Timestamp } from "firebase/firestore";

type DBTimestamp = string | FieldValue | Timestamp;

export interface IUser {
  id: string;
  username: string;
}

export interface IProfile {
  recentlyAccessed: string[];
  starred: string[];
  username: string;
  userId: string;
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  darkTheme: boolean;
}

export interface IDeck {
  id?: string;
  ownerId: string;
  permissions: string[];
  sharedWith: string[];
  title: string;
  searchIndex: string[];
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

