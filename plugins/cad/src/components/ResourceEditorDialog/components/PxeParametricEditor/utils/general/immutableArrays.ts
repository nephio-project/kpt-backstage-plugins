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

/**
 * Returns an array with a new item replacing an item at the given index.
 * Original array is not modified.
 *
 * @param array The original array.
 * @param replaceAt Index at which array item is to be replaced.
 * @param newItem Item to replace on original item.
 * @returns A new array with item replaced.
 */
export const arrayWithItemReplaced = <T>(
  array: readonly T[],
  replaceAt: number,
  newItem: T,
): readonly T[] => [
  ...array.slice(0, replaceAt),
  newItem,
  ...array.slice(replaceAt + 1),
];

/**
 * Returns an array with a new item inserted at the given index.
 * Original array is not modified.
 *
 * @param array The original array.
 * @param insertAt Index at which array item is to be inserted.
 * @param newItem Item to insert.
 * @returns A new array with item inserted.
 */
export const arrayWithItemInserted = <T>(
  array: readonly T[],
  insertAt: number,
  newItem: T,
): readonly T[] => [
  ...array.slice(0, insertAt),
  newItem,
  ...array.slice(insertAt),
];

/**
 * Returns an array with a new item removed at the given index.
 * Original array is not modified.
 * @param array The original array.
 * @param removeAt Index at which array item is to be removed.
 * @returns A new array with item removed.
 */
export const arrayWithItemRemoved = <T>(
  array: readonly T[],
  removeAt: number,
): readonly T[] => [...array.slice(0, removeAt), ...array.slice(removeAt + 1)];
