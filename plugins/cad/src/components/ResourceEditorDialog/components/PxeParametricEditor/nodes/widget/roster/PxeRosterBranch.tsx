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
import { PxeRosterItemRail } from './PxeRosterItemRail';

type PxeRosterBranchProps = {
  readonly className?: string;
  readonly content: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly bottomRail: boolean;
};

export const PxeRosterBranch: React.FC<PxeRosterBranchProps> = React.memo(
  ({ className, content, actions, bottomRail, ...otherProps }) => {
    const classes = useStyles();

    return (
      <div className={`${classes.container} ${className ?? ''}`} {...otherProps}>
        <PxeRosterItemRail className={classes.rail} bottomLeg={bottomRail} />
        <div className={classes.itemContent}>{content}</div>
        <div className={classes.itemActions}>{actions}</div>
      </div>
    );
  },
  isEqual,
);

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
    marginTop: '18px',
  },
  itemActions: {
    position: 'absolute',
    top: '24px',
    right: '16px',
  },
}));
