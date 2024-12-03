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
import { PxeConfiguration } from './types/PxeConfiguration.types';
import { PxeParametricEditor } from './PxeParametricEditor';
import { PxeDiagnosticsReporter } from './types/PxeDiagnostics.types';

type ConfiguredEditorProps = {
  readonly yamlText: string;
  readonly onResourceChange: (yaml: string) => void;
};

export const createEditorFromConfiguration =
  (configuration: PxeConfiguration, diagnosticsReporter?: PxeDiagnosticsReporter): React.FC<ConfiguredEditorProps> =>
  ({ yamlText, onResourceChange }) =>
    (
      <PxeParametricEditor
        configuration={configuration}
        yamlText={yamlText}
        onResourceChange={onResourceChange}
        __diagnosticsReporter={diagnosticsReporter}
      />
    );
