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

import { pick } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { useEditorStyles } from '../FirstClassEditors/styles';
import { PxeConfiguration } from './types/PxeConfiguration.types';
import { PxeResourceChangeRequestHandler } from './types/PxeParametricEditor.types';
import { PxeDiagnosticsReporter } from './types/PxeDiagnostics.types';
import { createResourceChunkAfterChangeRequest } from './utils/createResourceChunkAfterChangeRequest';
import { parseYaml, stringifyYaml } from './utils/yamlConversion';
import { PxeParametricEditorNodeList } from './PxeParametricEditorNodeList';
import { PxeDiagnosticsContext } from './PxeDiagnosticsContext';
import { PxeResourceContext } from './PxeResourceContext';
import { PxeExpandedSectionContext, useNewExpandedSectionState } from './PxeExpandedSectionContext';

export type PxeParametricEditorProps = {
  readonly configuration: PxeConfiguration;
  readonly yamlText: string;
  readonly onResourceChange: (yaml: string) => void;
  readonly __diagnosticsReporter?: PxeDiagnosticsReporter;
};

export const PxeParametricEditor: React.FC<PxeParametricEditorProps> = ({
  configuration: { topLevelProperties, entries },
  yamlText,
  onResourceChange,
  __diagnosticsReporter,
}) => {
  const initialYamlObject = useRef(parseYaml(yamlText).yamlObject);

  const [resource, setResource] = useState(() => pick(initialYamlObject.current, topLevelProperties));
  const previousResource = useRef(resource);
  if (previousResource.current !== resource) {
    previousResource.current = resource;
    onResourceChange(stringifyYaml({ ...initialYamlObject.current, ...resource }));
  }

  const rootLevelExpandedSectionStateTuple = useNewExpandedSectionState();

  const handleResourceChangeRequest: PxeResourceChangeRequestHandler = useCallback(
    (changeRequest): void =>
      setResource(prevResource => createResourceChunkAfterChangeRequest(prevResource, changeRequest)),
    [],
  );

  const classes = useEditorStyles();

  return (
    <div className={classes.root}>
      <PxeDiagnosticsContext.Provider value={__diagnosticsReporter ?? null}>
        <PxeExpandedSectionContext.Provider value={rootLevelExpandedSectionStateTuple}>
          <PxeResourceContext.Provider value={resource}>
            <PxeParametricEditorNodeList entries={entries} onResourceChangeRequest={handleResourceChangeRequest} />
          </PxeResourceContext.Provider>
        </PxeExpandedSectionContext.Provider>
      </PxeDiagnosticsContext.Provider>
    </div>
  );
};
