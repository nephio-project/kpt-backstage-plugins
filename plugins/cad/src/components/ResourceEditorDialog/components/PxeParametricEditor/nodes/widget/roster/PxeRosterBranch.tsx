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
import { PXE_INPUT_TOP_MARGIN } from '../../../PxeSharedStyles';
import { PxeRosterItemRail } from './PxeRosterItemRail';

type PxeRosterBranchProps = {
  readonly className?: string;
  readonly content: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly railBarHeight?: number;
  readonly bottomRail?: boolean;
};

export const PxeRosterBranch: React.FC<PxeRosterBranchProps> = React.memo(
  ({ className, content, actions, railBarHeight, bottomRail, ...otherProps }) => {
    const classes = useStyles();

    return (
      <div className={`${classes.container} ${className ?? ''}`} {...otherProps}>
        <PxeRosterItemRail className={classes.rail} barHeight={railBarHeight} bottomLeg={bottomRail} />
        <div className={classes.itemContent}>{content}</div>
        <div className={classes.itemActions}>{actions}</div>
      </div>
    );
  },
  isEqual,
);

const CONTENT_TOP_MARGIN = 18;
const ACTION_RIGHT_POSITION = 48;
const ACTION_TOP_MARGIN = 7;

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rail: {
    alignSelf: 'stretch',
  },
  itemContent: {
    flex: '1 1 auto',
    marginTop: CONTENT_TOP_MARGIN,
  },
  itemActions: {
    position: 'absolute',
    top: CONTENT_TOP_MARGIN + PXE_INPUT_TOP_MARGIN + ACTION_TOP_MARGIN,
    right: -ACTION_RIGHT_POSITION,
  },
}));
