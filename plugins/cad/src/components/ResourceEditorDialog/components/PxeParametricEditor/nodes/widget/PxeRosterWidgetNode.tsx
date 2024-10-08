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
  PxeRosterType,
  PxeRosterWidgetEntry,
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

type PxeRosterItemResourceChunk = {
  readonly key: string;
  readonly value: PxeValue;
};

// FIXME Move functions to end of the file after eslint configuration change.
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

const itemChunksFromValue = (
  value: PxeValue,
): readonly PxeRosterItemResourceChunk[] =>
  Object.entries(value ?? {}).map(([itemKey, itemValue]) => ({
    key: itemKey,
    value: itemValue as PxeValue,
  }));

const valueFromItemChunks = (
  itemChunks: readonly PxeRosterItemResourceChunk[],
  rosterType: PxeRosterType,
): PxeValue =>
  rosterType === PxeRosterType.Object
    ? Object.fromEntries(
        itemChunks.map(itemChunk => [itemChunk.key, itemChunk.value]),
      )
    : itemChunks.map(itemChunk => itemChunk.value);

export const PxeRosterWidgetNode: React.FC<PxeParametricEditorNodeProps> = ({
  configurationEntry,
  resourceChunk,
  onResourceChangeRequest,
}) => {
  const rosterEntry = configurationEntry as PxeRosterWidgetEntry;
  const { values, rosterType, itemEntries } = rosterEntry;
  const valueDescriptor = values[0];

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
    ) as PxeRosterItemResourceChunk;

    onResourceChangeRequest({
      valueDescriptor,
      newValue: valueFromItemChunks(
        arrayWithItemReplaced(itemChunks, itemIndex, newItemChunk),
        rosterType,
      ),
    });
  };

  const handleItemAddition = () => {
    const newItemChunk: PxeRosterItemResourceChunk = {
      key: rosterType === PxeRosterType.Array ? String(itemChunks.length) : '',
      value: undefined,
    };

    onResourceChangeRequest({
      valueDescriptor,
      newValue: valueFromItemChunks([...itemChunks, newItemChunk], rosterType),
    });
  };

  const handleItemDeletion = (itemIndex: number) => {
    onResourceChangeRequest({
      valueDescriptor,
      newValue: valueFromItemChunks(
        arrayWithItemRemoved(itemChunks, itemIndex),
        rosterType,
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
                key={`${itemIndex}-${entryIndex}`} // FIXME Keys.
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
