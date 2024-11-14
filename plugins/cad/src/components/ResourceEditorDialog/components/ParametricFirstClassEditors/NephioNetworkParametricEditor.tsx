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

import { createEditorFromConfiguration } from '../PxeParametricEditor/createEditorFromConfiguration';
import { PxeConfigurationFactory } from '../PxeParametricEditor/configuration';
import { metadataEditorSection } from './partial/metadataEditorSection';
import { PxeValueType } from '../PxeParametricEditor/types/PxeConfiguration.types';

const { section, rowLayout, arrayTypeRoster, objectTypeRoster, selectValue, singleLineText } = PxeConfigurationFactory;

const INTERFACE_KIND_OPTIONS = [
  { value: 'interface', label: 'Interface' },
  { value: 'bridgedomain', label: 'Bridge domain' },
];

const INTERFACE_ATTACHMENT_TYPE_OPTIONS = [
  { value: undefined, label: 'None' },
  { value: 'vlan', label: 'VLAN' },
];

const SELECTOR_OPERATOR_OPTIONS = [
  { value: 'In', label: 'In' },
  { value: 'NotIn', label: 'Not In' },
  { value: 'Exists', label: 'Exists' },
  { value: 'DoesNotExist', label: 'Does Not Exist' },
];

export const NephioNetworkParametricEditor = createEditorFromConfiguration({
  topLevelProperties: ['metadata', 'spec'],
  entries: [
    metadataEditorSection({ isNamespacedResource: true }),
    section({ name: 'Topology' }, singleLineText({ path: 'spec.topology', isRequired: true })),
    arrayTypeRoster(
      {
        name: 'Routing tables',
        path: 'spec.routingTables',
        isRequired: false,
        item: { type: PxeValueType.Object, isRequired: true },
      },
      routingTableItemConfiguration(),
    ),
    arrayTypeRoster(
      {
        name: 'Bridge domains',
        path: 'spec.bridgeDomains',
        isRequired: false,
        item: { type: PxeValueType.Object, isRequired: true },
      },
      bridgeDomainItemConfiguration(),
    ),
  ],
});

function routingTableItemConfiguration() {
  return section(
    { name: 'Routing table' },
    singleLineText({ path: '$value.name', isRequired: true }),
    arrayTypeRoster(
      {
        name: 'Prefixes',
        path: '$value.prefixes',
        isRequired: true,
        item: { type: PxeValueType.Object, isRequired: true },
      },
      prefixItemConfiguration(),
    ),
    arrayTypeRoster(
      {
        name: 'Interfaces',
        path: '$value.interfaces',
        item: { type: PxeValueType.Object, isRequired: true },
      },
      interfaceItemConfiguration(),
    ),
  );
}

function bridgeDomainItemConfiguration() {
  return section(
    { name: 'Bridge domain' },
    singleLineText({ path: '$value.name', isRequired: true }),
    arrayTypeRoster(
      {
        name: 'Interfaces',
        path: '$value.interfaces',
        item: { type: PxeValueType.Object, isRequired: true },
      },
      interfaceItemConfiguration(),
    ),
  );
}

function interfaceItemConfiguration() {
  return section(
    { name: 'Interface' },
    // TODO Different options depending on where used.
    selectValue({ path: '$value.kind', isRequired: true, options: INTERFACE_KIND_OPTIONS }),
    singleLineText({ path: '$value.interfaceName' }),
    singleLineText({ path: '$value.bridgeDomainName' }),
    singleLineText({ path: '$value.nodeName' }),
    selectValue({ path: '$value.attachmentType', options: INTERFACE_ATTACHMENT_TYPE_OPTIONS }),
    ...selectorConfiguration('$value.selector'),
  );
}

function prefixItemConfiguration() {
  return section(
    { name: 'Prefix' },
    singleLineText({ path: '$value.prefix', isRequired: true }),
    objectTypeRoster(
      { name: 'Labels', path: '$value.labels' },
      rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: true })),
    ),
  );
}

// FIXME Extract.
function selectorConfiguration(pathPrefix: string) {
  return [
    objectTypeRoster(
      { name: 'Match labels', path: `${pathPrefix}.matchLabels` },
      rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value' })),
    ),
    arrayTypeRoster(
      {
        name: 'Match expressions',
        path: `${pathPrefix}.matchExpressions`,
        item: { type: PxeValueType.Object, isRequired: true },
      },
      section(
        { name: 'Match expression' },
        rowLayout(
          singleLineText({ path: '$value.key', isRequired: true }),
          selectValue({ path: '$value.operator', isRequired: true, options: SELECTOR_OPERATOR_OPTIONS }),
        ),
        // TODO Different value requirements for different operators.
        arrayTypeRoster(
          { name: 'Values', path: '$value.values' },
          singleLineText({ path: '$value', isRequired: true }),
        ),
      ),
    ),
  ];
}
