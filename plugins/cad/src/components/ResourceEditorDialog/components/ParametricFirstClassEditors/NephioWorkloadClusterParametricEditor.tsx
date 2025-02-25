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
import { metadataEditorTab } from './partial/metadataEditorSection';

const { arrayTypeRoster, singleLineText } = PxeConfigurationFactory;

export const NephioWorkloadClusterParametricEditor = createEditorFromConfiguration({
  topLevelProperties: ['metadata', 'spec'],
  tabs: [
    metadataEditorTab({ isNamespacedResource: true }),
    {
      name: 'Workload cluster',
      entries: [
        singleLineText({ path: 'spec.clusterName', isRequired: true }),
        singleLineText({ path: 'spec.masterInterface' }),
        arrayTypeRoster(
          { name: 'CNIs', path: 'spec.cnis', isRequired: false },
          singleLineText({ path: '$value', isRequired: true }),
        ),
      ],
    },
  ],
});
