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

export const findTextFieldInput = (searchRoot: RenderResult | HTMLElement, path: string): HTMLInputElement =>
  findElement(searchRoot, `[data-testid="TextField_${path}"] input`, `Text field ${path}`);

export const findSelectInput = (searchRoot: RenderResult | HTMLElement, path: string): HTMLDivElement =>
  findElement(searchRoot, `[data-testid="Select_${path}"] [role="button"]`, `Select ${path}`);

export const findSelectLabel = (searchRoot: RenderResult | HTMLElement, path: string): HTMLDivElement =>
  findElement(searchRoot, `[data-testid="Select_${path}"] label`, `Select label ${path}`);

export const findSelectOption = (searchRoot: RenderResult | HTMLElement, optionNumber: number): HTMLDivElement =>
  findElement(searchRoot, `[role="listbox"] > li:nth-child(${optionNumber})`, `Select option ${optionNumber}`);

export const findRosterItem = (searchRoot: RenderResult | HTMLElement, path: string, index: number): HTMLElement =>
  findElement(searchRoot, `[data-testid="RosterItem_${path}_${index}"]`, `Roster item ${path} [${index}]`);

export const findRosterAddButton = (searchRoot: RenderResult | HTMLElement, path: string): HTMLButtonElement =>
  findElement(searchRoot, `[data-testid="RosterAddButton_${path}"]`, `Roster add button ${path}`);

const findElement = <T extends HTMLElement>(
  searchRoot: RenderResult | HTMLElement,
  selector: string,
  description: string,
): T => {
  const searchRootElement = 'baseElement' in searchRoot ? searchRoot.baseElement : searchRoot;
  const inputElement = searchRootElement?.querySelector(selector);

  if (inputElement) return inputElement as T;
  else throw new Error(`${description} not found.`);
};
