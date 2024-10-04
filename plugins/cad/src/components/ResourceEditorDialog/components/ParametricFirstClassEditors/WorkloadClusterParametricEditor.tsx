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

import { createEditorFromConfiguration } from './createEditorFromConfiguration';
import { metadataEditorSection } from './configuration/metadataEditorSection';
import { editorSection } from './configuration/editorSection';
import { arrayTypeRoster } from './configuration/roster';
import { singleLineTextWidget } from './configuration/singleLineTextWidget';

export const WorkloadClusterParametricEditor = createEditorFromConfiguration({
  topLevelProperties: ['metadata', 'spec'],
  entries: [
    metadataEditorSection({ isNamespacedResource: true }),
    editorSection(
      { name: 'Configuration' },
      singleLineTextWidget({ path: 'spec.clusterName', isRequired: true }),
      singleLineTextWidget({ path: 'spec.masterInterface' }),
      editorSection(
        { name: 'CNIs' },
        arrayTypeRoster(
          { path: 'spec.cnis', isRequired: false },
          singleLineTextWidget({ path: 'value' }),
        ),
      ),
    ),
  ],
});
