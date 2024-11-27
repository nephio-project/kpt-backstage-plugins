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
import { PackageVariant, PackageVariantSpec } from '../../../../../types/PackageVariant';
import { PackageResource } from '../../../../../utils/packageRevisionResources';
import { dumpYaml, loadYaml } from '../../../../../utils/yaml';
import { ResourceMetadataAccordion } from '../Controls';
import { useEditorStyles } from '../styles';
import { PackageVariantSpecEditor } from './components/PackageVariantSpecEditor';

type OnUpdatedYamlFn = (yaml: string) => void;

type ResourceEditorProps = {
  yaml: string;
  onUpdatedYaml: OnUpdatedYamlFn;
  packageResources: PackageResource[];
};

type State = {
  spec: PackageVariantSpec;
};

const getResourceState = (packageVariant: PackageVariant): State => {
  packageVariant.spec = packageVariant.spec || { adoptionPolicy: '' };
  const packageVariantSpec = packageVariant.spec;

  packageVariantSpec.upstream = packageVariantSpec.upstream || {};
  packageVariantSpec.downstream = packageVariantSpec.downstream || {};
  packageVariantSpec.labels = packageVariantSpec.labels || undefined;
  packageVariantSpec.annotations = packageVariantSpec.annotations || undefined;
  packageVariantSpec.adoptionPolicy = packageVariantSpec.adoptionPolicy || '';
  packageVariantSpec.deletionPolicy = packageVariantSpec.deletionPolicy || '';
  packageVariantSpec.injectors = packageVariantSpec.injectors || { name: '' };
  packageVariantSpec.packageContext = packageVariantSpec.packageContext || {
    data: {},
  };
  packageVariantSpec.pipeline = packageVariantSpec.pipeline || {
    mutators: [],
    validators: [],
  };
  const specData = {
    upstream: packageVariantSpec.upstream,
    downstream: packageVariantSpec.downstream,
    labels: packageVariantSpec.labels,
    annotations: packageVariantSpec.annotations,
    adoptionPolicy: packageVariantSpec.adoptionPolicy,
    deletionPolicy: packageVariantSpec.deletionPolicy,
    injectors: packageVariantSpec.injectors,
    packageContext: packageVariantSpec.packageContext,
    pipeline: packageVariantSpec.pipeline,
  };
  return {
    spec: specData,
  };
};
export const PackageVariantEditor = ({ yaml, onUpdatedYaml, packageResources }: ResourceEditorProps) => {
  const resourceYaml = loadYaml(yaml) as PackageVariant;

  const classes = useEditorStyles();

  const [state, setState] = useState<PackageVariant>(resourceYaml);
  const [specState, setSpecState] = useState<State>(getResourceState(resourceYaml));
  const [expanded, setExpanded] = useState<string>();

  useEffect(() => {
    resourceYaml.metadata = state.metadata;
    const spec = resourceYaml.spec;
    spec.upstream = cloneDeep(specState.spec.upstream);
    spec.downstream = cloneDeep(specState.spec.downstream);
    spec.labels = specState.spec.labels;
    spec.annotations = specState.spec.annotations;
    spec.adoptionPolicy = specState.spec.adoptionPolicy;
    spec.deletionPolicy = specState.spec.deletionPolicy;
    spec.injectors = cloneDeep(specState.spec.injectors);
    spec.packageContext = cloneDeep(specState.spec.packageContext);
    spec.pipeline = cloneDeep(specState.spec.pipeline);

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
      <PackageVariantSpecEditor
        id="spec"
        title="Spec Data"
        state={[expanded, setExpanded]}
        value={specState.spec}
        packageResources={packageResources}
        onUpdate={spec => setSpecState(s => ({ ...s, spec }))}
      />
    </div>
  );
};
