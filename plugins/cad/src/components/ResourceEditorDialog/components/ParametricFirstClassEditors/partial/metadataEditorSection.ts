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

import { PxeSectionEntry } from '../../PxeParametricEditor/types/PxeConfiguration.types';
import { PxeConfigurationFactory } from '../../PxeParametricEditor/configuration';

const { section, rowLayout, objectTypeRoster, singleLineText } = PxeConfigurationFactory;

export const metadataEditorSection = ({ isNamespacedResource }: { isNamespacedResource: boolean }): PxeSectionEntry =>
  section(
    { name: 'Resource Metadata' },
    singleLineText({ path: 'metadata.name', isRequired: true }),
    ...(isNamespacedResource ? [singleLineText({ path: 'metadata.namespace' })] : []),
    section(
      { name: 'Labels' },
      objectTypeRoster(
        { path: 'metadata.labels', isRequired: false },
        rowLayout(singleLineText({ path: 'key', isRequired: true }), singleLineText({ path: 'value' })),
      ),
    ),
    section(
      { name: 'Annotations' },
      objectTypeRoster(
        { path: 'metadata.annotations', isRequired: false },
        rowLayout(singleLineText({ path: 'key', isRequired: true }), singleLineText({ path: 'value' })),
      ),
    ),
  );
