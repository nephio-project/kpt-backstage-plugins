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

import { TextField } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { PxeSingleLineTextWidgetEntry } from '../types/PxeConfiguration.types';
import { PxeParametricEditorNodeProps } from '../PxeParametricEditorNode';
import { generateDefaultValueName } from '../utils/generateLabelsForWidgets';

export const PxeSingleLineTextWidgetNode: React.FC<
  PxeParametricEditorNodeProps
> = ({ configurationEntry, onResourceChangeRequest, resourceChunk }) => {
  const entry = configurationEntry as PxeSingleLineTextWidgetEntry;
  const valuePath = entry.valuePath;

  return (
    <TextField
      label={generateDefaultValueName(entry)}
      variant="outlined"
      value={get(resourceChunk, valuePath)}
      onChange={e => {
        onResourceChangeRequest(valuePath, e.target.value);
      }}
      fullWidth
    />
  );
};
