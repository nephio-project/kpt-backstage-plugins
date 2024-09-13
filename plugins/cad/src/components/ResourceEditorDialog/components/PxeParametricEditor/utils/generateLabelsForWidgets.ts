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

import * as changeCase from 'change-case';
import { get } from 'lodash';
import {
  PxeConfigurationEntry,
  PxeConfigurationEntryType,
  PxeSectionEntry,
  PxeWidgetEntry,
} from '../types/PxeConfiguration.types';
import { PxeResourceChunk } from '../types/PxeParametricEditor.types';
import { isEmptyPxeValue } from './isEmptyPxeValue';

const FALLBACK_DEFAULT_VALUE_NAME = 'Value';

export const generateDefaultValueName = (
  configurationEntry: PxeConfigurationEntry,
): string => {
  if (configurationEntry.type === PxeConfigurationEntryType.Section) {
    throw new Error(
      'generateDefaultValueName() called for entry of Section type.',
    );
  }

  const pathSegments = configurationEntry.valuePath.split('.');
  return pathSegments.length > 0
    ? changeCase.sentenceCase(pathSegments[pathSegments.length - 1])
    : FALLBACK_DEFAULT_VALUE_NAME;
};

// TODO Naive and non-performant implementation.
// Consider configuration preprocessing (different types for inputted and final configuration).
// Handle "required" entry property.
export const generateDefaultSectionDescription = (
  sectionEntry: PxeSectionEntry,
  resourceChunk: PxeResourceChunk,
): string =>
  sectionEntry.entries
    .filter(childEntry => childEntry.type !== PxeConfigurationEntryType.Section)
    .map(childEntry => {
      const { valuePath, isRequired } = childEntry as PxeWidgetEntry;
      const value = get(resourceChunk, valuePath);
      const valueName = generateDefaultValueName(childEntry);

      return !isEmptyPxeValue(value) || isRequired
        ? `${valueName}: ${value ?? ''}`
        : null;
    })
    .filter(segment => segment !== null)
    .join(', ');
