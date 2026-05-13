import type { VxeGridProps } from '#/adapter/vxe-table';

export const gridSchemas: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
  },
  toolbarConfig: {
    refresh: true,
    print: false,
    export: false,
    custom: true,
  },
  height: 'auto',
  columns: [
    { field: 'id', width: 60, visible: false },
    { field: 'sourceService', title: '来源服务' },
    { field: 'syncMode', title: '同步模式' },
    { field: 'state', title: '状态' },
    { field: 'lastSnapshotRevision', title: '快照版本' },
    { field: 'lastSyncTime', title: '最近同步时间', width: 180 },
    { field: 'lastError', title: '最近错误' },
    { field: 'description', title: '描述' },
    { field: 'createTime', title: '创建时间', width: 180 },
  ],
  showOverflow: false,
};
