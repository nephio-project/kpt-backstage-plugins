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

import { isEqual } from 'lodash';
import React, { Fragment } from 'react';
import { PxeParametricEditorNode } from './PxeParametricEditorNode';
import { PxeConfigurationEntry } from './types/PxeConfiguration.types';
import { PxeExpandedSectionStateTuple, PxeResourceChangeRequestHandler } from './types/PxeParametricEditor.types';
import { chunkByTrait } from './utils/general/chunkByTrait';
import { isSectionNode } from './utils/nodePredicates';
import { renderGroupedArray } from './utils/rendering/renderGroupedArray';

type PxeParametricEditorNodeListProps = {
  readonly entries: readonly PxeConfigurationEntry[];
  readonly onResourceChangeRequest: PxeResourceChangeRequestHandler;
  readonly parentExpandedSectionState: PxeExpandedSectionStateTuple;
};

export const PxeParametricEditorNodeList: React.FC<PxeParametricEditorNodeListProps> = React.memo(
  ({ entries, onResourceChangeRequest, parentExpandedSectionState }) => {
    const groupedEntries = chunkByTrait(entries, entry => isSectionNode(entry) || null);

    return (
      <Fragment>
        {renderGroupedArray(groupedEntries, (entry, groupIndex, itemIndex) => (
          <PxeParametricEditorNode
            key={`${groupIndex}-${itemIndex}`}
            configurationEntry={entry}
            parentExpandedSectionState={parentExpandedSectionState}
            onResourceChangeRequest={onResourceChangeRequest}
          />
        ))}
      </Fragment>
    );
  },
  isEqual,
);
