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
import { PxeLayoutEntry } from '../types/PxeConfiguration.types';
import {
  PxeParametricEditorNode,
  PxeParametricEditorNodeProps,
} from '../PxeParametricEditorNode';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  },
}));

export const PxeRowLayoutNode: React.FC<PxeParametricEditorNodeProps> = ({
  configurationEntry,
  parentExpandedSectionState,
  onResourceChangeRequest,
  resourceChunk,
}) => {
  const { entries } = configurationEntry as PxeLayoutEntry;

  const classes = useStyles();
  return (
    <div className={classes.rowContainer}>
      {entries.map((entry, index) => (
        <PxeParametricEditorNode
          key={`${index}`}
          configurationEntry={entry}
          resourceChunk={resourceChunk}
          parentExpandedSectionState={parentExpandedSectionState}
          onResourceChangeRequest={onResourceChangeRequest}
        />
      ))}
    </div>
  );
};
