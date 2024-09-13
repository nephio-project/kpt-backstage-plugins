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

import { cloneDeep, set, unset } from 'lodash';
import {
  PxeResourceChangeRequest,
  PxeResourceChunk,
} from '../types/PxeParametricEditor.types';
import { isEmptyPxeValue } from './isEmptyPxeValue';

export const createResourceChunkAfterChangeRequest = (
  resourceChunk: PxeResourceChunk,
  changeRequest: PxeResourceChangeRequest,
) => {
  const { widgetEntry, newValue } = changeRequest;

  // TODO Using cloneDeep may lead to performance issues. Consider different implementation.
  const newResourceChunk = cloneDeep(resourceChunk);
  if (!isEmptyPxeValue(newValue) || widgetEntry.isRequired) {
    set(newResourceChunk, widgetEntry.valuePath, newValue);
  } else {
    unset(newResourceChunk, widgetEntry.valuePath);
  }

  return newResourceChunk;
};
