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
import { editorSection } from './editorSection';
import { singleLineTextWidget } from './singleLineTextWidget';
import { objectTypeRoster } from './roster';
import { rowLayout } from './rowLayout';

export const metadataEditorSection = ({
  isNamespacedResource,
}: {
  isNamespacedResource: boolean;
}): PxeSectionEntry =>
  editorSection(
    { name: 'Resource Metadata' },
    singleLineTextWidget({ path: 'metadata.name', isRequired: true }),
    ...(isNamespacedResource
      ? [singleLineTextWidget({ path: 'metadata.namespace' })]
      : []),
    editorSection(
      { name: 'Labels' },
      objectTypeRoster(
        { path: 'metadata.labels', isRequired: false },
        rowLayout(
          singleLineTextWidget({ path: 'key', isRequired: true }),
          singleLineTextWidget({ path: 'value' }),
        ),
      ),
    ),
    editorSection(
      { name: 'Annotations' },
      objectTypeRoster(
        { path: 'metadata.annotations', isRequired: false },
        rowLayout(
          singleLineTextWidget({ path: 'key', isRequired: true }),
          singleLineTextWidget({ path: 'value' }),
        ),
      ),
    ),
  );
