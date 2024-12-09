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

import { PxeConfigurationFactory } from '../../PxeParametricEditor/configuration';
import { PxeConfigurationEntry } from '../../PxeParametricEditor/types/PxeConfiguration.types';

const { rowLayout, objectTypeRoster, singleLineText } = PxeConfigurationFactory;

export const metadataEditorEntries = (options: { isNamespacedResource: boolean }): PxeConfigurationEntry[] => [
  singleLineText({ path: 'metadata.name', isRequired: true }),
  ...(options.isNamespacedResource ? [singleLineText({ path: 'metadata.namespace' })] : []),
  objectTypeRoster(
    { name: 'Labels', path: 'metadata.labels', isRequired: false },
    rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: true })),
  ),
  objectTypeRoster(
    { name: 'Annotations', path: 'metadata.annotations', isRequired: false },
    rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: true })),
  ),
];
