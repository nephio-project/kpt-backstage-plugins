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
import React, { Fragment, useRef, useState } from 'react';
import { EditorAccordion } from '../FirstClassEditors/Controls';
import {
  ParametricEditorNode,
  ParametricEditorNodeProps,
} from './ParametricEditorNode';
import {
  ParametricEditorExpansionState,
  ParametricEditorSection,
} from './ParametricEditor.types';

export const SectionWidget: React.FC<ParametricEditorNodeProps> = props => {
  const { name, entries } = props.configurationEntry as ParametricEditorSection;

  const sectionIdRef = useRef(`section-${nanoid()}`);
  const sectionExpansionStateTuple =
    useState<ParametricEditorExpansionState>(undefined);

  return (
    <EditorAccordion
      id={sectionIdRef.current}
      title={name}
      state={props.expansionStateTuple}
      description={'TODO'} // FIXME
    >
      <Fragment>
        {entries.map((entry, index) => (
          <ParametricEditorNode
            key={index}
            configurationEntry={entry}
            resourceChunk={props.resourceChunk}
            expansionStateTuple={sectionExpansionStateTuple}
            onResourceChangeRequest={props.onResourceChangeRequest}
          />
        ))}
      </Fragment>
    </EditorAccordion>
  );
};
