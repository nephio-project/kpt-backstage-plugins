import React, { ReactNode } from 'react';

const DEFAULT_RENDER_GROUPING_FUNCTION = (groupContent: ReactNode, groupIndex: number) => (
  <div key={`group-${groupIndex}`}>{groupContent}</div>
);

export const renderGroupedArray = <T,>(
  groupedArray: readonly T[][],
  renderItemFunction: (item: T, groupIndex: number, itemIndex: number) => ReactNode,
  renderGrouping: (groupContent: ReactNode, groupIndex: number) => ReactNode = DEFAULT_RENDER_GROUPING_FUNCTION,
) =>
  groupedArray.map((group, groupIndex) =>
    group.length === 1
      ? renderItemFunction(group[0], groupIndex, 0)
      : renderGrouping(
          group.map((item, itemIndex) => renderItemFunction(item, groupIndex, itemIndex)),
          groupIndex,
        ),
  );
