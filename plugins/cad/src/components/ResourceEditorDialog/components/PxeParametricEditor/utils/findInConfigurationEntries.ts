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
import { PxeConfigurationEntry } from '../types/PxeConfiguration.types';
import { isArray } from 'lodash';
import { isLayoutNode, isSectionNode } from './nodePredicates';

type SearchOptions = {
  readonly searchInLayouts?: boolean;
  readonly searchInSections?: boolean;
};

export const findInConfigurationEntries = (
  searchIn: PxeConfigurationEntry | readonly PxeConfigurationEntry[],
  isSuccess: (entry: PxeConfigurationEntry) => boolean,
  { searchInLayouts = true, searchInSections = true }: SearchOptions = {},
): PxeConfigurationEntry | null => {
  const options = { searchInLayouts, searchInSections };
  const entries: PxeConfigurationEntry[] = isArray(searchIn) ? searchIn : [searchIn];

  for (const entry of entries) {
    if (isSuccess(entry)) {
      return entry;
    } else if ((isLayoutNode(entry) && searchInLayouts) || (isSectionNode(entry) && searchInSections)) {
      const foundEntry = findInConfigurationEntries(entry.entries, isSuccess, options);
      if (foundEntry) {
        return foundEntry;
      }
    }
  }
  return null;
};

export const findAllInConfigurationEntries = (
  searchIn: PxeConfigurationEntry | readonly PxeConfigurationEntry[],
  isSuccess: (entry: PxeConfigurationEntry) => boolean,
  { searchInLayouts = true, searchInSections = true }: SearchOptions = {},
): PxeConfigurationEntry[] => {
  const options = { searchInLayouts, searchInSections };
  const entries: PxeConfigurationEntry[] = isArray(searchIn) ? searchIn : [searchIn];

  const foundEntries: PxeConfigurationEntry[] = [];
  for (const entry of entries) {
    if (isSuccess(entry)) {
      foundEntries.push(entry);
    }
    if ((isLayoutNode(entry) && searchInLayouts) || (isSectionNode(entry) && searchInSections)) {
      foundEntries.push(...findAllInConfigurationEntries(entry.entries, isSuccess, options));
    }
  }
  return foundEntries;
};
