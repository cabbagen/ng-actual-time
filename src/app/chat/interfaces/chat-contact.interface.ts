export interface ContactsItem {
  type: string,   // 1 => 单聊    2 => 群聊
  nickname: string;
  id: string;
  avator: string;
  information: string;
  unReadMessages?: number;
  lastTime?: string;
}