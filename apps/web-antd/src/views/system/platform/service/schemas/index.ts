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
    { field: 'serviceCode', title: '服务编码' },
    { field: 'serviceName', title: '服务名称' },
    { field: 'httpPrefix', title: 'HTTP 前缀' },
    { field: 'grpcService', title: 'gRPC 服务' },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      field: 'projectionEnabled',
      formatter: ({ cellValue }) => (cellValue ? '开启' : '关闭'),
      title: '投影启用',
      width: 100,
    },
    { field: 'description', title: '描述' },
    { field: 'createTime', title: '创建时间', width: 180 },
  ],
  showOverflow: false,
};
