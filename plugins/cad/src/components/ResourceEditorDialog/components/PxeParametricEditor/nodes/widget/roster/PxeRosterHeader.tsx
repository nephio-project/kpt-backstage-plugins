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
import { PxeValueType } from '../../../types/PxeConfiguration.types';
import { PXE_COLOR_BACKGROUND_WHITE, PXE_COLOR_RAIL } from '../../../PxeSharedStyles';

type PxeRosterHeaderProps = {
  readonly name: string;
  readonly rosterValueType: PxeValueType.Object | PxeValueType.Array;
};

export const PxeRosterHeader: React.FC<PxeRosterHeaderProps> = React.memo(({ name, rosterValueType }) => {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <span className={classes.nameLabel}>{name}</span>
      <span className={classes.typeLabel}>{rosterValueType === PxeValueType.Array ? '[]' : '{}'}</span>
    </div>
  );
}, isEqual);

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'fit-content',
    height: '32px',
    padding: '0 12px',
    borderRadius: '16px',
    border: `solid 1px ${PXE_COLOR_RAIL}`,
    backgroundColor: PXE_COLOR_BACKGROUND_WHITE,
  },
  nameLabel: {
    fontWeight: 700,
  },
  typeLabel: {
    marginLeft: '12px',
    fontFamily: 'Lucida Console, monospace',
    fontWeight: 700,
  },
}));
