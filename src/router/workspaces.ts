import { Bell, Calendar, Plus, Collection, DataBoard, OfficeBuilding, User } from '@element-plus/icons-vue'

export const workspaces = {
  '/user': {
    role: '师生服务',
    heading: '找一间合适的教室',
    description: '按位置和容量查找教室，提交申请后可随时查看审核进度。',
    items: [
      { path: 'home', title: '工作台', icon: DataBoard },
      { path: 'appointment', title: '预约教室', icon: Plus },
      { path: 'my-appointment', title: '我的预约', icon: Calendar },
      { path: 'message', title: '消息中心', icon: Bell },
    ],
  },
  '/classroom-admin': {
    role: '教室管理',
    heading: '安排好每一间教室',
    description: '处理待审核申请，查看所管教室的预约安排。',
    items: [
      { path: 'home', title: '工作台', icon: DataBoard },
      { path: 'new-appointment', title: '待审核预约', icon: Collection },
      { path: 'appointment', title: '预约记录', icon: Calendar },
      { path: 'classroom-info', title: '我的教室', icon: OfficeBuilding },
      { path: 'message', title: '消息中心', icon: Bell },
    ],
  },
  '/manager': {
    role: '系统管理',
    heading: '统筹校园教学空间',
    description: '查看全校教室和预约情况，维护教室、用户及人员分工。',
    items: [
      { path: 'home', title: '工作台', icon: DataBoard },
      { path: 'classroom', title: '教室管理', icon: OfficeBuilding },
      { path: 'user', title: '用户管理', icon: User },
      { path: 'appointment', title: '预约管理', icon: Calendar },
      { path: 'message', title: '消息中心', icon: Bell },
    ],
  },
}

export function workspacePath(role: number) {
  if (role === 4) return '/manager'
  if (role === 3) return '/classroom-admin'
  return '/user'
}
