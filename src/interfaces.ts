export interface ResumeData {
  accomplishments: Record<string, Accomplishment>;
  contents: Record<string, Card>;
}

export interface Accomplishment {
  parentKey: string;
  text: string;
}

export type CardTypes =
  | 'experience'
  | 'sideProjects'
  | 'talks'
  | 'startup'
  | 'education'
  | 'other';

export interface Card {
  date: string;
  description: string;
  link: string;
  position: string;
  sortDate: string;
  title: string;
  type: CardTypes;
  accomplishments: Accomplishment[];
}

export const titleMap: Record<CardTypes, string> = {
  experience: 'Professional Experience',
  sideProjects: 'Side Projects',
  talks: 'Community / Talks',
  startup: 'Hackathons',
  education: 'Education',
  other: 'Other',
};

export const emojiMap: Record<CardTypes, string> = {
  experience: '💼',
  sideProjects: '🏗️',
  talks: '🎤',
  startup: '🏅',
  education: '🎒',
  other: '🤷',
};

export interface ResumeCards {
  type: CardTypes;
  content: Card[];
}
