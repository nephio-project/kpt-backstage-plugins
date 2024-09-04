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

import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Fragment, useRef } from 'react';
import { KubernetesValueList } from '../../../../../types/KubernetesResource';
import { toLowerCase } from '../../../../../utils/string';
import { IconButton } from '../../../../Controls';
import { useEditorStyles } from '../styles';
import { AccordionState, EditorAccordion } from './EditorAccordion';

type ValueListEditorProps = {
  id: string;
  title: string;
  state: AccordionState;
  valueList: KubernetesValueList;
  onUpdatedValueList: (valueList: KubernetesValueList) => void;
};

export const ValueListEditorAccordion = ({
  id,
  title,
  state,
  valueList,
  onUpdatedValueList,
}: ValueListEditorProps) => {
  const refViewModel = useRef<{ value: string }[]>(
    valueList.map(value => ({ value })),
  );

  const classes = useEditorStyles();

  const valueUpdated = (): void => {
    onUpdatedValueList(
      refViewModel.current.map(valueHolder => valueHolder.value),
    );
  };

  const addRow = () => {
    refViewModel.current.push({ value: '' });
    valueUpdated();
  };

  const description = `${refViewModel.current.length} ${toLowerCase(title)}`;

  return (
    <EditorAccordion
      id={id}
      state={state}
      title={title}
      description={description}
    >
      <Fragment>
        {refViewModel.current.map((valueHolder, index) => (
          <div className={classes.multiControlRow} key={index}>
            <TextField
              label="Value"
              variant="outlined"
              value={valueHolder.value}
              onChange={e => {
                valueHolder.value = e.target.value;
                valueUpdated();
              }}
              fullWidth
            />
            <IconButton
              title="Delete"
              className={classes.iconButton}
              onClick={() => {
                refViewModel.current = refViewModel.current.filter(
                  thisValueHolder => thisValueHolder !== valueHolder,
                );
                valueUpdated();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        <Button variant="outlined" startIcon={<AddIcon />} onClick={addRow}>
          Add {title}
        </Button>
      </Fragment>
    </EditorAccordion>
  );
};
