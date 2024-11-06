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
  PxeSectionEntry,
  PxeValueType,
} from '../types/PxeConfiguration.types';
import { sectionConfigurationEntry } from './sectionConfigurationEntry';

// TODO With the current UI every roster entry is wrapped in implicit section entry.
// Also, name parameter is mandatory as it iss used for displaying section name.
// Change this after UI redesign.
export const objectTypeRosterConfigurationEntry = (
  {
    name,
    path,
    isRequired = false,
  }: {
    name: string;
    path: string;
    isRequired?: boolean;
  },
  ...itemEntries: PxeConfigurationEntry[]
): PxeSectionEntry =>
  sectionConfigurationEntry(
    { name },
    {
      type: PxeConfigurationEntryType.Roster,
      values: [{ path, type: PxeValueType.Object, isRequired, display: { name } }],
      itemEntries,
    },
  );

export const arrayTypeRosterConfigurationEntry = (
  {
    name,
    path,
    isRequired = false,
  }: {
    name: string;
    path: string;
    isRequired?: boolean;
  },
  ...itemEntries: PxeConfigurationEntry[]
): PxeSectionEntry =>
  sectionConfigurationEntry(
    { name },
    {
      type: PxeConfigurationEntryType.Roster,
      values: [{ path, type: PxeValueType.Array, isRequired, display: { name } }],
      itemEntries,
    },
  );
