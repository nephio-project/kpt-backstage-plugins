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
import { PxeConfigurationEntry } from './types/PxeConfiguration.types';
import { PxeParametricEditorNode } from './PxeParametricEditorNode';

type PxeParametricEditorNodeListProps = {
  readonly entries: readonly PxeConfigurationEntry[];
};

export const PxeParametricEditorNodeList: React.FC<PxeParametricEditorNodeListProps> = React.memo(({ entries }) => {
  const classes = useClasses();
  return (
    <div className={classes.nodesContainer}>
      {entries.map((entry, index) => (
        <PxeParametricEditorNode key={`${index}`} configurationEntry={entry} />
      ))}
    </div>
  );
}, isEqual);

const useClasses = makeStyles({
  nodesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '18px',
  },
});
