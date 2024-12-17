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

import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { PxeSelectValueWidgetEntry } from '../../types/PxeConfiguration.types';
import { withCurrentValues } from '../../utils/rendering/withCurrentValues';
import { generateValueLabel } from '../../utils/generateLabelsForWidgets';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { useDiagnostics } from '../../PxeDiagnosticsContext';
import { PxeValue } from '../../types/PxeParametricEditor.types';

const DEFAULT_VALUE = '__DEFAULT_VALUE__';

export const PxeSelectValueWidgetNode: React.FC<PxeParametricEditorNodeProps> = withCurrentValues(
  ({ configurationEntry, onResourceChangeRequest, currentValues: [currentValue] }) => {
    useDiagnostics(configurationEntry);

    const idRef = useRef(`select-value-${nanoid()}`);

    const widgetEntry = configurationEntry as PxeSelectValueWidgetEntry;
    const [valueDescriptor] = widgetEntry.valueDescriptors;

    const selectLabel = generateValueLabel(valueDescriptor);
    const selectItems = widgetEntry.options.map(({ value, label }) => ({
      value: value !== undefined ? value : DEFAULT_VALUE,
      label,
    }));

    const classes = useStyles();

    return (
      <FormControl variant="outlined" className={classes.select}>
        <InputLabel id={`select-value-label-${idRef.current}`}>{selectLabel}</InputLabel>
        <Select
          data-testid={`Select_${valueDescriptor.path}`}
          value={(currentValue ?? DEFAULT_VALUE) as string}
          label={selectLabel}
          labelId={`select-value-label-${idRef.current}`}
          variant="outlined"
          onChange={({ target: { value } }) => {
            onResourceChangeRequest({
              valueDescriptor,
              newValue: value !== DEFAULT_VALUE ? (value as PxeValue) : undefined,
            });
          }}
        >
          {selectItems.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  },
);

const useStyles = makeStyles({
  select: {
    width: '100%',
    maxWidth: '500px',
    marginTop: '6px',
    '& fieldset': {
      borderColor: '#74777f',
    },
  },
});
