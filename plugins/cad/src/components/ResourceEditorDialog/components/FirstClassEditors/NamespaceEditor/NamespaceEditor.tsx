/**
 * Copyright 2022 Google LLC
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

import React, { useEffect, useState } from 'react';
import { Namespace, NamespaceMetadata } from '../../../../../types/Namespace';
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import { ResourceMetadataAccordion } from '../Controls';
import { useEditorStyles } from '../styles';

type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
};

type State = {
  metadata: NamespaceMetadata;
};

export const NamespaceEditor = ({ yaml, onUpdatedYaml }: ResourceEditorProps) => {
  const resourceYaml = loadYaml(yaml) as Namespace;

  const createResourceState = (): State => ({
    metadata: resourceYaml.metadata,
  });

  const [state, setState] = useState<State>(createResourceState);
  const [expanded, setExpanded] = useState<string>();

  const classes = useEditorStyles();

  useEffect(() => {
    resourceYaml.metadata = state.metadata;

    onUpdatedYaml(dumpYaml(resourceYaml));
  }, [state, onUpdatedYaml, resourceYaml]);

  return (
    <div className={classes.root}>
      <ResourceMetadataAccordion
        clusterScopedResource
        id="metadata"
        state={[expanded, setExpanded]}
        value={state.metadata}
        onUpdate={metadata => setState(s => ({ ...s, metadata }))}
      />
    </div>
  );
};
