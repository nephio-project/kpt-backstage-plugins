/**
 * Copyright 2024 The Nephio Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isEqual } from 'lodash';
import React from 'react';
import { PxeConfigurationEntry, PxeNodeType } from './types/PxeConfiguration.types';
import { PxeNodeListPositionInfo } from './types/PxeParametricEditor.types';
import { PxeRowLayoutNode } from './nodes/layout/PxeRowLayoutNode';
import { PxeRosterWidgetNode } from './nodes/widget/roster/PxeRosterWidgetNode';
import { PxeSingleLineTextWidgetNode } from './nodes/widget/PxeSingleLineTextWidgetNode';
import { PxeSelectValueWidgetNode } from './nodes/widget/PxeSelectValueWidgetNode';

export type PxeParametricEditorNodeProps = {
  readonly configurationEntry: PxeConfigurationEntry;
  readonly listPositionInfo: PxeNodeListPositionInfo;
};

const NODE_BY_TYPE_RECORD: Record<PxeNodeType, React.FC<PxeParametricEditorNodeProps>> = {
  [PxeNodeType.RowLayout]: PxeRowLayoutNode,

  [PxeNodeType.Roster]: PxeRosterWidgetNode,
  [PxeNodeType.SingleLineText]: PxeSingleLineTextWidgetNode,
  [PxeNodeType.SelectValue]: PxeSelectValueWidgetNode,
};

export const PxeParametricEditorNode: React.FC<PxeParametricEditorNodeProps> = React.memo(props => {
  const { configurationEntry } = props;
  const SpecificEditorNode = NODE_BY_TYPE_RECORD[configurationEntry.type];

  return <SpecificEditorNode {...props} />;
}, isEqual);
