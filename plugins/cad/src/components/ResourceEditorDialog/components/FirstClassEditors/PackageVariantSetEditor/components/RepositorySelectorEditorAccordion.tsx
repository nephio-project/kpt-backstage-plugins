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
import { Button } from '@material-ui/core';
import { AccordionState, EditorAccordion } from '../../Controls/EditorAccordion';
import {
  PackageVariantSetRepositorySelector,
  PackageVariantSetTempleate,
} from '../../../../../../types/PackageVariantSet';
import { KeyValueEditorAccordion } from '../../Controls';
import { PackageResource } from '../../../../../../utils/packageRevisionResources';
import { TemplateEditorAccordion } from './templates/TemplateEditorAccordion';
import { useEditorStyles } from '../../styles';

type RepositoriesState = {
  repositorySelector: PackageVariantSetRepositorySelector;
  template?: PackageVariantSetTempleate;
};
type OnUpdate = (newValue?: RepositoriesState) => void;

type repositorySelectorEditorProps = {
  id: number;
  title: string;
  targetState: AccordionState;
  target: RepositoriesState;
  packageResources: PackageResource[];
  onUpdate: OnUpdate;
};

export const RepositorySelectorEditorAccordion = ({
  id,
  title,
  targetState: accordionState,
  target,
  packageResources,
  onUpdate,
}: repositorySelectorEditorProps) => {
  const classes = useEditorStyles();
  const refViewModel = useRef<RepositoriesState>(clone(target));
  const viewModel = refViewModel.current;
  const [expanded, setExpanded] = useState<string>();
  const [state, setState] = useState<RepositoriesState>(viewModel);
  const valueUpdated = (): void => {
    onUpdate(viewModel);
  };

  return (
    <EditorAccordion
      id={`repositorySelector-${id}`}
      title={title}
      description={`Repository Selector-${id}`}
      state={accordionState}
    >
      <KeyValueEditorAccordion
        id="matchLabels"
        state={[expanded, setExpanded]}
        title="Match Labels"
        keyValueObject={state.repositorySelector.matchLabels || {}}
        onUpdatedKeyValueObject={matchLabels => {
          viewModel.repositorySelector.matchLabels = matchLabels;
          valueUpdated();
        }}
      />
      <TemplateEditorAccordion
        id="template"
        title="Template Data"
        state={[expanded, setExpanded]}
        value={state.template || {}}
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
          Delete Repository Selector
        </Button>
      </div>
    </EditorAccordion>
  );
};
