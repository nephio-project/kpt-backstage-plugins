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

import { noop } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useRef, useState } from 'react';
import { EditorAccordion } from '../../FirstClassEditors/Controls';
import { PxeExpandedSectionState } from '../types/PxeParametricEditor.types';
import { PxeSectionEntry } from '../types/PxeConfiguration.types';
import { generateSectionDescription } from '../utils/generateLabelsForWidgets';
import { PxeParametricEditorNodeProps } from '../PxeParametricEditorNode';
import { PxeParametricEditorNodeList } from '../PxeParametricEditorNodeList';

export const PxeSectionNode: React.FC<PxeParametricEditorNodeProps> = ({
  configurationEntry: configurationEntryUncasted,
  resourceChunk,
  onResourceChangeRequest,
  parentExpandedSectionState,
}) => {
  const configurationEntry = configurationEntryUncasted as PxeSectionEntry;
  const { name, entries: childEntries } = configurationEntry;

  const sectionIdRef = useRef(`section-${nanoid()}`);
  const [expandedSection, setExpandedSection] = useState<PxeExpandedSectionState>(undefined);

  const description = generateSectionDescription(configurationEntry, resourceChunk);

  return (
    <EditorAccordion
      id={sectionIdRef.current}
      title={name}
      state={parentExpandedSectionState ?? [undefined, noop]}
      description={description}
    >
      <PxeParametricEditorNodeList
        entries={childEntries}
        resourceChunk={resourceChunk}
        onResourceChangeRequest={onResourceChangeRequest}
        parentExpandedSectionState={[expandedSection, setExpandedSection]}
      />
    </EditorAccordion>
  );
};
