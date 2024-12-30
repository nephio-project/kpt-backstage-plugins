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

import { makeStyles, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import { PxeConfigurationTab } from './types/PxeConfiguration.types';
import { PxeParametricEditorNodeList } from './PxeParametricEditorNodeList';

type PxeParametricEditorTabsProps = {
  readonly tabs: readonly PxeConfigurationTab[];
};

export const PxeParametricEditorTabs: React.FC<PxeParametricEditorTabsProps> = ({ tabs }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const classes = useStyles();
  return (
    <div>
      <Tabs classes={{ root: classes.tabs, indicator: classes.indicator }} value={value} onChange={handleChange}>
        {tabs.map(({ name }, index) => (
          <Tab classes={{ root: classes.tab, selected: classes.tabSelected }} key={index} label={name} />
        ))}
      </Tabs>
      {tabs.map(({ entries }, index) => (
        <div key={index} hidden={value !== index}>
          <PxeParametricEditorNodeList entries={entries} />
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles(theme => {
  return {
    tabs: {
      marginBottom: '24px',
    },
    indicator: {
      backgroundColor: '#3d5f90',
    },
    tab: {
      borderBottom: 'solid 1px #c4c6cF',
      fontWeight: 600,
      letterSpacing: '0.5px',
      color: theme.palette.text.primary,
      opacity: 1,
    },
    tabSelected: {
      // FIXME Duplicated color.
      color: '#3d5f90',
    },
  };
});
