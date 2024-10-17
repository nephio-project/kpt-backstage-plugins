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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { get, noop } from 'lodash';
import React, { Fragment } from 'react';
import { IconButton } from '../../../../../Controls';
import { useEditorStyles } from '../../../FirstClassEditors/styles';
import {
  PxeParametricEditorNode,
  PxeParametricEditorNodeProps,
} from '../../PxeParametricEditorNode';
import {
  PxeRosterWidgetEntry,
  PxeValueType,
} from '../../types/PxeConfiguration.types';
import {
  PxeResourceChangeRequest,
  PxeValue,
} from '../../types/PxeParametricEditor.types';
import { createResourceChunkAfterChangeRequest } from '../../utils/createResourceChunkAfterChangeRequest';
import { generateDefaultValueLabel } from '../../utils/generateLabelsForWidgets';
import {
  arrayWithItemRemoved,
  arrayWithItemReplaced,
} from '../../utils/general/immutableArrays';

type RosterItemResourceChunk = {
  readonly key: string;
  readonly value: PxeValue;
};

type RosterValueType = PxeValueType.Object | PxeValueType.Array;

export const PxeRosterWidgetNode: React.FC<PxeParametricEditorNodeProps> = ({
  configurationEntry,
  resourceChunk,
  onResourceChangeRequest,
}) => {
  const { values, itemEntries } = configurationEntry as PxeRosterWidgetEntry;
  const valueDescriptor = values[0];
  const rosterValueType = valueDescriptor.type as RosterValueType;

  const itemChunks = itemChunksFromValue(
    get(resourceChunk, valueDescriptor.path),
  );

  const handleResourceChangeRequestForItem = (
    itemIndex: number,
    changeRequest: PxeResourceChangeRequest,
  ) => {
    const newItemChunk = createResourceChunkAfterChangeRequest(
      itemChunks[itemIndex],
      changeRequest,
    ) as RosterItemResourceChunk;

    onResourceChangeRequest({
      valueDescriptor,
      newValue: valueFromItemChunks(
        arrayWithItemReplaced(itemChunks, itemIndex, newItemChunk),
        rosterValueType,
      ),
    });
  };

  const handleItemAddition = () => {
    const newItemChunk: RosterItemResourceChunk = {
      key:
        rosterValueType === PxeValueType.Array ? String(itemChunks.length) : '',
      value: undefined,
    };

    onResourceChangeRequest({
      valueDescriptor,
      newValue: valueFromItemChunks(
        [...itemChunks, newItemChunk],
        rosterValueType,
      ),
    });
  };

  const handleItemDeletion = (itemIndex: number) => {
    onResourceChangeRequest({
      valueDescriptor,
      newValue: valueFromItemChunks(
        arrayWithItemRemoved(itemChunks, itemIndex),
        rosterValueType,
      ),
    });
  };

  const editorClasses = useEditorStyles();
  const rosterClasses = useStyles();
  return (
    <Fragment>
      {itemChunks.map((itemChunk, itemIndex) => (
        <div className={rosterClasses.item} key={itemIndex}>
          <div className={rosterClasses.itemContent}>
            {itemEntries.map((itemEntry, entryIndex) => (
              <PxeParametricEditorNode
                key={`${itemIndex}-${entryIndex}`}
                configurationEntry={itemEntry}
                resourceChunk={itemChunk}
                parentExpandedSectionState={[undefined, noop]} // FIXME Probably should be extracted.
                onResourceChangeRequest={changeRequest =>
                  handleResourceChangeRequestForItem(itemIndex, changeRequest)
                }
              />
            ))}
          </div>
          <div className={rosterClasses.itemActions}>
            <IconButton
              title="Delete"
              className={editorClasses.iconButton}
              onClick={() => handleItemDeletion(itemIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleItemAddition}
      >
        Add {generateDefaultValueLabel(valueDescriptor)}
      </Button>
    </Fragment>
  );
};

const itemChunksFromValue = (
  value: PxeValue,
): readonly RosterItemResourceChunk[] =>
  Object.entries(value ?? {}).map(([itemKey, itemValue]) => ({
    key: itemKey,
    value: itemValue as PxeValue,
  }));

const valueFromItemChunks = (
  itemChunks: readonly RosterItemResourceChunk[],
  rosterType: RosterValueType,
): PxeValue =>
  rosterType === PxeValueType.Object
    ? Object.fromEntries(
        itemChunks.map(itemChunk => [itemChunk.key, itemChunk.value]),
      )
    : itemChunks.map(itemChunk => itemChunk.value);

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
