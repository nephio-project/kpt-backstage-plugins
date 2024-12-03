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
  PxeNodeType,
  PxeSectionEntry,
  PxeValueDescriptor,
  PxeValueType,
  PxeWidgetEntry,
} from '../types/PxeConfiguration.types';
import { sectionConfigurationEntry } from './sectionConfigurationEntry';
import { findInConfigurationEntries } from '../utils/findInConfigurationEntries';
import { isWidgetNode } from '../utils/nodePredicates';

type RosterItemParams = {
  readonly type: PxeValueType;
  readonly isRequired?: boolean;
};

// TODO With the current UI every roster entry is wrapped in implicit section entry.
// Also, name parameter is mandatory as it iss used for displaying section name.
// Change this after UI redesign.
export const objectTypeRosterConfigurationEntry = (
  {
    name,
    path,
    isRequired = false,
    item,
  }: {
    name: string;
    path: string;
    isRequired?: boolean;
    item?: RosterItemParams;
  },
  ...itemEntries: PxeConfigurationEntry[]
): PxeSectionEntry =>
  sectionConfigurationEntry(
    { name },
    {
      type: PxeNodeType.Roster,
      valueDescriptors: [{ path, type: PxeValueType.Object, isRequired, display: { name } }],
      itemValueDescriptor: resolveItemValueDescriptor(name, item ?? null, itemEntries),
      itemEntries,
    },
  );

export const arrayTypeRosterConfigurationEntry = (
  {
    name,
    path,
    isRequired = false,
    item,
  }: {
    name: string;
    path: string;
    isRequired?: boolean;
    item?: RosterItemParams;
  },
  ...itemEntries: PxeConfigurationEntry[]
): PxeSectionEntry =>
  sectionConfigurationEntry(
    { name },
    {
      type: PxeNodeType.Roster,
      valueDescriptors: [{ path, type: PxeValueType.Array, isRequired, display: { name } }],
      itemValueDescriptor: resolveItemValueDescriptor(name, item ?? null, itemEntries),
      itemEntries,
    },
  );

const resolveItemValueDescriptor = (
  rosterName: string,
  rosterItemParams: RosterItemParams | null,
  itemEntries: PxeConfigurationEntry[],
): PxeValueDescriptor => {
  const itemValueEntry = findInConfigurationEntries(
    itemEntries,
    entry => isWidgetNode(entry) && entry.valueDescriptors[0]?.path === '$value',
  ) as PxeWidgetEntry | null;

  if (rosterItemParams && itemValueEntry) {
    throw new Error(`Redundant item params in roster ${rosterName}. Descriptor inherited from $value entry.`);
  } else if (!rosterItemParams && !itemValueEntry) {
    throw new Error(`Roster ${rosterName} needs explicit item params. No $value entry to inherit descriptor from.`);
  } else {
    return rosterItemParams
      ? { path: '$value', type: rosterItemParams.type, isRequired: rosterItemParams.isRequired ?? false }
      : itemValueEntry?.valueDescriptors[0]!;
  }
};
