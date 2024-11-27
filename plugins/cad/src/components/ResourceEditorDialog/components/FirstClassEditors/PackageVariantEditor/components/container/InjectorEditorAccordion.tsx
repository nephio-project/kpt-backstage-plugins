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
import React, { useRef } from 'react';
import { PackageVariantInjectors } from '../../../../../../../types/PackageVariant';
import { EditorAccordion } from '../../../Controls';
import { AccordionState } from '../../../Controls/EditorAccordion';

type OnUpdate = (newValue: PackageVariantInjectors) => void;

type KeyValueObjectEditorProps = {
  id: string;
  title: string;
  state: AccordionState;
  keyValueObject: PackageVariantInjectors;
  onUpdatedKeyValueObject: OnUpdate;
};

export const InjectorEditorAccordion = ({
  id,
  title,
  state,
  keyValueObject,
  onUpdatedKeyValueObject,
}: KeyValueObjectEditorProps) => {
  const refViewModel = useRef<PackageVariantInjectors>(keyValueObject);
  const viewModel = refViewModel.current;
  const keyValueObjectUpdated = (): void => {
    onUpdatedKeyValueObject(viewModel);
  };

  const description = `${viewModel.group ? `${viewModel.group}/` : ''}${
    viewModel.version ? `${viewModel.version}/` : ''
  }${viewModel.kind ? `${viewModel.kind}@` : ''}${viewModel.name ? `${viewModel.name}` : ''}`;
  return (
    <EditorAccordion id={id} state={state} title={title} description={description}>
      <TextField
        key="group"
        label="Group"
        variant="outlined"
        value={viewModel.group}
        onChange={e => {
          viewModel.group = e.target.value;
          keyValueObjectUpdated();
        }}
        fullWidth
      />
      <TextField
        key="version"
        label="Version"
        variant="outlined"
        value={viewModel.version}
        onChange={e => {
          viewModel.version = e.target.value;
          keyValueObjectUpdated();
        }}
        fullWidth
      />
      <TextField
        key="kind"
        label="Kind"
        variant="outlined"
        value={viewModel.kind}
        onChange={e => {
          viewModel.kind = e.target.value;
          keyValueObjectUpdated();
        }}
        fullWidth
      />
      <TextField
        key="name"
        label="Name"
        variant="outlined"
        value={viewModel.name}
        onChange={e => {
          viewModel.name = e.target.value;
          keyValueObjectUpdated();
        }}
        fullWidth
      />
    </EditorAccordion>
  );
};
