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

import { SelectItem } from '@backstage/core-components';
import React, { useState } from 'react';
import { Select } from '../../../../Controls';
import { useSetStateAndCall } from '../../../../../hooks/useSetStateAndCall';
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import {
  NephioToken,
  NephioTokenMetadata,
  NephioTokenSpec,
} from '../../../../../types/Token';
import { EditorAccordion, ResourceMetadataAccordion } from '../Controls';
import { useEditorStyles } from '../styles';

const DELETION_POLICY_DEFAULT = 'default';
const DELETION_POLICY_SELECT_ITEMS: SelectItem[] = [
  { value: DELETION_POLICY_DEFAULT, label: 'Default' },
  { value: 'delete', label: 'Delete' },
  { value: 'orphan', label: 'Orphan' },
];

type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
};

type State = {
  metadata: NephioTokenMetadata;
  spec: NephioTokenSpec;
};

export const NephioTokenEditor = ({
  yaml,
  onUpdatedYaml,
}: ResourceEditorProps) => {
  const classes = useEditorStyles();
  const resourceYaml = loadYaml(yaml) as NephioToken;

  const createResourceState = (): State => ({
    metadata: resourceYaml.metadata,
    spec: resourceYaml.spec,
  });

  const [state, setState] = useState<State>(createResourceState());
  const [expanded, setExpanded] = useState<string>();

  const setStateAndCall = useSetStateAndCall([state, setState], newState => {
    onUpdatedYaml(dumpYaml({ ...resourceYaml, ...newState }));
  });

  return (
    <div className={classes.root}>
      <ResourceMetadataAccordion
        id="metadata"
        state={[expanded, setExpanded]}
        value={state.metadata}
        onUpdate={metadata => setStateAndCall(s => ({ ...s, metadata }))}
      />

      <EditorAccordion
        id="lifecycle"
        title="Lifecycle"
        state={[expanded, setExpanded]}
        description={getNephioTokenDescription(state.spec)}
      >
        <Select
          label="Deletion policy"
          items={DELETION_POLICY_SELECT_ITEMS}
          selected={
            state.spec.lifecycle?.deletionPolicy ?? DELETION_POLICY_DEFAULT
          }
          onChange={value => {
            setStateAndCall(s => ({
              ...s,
              spec:
                value !== DELETION_POLICY_DEFAULT
                  ? { lifecycle: { deletionPolicy: value } }
                  : {},
            }));
          }}
        />
      </EditorAccordion>
    </div>
  );
};

const getNephioTokenDescription = (spec: NephioTokenSpec) =>
  `Deletion policy: ${
    spec.lifecycle?.deletionPolicy ?? DELETION_POLICY_DEFAULT
  }`;
