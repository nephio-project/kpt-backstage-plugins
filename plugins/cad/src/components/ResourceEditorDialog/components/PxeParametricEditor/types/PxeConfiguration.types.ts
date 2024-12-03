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

import { TextFilter } from '../validation/textFilters';

export type PxeConfiguration = {
  readonly topLevelProperties: readonly string[];
  readonly entries: readonly PxeConfigurationEntry[];
};

// Entries

export type PxeConfigurationEntry = PxeSectionEntry | PxeRowLayoutEntry | PxeWidgetEntry;

export enum PxeNodeType {
  Section = 'Section',
  Roster = 'Roster',

  RowLayout = 'RowLayout',

  SingleLineText = 'SingleLineText',
  SelectValue = 'SelectValue',
}

// Values

export enum PxeValueType {
  String = 'String',
  Number = 'Number',
  Object = 'Object',
  Array = 'Array',
}

export type PxeValueDescriptor = {
  readonly path: string;
  readonly type: PxeValueType;
  readonly isRequired: boolean;
  readonly display?: {
    readonly name?: string;
  };
};

// Section

export type PxeSectionEntry = {
  readonly type: PxeNodeType.Section;
  readonly name: string;
  readonly entries: readonly PxeConfigurationEntry[];
};

// Layouts

export type PxeLayoutEntry = PxeRowLayoutEntry;

export interface PxeRowLayoutEntry {
  readonly type: PxeNodeType.RowLayout;
  readonly entries: readonly PxeConfigurationEntry[];
}

// Widgets

export type PxeWidgetEntry = PxeRosterWidgetEntry | PxeSingleLineTextWidgetEntry | PxeSelectValueWidgetEntry;

type PxeWidgetEntryBase = {
  readonly type: PxeNodeType;
  readonly valueDescriptors: readonly PxeValueDescriptor[];
};

export interface PxeRosterWidgetEntry extends PxeWidgetEntryBase {
  readonly type: PxeNodeType.Roster;
  readonly itemValueDescriptor: PxeValueDescriptor;
  readonly itemEntries: readonly PxeConfigurationEntry[];
}

export interface PxeSingleLineTextWidgetEntry extends PxeWidgetEntryBase {
  readonly type: PxeNodeType.SingleLineText;
  readonly textFilter: TextFilter;
}

export interface PxeSelectValueWidgetEntry extends PxeWidgetEntryBase {
  readonly type: PxeNodeType.SelectValue;
  readonly options: readonly PxeValueOption[];
}

export type PxeValueOption = {
  readonly value: string | number | undefined;
  readonly label: string;
};
