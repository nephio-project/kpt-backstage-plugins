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
import { Select } from '../../../../../Controls';
import { PxeSelectValueWidgetEntry } from '../../types/PxeConfiguration.types';
import { generateDefaultValueLabel } from '../../utils/generateLabelsForWidgets';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';

const DEFAULT_VALUE = '__DEFAULT_VALUE__';

export const PxeSelectValueWidgetNode: React.FC<
  PxeParametricEditorNodeProps
> = ({ configurationEntry, onResourceChangeRequest, resourceChunk }) => {
  const widgetEntry = configurationEntry as PxeSelectValueWidgetEntry;
  const valueDescriptor = widgetEntry.values[0];

  const selectItems = widgetEntry.options.map(({ value, label }) => ({
    value: value !== undefined ? String(value) : DEFAULT_VALUE,
    label,
  }));

  return (
    <Select
      label={generateDefaultValueLabel(valueDescriptor)}
      items={selectItems}
      selected={get(resourceChunk, valueDescriptor.path) ?? DEFAULT_VALUE}
      onChange={value => {
        onResourceChangeRequest({
          valueDescriptor,
          newValue: value !== DEFAULT_VALUE ? value : undefined,
        });
      }}
    />
  );
};
