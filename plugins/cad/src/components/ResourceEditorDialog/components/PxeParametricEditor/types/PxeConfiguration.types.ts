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

export type PxeConfiguration = {
  readonly topLevelProperties: readonly string[];
  readonly entries: readonly PxeConfigurationEntry[];
};

export type PxeConfigurationEntry =
  | PxeSectionEntry
  | PxeLayoutEntry
  | PxeWidgetEntry;

export type PxeSectionEntry = {
  readonly type: PxeConfigurationEntryType.Section;
  readonly name: string;
  readonly entries: readonly PxeConfigurationEntry[];
};

// TODO Probably needs separate types for different layouts.
export interface PxeLayoutEntry {
  readonly type: PxeConfigurationEntryType.RowLayout;
  readonly entries: readonly PxeConfigurationEntry[];
}

export enum PxeConfigurationEntryType {
  Section = 'Section',
  Roster = 'Roster',

  RowLayout = 'RowLayout',

  SingleLineText = 'SingleLineText',
}

export type PxeValueDescriptor = {
  readonly path: string;
  readonly isRequired: boolean;
};

// FIXME Should be a part of roster's value descriptor.
export enum PxeRosterType {
  Array = 'Array',
  Object = 'Object',
}

type PxeWidgetEntryBase = {
  readonly values: readonly PxeValueDescriptor[];
};

// Widgets

export type PxeWidgetEntry =
  | PxeRosterWidgetEntry
  | PxeSingleLineTextWidgetEntry;

export interface PxeRosterWidgetEntry extends PxeWidgetEntryBase {
  readonly type: PxeConfigurationEntryType.Roster;
  readonly values: readonly [PxeValueDescriptor];
  readonly rosterType: PxeRosterType;
  readonly itemEntries: readonly PxeConfigurationEntry[];
}

export interface PxeSingleLineTextWidgetEntry extends PxeWidgetEntryBase {
  readonly type: PxeConfigurationEntryType.SingleLineText;
  readonly values: readonly [PxeValueDescriptor];
}
