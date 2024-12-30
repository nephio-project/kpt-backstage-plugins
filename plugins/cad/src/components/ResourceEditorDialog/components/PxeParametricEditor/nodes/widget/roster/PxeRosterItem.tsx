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

import CloseIcon from '@material-ui/icons/Close';
import { isEqual } from 'lodash';
import React from 'react';
import { IconButton } from '../../../../../../Controls';
import { PxeConfigurationEntry, PxeValueDescriptor } from '../../../types/PxeConfiguration.types';
import { PxeResourceChangeRequest } from '../../../types/PxeParametricEditor.types';
import { useEditorStyles } from '../../../../FirstClassEditors/styles';
import { PxeParametricEditorNodeList } from '../../../PxeParametricEditorNodeList';
import { PxeRosterBranch } from './PxeRosterBranch';
import { PxeResourceChangeRequestContext } from '../../../PxeResourceChangeRequestContext';

type PxeRosterItemProps = {
  readonly rosterValueDescriptor: PxeValueDescriptor;
  readonly itemIndex: number;
  readonly entries: readonly PxeConfigurationEntry[];
  readonly railBarHeight?: number;
  readonly onResourceChangeRequestForItem: (itemIndex: number, changeRequest: PxeResourceChangeRequest) => void;
  readonly onItemDeletion: (itemIndex: number) => void;
};

export const PxeRosterItem: React.FC<PxeRosterItemProps> = React.memo(
  ({
    rosterValueDescriptor,
    itemIndex,
    entries,
    railBarHeight,
    onResourceChangeRequestForItem: handleResourceChangeRequestForItem,
    onItemDeletion: handleItemDeletion,
  }) => {
    const editorClasses = useEditorStyles();

    return (
      <PxeRosterBranch
        data-testid={`RosterItem_${rosterValueDescriptor.path}_${itemIndex}`}
        content={
          <PxeResourceChangeRequestContext.Provider
            value={changeRequest => handleResourceChangeRequestForItem(itemIndex, changeRequest)}
          >
            <PxeParametricEditorNodeList entries={entries} />
          </PxeResourceChangeRequestContext.Provider>
        }
        actions={
          <IconButton title="Delete" className={editorClasses.iconButton} onClick={() => handleItemDeletion(itemIndex)}>
            <CloseIcon />
          </IconButton>
        }
        railBarHeight={railBarHeight}
      />
    );
  },
  isEqual,
);
