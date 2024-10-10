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

import { PxeValueType } from '../PxeParametricEditor/types/PxeConfiguration.types';
import { createEditorFromConfiguration } from '../PxeParametricEditor/createEditorFromConfiguration';
import { PxeConfigurationFactory } from '../PxeParametricEditor/configuration';
import { metadataEditorSection } from './partial/metadataEditorSection';

const { section, selectValue } = PxeConfigurationFactory;

export const NephioTokenParametricEditor = createEditorFromConfiguration({
  topLevelProperties: ['metadata', 'spec'],
  entries: [
    metadataEditorSection({ isNamespacedResource: true }),
    section(
      { name: 'Lifecycle' },
      selectValue({
        path: 'spec.lifecycle.deletionPolicy',
        type: PxeValueType.String,
        isRequired: false,
        options: [
          { value: undefined, label: 'Default' },
          { value: 'delete', label: 'Delete' },
          { value: 'orphan', label: 'Orphan' },
        ],
      }),
    ),
  ],
});
