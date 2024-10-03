import { get, noop } from 'lodash';
import React from 'react';
import {
  PxeParametricEditorNode,
  PxeParametricEditorNodeProps,
} from '../PxeParametricEditorNode';
import {
  PxeRosterType,
  PxeRosterWidgetEntry,
} from '../types/PxeConfiguration.types';
import {
  PxeResourceChangeRequest,
  PxeValue,
} from '../types/PxeParametricEditor.types';
import { createResourceChunkAfterChangeRequest } from '../utils/createResourceChunkAfterChangeRequest';
import { arrayWithItemReplaced } from '../utils/general/immutableArrays';

type PxeRosterItemResourceChunk = {
  readonly key: string;
  readonly value: PxeValue;
};

// FIXME Move functions to end of the file after eslint configuration change.
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

  return (
    <div>
      {itemChunks.map((itemChunk, itemIndex) => (
        <div key={itemIndex}>
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
      ))}
    </div>
  );
};
