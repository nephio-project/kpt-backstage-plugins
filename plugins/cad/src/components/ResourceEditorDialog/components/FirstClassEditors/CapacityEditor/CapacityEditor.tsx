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

import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useSetStateAndCall } from '../../../../../hooks/useSetStateAndCall';
import { getNumber } from '../../../../../utils/string';
import {
  Capacity,
  CapacityMetadata,
  CapacitySpec,
} from '../../../../../types/Capacity';
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import { EditorAccordion, ResourceMetadataAccordion } from '../Controls';
import { useEditorStyles } from '../styles';

type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
};

type State = {
  metadata: CapacityMetadata;
  spec: CapacitySpec;
};

export const CapacityEditor = ({
  yaml,
  onUpdatedYaml,
}: ResourceEditorProps) => {
  const classes = useEditorStyles();
  const resourceYaml = loadYaml(yaml) as Capacity;

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
        id="spec"
        title="Capacity"
        state={[expanded, setExpanded]}
      >
        {/* TODO Consider adding regex-based validation of both throughput values. */}
        <TextField
          label="Max Uplink Throughput"
          variant="outlined"
          value={state.spec.maxUplinkThroughput ?? ''}
          onChange={e => {
            setStateAndCall(s => ({
              ...s,
              spec: { ...s.spec, maxUplinkThroughput: e.target.value },
            }));
          }}
          fullWidth
        />

        <TextField
          label="Max Downlink Throughput"
          variant="outlined"
          value={state.spec.maxDownlinkThroughput ?? ''}
          onChange={e => {
            setStateAndCall(s => ({
              ...s,
              spec: { ...s.spec, maxDownlinkThroughput: e.target.value },
            }));
          }}
          fullWidth
        />

        <TextField
          label="Max NF Connections"
          variant="outlined"
          value={state.spec.maxNFConnections ?? ''}
          onChange={e => {
            setStateAndCall(s => ({
              ...s,
              spec: { ...s.spec, maxNFConnections: getNumber(e.target.value) },
            }));
          }}
          fullWidth
        />

        <TextField
          label="Max Sessions"
          variant="outlined"
          value={state.spec.maxSessions ?? ''}
          onChange={e => {
            setStateAndCall(s => ({
              ...s,
              spec: { ...s.spec, maxSessions: getNumber(e.target.value) },
            }));
          }}
          fullWidth
        />

        <TextField
          label="Max Subscribers"
          variant="outlined"
          value={state.spec.maxSubscribers ?? ''}
          onChange={e => {
            setStateAndCall(s => ({
              ...s,
              spec: { ...s.spec, maxSubscribers: getNumber(e.target.value) },
            }));
          }}
          fullWidth
        />
      </EditorAccordion>
    </div>
  );
};
