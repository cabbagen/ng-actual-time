
// 添加好友 通知类型
export interface IMNoticeForAddFriend {
  notice_type: string;
  source_contact_id: string;
  source_contact_nickname: string;
  target_contact_id: string;
  target_contact_nickname: string;
  appkey?: string;
}

