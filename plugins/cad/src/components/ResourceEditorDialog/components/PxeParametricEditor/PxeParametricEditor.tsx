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
import {
  PxeConfiguration,
  PxeConfigurationEntryType,
} from './types/PxeConfiguration.types';
import {
  PxeExpandedSectionState,
  PxeResourceChangeRequestHandler,
} from './types/PxeParametricEditor.types';
import { chunkByTrait } from './utils/general/chunkByTrait';
import { renderGroupedArray } from './utils/rendering/renderGroupedArray';
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
      (changeRequest): void =>
        setResourceAndNotifyOnChange(
          createResourceChunkAfterChangeRequest(resource, changeRequest),
        ),
      [resource, setResourceAndNotifyOnChange],
    );

  const classes = useEditorStyles();

  const groupedEntries = chunkByTrait(entries, entry =>
    entry.type === PxeConfigurationEntryType.Section ? 'section' : null,
  );

  return (
    <div className={classes.root}>
      {renderGroupedArray(groupedEntries, (entry, groupIndex, itemIndex) => (
        <PxeParametricEditorNode
          key={`${groupIndex}-${itemIndex}`}
          configurationEntry={entry}
          resourceChunk={resource}
          parentExpandedSectionState={[expandedSection, setExpandedSection]}
          onResourceChangeRequest={handleResourceChangeRequest}
        />
      ))}
    </div>
  );
};
