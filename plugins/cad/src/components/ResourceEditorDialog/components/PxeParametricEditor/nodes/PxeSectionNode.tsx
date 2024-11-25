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
import React, { useRef } from 'react';
import { EditorAccordion } from '../../FirstClassEditors/Controls';
import { PxeSectionEntry } from '../types/PxeConfiguration.types';
import { withSectionDescription } from '../utils/rendering/withSectionDescription';
import { PxeParametricEditorNodeProps } from '../PxeParametricEditorNode';
import { PxeParametricEditorNodeList } from '../PxeParametricEditorNodeList';
import {
  PxeExpandedSectionContext,
  useAncestorExpandedSectionState,
  useNewExpandedSectionState,
} from '../PxeExpandedSectionContext';
import { useDiagnostics } from '../PxeDiagnosticsContext';

export const PxeSectionNode: React.FC<PxeParametricEditorNodeProps> = withSectionDescription(
  ({ configurationEntry, onResourceChangeRequest, children, sectionDescription }) => {
    useDiagnostics(configurationEntry);

    const sectionEntry = configurationEntry as PxeSectionEntry;
    const { name, entries: childEntries } = sectionEntry;

    const sectionIdRef = useRef(`section-${nanoid()}`);
    const ancestorLevelExpandedSectionState = useAncestorExpandedSectionState();
    const sectionLevelExpandedSectionState = useNewExpandedSectionState();

    return (
      <EditorAccordion
        id={sectionIdRef.current}
        title={name}
        state={ancestorLevelExpandedSectionState}
        description={sectionDescription}
      >
        <PxeExpandedSectionContext.Provider value={sectionLevelExpandedSectionState}>
          <PxeParametricEditorNodeList entries={childEntries} onResourceChangeRequest={onResourceChangeRequest} />
          {children}
        </PxeExpandedSectionContext.Provider>
      </EditorAccordion>
    );
  },
);
