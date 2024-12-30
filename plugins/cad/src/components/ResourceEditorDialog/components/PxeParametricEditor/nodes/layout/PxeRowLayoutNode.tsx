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

import { makeStyles } from '@material-ui/core';
import { isEqual } from 'lodash';
import React from 'react';
import { PxeRowLayoutEntry } from '../../types/PxeConfiguration.types';
import { PxeParametricEditorNode, PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { useDiagnostics } from '../../PxeDiagnosticsContext';

export const PxeRowLayoutNode: React.FC<PxeParametricEditorNodeProps> = React.memo(({ configurationEntry }) => {
  useDiagnostics(configurationEntry);
  const { entries } = configurationEntry as PxeRowLayoutEntry;

  const classes = useStyles();

  return (
    <div className={classes.rowContainer}>
      {entries.map((entry, index) => (
        <div className={classes.rowItem} key={`${index}`}>
          <PxeParametricEditorNode configurationEntry={entry} />
        </div>
      ))}
    </div>
  );
}, isEqual);

// FIXME 500px is duplicated
const useStyles = makeStyles(() => ({
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  },
  rowItem: {
    flex: '1 1 0',
    maxWidth: '500px',
  },
}));
