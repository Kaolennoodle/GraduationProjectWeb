export interface User {
  uid: number
  uloginName: string
  unickname: string
  utype: number
  uavatarPath?: string
  token: string
}

export interface Classroom {
  cId: number
  cName: string
  cVolume: number
  cBuilding: string
  cFloor: string
  cAddress: string
  cAdminId: number
}

export interface Appointment {
  aId: number
  cId: number
  uId: number
  aStartTime: string
  aEndTime: string
  aStatus: number
  aApprovalStatus: number
}

export interface Message {
  mId: number
  mTitle: string
  mContent: string
  mSenderId: number
  mReceiverId: number
  mStatus: number
  mCreateTime: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
}

export interface ApiResponse<T = any> {
  code: string
  msg: string
  data: T
}
