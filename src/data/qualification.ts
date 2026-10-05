export interface QualificationItem {
  id: string;
  name: string;
  institution: string;
  requiredMaterials: string[];
  status: 'completed' | 'pending';
  submitDate?: string;
  completedDate?: string;
  remark?: string;
}

export const qualificationItems: QualificationItem[] = [
  {
    id: 'Q1',
    name: '海关出口收发货人备案',
    institution: '深圳海关',
    requiredMaterials: ['营业执照', '对外贸易经营者备案表', '企业公章'],
    status: 'completed',
    submitDate: '2026-09-01',
    completedDate: '2026-09-05',
    remark: '备案编号：4403169ABC',
  },
  {
    id: 'Q2',
    name: '跨境电商企业备案',
    institution: '中国（深圳）跨境电商综试区',
    requiredMaterials: ['海关备案回执', '跨境电商业务说明', '平台店铺信息'],
    status: 'completed',
    submitDate: '2026-09-01',
    completedDate: '2026-09-08',
    remark: '企业类型：跨境电商出口企业',
  },
  {
    id: 'Q3',
    name: '申请电子口岸卡',
    institution: '电子口岸数据中心',
    requiredMaterials: ['法人身份证', '营业执照', '经办人身份证', '企业申请表'],
    status: 'completed',
    submitDate: '2026-09-02',
    completedDate: '2026-09-10',
    remark: 'IC卡号：4428A123456',
  },
  {
    id: 'Q4',
    name: '申请数据传输',
    institution: '深圳数据分中心',
    requiredMaterials: ['电子口岸卡', '数据传输协议', '技术方案说明'],
    status: 'completed',
    submitDate: '2026-09-02',
    completedDate: '2026-09-12',
    remark: '数据传输方式：API 对接',
  },
  {
    id: 'Q5',
    name: '通关无纸化签约',
    institution: '深圳海关',
    requiredMaterials: ['电子口岸卡', '无纸化签约申请书'],
    status: 'completed',
    submitDate: '2026-09-03',
    completedDate: '2026-09-06',
    remark: '',
  },
  {
    id: 'Q6',
    name: '外汇名录备案',
    institution: '国家外汇管理局深圳分局',
    requiredMaterials: ['营业执照', '海关备案回执', '外汇备案申请表'],
    status: 'completed',
    submitDate: '2026-09-05',
    completedDate: '2026-09-15',
    remark: '名录代码：BOC4408XY1234',
  },
  {
    id: 'Q7',
    name: '出口退（免）税备案',
    institution: '国家税务总局深圳市税务局',
    requiredMaterials: ['营业执照', '海关备案回执', '银行账户信息', '退税计算方法说明'],
    status: 'pending',
    remark: '需完成后启动首笔退税申报',
  },
];