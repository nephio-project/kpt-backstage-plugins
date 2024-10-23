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
import { PackageVariantInjectors, PackageVariantSpec } from '../../../../../../types/PackageVariant';
import { PackageResource } from '../../../../../../utils/packageRevisionResources';
import { Select } from '../../../../../Controls';
import { AccordionState, EditorAccordion } from '../../Controls/EditorAccordion';
import { KeyValueEditorAccordion } from '../../Controls/KeyValueEditorAccordion';
import { DownstreamPackageEditorAccordion } from './container/DownstreamPackageEditorAccordion';
import { PackageContextEditorAccordion } from './container/PackageContextEditorAccordion';
import { PipelineEditorAccordion } from './container/PipelineEditorAccordion';
import { UpstreamPackageEditorAccordion } from './container/UpstreamPackageEditorAccordion';
import { InjectorEditorAccordion } from './container/InjectorEditorAccordion';

type OnUpdate = (value: PackageVariantSpec) => void;

type PackageVariantSpecEditorProps = {
  id: string;
  title: string;
  state: AccordionState;
  value: PackageVariantSpec;
  onUpdate: OnUpdate;
  packageResources: PackageResource[];
};

const deletionFunctionList = [
  { label: 'Delete', value: 'delete' },
  { label: 'Orphan', value: 'orphan' },
];
const adoptFunctionList = [
  { label: 'AdoptExisting', value: 'adoptExisting' },
  { label: 'AdoptNone', value: 'adoptNone' },
];

export const PackageVariantSpecEditor = ({
  id,
  title,
  state,
  value,
  onUpdate,
  packageResources,
}: PackageVariantSpecEditorProps) => {
  const createInjectorsState = (injectors: any): PackageVariantInjectors => ({
    group: injectors && injectors.group ? injectors.group : '',
    version: injectors && injectors.version ? injectors.version : '',
    kind: injectors && injectors.kind ? injectors.kind : '',
    name: injectors && injectors.name ? injectors.name : '',
  });

  const refViewModel = useRef<PackageVariantSpec>(value);
  const viewModel = refViewModel.current;
  const [specExpanded, setSpecExpanded] = useState<string>();
  const [injectorEditor, setInjectorEditor] = useState<PackageVariantInjectors>(
    createInjectorsState(viewModel.injectors),
  );
  const valueUpdated = (): void => {
    onUpdate(viewModel);
  };

  return (
    <EditorAccordion id={id} title={title} state={state}>
      <KeyValueEditorAccordion
        id="labels"
        state={[specExpanded, setSpecExpanded]}
        title="Labels"
        keyValueObject={viewModel.labels || {}}
        onUpdatedKeyValueObject={labels => {
          viewModel.labels = labels;
          valueUpdated();
        }}
      />
      <KeyValueEditorAccordion
        id="annotations"
        state={[specExpanded, setSpecExpanded]}
        title="Annotations"
        keyValueObject={viewModel.annotations || {}}
        onUpdatedKeyValueObject={annotations => {
          viewModel.annotations = annotations;
          valueUpdated();
        }}
      />
      <UpstreamPackageEditorAccordion
        id="upstream"
        state={[specExpanded, setSpecExpanded]}
        title="Upstream"
        keyValueObject={viewModel.upstream || {}}
        onUpdatedKeyValueObject={upstream => {
          viewModel.upstream = upstream;
          valueUpdated();
        }}
      />
      <DownstreamPackageEditorAccordion
        id="downstream"
        state={[specExpanded, setSpecExpanded]}
        title="Downstream"
        keyValueObject={viewModel.downstream || {}}
        onUpdatedKeyValueObject={downstream => {
          viewModel.downstream = downstream;
          valueUpdated();
        }}
      />
      <PackageContextEditorAccordion
        id="package-Context"
        state={[specExpanded, setSpecExpanded]}
        value={viewModel.packageContext}
        onUpdate={packageContext => {
          viewModel.packageContext = packageContext;
          valueUpdated();
        }}
      />
      <Select
        label="Adoption Policy"
        onChange={adoptionValue => {
          viewModel.adoptionPolicy = adoptionValue;
          valueUpdated();
        }}
        selected={viewModel.adoptionPolicy || ''}
        items={adoptFunctionList}
      />
      <Select
        label="Deletion Policy"
        onChange={deletionValue => {
          viewModel.deletionPolicy = deletionValue;
          valueUpdated();
        }}
        selected={viewModel.deletionPolicy || ''}
        items={deletionFunctionList}
      />
      <PipelineEditorAccordion
        pipeLinestate={[specExpanded, setSpecExpanded]}
        keyValueObject={viewModel.pipeline || {}}
        onUpdatedYaml={pipeline => {
          viewModel.pipeline = pipeline;
          valueUpdated();
        }}
        packageResources={packageResources}
      />
      <InjectorEditorAccordion
        id="injectors"
        state={[specExpanded, setSpecExpanded]}
        title="Injectors"
        keyValueObject={injectorEditor}
        onUpdatedKeyValueObject={injectors => {
          setInjectorEditor(injectors);
          viewModel.injectors = injectors;
          valueUpdated();
        }}
      />
    </EditorAccordion>
  );
};
