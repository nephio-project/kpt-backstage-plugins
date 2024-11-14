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

import {
  PxeConfigurationEntryType,
  PxeSelectValueWidgetEntry,
  PxeValueOption,
  PxeValueType,
} from '../types/PxeConfiguration.types';

export const selectValueWidgetConfigurationEntry = ({
  path,
  type = PxeValueType.String,
  isRequired = false,
  name,
  options,
}: {
  path: string;
  type?: PxeValueType;
  isRequired?: boolean;
  name?: string;
  options: readonly PxeValueOption[];
}): PxeSelectValueWidgetEntry => ({
  type: PxeConfigurationEntryType.SelectValue,
  valueDescriptors: [{ path, type, isRequired, display: { name } }],
  options,
});
