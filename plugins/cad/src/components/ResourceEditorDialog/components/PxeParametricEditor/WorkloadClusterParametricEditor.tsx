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

import React from 'react';
import { PxeParametricEditor } from './PxeParametricEditor';
import {
  PxeConfiguration,
  PxeConfigurationEntryType,
} from './types/PxeConfiguration.types';

export type WorkloadClusterParametricEditorProps = {
  readonly yamlText: string;
  readonly onResourceChange: (yaml: string) => void;
};

const CONFIGURATION: PxeConfiguration = {
  topLevelProperties: ['metadata', 'spec'],
  // TODO Implement factory functions for configuration creation.
  entries: [
    {
      type: PxeConfigurationEntryType.Section,
      name: 'Resource Metadata',
      entries: [
        {
          type: PxeConfigurationEntryType.SingleLineText,
          values: [
            {
              path: 'metadata.name',
              isRequired: true,
            },
          ],
        },
        {
          type: PxeConfigurationEntryType.SingleLineText,
          values: [
            {
              path: 'metadata.namespace',
              isRequired: false,
            },
          ],
        },
        {
          type: PxeConfigurationEntryType.Section,
          name: 'Labels',
          entries: [],
        },
        {
          type: PxeConfigurationEntryType.Section,
          name: 'Annotations',
          entries: [],
        },
      ],
    },
    {
      type: PxeConfigurationEntryType.Section,
      name: 'Configuration',
      entries: [
        {
          type: PxeConfigurationEntryType.SingleLineText,
          values: [
            {
              path: 'spec.clusterName',
              isRequired: true,
            },
          ],
        },
        {
          type: PxeConfigurationEntryType.SingleLineText,
          values: [
            {
              path: 'spec.masterInterface',
              isRequired: false,
            },
          ],
        },
      ],
    },
  ],
};

export const WorkloadClusterParametricEditor: React.FC<
  WorkloadClusterParametricEditorProps
> = ({ yamlText, onResourceChange }) => (
  <PxeParametricEditor
    configuration={CONFIGURATION}
    yamlText={yamlText}
    onResourceChange={onResourceChange}
  />
);
