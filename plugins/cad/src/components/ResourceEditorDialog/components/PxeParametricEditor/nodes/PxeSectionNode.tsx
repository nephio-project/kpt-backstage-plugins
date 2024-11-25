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
import { PxeParametricEditorNodeProps } from '../PxeParametricEditorNode';
import { PxeParametricEditorNodeList } from '../PxeParametricEditorNodeList';
import { useDiagnostics } from '../PxeDiagnosticsContext';
import { withSectionDescription } from '../utils/rendering/withSectionDescription';

export const PxeSectionNode: React.FC<PxeParametricEditorNodeProps> = withSectionDescription(
  ({ configurationEntry, onResourceChangeRequest, parentExpandedSectionState, children, sectionDescription }) => {
    useDiagnostics(configurationEntry);

    const sectionEntry = configurationEntry as PxeSectionEntry;
    const { name, entries: childEntries } = sectionEntry;

    const sectionIdRef = useRef(`section-${nanoid()}`);
    const [expandedSection, setExpandedSection] = useState<PxeExpandedSectionState>(undefined);

    return (
      <EditorAccordion
        id={sectionIdRef.current}
        title={name}
        state={parentExpandedSectionState ?? [undefined, noop]}
        description={sectionDescription}
      >
        <PxeParametricEditorNodeList
          entries={childEntries}
          onResourceChangeRequest={onResourceChangeRequest}
          parentExpandedSectionState={[expandedSection, setExpandedSection]}
        />
        {children}
      </EditorAccordion>
    );
  },
);
