export interface ChatMessage {
  type: number;
  source: string;
  target: string;
  content: string;
};

export interface ChatGroupMessage {
  type: number,
  source: string,
  target: string,
  content: string,
}
