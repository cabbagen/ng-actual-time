import { ContactsItem } from './chat-contact.interface';

export interface ChatMessage {
  type: number;
  source: string;
  target: string;
  content: string;
  appkey?: string;
};

export interface ChatGroupMessage {
  type: number,
  source: string,
  target: string,
  content: string,
  appkey?: string;
}

export interface ChatFullMessage {
  type: number,
  time: string,
  content: string,
  source: ContactsItem,
  target: ContactsItem,
};
