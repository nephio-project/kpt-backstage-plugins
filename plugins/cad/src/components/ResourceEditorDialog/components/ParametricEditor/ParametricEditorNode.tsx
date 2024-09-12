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

import React from 'react';
import {
  ParametricEditorEntry,
  ParametricEditorExpansionStateTuple,
  ParametricEditorWidgetType,
  PxeResourceChangeRequestHandler,
} from './ParametricEditor.types';
import { SectionWidget } from './SectionWidget';
import { SingleLineTextWidget } from './SingleLineTextWidget';

export type ParametricEditorNodeProps = {
  readonly configurationEntry: ParametricEditorEntry;
  readonly resourceChunk: object;
  readonly expansionStateTuple: ParametricEditorExpansionStateTuple;
  readonly onResourceChangeRequest: PxeResourceChangeRequestHandler;
};

const NODE_BY_ENTRY_TYPE_RECORD: Record<
  ParametricEditorWidgetType,
  React.FC<ParametricEditorNodeProps>
> = {
  Section: SectionWidget,
  SingleLineText: SingleLineTextWidget,
};

export const ParametricEditorNode: React.FC<
  ParametricEditorNodeProps
> = props => {
  const { configurationEntry } = props;
  const ConcreteEditorNode = NODE_BY_ENTRY_TYPE_RECORD[configurationEntry.type];

  return <ConcreteEditorNode {...props} />;
};
