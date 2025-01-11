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
  readonly isInRosterItem: boolean;
};

export const PxeParametricEditorNodeList: React.FC<PxeParametricEditorNodeListProps> = React.memo(
  ({ entries, isInRosterItem }) => {
    const classes = useClasses();
    return (
      <div className={classes.nodesContainer}>
        {entries.map((entry, index) => {
          const isFirstNode = index === 0;
          const isLastNode = index === entries.length - 1;
          return [
            <PxeParametricEditorNode
              key={`node-${index}`}
              configurationEntry={entry}
              listPositionInfo={{ isInRosterItem, isFirstNode, isLastNode }}
            />,
            !isLastNode && (
              <div className={classes.nodeSeparator} key={`separator-${index}`}>
                <div className={isInRosterItem ? classes.nodeSeparatorRail : ''} />
              </div>
            ),
          ];
        })}
      </div>
    );
  },
  isEqual,
);

const useClasses = makeStyles({
  nodesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  nodeSeparator: {
    height: '18px',
    overflow: 'visible',
  },
  nodeSeparatorRail: {
    height: '32px',
    width: '17px',
    borderRight: 'solid 1px #c4c6Cf',
  },
});
