import React, { ReactNode } from 'react';

export const renderGroupedArray = <T,>(
  groupedArray: readonly T[][],
  renderItemFunction: (
    item: T,
    groupIndex: number,
    itemIndex: number,
  ) => ReactNode,
  renderGrouping: (groupContent: ReactNode) => ReactNode = groupContent => (
    <div>{groupContent}</div>
  ),
) =>
  groupedArray.map((group, groupIndex) =>
    group.length === 1
      ? renderItemFunction(group[0], groupIndex, 0)
      : renderGrouping(
          group.map((item, itemIndex) =>
            renderItemFunction(item, groupIndex, itemIndex),
          ),
        ),
  );
