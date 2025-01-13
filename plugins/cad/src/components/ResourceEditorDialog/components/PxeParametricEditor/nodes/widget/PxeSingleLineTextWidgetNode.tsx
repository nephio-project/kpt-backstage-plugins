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
import React, { useContext } from 'react';
import { PxeSingleLineTextWidgetEntry } from '../../types/PxeConfiguration.types';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { withCurrentValues } from '../../utils/rendering/withCurrentValues';
import { generateValueLabel } from '../../utils/generateLabelsForWidgets';
import { useDiagnostics } from '../../PxeDiagnosticsContext';
import { PxeResourceChangeRequestContext } from '../../PxeResourceChangeRequestContext';
import {
  PXE_COLOR_BACKGROUND_WHITE,
  PXE_COLOR_BORDER_DEFAULT,
  PXE_INPUT_TOP_MARGIN,
  PXE_INPUT_WIDTH,
} from '../../PxeSharedStyles';

export const PxeSingleLineTextWidgetNode: React.FC<PxeParametricEditorNodeProps> = withCurrentValues(
  ({ configurationEntry, currentValues: [currentValue] }) => {
    useDiagnostics(configurationEntry);

    const {
      textFilter,
      valueDescriptors: [valueDescriptor],
    } = configurationEntry as PxeSingleLineTextWidgetEntry;

    const onResourceChangeRequest = useContext(PxeResourceChangeRequestContext);
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
