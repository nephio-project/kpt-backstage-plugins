/**
 * Copyright 2023 The Nephio Authors.
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
import React, { useState, useRef } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { toLowerCase } from '../../../../../../../utils/string';
import { AccordionState, EditorAccordion } from '../../../Controls/EditorAccordion';
import { useEditorStyles } from '../../../styles';
import { ConfigMapExpr } from '../../../../../../../types/PackageVariantSet';

type OnUpdatedKeyValueObject = (keyValueObject: ConfigMapExpr[]) => void;

type KptExprEditorAccordionProps = {
  id: string;
  title: string;
  state: AccordionState;
  keyValueObject: ConfigMapExpr[];
  onUpdatedKeyValueObject: OnUpdatedKeyValueObject;
};

export const ExprEditorAccordion = ({
  id,
  title,
  state,
  keyValueObject,
  onUpdatedKeyValueObject,
}: KptExprEditorAccordionProps) => {
  const [exprExpanded, setExprExpanded] = useState<string>();

  const refViewModel = useRef<ConfigMapExpr[]>(keyValueObject);

  const classes = useEditorStyles();

  const keyValueObjectUpdated = (): void => {
    const updatedObject = refViewModel.current;
    onUpdatedKeyValueObject(updatedObject);
  };

  const addRow = () => {
    refViewModel.current.push({
      key: '',
      value: '',
      keyExpr: '',
      valueExpr: '',
    });
    keyValueObjectUpdated();
  };

  const description = `${refViewModel.current.length} ${toLowerCase(title)}`;

  return (
    <EditorAccordion id={id} state={state} title={title} description={description}>
      {refViewModel.current.map((keyValuePair, index) => (
        <EditorAccordion
          id={`${index}`}
          state={[exprExpanded, setExprExpanded]}
          title={`Expr-${index}`}
          description={description}
        >
          <TextField
            label="Key"
            variant="outlined"
            value={keyValuePair.key}
            onChange={e => {
              keyValuePair.key = e.target.value;
              keyValueObjectUpdated();
            }}
            fullWidth
          />
          <TextField
            label="Value"
            variant="outlined"
            value={keyValuePair.value}
            onChange={e => {
              keyValuePair.value = e.target.value;
              keyValueObjectUpdated();
            }}
            fullWidth
          />
          <TextField
            label="Key Expr"
            variant="outlined"
            value={keyValuePair.keyExpr}
            onChange={e => {
              keyValuePair.keyExpr = e.target.value;
              keyValueObjectUpdated();
            }}
            fullWidth
          />
          <TextField
            label="Value Expr"
            variant="outlined"
            value={keyValuePair.valueExpr}
            onChange={e => {
              keyValuePair.valueExpr = e.target.value;
              keyValueObjectUpdated();
            }}
            fullWidth
          />
          <div className={classes.multiControlRow}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => {
                refViewModel.current = refViewModel.current.filter(
                  thisKeyValueObject => thisKeyValueObject !== keyValuePair,
                );
                keyValueObjectUpdated();
              }}
            >
              Delete Expr
            </Button>
          </div>
        </EditorAccordion>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addRow}>
        Add {title}
      </Button>
    </EditorAccordion>
  );
};
