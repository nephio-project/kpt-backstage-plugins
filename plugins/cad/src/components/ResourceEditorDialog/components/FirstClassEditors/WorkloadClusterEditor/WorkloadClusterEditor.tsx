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
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import {
  WorkloadCluster,
  WorkloadClusterMetadata,
  WorkloadClusterSpec,
} from '../../../../../types/WorkloadCluster';
import React, { Fragment, useEffect, useState } from 'react';
import {
  EditorAccordion,
  ResourceMetadataAccordion,
  ValueListEditorAccordion,
} from '../Controls';
import { useEditorStyles } from '../styles';
import { TextField } from '@material-ui/core';

// FIXME This function is wildly duplicated across editor code.
type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
};

type State = {
  metadata: WorkloadClusterMetadata;
  spec: WorkloadClusterSpec;
};

const getDescription = (spec: WorkloadClusterSpec) =>
  [
    `Name: ${spec.clusterName}`,
    spec.masterInterface ? `master interface: ${spec.masterInterface}` : null,
  ]
    .filter(Boolean)
    .join(', ');

export const WorkloadClusterEditor = ({
  yaml,
  onUpdatedYaml,
}: ResourceEditorProps) => {
  const resourceYaml = loadYaml(yaml) as WorkloadCluster;

  const createResourceState = (): State => ({
    metadata: resourceYaml.metadata,
    spec: resourceYaml.spec,
  });

  const [state, setState] = useState<State>(createResourceState());
  const [expanded, setExpanded] = useState<string>();

  const classes = useEditorStyles();

  useEffect(() => {
    onUpdatedYaml(
      dumpYaml({
        ...resourceYaml,
        metadata: state.metadata,
        spec: state.spec,
      }),
    );
  }, [state, onUpdatedYaml, resourceYaml]); // FIXME

  return (
    <div className={classes.root}>
      <ResourceMetadataAccordion
        id="metadata"
        state={[expanded, setExpanded]}
        value={state.metadata}
        onUpdate={metadata => setState(s => ({ ...s, metadata }))}
      />

      <EditorAccordion
        id="configuration"
        title="Configuration"
        state={[expanded, setExpanded]}
        description={getDescription(state.spec)}
      >
        <Fragment>
          <TextField
            label="Cluster name"
            variant="outlined"
            value={state.spec.clusterName}
            onChange={e => {
              setState(s => ({
                ...s,
                spec: { ...s.spec, clusterName: e.target.value },
              }));
            }}
            fullWidth
          />

          <TextField
            label="Master interface"
            variant="outlined"
            value={state.spec.masterInterface}
            onChange={e => {
              setState(s => ({
                ...s,
                spec: {
                  ...s.spec,
                  masterInterface: e.target.value || undefined,
                },
              }));
            }}
            fullWidth
          />
        </Fragment>
      </EditorAccordion>

      <ValueListEditorAccordion
        id="cnis"
        title="CNIs"
        state={[expanded, setExpanded]}
        valueList={state.spec.cnis ?? []}
        onUpdatedValueList={cnis => {
          setState(s => ({
            ...s,
            spec: { ...s.spec, cnis: cnis.length > 0 ? cnis : undefined },
          }));
        }}
      />
    </div>
  );
};
