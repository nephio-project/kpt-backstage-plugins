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
import { get } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { IconButton } from '../../../../../Controls';
import { useEditorStyles } from '../../../FirstClassEditors/styles';
import { PxeParametricEditorNode, PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { PxeConfigurationEntryType, PxeRosterWidgetEntry, PxeValueType } from '../../types/PxeConfiguration.types';
import { PxeResourceChangeRequest, PxeValue } from '../../types/PxeParametricEditor.types';
import { createResourceChunkAfterChangeRequest } from '../../utils/createResourceChunkAfterChangeRequest';
import { generateValueLabel } from '../../utils/generateLabelsForWidgets';
import { arrayWithItemRemoved, arrayWithItemReplaced } from '../../utils/general/immutableArrays';
import { defaultValueForType } from '../../utils/defaultValueForType';

type RosterItemResourceChunk = {
  readonly $key: string;
  readonly $value: PxeValue;
};

type RosterValueType = PxeValueType.Object | PxeValueType.Array;

// TODO Consider refactoring this component after Prettier settings update.
export const PxeRosterWidgetNode: React.FC<PxeParametricEditorNodeProps> = ({
  configurationEntry,
  resourceChunk,
  onResourceChangeRequest,
  parentExpandedSectionState,
}) => {
  const {
    valueDescriptors: [valueDescriptor],
    itemValueDescriptor: itemValueDescriptor,
    itemEntries,
  } = configurationEntry as PxeRosterWidgetEntry;
  const rosterValueType = valueDescriptor.type as RosterValueType;

  const [itemChunks, setItemChunks] = useState<readonly RosterItemResourceChunk[]>(
    itemChunksFromValue(get(resourceChunk, valueDescriptor.path)),
  );

  useEffect(() => {
    setItemChunks(itemChunksFromValue(get(resourceChunk, valueDescriptor.path)));
  }, [resourceChunk, valueDescriptor]);

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

  const isAddButtonEnabled = rosterValueType === PxeValueType.Array || itemChunks.every(({ $key }) => $key !== '');
  const editorClasses = useEditorStyles();
  const rosterClasses = useStyles();

  if (itemEntries.length === 0) {
    return <Fragment />;
  } else if (itemEntries.length > 1) {
    // TODO With proper styling this should be actually possible. Reconsider handling this.
    throw new Error('Roster Widget does not support multiple configuration entries per item.');
  } else {
    // FIXME Refactor by extraction?
    return (
      <Fragment>
        {itemChunks.map((itemChunk, itemIndex) => (
          <div
            key={itemIndex}
            className={rosterClasses.item}
            data-testid={`RosterItem_${valueDescriptor.path}_${itemIndex}`}
          >
            <div className={rosterClasses.itemContent}>
              <PxeParametricEditorNode
                configurationEntry={itemEntries[0]}
                resourceChunk={itemChunk}
                onResourceChangeRequest={changeRequest => handleResourceChangeRequestForItem(itemIndex, changeRequest)}
                parentExpandedSectionState={parentExpandedSectionState}
              >
                {itemEntries[0].type === PxeConfigurationEntryType.Section && (
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleItemDeletion(itemIndex)}>
                    Delete {generateValueLabel(valueDescriptor)}
                  </Button>
                )}
              </PxeParametricEditorNode>
            </div>
            {itemEntries[0].type !== PxeConfigurationEntryType.Section && (
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
        ))}
        <Button
          data-testid={`RosterAddButton_${valueDescriptor.path}`}
          variant="outlined"
          startIcon={<AddIcon />}
          disabled={!isAddButtonEnabled}
          onClick={handleItemAddition}
        >
          Add {generateValueLabel(valueDescriptor)}
        </Button>
      </Fragment>
    );
  }
};

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
