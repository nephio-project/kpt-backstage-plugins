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

type TraitToken = string | number | boolean | null;

/**
 * Splits an array into multiple arrays based on the trait value of individual items.
 * Result arrays consist of adjacent items with the same trait value.
 * Order of items in the original array is preserved in the result arrays.
 * Items with trait value `null` do not pair with other items and always end up in a separate result array.
 *
 * @param array The original array.
 * @param getTrait The function called for determining the trait value of an item.
 */
export const chunkByTrait = <T>(array: readonly T[], getTrait: (item: T) => TraitToken): T[][] =>
  array.reduce(
    ({ chunks, currentTrait }, item) => {
      const lastChunk = chunks[chunks.length - 1] ?? null;
      const itemTrait = getTrait(item);
      const chunkContinues = itemTrait !== null && itemTrait === currentTrait;

      return {
        chunks: chunkContinues ? [...chunks.slice(0, chunks.length - 1), [...lastChunk, item]] : [...chunks, [item]],
        currentTrait: itemTrait,
      };
    },
    { chunks: [] as T[][], currentTrait: null as TraitToken },
  ).chunks;
