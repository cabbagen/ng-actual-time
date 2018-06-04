import { ChatFullMessage } from './chat-message.interface';

export interface Channel {
  channelId?: string;
  messages?: ChatFullMessage[];
};
