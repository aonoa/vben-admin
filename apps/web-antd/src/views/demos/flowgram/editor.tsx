import {
  EditorRenderer,
  FreeLayoutEditorProvider,
  useNodeRender,
  WorkflowNodeRenderer,
} from '@flowgram.ai/free-layout-editor';
// @jsxImportSource react
import { createElement } from 'react';

import '@flowgram.ai/free-layout-editor/index.css';
import './index.css';

// 自定义节点渲染组件
function NodeRender(props) {
  const { form, selected } = useNodeRender();

  return createElement(
    WorkflowNodeRenderer,
    {
      style: {
        width: 280,
        minHeight: 88,
        height: 'auto',
        background: '#fff',
        border: '1px solid rgba(6, 7, 9, 0.15)',
        borderColor: selected ? '#4e40e5' : 'rgba(6, 7, 9, 0.15)',
        borderRadius: 8,
        boxShadow:
          '0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        padding: 12,
        cursor: 'move',
      },
      node: props.node,
    },
    form?.render(),
  );
}

export default function Editor() {
  // const editorProps = useEditorProps();
  return createElement(
    'div',
    {
      style: {
        height: '600px',
        width: '100%',
        backgroundColor: '#fff',
        border: '2px solid #ccc',
        borderRadius: '8px',
      },
    },
    createElement(
      FreeLayoutEditorProvider,
      {
        materials: {
          renderDefaultNode: NodeRender,
        },
        nodeRegistries: [
          {
            type: 'custom',
          },
        ],
        initialData: {
          nodes: [
            {
              id: '1',
              type: 'custom',
              meta: {
                position: { x: 250, y: 100 },
              },
            },
            {
              id: '2',
              type: 'custom',
              meta: {
                position: { x: 450, y: 100 },
              },
            },
            {
              id: '3',
              type: 'custom',
              meta: {
                position: { x: 650, y: 100 },
              },
            },
          ],
          edges: [],
        },
      },
      createElement(EditorRenderer),
    ),
  );
}

// export const Editor = () => {
//   const editorProps = useEditorProps();
//   return createElement(
//     FreeLayoutEditorProvider,
//     editorProps,
//     createElement(
//       'div',
//       { className: 'demo-free-container' },
//       createElement(
//         'div',
//         { className: 'demo-free-layout' },
//         // 暂时注释掉 NodeAddPanel
//         // createElement(NodeAddPanel),
//         createElement(EditorRenderer, { className: 'demo-free-editor' })
//       ),
//       // createElement(Tools),
//       // createElement(Minimap)
//     )
//   );
// };
