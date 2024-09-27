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

import { nanoid } from 'nanoid';
import React, { useRef, useState } from 'react';
import { EditorAccordion } from '../FirstClassEditors/Controls';
import { PxeExpandedSectionState } from './types/PxeParametricEditor.types';
import {
  PxeConfigurationEntryType,
  PxeSectionEntry,
} from './types/PxeConfiguration.types';
import { chunkByTrait } from './utils/general/chunkByTrait';
import { generateDefaultSectionDescription } from './utils/generateLabelsForWidgets';
import { renderGroupedArray } from './utils/rendering/renderGroupedArray';
import {
  PxeParametricEditorNode,
  PxeParametricEditorNodeProps,
} from './PxeParametricEditorNode';

export const PxeSectionNode: React.FC<PxeParametricEditorNodeProps> = ({
  configurationEntry: configurationEntryUncasted,
  onResourceChangeRequest,
  parentExpandedSectionState,
  resourceChunk,
}) => {
  const configurationEntry = configurationEntryUncasted as PxeSectionEntry;
  const { name, entries: childEntries } = configurationEntry;

  const sectionIdRef = useRef(`section-${nanoid()}`);
  const [expandedSection, setExpandedSection] =
    useState<PxeExpandedSectionState>(undefined);

  const description = generateDefaultSectionDescription(
    configurationEntry,
    resourceChunk,
  );

  // TODO Refactor this grouping and rendering into a separate component.
  // It is used also in PxeParametricEditor main component.
  const groupedChildEntries = chunkByTrait(childEntries, entry =>
    entry.type === PxeConfigurationEntryType.Section ? 'section' : null,
  );

  return (
    <EditorAccordion
      id={sectionIdRef.current}
      title={name}
      state={parentExpandedSectionState}
      description={description}
    >
      {renderGroupedArray(
        groupedChildEntries,
        (childEntry, groupIndex, itemIndex) => (
          <PxeParametricEditorNode
            key={`${groupIndex}-${itemIndex}`}
            configurationEntry={childEntry}
            resourceChunk={resourceChunk}
            parentExpandedSectionState={[expandedSection, setExpandedSection]}
            onResourceChangeRequest={onResourceChangeRequest}
          />
        ),
      )}
    </EditorAccordion>
  );
};
