
// 通知类型 => 添加好友
export interface IMNoticeForAddFriend {
  notice_type: string;
  source_contact_id: string;
  source_contact_nickname: string;
  target_contact_id: string;
  target_contact_nickname: string;
  appkey?: string;
}

// 通知类型 => 添加群组 
export interface IMNoticeForAddGroup {
  notice_type: string;
  source_contact_id: string;
  source_contact_nickname: string;
  target_contact_id: string;
  target_contact_nickname: string;
  target_group_id: string;
  target_group_name: string;
  appkey?: string;
}
