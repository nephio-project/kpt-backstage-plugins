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

export type PxeConfigurationEntry = PxeSectionEntry | PxeWidgetEntry;

export type PxeSectionEntry = {
  readonly type: PxeConfigurationEntryType.Section;
  readonly name: string;
  readonly entries: PxeConfigurationEntry[];
};

export enum PxeConfigurationEntryType {
  Section = 'Section',
  SingleLineText = 'SingleLineText',
}

// Widget entry types

export type PxeWidgetEntry = PxeSingleLineTextWidgetEntry;

type PxeWidgetEntryBase = {
  readonly valuePath: string;
};

export type PxeSingleLineTextWidgetEntry = PxeWidgetEntryBase & {
  readonly type: PxeConfigurationEntryType.SingleLineText;
};