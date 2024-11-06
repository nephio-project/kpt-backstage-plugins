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

const { section, rowLayout, arrayTypeRoster, objectTypeRoster, singleLineText } = PxeConfigurationFactory;

export const NephioNetworkParametricEditor = createEditorFromConfiguration({
  topLevelProperties: ['metadata', 'spec'],
  entries: [
    metadataEditorSection({ isNamespacedResource: true }),
    section({ name: 'Topology' }, singleLineText({ path: 'spec.topology', isRequired: true })),
    arrayTypeRoster(
      { name: 'Routing tables', path: 'spec.routingTables', isRequired: false },
      section(
        { name: 'Routing table' },
        singleLineText({ path: 'value.name', isRequired: true }),
        arrayTypeRoster(
          { name: 'Prefixes', path: 'value.prefixes', isRequired: true },
          section(
            { name: 'Prefix' },
            singleLineText({ path: 'value.prefix', isRequired: true }),
            objectTypeRoster(
              { name: 'Labels', path: 'value.labels', isRequired: false },
              rowLayout(singleLineText({ path: 'key', isRequired: true }), singleLineText({ path: 'value' })),
            ),
          ),
        ),
      ),
    ),
    section({ name: 'Bridge domains' }),
  ],
});
