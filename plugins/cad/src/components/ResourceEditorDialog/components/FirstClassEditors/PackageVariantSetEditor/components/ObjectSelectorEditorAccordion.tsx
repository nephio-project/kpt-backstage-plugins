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

import React, { useRef, useState } from 'react';
import { clone } from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextField, Button } from '@material-ui/core';
import { AccordionState, EditorAccordion } from '../../Controls/EditorAccordion';
import { PackageVariantSetObjectSelector, PackageVariantSetTempleate } from '../../../../../../types/PackageVariantSet';
import { KeyValueEditorAccordion } from '../../Controls';
import { PackageResource } from '../../../../../../utils/packageRevisionResources';
import { TemplateEditorAccordion } from './templates/TemplateEditorAccordion';
import { useEditorStyles } from '../../styles';

type RepositoriesState = {
  objectSelector: PackageVariantSetObjectSelector;
  template: PackageVariantSetTempleate;
};

type OnUpdate = (newValue?: RepositoriesState) => void;

type objectSelectorEditorProps = {
  id: number;
  title: string;
  targetState: AccordionState;
  target: RepositoriesState;
  packageResources: PackageResource[];
  onUpdate: OnUpdate;
};

export const ObjectSelectorEditorAccordion = ({
  id,
  title,
  targetState: accordionState,
  target,
  packageResources,
  onUpdate,
}: objectSelectorEditorProps) => {
  const classes = useEditorStyles();
  const refViewModel = useRef<RepositoriesState>(clone(target));
  const viewModel = refViewModel.current;
  const [expanded, setExpanded] = useState<string>();

  const [state, setState] = useState<RepositoriesState>(viewModel);
  const valueUpdated = (): void => {
    onUpdate(state);
  };

  return (
    <EditorAccordion
      id={`objectSelector-${id}`}
      title={title}
      description={`ObjectSelector-${id}`}
      state={accordionState}
    >
      <TextField
        label="API Version"
        variant="outlined"
        value={state.objectSelector.apiVersion}
        onChange={e => {
          state.objectSelector.apiVersion = e.target.value;
          valueUpdated();
        }}
        fullWidth
      />
      <TextField
        label="Kind"
        variant="outlined"
        value={state.objectSelector.kind}
        onChange={e => {
          state.objectSelector.kind = e.target.value;
          valueUpdated();
        }}
        fullWidth
      />
      <KeyValueEditorAccordion
        id="matchLabels"
        state={[expanded, setExpanded]}
        title="Match Labels"
        keyValueObject={state.objectSelector.matchLabels || {}}
        onUpdatedKeyValueObject={matchLabels => {
          state.objectSelector.matchLabels = matchLabels;
          valueUpdated();
        }}
      />
      <TemplateEditorAccordion
        id="template"
        title="Template Data"
        state={[expanded, setExpanded]}
        value={state.template}
        packageResources={packageResources}
        onUpdate={updatedRepositories => {
          setState(s => ({
            ...s,
            template: updatedRepositories,
          }));
          valueUpdated();
        }}
      />
      <div className={classes.multiControlRow}>
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => onUpdate(undefined)}>
          Delete Object Selector
        </Button>
      </div>
    </EditorAccordion>
  );
};
