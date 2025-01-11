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
import React, { useContext, useState } from 'react';
import { PxeParametricEditorNodeProps } from '../../../PxeParametricEditorNode';
import { PxeNodeType, PxeRosterWidgetEntry, PxeValueType } from '../../../types/PxeConfiguration.types';
import { PxeResourceChangeRequest, PxeValue } from '../../../types/PxeParametricEditor.types';
import { createResourceChunkAfterChangeRequest } from '../../../utils/createResourceChunkAfterChangeRequest';
import { generateValueLabel } from '../../../utils/generateLabelsForWidgets';
import { arrayWithItemRemoved, arrayWithItemReplaced } from '../../../utils/general/immutableArrays';
import { defaultValueForType } from '../../../utils/defaultValueForType';
import { PxeResourceContext } from '../../../PxeResourceContext';
import { useDiagnostics } from '../../../PxeDiagnosticsContext';
import { withCurrentValues } from '../../../utils/rendering/withCurrentValues';
import { PxeRosterItem } from './PxeRosterItem';
import { PxeRosterHeader } from './PxeRosterHeader';
import { PxeRosterBranch } from './PxeRosterBranch';
import { PxeResourceChangeRequestContext } from '../../../PxeResourceChangeRequestContext';

type RosterItemResourceChunk = {
  readonly $key: string;
  readonly $value: PxeValue;
};

type RosterValueType = PxeValueType.Object | PxeValueType.Array;

// TODO Rework roster - instead of being index-based use temp ids for items.
export const PxeRosterWidgetNode: React.FC<PxeParametricEditorNodeProps> = withCurrentValues(
  ({ configurationEntry, listPositionInfo: { isInRosterItem, isLastNode }, currentValues: [currentValue] }) => {
    useDiagnostics(configurationEntry);
    const onResourceChangeRequest = useContext(PxeResourceChangeRequestContext);

    const {
      valueDescriptors: [valueDescriptor],
      itemValueDescriptor: itemValueDescriptor,
      itemEntries,
    } = configurationEntry as PxeRosterWidgetEntry;
    const rosterValueType = valueDescriptor.type as RosterValueType;

    const [itemChunks, setItemChunks] = useState<readonly RosterItemResourceChunk[]>(itemChunksFromValue(currentValue));

    const [previousResourceChunk, setPreviousResourceChunk] = useState(currentValue);
    if (previousResourceChunk !== currentValue) {
      setItemChunks(itemChunksFromValue(currentValue));
      setPreviousResourceChunk(currentValue);
    }

    const handleItemAddition = () => {
      const newItemChunk: RosterItemResourceChunk = {
        $key: rosterValueType === PxeValueType.Array ? String(itemChunks.length) : '',
        $value: itemValueDescriptor.isRequired ? defaultValueForType(itemValueDescriptor.type) : null,
      };

      const newValue = valueFromItemChunks([...itemChunks, newItemChunk], rosterValueType);
      onResourceChangeRequest({ valueDescriptor, newValue });
    };

    const handleItemDeletion = (itemIndex: number) => {
      const newValue = valueFromItemChunks(arrayWithItemRemoved(itemChunks, itemIndex), rosterValueType);
      onResourceChangeRequest({ valueDescriptor, newValue });
    };

    const handleResourceChangeRequestForItem = (itemIndex: number, changeRequest: PxeResourceChangeRequest) => {
      const newItemChunk = createResourceChunkAfterChangeRequest(
        itemChunks[itemIndex],
        changeRequest,
      ) as RosterItemResourceChunk;

      const newItemChunks = arrayWithItemReplaced(itemChunks, itemIndex, newItemChunk);
      const newValue = valueFromItemChunks(newItemChunks, rosterValueType);
      if (Object.values(newValue).length === itemChunks.length) {
        onResourceChangeRequest({ valueDescriptor, newValue });
      } else {
        setItemChunks(newItemChunks);
      }
    };

    const isAddButtonEnabled = rosterValueType === PxeValueType.Array || itemChunks.every(({ $key }) => $key !== '');

    const classes = useStyles();

    // FIXME railBarHeight adjustment could be done better.
    return (
      <div>
        <PxeRosterHeader name={generateValueLabel(valueDescriptor)} rosterValueType={rosterValueType} />
        {itemChunks.map((itemChunk, itemIndex) => (
          <PxeResourceContext.Provider value={itemChunk} key={itemIndex}>
            <PxeRosterItem
              key={itemIndex}
              rosterValueDescriptor={valueDescriptor}
              itemIndex={itemIndex}
              entries={itemEntries}
              railBarHeight={itemEntries[0]?.type === PxeNodeType.Roster ? 34 : undefined}
              onResourceChangeRequestForItem={handleResourceChangeRequestForItem}
              onItemDeletion={handleItemDeletion}
            />
          </PxeResourceContext.Provider>
        ))}
        <PxeRosterBranch
          railBarHeight={38}
          bottomRail={isInRosterItem && !isLastNode}
          content={
            <Button
              data-testid={`RosterAddButton_${valueDescriptor.path}`}
              className={classes.addButton}
              variant="outlined"
              startIcon={<AddIcon />}
              disabled={!isAddButtonEnabled}
              onClick={handleItemAddition}
            >
              Add {generateValueLabel(valueDescriptor)}
            </Button>
          }
        />
      </div>
    );
  },
);

const itemChunksFromValue = (value: PxeValue): readonly RosterItemResourceChunk[] =>
  Object.entries(value ?? {}).map(([itemKey, itemValue]) => ({
    $key: itemKey,
    $value: itemValue as PxeValue,
  }));

const valueFromItemChunks = (
  itemChunks: readonly RosterItemResourceChunk[],
  rosterType: RosterValueType,
): object | readonly any[] =>
  rosterType === PxeValueType.Object
    ? Object.fromEntries(itemChunks.map(itemChunk => [itemChunk.$key, itemChunk.$value]))
    : itemChunks.map(itemChunk => itemChunk.$value);

const useStyles = makeStyles(() => ({
  addButton: {
    height: '40px',
    borderRadius: '20px',
    borderColor: '#74777f',
    color: '#3d5f90',
    textTransform: 'none',
  },
}));
