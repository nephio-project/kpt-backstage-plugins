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
import { PxeConfigurationFactory } from '../../PxeParametricEditor/configuration';
import { PxeValueType } from '../../PxeParametricEditor/types/PxeConfiguration.types';

const SELECTOR_OPERATOR_OPTIONS = [
  { value: 'In', label: 'In' },
  { value: 'NotIn', label: 'Not In' },
  { value: 'Exists', label: 'Exists' },
  { value: 'DoesNotExist', label: 'Does Not Exist' },
];

const { section, rowLayout, arrayTypeRoster, objectTypeRoster, selectValue, singleLineText } = PxeConfigurationFactory;

export const selectorRosters = (pathPrefix: string) => [
  objectTypeRoster(
    { name: 'Match labels', path: `${pathPrefix}.matchLabels` },
    rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value' })),
  ),
  arrayTypeRoster(
    {
      name: 'Match expressions',
      path: `${pathPrefix}.matchExpressions`,
      item: { type: PxeValueType.Object, isRequired: true },
    },
    section(
      { name: 'Match expression' },
      rowLayout(
        singleLineText({ path: '$value.key', isRequired: true }),
        selectValue({ path: '$value.operator', isRequired: true, options: SELECTOR_OPERATOR_OPTIONS }),
      ),
      // TODO Needs different value requirements for different operators.
      arrayTypeRoster({ name: 'Values', path: '$value.values' }, singleLineText({ path: '$value', isRequired: true })),
    ),
  ),
];
