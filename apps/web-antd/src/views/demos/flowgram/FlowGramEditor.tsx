// @jsxImportSource react
import { createElement, useCallback } from 'react';
import '@flowgram.ai/free-layout-editor/index.css';

import {
  FreeLayoutEditorProvider,
  EditorRenderer,
  useNodeRender,
  WorkflowNodeRenderer,
  usePlaygroundTools
} from '@flowgram.ai/free-layout-editor';

// 自定义节点渲染
function CustomNodeRender(props) {
  const { form, selected } = useNodeRender();

  return createElement(
    WorkflowNodeRenderer,
    {
      style: {
        width: 200,
        minHeight: 60,
        height: 'auto',
        background: selected ? '#e6f7ff' : '#fff',
        border: `2px solid ${selected ? '#1890ff' : '#d9d9d9'}`,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 12,
        cursor: 'move',
        fontSize: '14px',
        fontWeight: 'bold'
      },
      node: props.node
    },
    form?.render() || `节点 ${props.node.id}`
  );
}

// 带工具栏的编辑器组件
function EditorWithToolbar() {
  const tools = usePlaygroundTools();

  const onZoomIn = useCallback(() => tools.zoomin(true), [tools]);
  const onZoomOut = useCallback(() => tools.zoomout(true), [tools]);
  const onFitView = useCallback(() => tools.fitView(true), [tools]);

  return createElement(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    },
    // 工具栏
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: '8px',
          padding: '12px 16px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#fafafa'
        }
      },
      createElement('button', {
        onClick: onZoomIn,
        style: {
          padding: '6px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: '#fff',
          cursor: 'pointer'
        }
      }, 'Zoom In'),
      createElement('button', {
        onClick: onZoomOut,
        style: {
          padding: '6px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: '#fff',
          cursor: 'pointer'
        }
      }, 'Zoom Out'),
      createElement('button', {
        onClick: onFitView,
        style: {
          padding: '6px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: '#fff',
          cursor: 'pointer'
        }
      }, 'Fit View')
    ),
    // 编辑器内容
    createElement(
      'div',
      {
        style: {
          flex: 1,
          minHeight: 0
        }
      },
      createElement(EditorRenderer)
    )
  );
}

export default function FlowGramEditor() {
  return createElement(
    'div',
    {
      style: {
        height: '600px',
        width: '100%',
        backgroundColor: '#fff',
        border: '2px solid #1890ff',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },
    createElement(
      FreeLayoutEditorProvider,
      {
        materials: {
          renderDefaultNode: CustomNodeRender,
        },
        nodeRegistries: [
          {
            type: 'custom',
          },
        ],
        initialData: {
          nodes: [
            {
              id: 'start',
              type: 'custom',
              meta: {
                position: { x: 100, y: 100 },
              },
              data: {
                label: '开始节点'
              }
            },
            {
              id: 'process',
              type: 'custom',
              meta: {
                position: { x: 350, y: 100 },
              },
              data: {
                label: '处理节点'
              }
            },
            {
              id: 'end',
              type: 'custom',
              meta: {
                position: { x: 600, y: 100 },
              },
              data: {
                label: '结束节点'
              }
            }
          ],
          edges: [],
        }
      },
      createElement(EditorWithToolbar)
    )
  );
}
