/**
 * ============================================================================
 *  📒 简历数据 —— 你只需要改这一个文件！
 * ============================================================================
 *
 *  colours 取值来自 animal-island-ui 的岛屿色板：
 *    'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange'
 *    | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green'
 *    | 'brown' | 'warm-peach-pink'
 *
 *  改完保存后 Vite 会自动刷新，无需重启。
 * ============================================================================
 */

export type IslandColor =
  | 'default'
  | 'app-pink'
  | 'purple'
  | 'app-blue'
  | 'app-yellow'
  | 'app-orange'
  | 'app-teal'
  | 'app-green'
  | 'app-red'
  | 'lime-green'
  | 'yellow-green'
  | 'brown'
  | 'warm-peach-pink'

export interface TimelineStep {
  date: string
  title: string
  desc?: string
}

export interface ExperienceItem {
  id: string
  kind: 'work' | 'project'
  badge: string // 图鉴编号，如 No.001
  title: string
  subtitle: string
  period: string
  color: IslandColor
  pattern: boolean
  summary: string
  tags: string[]
  highlights: string[]
  timeline: TimelineStep[]
  link?: { label: string; url: string }
}

export interface SkillGroup {
  title: string
  color: IslandColor
  icon: 'seed' | 'leaf' | 'tool' | 'heart'
  items: string[]
}

export interface ContactItem {
  label: string
  value: string
  href?: string
  color: IslandColor
}

export interface Profile {
  name: string
  nickname: string
  role: string
  greeting: string
  islandName: string
  status: string
}

/** 岛主基本信息 */
export const profile: Profile = {
  name: '你的名字',
  nickname: '你的昵称',
  role: '你的求职意向',
  greeting: '欢迎登岛！这里是我的个人小岛，四处逛逛，顺便认识一下我吧～',
  islandName: '你的岛屿名',
  status: '你的个人状态',
}

/** 工作经历 */
export const workExperience: ExperienceItem[] = [
  {
    id: 'work-1',
    kind: 'work',
    badge: 'No.001',
    title: '你的工作经历',
    subtitle: '你的岗位',
    period: '20XX.XX — 20XX.XX',
    color: 'app-teal',
    pattern: true,
    summary:
      '在这里填写你的工作经历简介，例如负责的工作内容、对接的对象、取得的成果等。',
    tags: ['标签一', '标签二', '标签三', '标签四'],
    highlights: [
      '亮点一：写清楚你做了什么、结果如何',
      '亮点二：用数据和成果说话',
      '亮点三：突出你的核心能力',
    ],
    timeline: [
      { date: '20XX.XX', title: '时间节点', desc: '补充说明' },
      { date: '20XX.XX', title: '时间节点', desc: '补充说明' },
    ],
  },
]

/** 项目 / 校园经历 */
export const projects: ExperienceItem[] = [
  {
    id: 'project-1',
    kind: 'project',
    badge: 'No.002',
    title: '你的校园/项目经历',
    subtitle: '你的角色/职位',
    period: '20XX.XX — 20XX.XX',
    color: 'app-orange',
    pattern: true,
    summary:
      '在这里填写你的校园经历或项目经历简介，例如担任的职务、组织的活动、取得的成果等。',
    tags: ['标签一', '标签二', '标签三', '标签四'],
    highlights: [
      '亮点一：写清楚你做了什么、结果如何',
      '亮点二：用数据和成果说话',
      '亮点三：突出你的核心能力',
    ],
    timeline: [
      { date: '20XX.XX', title: '时间节点', desc: '补充说明' },
      { date: '20XX.XX', title: '时间节点', desc: '补充说明' },
    ],
  },
  {
    id: 'project-2',
    kind: 'project',
    badge: 'No.003',
    title: '你的校园/项目经历',
    subtitle: '你的角色/职位',
    period: '20XX.XX — 20XX.XX',
    color: 'purple',
    pattern: true,
    summary:
      '在这里填写你的第二段校园经历或项目经历简介，例如参与的社团、负责的工作、取得的成果等。',
    tags: ['标签一', '标签二', '标签三', '标签四'],
    highlights: [
      '亮点一：写清楚你做了什么、结果如何',
      '亮点二：用数据和成果说话',
      '亮点三：突出你的核心能力',
    ],
    timeline: [
      { date: '20XX.XX', title: '时间节点', desc: '补充说明' },
      { date: '20XX.XX', title: '时间节点', desc: '补充说明' },
    ],
  },
]

/** 专业技能 */
export const skillGroups: SkillGroup[] = [
  {
    title: '招聘与沟通',
    color: 'app-green',
    icon: 'seed',
    items: ['招聘流程协助', '报名收集', '人员推选', '活动组织', '咨询答疑', '跨方协调'],
  },
  {
    title: '信息与数据',
    color: 'app-yellow',
    icon: 'tool',
    items: ['Office / Excel', '透视表', 'VLOOKUP', '图表与报表', 'SPSS 问卷分析', 'SQL 基础查询'],
  },
  {
    title: 'AI 工具应用',
    color: 'app-pink',
    icon: 'heart',
    items: ['AI 对话助手', '提示词优化', '内容生成', '资料整理'],
  },
  {
    title: '语言与素养',
    color: 'app-teal',
    icon: 'leaf',
    items: ['英语等级', '英文资料阅读', '书面沟通', '严谨细致', '零差错意识'],
  },
]

/** 联系方式 */
export const contacts: ContactItem[] = [
  {
    label: '邮箱',
    value: 'your@email.com',
    href: 'mailto:your@email.com',
    color: 'app-teal',
  },
  {
    label: '电话',
    value: '你的电话',
    href: 'tel:你的电话',
    color: 'app-green',
  },
  {
    label: '微信',
    value: '你的微信',
    color: 'app-pink',
  },
]
