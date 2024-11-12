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

/* eslint @backstage/no-undeclared-imports: off */
import { RenderResult } from '@testing-library/react';

export const findTextFieldInput = (searchRoot: RenderResult | HTMLElement, path: string): HTMLInputElement => {
  const searchRootElement = 'baseElement' in searchRoot ? searchRoot.baseElement : searchRoot;
  const inputElement = searchRootElement?.querySelector(`[data-testid="TextField_${path}"]`)?.querySelector('input');

  if (inputElement) return inputElement;
  else throw new Error(`Text field ${path} not found.`);
};

export const findRosterItem = (searchRoot: RenderResult | HTMLElement, path: string, index: number): HTMLElement => {
  const searchRootElement = 'baseElement' in searchRoot ? searchRoot.baseElement : searchRoot;
  const rosterItemElement = searchRootElement?.querySelector(`[data-testid="RosterItem_${path}_${index}"]`);

  if (rosterItemElement) return rosterItemElement as HTMLElement;
  else throw new Error(`Roster item ${path} [${index}] not found.`);
};

export const findRosterAddButton = (searchRoot: RenderResult | HTMLElement, path: string): HTMLButtonElement => {
  const searchRootElement = 'baseElement' in searchRoot ? searchRoot.baseElement : searchRoot;
  const rosterAddButtonElement = searchRootElement?.querySelector(`[data-testid="RosterAddButton_${path}"]`);

  if (rosterAddButtonElement) return rosterAddButtonElement as HTMLButtonElement;
  else throw new Error(`Roster add button ${path} not found.`);
};
