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
import { get, size } from 'lodash';
import { PxeValueDescriptor, PxeValueType, PxeWidgetEntry } from '../types/PxeConfiguration.types';
import { PxeResourceChunk } from '../types/PxeParametricEditor.types';
import { upperCaseFirstLetter } from './general/stringCasing';
import { isEmptyPxeValue } from './isEmptyPxeValue';

const FALLBACK_DEFAULT_VALUE_NAME = 'Value';

export const generateDescriptionForEntries = (entries: PxeWidgetEntry[], resourceChunk: PxeResourceChunk): string =>
  entries.flatMap(widgetEntry => generateValueDescriptionsForWidget(widgetEntry, resourceChunk)).join(', ');

export const generateValueLabel = (valueDescriptor: PxeValueDescriptor, uppercase: boolean = true): string => {
  if (valueDescriptor.display?.name) {
    return uppercase ? upperCaseFirstLetter(valueDescriptor.display.name) : valueDescriptor.display.name;
  } else {
    const pathSegments = valueDescriptor.path.split('.');
    return (uppercase ? changeCase.sentenceCase : changeCase.noCase)(
      pathSegments[pathSegments.length - 1] ?? FALLBACK_DEFAULT_VALUE_NAME,
    );
  }
};

const generateValueDescriptionsForWidget = (widgetEntry: PxeWidgetEntry, resourceChunk: PxeResourceChunk): string[] =>
  widgetEntry.valueDescriptors
    .map(valueDescriptor => generateValueDescription(valueDescriptor, resourceChunk))
    .filter(segment => segment !== null) as string[];

const generateValueDescription = (
  valueDescriptor: PxeValueDescriptor,
  resourceChunk: PxeResourceChunk,
): string | null => {
  const { path, type, isRequired } = valueDescriptor;
  const value = get(resourceChunk, path);

  if (type === PxeValueType.Array || type === PxeValueType.Object) {
    return `${size(value)} ${generateValueLabel(valueDescriptor, false)}`;
  } else {
    const hasDescription = !isEmptyPxeValue(value) || isRequired;
    return hasDescription ? `${generateValueLabel(valueDescriptor)}: ${value ?? ''}` : null;
  }
};
