/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import React from 'react';

import { useEditorProps } from './hooks/use-editor-props';
import { Tools } from './components/tools';
import { NodeAddPanel } from './components/node-add-panel';
import { Minimap } from './components/minimap';
import '@flowgram.ai/free-layout-editor/index.css';
import './index.css';

export const Editor = () => {
  const editorProps = useEditorProps();

  return React.createElement(
    FreeLayoutEditorProvider,
    editorProps,
    React.createElement(
      'div',
      { className: 'demo-free-container' },
      React.createElement(
        'div',
        { className: 'demo-free-layout' },
        React.createElement(NodeAddPanel),
        React.createElement(EditorRenderer, { className: 'demo-free-editor' })
      ),
      React.createElement(Tools),
      React.createElement(Minimap)
    )
  );
};
