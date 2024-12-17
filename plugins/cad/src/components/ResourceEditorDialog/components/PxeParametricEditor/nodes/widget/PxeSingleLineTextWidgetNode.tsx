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

import { makeStyles, TextField } from '@material-ui/core';
import React from 'react';
import { PxeSingleLineTextWidgetEntry } from '../../types/PxeConfiguration.types';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { withCurrentValues } from '../../utils/rendering/withCurrentValues';
import { generateValueLabel } from '../../utils/generateLabelsForWidgets';
import { useDiagnostics } from '../../PxeDiagnosticsContext';

export const PxeSingleLineTextWidgetNode: React.FC<PxeParametricEditorNodeProps> = withCurrentValues(
  ({ configurationEntry, onResourceChangeRequest, currentValues: [currentValue] }) => {
    useDiagnostics(configurationEntry);

    const {
      textFilter,
      valueDescriptors: [valueDescriptor],
    } = configurationEntry as PxeSingleLineTextWidgetEntry;

    const classes = useStyles();
    return (
      <TextField
        data-testid={`TextField_${valueDescriptor.path}`}
        className={classes.textField}
        label={generateValueLabel(valueDescriptor)}
        variant="outlined"
        value={currentValue ?? ''}
        onChange={e => {
          onResourceChangeRequest({
            valueDescriptor,
            newValue: textFilter(e.target.value),
          });
        }}
      />
    );
  },
);

const useStyles = makeStyles({
  textField: {
    width: '100%',
    maxWidth: '500px',
    marginTop: '6px',
    '& fieldset': {
      borderColor: '#74777f', // FIXME extract color
    },
  },
});
