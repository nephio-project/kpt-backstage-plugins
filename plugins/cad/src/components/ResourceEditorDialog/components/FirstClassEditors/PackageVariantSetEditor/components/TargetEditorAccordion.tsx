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
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { EditorAccordion } from '../../Controls';
import { AccordionState } from '../../Controls/EditorAccordion';
import { useEditorStyles } from '../../styles';
import { RepositoriesEditorAccordion } from './RepositoriesEditorAccordion';
import { ObjectSelectorEditorAccordion } from './ObjectSelectorEditorAccordion';
import { RepositorySelectorEditorAccordion } from './RepositorySelectorEditorAccordion';
import { Deletable, getActiveElements, isActiveElement, updateList } from '../../util/deletable';
import { PackageResource } from '../../../../../../utils/packageRevisionResources';

type OnUpdate = (value: any) => void;

type TargetEditorAccordionProps = {
  id: string;
  title: string;
  targetState: AccordionState;
  keyValueObject: any;
  packageResources: PackageResource[];
  onUpdate: OnUpdate;
};

export const TargetEditorAccordion = ({
  id,
  title,
  targetState,
  keyValueObject,
  packageResources,
  onUpdate,
}: TargetEditorAccordionProps) => {
  const refViewModel = useRef<Deletable<any>[]>(keyValueObject);
  const viewModel = refViewModel.current ?? [];
  const classes = useEditorStyles();
  const [expanded, setExpanded] = useState<string>();

  const dataUpdate = (): void => {
    const stateData = getActiveElements(viewModel);
    onUpdate(stateData);
  };
  return (
    <EditorAccordion id={id} state={targetState} title={title} description="">
      {viewModel.map((target: any, index: number) => {
        if (target.repositories !== undefined && isActiveElement(target))
          return (
            <RepositoriesEditorAccordion
              id={index}
              title="Repositories"
              targetState={[expanded, setExpanded]}
              target={target}
              packageResources={packageResources}
              onUpdate={updatedRepositories => {
                updateList(viewModel, updatedRepositories, index);
                dataUpdate();
              }}
            />
          );
        if (target.repositorySelector !== undefined && isActiveElement(target))
          return (
            <RepositorySelectorEditorAccordion
              id={index}
              title="Repository Selector"
              targetState={[expanded, setExpanded]}
              target={target}
              packageResources={packageResources}
              onUpdate={updatedRepositories => {
                updateList(viewModel, updatedRepositories, index);
                dataUpdate();
              }}
            />
          );
        if (target.objectSelector !== undefined && isActiveElement(target))
          return (
            <ObjectSelectorEditorAccordion
              id={index}
              title="Object Selector"
              targetState={[expanded, setExpanded]}
              target={target}
              packageResources={packageResources}
              onUpdate={updatedRepositories => {
                updateList(viewModel, updatedRepositories, index);
                dataUpdate();
              }}
            />
          );
        return null;
      })}
      <div className={classes.buttonRow}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            viewModel.push({
              repositories: [
                {
                  name: '',
                  packageNames: [],
                },
              ],
              template: {},
            });
            dataUpdate();
            setExpanded(`repositories-${viewModel.length - 1}`);
          }}
        >
          Repository
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            viewModel.push({
              repositorySelector: {},
              template: {},
            });
            dataUpdate();
            setExpanded(`repositorySelector-${viewModel.length - 1}`);
          }}
        >
          Repository Seletor
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            viewModel.push({
              objectSelector: {},
              template: {},
            });
            dataUpdate();
            setExpanded(`objectSelector-${viewModel.length - 1}`);
          }}
        >
          Object Selector
        </Button>
      </div>
    </EditorAccordion>
  );
};
