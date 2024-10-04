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
  PxeConfigurationEntry,
  PxeConfigurationEntryType,
  PxeRosterType,
  PxeRosterWidgetEntry,
} from '../../PxeParametricEditor/types/PxeConfiguration.types';

// TODO Refactor these two functions.
export const objectTypeRoster = (
  {
    path,
    isRequired = false,
  }: {
    path: string;
    isRequired?: boolean;
  },
  ...itemEntries: PxeConfigurationEntry[]
): PxeRosterWidgetEntry => ({
  type: PxeConfigurationEntryType.Roster,
  rosterType: PxeRosterType.Object,
  values: [{ path, isRequired }],
  itemEntries,
});

export const arrayTypeRoster = (
  {
    path,
    isRequired = false,
  }: {
    path: string;
    isRequired?: boolean;
  },
  ...itemEntries: PxeConfigurationEntry[]
): PxeRosterWidgetEntry => ({
  type: PxeConfigurationEntryType.Roster,
  rosterType: PxeRosterType.Array,
  values: [{ path, isRequired }],
  itemEntries,
});
