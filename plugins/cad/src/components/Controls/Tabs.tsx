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

import { makeStyles, Tab as MUITab, Tabs as MUITabs } from '@material-ui/core';
import React, { ReactElement, ReactNode } from 'react';

type TabsProps = {
  tabs: readonly {
    readonly label?: string;
    readonly icon?: ReactElement;
    readonly content: ReactNode;
  }[];
};

const useStyles = makeStyles(theme => ({
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
  tabsIndicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.tabbar.indicator,
    height: theme.spacing(0.5),
  },
  tab: {
    width: '130px',
    minWidth: '130px',
    height: '64px',
    marginLeft: '24px',
    marginRight: '24px',
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(13),
    color: theme.palette.textSubtle,
  },
  content: {
    padding: '24px',
  },
}));

export const Tabs = (props: TabsProps) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <MUITabs
        classes={{ root: classes.tabs, indicator: classes.tabsIndicator }}
        value={value}
        onChange={handleChange}
      >
        {props.tabs.map(({ label, icon }, index) => (
          <MUITab
            key={index}
            classes={{ root: classes.tab }}
            label={label ?? ''}
            icon={icon}
          />
        ))}
      </MUITabs>
      {props.tabs.map(({ content }, index) => (
        <div className={classes.content} hidden={value !== index}>
          {content}
        </div>
      ))}
    </div>
  );
};
