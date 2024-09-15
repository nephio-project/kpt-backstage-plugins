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
  PxeConfigurationEntryType,
  PxeSectionEntry,
  PxeValueDescriptor,
  PxeWidgetEntry,
} from '../types/PxeConfiguration.types';
import { PxeResourceChunk } from '../types/PxeParametricEditor.types';
import { isEmptyPxeValue } from './isEmptyPxeValue';

const FALLBACK_DEFAULT_VALUE_NAME = 'Value';

export const generateDefaultValueLabel = (
  valueDescriptor: PxeValueDescriptor,
): string => {
  const pathSegments = valueDescriptor.path.split('.');
  return pathSegments.length > 0
    ? changeCase.sentenceCase(pathSegments[pathSegments.length - 1])
    : FALLBACK_DEFAULT_VALUE_NAME;
};

// TODO Fix @typescript-eslint/no-use-before-define rule and move these two helper functions to the end of file.
const generateValueDescription = (
  valueDescriptor: PxeValueDescriptor,
  resourceChunk: PxeResourceChunk,
): string | null => {
  const { isRequired, path } = valueDescriptor;
  const valueName = generateDefaultValueLabel(valueDescriptor);
  const value = get(resourceChunk, path);

  const hasDescription = !isEmptyPxeValue(value) || isRequired;
  return hasDescription ? `${valueName}: ${value ?? ''}` : null;
};

const generateValueDescriptionsForWidget = (
  widgetEntry: PxeWidgetEntry,
  resourceChunk: PxeResourceChunk,
): string[] =>
  widgetEntry.values
    .map(valueDescriptor =>
      generateValueDescription(valueDescriptor, resourceChunk),
    )
    .filter(segment => segment !== null) as string[];

export const generateDefaultSectionDescription = (
  sectionEntry: PxeSectionEntry,
  resourceChunk: PxeResourceChunk,
): string =>
  sectionEntry.entries
    .filter(childEntry => childEntry.type !== PxeConfigurationEntryType.Section)
    .flatMap(childEntry =>
      generateValueDescriptionsForWidget(
        childEntry as PxeWidgetEntry,
        resourceChunk,
      ),
    )
    .join(', ');
