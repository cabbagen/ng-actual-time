export interface ContactsItem {
  nickname: string;
  id: string;
  avator: string;
  information: string;
  unReadMessages?: number;
  lastTime?: string;
}