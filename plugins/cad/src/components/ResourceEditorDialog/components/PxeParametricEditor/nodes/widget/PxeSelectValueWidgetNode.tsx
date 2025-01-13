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
import React, { useContext, useRef } from 'react';
import { PxeSelectValueWidgetEntry } from '../../types/PxeConfiguration.types';
import { withCurrentValues } from '../../utils/rendering/withCurrentValues';
import { generateValueLabel } from '../../utils/generateLabelsForWidgets';
import { PxeValue } from '../../types/PxeParametricEditor.types';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { useDiagnostics } from '../../PxeDiagnosticsContext';
import { PxeResourceChangeRequestContext } from '../../PxeResourceChangeRequestContext';
import {
  PXE_COLOR_BACKGROUND_WHITE,
  PXE_COLOR_BORDER_DEFAULT,
  PXE_INPUT_TOP_MARGIN,
  PXE_INPUT_WIDTH,
} from '../../PxeSharedStyles';

const DEFAULT_VALUE = '__DEFAULT_VALUE__';

export const PxeSelectValueWidgetNode: React.FC<PxeParametricEditorNodeProps> = withCurrentValues(
  ({ configurationEntry, currentValues: [currentValue] }) => {
    useDiagnostics(configurationEntry);

    const idRef = useRef(`select-value-${nanoid()}`);

    const widgetEntry = configurationEntry as PxeSelectValueWidgetEntry;
    const [valueDescriptor] = widgetEntry.valueDescriptors;

    const selectLabel = generateValueLabel(valueDescriptor);
    const selectItems = widgetEntry.options.map(({ value, label }) => ({
      value: value !== undefined ? value : DEFAULT_VALUE,
      label,
    }));

    const onResourceChangeRequest = useContext(PxeResourceChangeRequestContext);
    const classes = useStyles();

    return (
      <FormControl data-testid={`Select_${valueDescriptor.path}`} variant="outlined" className={classes.select}>
        <InputLabel id={`select-value-label-${idRef.current}`}>{selectLabel}</InputLabel>
        <Select
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
    maxWidth: PXE_INPUT_WIDTH,
    marginTop: PXE_INPUT_TOP_MARGIN,
    backgroundColor: PXE_COLOR_BACKGROUND_WHITE,
    '& label': {
      backgroundColor: PXE_COLOR_BACKGROUND_WHITE,
    },
    '& fieldset': {
      borderColor: PXE_COLOR_BORDER_DEFAULT,
    },
  },
});
