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

import { PxeNodeType, PxeSingleLineTextWidgetEntry, PxeValueType } from '../types/PxeConfiguration.types';
import { identityTextFilter, naturalNumberTextFilter, TextFilter } from '../validation/textFilters';

export const singleLineTextWidgetConfigurationEntry = ({
  path,
  type = PxeValueType.String,
  isRequired,
  name,
  textFilter = identityTextFilter,
}: {
  path: string;
  type?: PxeValueType.String | PxeValueType.Number;
  isRequired?: boolean;
  name?: string;
  textFilter?: TextFilter;
}): PxeSingleLineTextWidgetEntry => {
  if (isRequired !== undefined && path === '$key') {
    throw new Error('Roster item "$key" entry is always required. Explicit value is prohibited.');
  }

  return {
    type: PxeNodeType.SingleLineText,
    valueDescriptors: [{ path, type, isRequired: path === '$key' ? true : isRequired ?? false, display: { name } }],
    textFilter,
  };
};

export const naturalNumberTextWidgetConfigurationEntry = ({
  path,
  isRequired,
  name,
}: {
  path: string;
  type?: PxeValueType.String | PxeValueType.Number;
  isRequired?: boolean;
  name?: string;
  textFilter?: TextFilter;
}): PxeSingleLineTextWidgetEntry =>
  singleLineTextWidgetConfigurationEntry({
    path,
    type: PxeValueType.Number,
    isRequired,
    name,
    textFilter: naturalNumberTextFilter,
  });
