/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import {
  useService,
  WorkflowDragService,
} from '@flowgram.ai/free-layout-editor';
import React from 'react';

const cardkeys = ['Node1', 'Node2', 'Condition', 'Chain', 'Tool', 'Twoway'];

export const NodeAddPanel: React.FC = () => {
  const startDragSerivce = useService<WorkflowDragService>(WorkflowDragService);

  return (
    <div className="demo-free-sidebar">
      {cardkeys.map((nodeType) => (
        <div
          className="demo-free-card"
          key={nodeType}
          onMouseDown={(e) =>
            startDragSerivce.startDragCard(nodeType.toLowerCase(), e, {
              data: {
                title: `New ${nodeType}`,
                content: 'xxxx',
              },
            })
          }
        >
          {nodeType}
        </div>
      ))}
    </div>
  );
};
