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

import { Dispatch, SetStateAction } from 'react';
import { PxeValueDescriptor } from './PxeConfiguration.types';

export type PxeResourceChunk = object;
export type PxeValue = string | object | readonly any[];

// TODO Semantically "null" should be used instead of "undefined".
// Consider project-wide refactoring alongside the update of prettier settings.
export type PxeExpandedSectionState = string | undefined;
export type PxeExpandedSectionStateTuple = [
  PxeExpandedSectionState,
  Dispatch<SetStateAction<PxeExpandedSectionState>>,
];

export type PxeResourceChangeRequest = {
  readonly valueDescriptor: PxeValueDescriptor;
  readonly newValue: PxeValue;
};

export type PxeResourceChangeRequestHandler = (
  changeRequest: PxeResourceChangeRequest,
) => void;
