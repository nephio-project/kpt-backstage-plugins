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

import { get } from 'lodash';
import React from 'react';
import { ParametricEditorNodeProps } from './ParametricEditorNode';
import { PESingleLineTextWidget } from './ParametricEditor.types';
import { TextField } from '@material-ui/core';
import { generateDefaultValueName } from './utils/generateDefaultValueName';

export const SingleLineTextWidget: React.FC<
  ParametricEditorNodeProps
> = props => {
  const { resourceChunk, onResourceChangeRequest } = props;
  const entry = props.configurationEntry as PESingleLineTextWidget;
  const path = entry.path;

  return (
    <TextField
      label={generateDefaultValueName(path)} // FIXME
      variant="outlined"
      value={get(resourceChunk, path)}
      onChange={e => {
        onResourceChangeRequest(path, e.target.value);
      }}
      fullWidth
    />
  );
};
