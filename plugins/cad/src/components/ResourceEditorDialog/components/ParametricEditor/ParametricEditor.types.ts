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
import { Dispatch, SetStateAction } from 'react';

export type ParametricEditorConfiguration = {
  readonly topLevelProperties: readonly string[];
  readonly entries: readonly ParametricEditorEntry[];
};

export type ParametricEditorEntry =
  | ParametricEditorSection
  | ParametricEditorWidget;

export type ParametricEditorSection = {
  readonly type: ParametricEditorWidgetType.Section;
  readonly name: string;
  readonly entries: ParametricEditorEntry[];
};

export type ParametricEditorWidget = PESingleLineTextWidget;

export type PESingleLineTextWidget = {
  readonly type: ParametricEditorWidgetType.SingleLineText;
  readonly path: string;
};

export enum ParametricEditorWidgetType {
  Section = 'Section',
  SingleLineText = 'SingleLineText',
}

export type ParametricEditorExpansionState = string | undefined;
export type ParametricEditorExpansionStateTuple = [
  ParametricEditorExpansionState,
  Dispatch<SetStateAction<ParametricEditorExpansionState>>,
];

export type PxeResourceChangeRequestHandler = (
  path: string,
  newValue: any,
) => void;
