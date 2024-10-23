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

import { TextField } from '@material-ui/core';
import { clone } from 'lodash';
import React, { Fragment, useRef, useState } from 'react';
import { KubernetesKeyValueObject } from '../../../../../../../types/KubernetesResource';
import { PackageVariantPackageContext } from '../../../../../../../types/PackageVariant';
import { KeyValueEditorAccordion } from '../../../Controls';
import { AccordionState, EditorAccordion } from '../../../Controls/EditorAccordion';
import { useEditorStyles } from '../../../styles';

type DeploymentState = {
  data: KubernetesKeyValueObject;
  removeKeys?: string[];
};

type OnUpdate = (newValue: DeploymentState) => void;

type DeploymentDetailsEditorAccordionProps = {
  id: string;
  state: AccordionState;
  value: PackageVariantPackageContext;
  onUpdate: OnUpdate;
};

export const PackageContextEditorAccordion = ({
  id,
  state,
  value: deploymentState,
  onUpdate,
}: DeploymentDetailsEditorAccordionProps) => {
  const classes = useEditorStyles();

  const [sectionExpanded, setSectionExpanded] = useState<string>();
  const refViewModel = useRef<DeploymentState>(clone(deploymentState));
  const viewModel = refViewModel.current;

  const valueUpdated = (): void => {
    onUpdate(viewModel);
  };

  return (
    <EditorAccordion id={id} title="Package Context" state={state}>
      <Fragment>
        <div className={classes.multiControlRow}>
          <TextField
            label="Remove Keys"
            variant="outlined"
            value={(viewModel.removeKeys ?? []).join(', ')}
            onChange={e => {
              const value = e.target.value;

              viewModel.removeKeys = value ? value.split(',').map(v => v.trim()) : undefined;
              valueUpdated();
            }}
            fullWidth
          />
          <div />
        </div>

        <div>
          <KeyValueEditorAccordion
            id="data"
            title="Data"
            state={[sectionExpanded, setSectionExpanded]}
            keyValueObject={viewModel.data || {}}
            onUpdatedKeyValueObject={data => {
              viewModel.data = data;
              valueUpdated();
            }}
          />
        </div>
      </Fragment>
    </EditorAccordion>
  );
};
