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

import { Button, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { isEqual } from 'lodash';
import React from 'react';
import { IconButton } from '../../../../../../Controls';
import { PxeParametricEditorNode } from '../../../PxeParametricEditorNode';
import { PxeConfigurationEntry, PxeNodeType, PxeValueDescriptor } from '../../../types/PxeConfiguration.types';
import { generateValueLabel } from '../../../utils/generateLabelsForWidgets';
import { isSectionNode } from '../../../utils/nodePredicates';
import { PxeResourceChangeRequest } from '../../../types/PxeParametricEditor.types';
import { useEditorStyles } from '../../../../FirstClassEditors/styles';

type PxeRosterItemProps = {
  readonly rosterValueDescriptor: PxeValueDescriptor;
  readonly itemIndex: number;
  readonly entries: readonly PxeConfigurationEntry[];
  readonly onResourceChangeRequestForItem: (itemIndex: number, changeRequest: PxeResourceChangeRequest) => void;
  readonly onItemDeletion: (itemIndex: number) => void;
};

export const PxeRosterItem: React.FC<PxeRosterItemProps> = React.memo(
  ({
    rosterValueDescriptor,
    itemIndex,
    entries,
    onResourceChangeRequestForItem: handleResourceChangeRequestForItem,
    onItemDeletion: handleItemDeletion,
  }) => {
    const editorClasses = useEditorStyles();
    const rosterClasses = useStyles();

    return (
      <div className={rosterClasses.item} data-testid={`RosterItem_${rosterValueDescriptor.path}_${itemIndex}`}>
        <div className={rosterClasses.itemContent}>
          <PxeParametricEditorNode
            configurationEntry={entries[0]}
            onResourceChangeRequest={changeRequest => handleResourceChangeRequestForItem(itemIndex, changeRequest)}
          >
            {isSectionNode(entries[0]) && (
              <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleItemDeletion(itemIndex)}>
                Delete {generateValueLabel(rosterValueDescriptor)}
              </Button>
            )}
          </PxeParametricEditorNode>
        </div>
        {entries[0].type !== PxeNodeType.Section && (
          <div className={rosterClasses.itemActions}>
            <IconButton
              title="Delete"
              className={editorClasses.iconButton}
              onClick={() => handleItemDeletion(itemIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </div>
    );
  },
  isEqual,
);

const useStyles = makeStyles(() => ({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: '1 1 auto',
  },
  itemActions: {
    flex: '0 0 auto',
    paddingLeft: '16px',
  },
}));
