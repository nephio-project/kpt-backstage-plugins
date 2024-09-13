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
import React, { useCallback, useState } from 'react';
import { useSetStateAndCall } from '../../../../hooks/useSetStateAndCall';
import { useEditorStyles } from '../FirstClassEditors/styles';
import { PxeConfiguration } from './types/PxeConfiguration.types';
import {
  PxeExpandedSectionState,
  PxeResourceChangeRequestHandler,
} from './types/PxeParametricEditor.types';
import { parseYaml, stringifyYaml } from './utils/yamlConversion';
import { PxeParametricEditorNode } from './PxeParametricEditorNode';
import { createResourceChunkAfterChangeRequest } from './utils/createResourceChunkAfterChangeRequest';

export type PxeParametricEditorProps = {
  readonly configuration: PxeConfiguration;
  readonly yamlText: string;
  readonly onResourceChange: (yaml: string) => void;
};

export const PxeParametricEditor: React.FC<PxeParametricEditorProps> = ({
  configuration: { topLevelProperties, entries },
  yamlText,
  onResourceChange,
}) => {
  const { yamlObject: initialYamlObject } = parseYaml(yamlText);
  const initialResourceState = pick(initialYamlObject, topLevelProperties);

  const [resource, setResource] = useState(initialResourceState);
  const [expandedSection, setExpandedSection] =
    useState<PxeExpandedSectionState>(undefined);

  const setResourceAndNotifyOnChange = useSetStateAndCall(
    [resource, setResource],
    newState => {
      const newYamlText = stringifyYaml({ ...initialYamlObject, ...newState });
      onResourceChange(newYamlText);
    },
  );

  const handleResourceChangeRequest: PxeResourceChangeRequestHandler =
    useCallback(
      ({ widgetEntry, newValue }): void =>
        setResourceAndNotifyOnChange(
          createResourceChunkAfterChangeRequest(resource, {
            widgetEntry,
            newValue,
          }),
        ),
      [resource, setResourceAndNotifyOnChange],
    );

  const classes = useEditorStyles();
  return (
    <div className={classes.root}>
      {entries.map((entry, index) => (
        <PxeParametricEditorNode
          key={index}
          configurationEntry={entry}
          resourceChunk={resource}
          parentExpandedSectionState={[expandedSection, setExpandedSection]}
          onResourceChangeRequest={handleResourceChangeRequest}
        />
      ))}
    </div>
  );
};
