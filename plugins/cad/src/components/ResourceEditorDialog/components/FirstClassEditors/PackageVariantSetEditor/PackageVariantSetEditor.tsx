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

import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { PackageResource } from '../../../../../utils/packageRevisionResources';
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import { EditorAccordion, ResourceMetadataAccordion } from '../Controls';
import { useEditorStyles } from '../styles';
import { PackageVariantSet, PackageVariantSetTargets } from '../../../../../types/PackageVariantSet';
import { PackageVariantUpstream } from '../../../../../types/PackageVariant';
import { UpstreamPackageEditorAccordion } from '../PackageVariantEditor/components/container/UpstreamPackageEditorAccordion';
import { TargetEditorAccordion } from './components/TargetEditorAccordion';

type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
  packageResources: PackageResource[];
};

type State = {
  upstream: PackageVariantUpstream;
  targets: PackageVariantSetTargets[];
};

const getResourceState = (packageVariantSet: PackageVariantSet): State => {
  packageVariantSet.spec = packageVariantSet.spec || { targets: [] };
  const pvSetSpec = packageVariantSet.spec;

  pvSetSpec.upstream = pvSetSpec.upstream || {};
  pvSetSpec.targets = pvSetSpec.targets || [];

  return {
    upstream: pvSetSpec.upstream,
    targets: pvSetSpec.targets,
  };
};
export const PackageVariantSetEditor = ({ yaml, onUpdatedYaml, packageResources }: ResourceEditorProps) => {
  const resourceYaml = loadYaml(yaml) as PackageVariantSet;

  const classes = useEditorStyles();

  const [state, setState] = useState<PackageVariantSet>(resourceYaml);
  const [specState, setSpecState] = useState<State>(getResourceState(resourceYaml));
  const [expanded, setExpanded] = useState<string>();
  const [specExpanded, setSpecExpanded] = useState<string>();

  useEffect(() => {
    resourceYaml.metadata = state.metadata;
    const spec = resourceYaml.spec;
    spec.upstream = cloneDeep(specState.upstream);
    spec.targets = cloneDeep(specState.targets);

    onUpdatedYaml(dumpYaml(resourceYaml));
  }, [state, specState, resourceYaml, onUpdatedYaml]);

  return (
    <div className={classes.root}>
      <ResourceMetadataAccordion
        id="metadata"
        state={[expanded, setExpanded]}
        value={state.metadata}
        onUpdate={metadata => setState(s => ({ ...s, metadata }))}
      />
      <EditorAccordion id="spec" title="Spec" state={[expanded, setExpanded]}>
        <UpstreamPackageEditorAccordion
          id="upstream"
          state={[specExpanded, setSpecExpanded]}
          title="Upstream"
          keyValueObject={specState.upstream || {}}
          onUpdatedKeyValueObject={upstream => setSpecState(s => ({ ...s, upstream }))}
        />
        <TargetEditorAccordion
          id="Target"
          title="Target"
          packageResources={packageResources}
          targetState={[specExpanded, setSpecExpanded]}
          keyValueObject={specState.targets || []}
          onUpdate={targetData => setSpecState(s => ({ ...s, targetData }))}
        />
      </EditorAccordion>
    </div>
  );
};
