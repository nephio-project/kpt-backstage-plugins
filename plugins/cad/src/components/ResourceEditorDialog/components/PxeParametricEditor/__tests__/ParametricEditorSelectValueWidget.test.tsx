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

import { renderWithEffects } from '@backstage/test-utils';
import { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { PxeParametricEditor } from '../PxeParametricEditor';
import { PxeConfiguration, PxeValueOption, PxeValueType } from '../types/PxeConfiguration.types';
import { PxeConfigurationFactory } from '../configuration';
import { findSelectInput, findSelectLabel, findSelectOption } from './testUtils/findEditorElement';
import { getLastResourceState } from './testUtils/getLastResourceState';

const { selectValue } = PxeConfigurationFactory;

const OPTIONS_S: readonly PxeValueOption[] = [
  { value: 'foo', label: 'Foo' },
  { value: 'bar', label: 'Bar' },
];
const OPTIONS_S_OPT: readonly PxeValueOption[] = [...OPTIONS_S, { value: undefined, label: 'Empty' }];

const OPTIONS_N: readonly PxeValueOption[] = [
  { value: 1, label: 'Number 1' },
  { value: 2, label: 'Number 2' },
];
const OPTIONS_N_OPT: readonly PxeValueOption[] = [...OPTIONS_N, { value: undefined, label: 'Empty' }];

const CONFIGURATION: PxeConfiguration = {
  topLevelProperties: ['spec'],
  entries: [
    selectValue({ path: 'spec.selectOptional', options: OPTIONS_S_OPT }),
    selectValue({ path: 'spec.selectRequired', options: OPTIONS_S, isRequired: true }),
    selectValue({ path: 'spec.selectNumberOptional', options: OPTIONS_N_OPT, type: PxeValueType.Number }),
    selectValue({ path: 'spec.selectNumberRequired', options: OPTIONS_N, type: PxeValueType.Number, isRequired: true }),
    selectValue({ path: 'spec.selectCustomName', options: OPTIONS_S, name: 'fizz buzz' }),
  ],
};

const YAML = `
spec:
  selectOptional: "foo"
  selectRequired: "foo"
  selectNumberOptional: 1
  selectNumberRequired: 1
  selectCustomName: "foo"
`;

describe('ParametricEditorSelectValueWidget', () => {
  let editor: RenderResult;
  let resourceChangeHandler: jest.Mock;

  beforeEach(async () => {
    resourceChangeHandler = jest.fn();

    editor = await renderWithEffects(
      <PxeParametricEditor configuration={CONFIGURATION} yamlText={YAML} onResourceChange={resourceChangeHandler} />,
    );
  });

  describe('(type: string)', () => {
    ['selectOptional', 'selectRequired'].forEach(property => {
      it('should have current value from resource', () => {
        const selectInput = findSelectInput(editor, `spec.${property}`);

        expect(selectInput.textContent).toBe('Foo');
      });

      it(`should change value on new value selection (${property})`, async () => {
        const selectInput = findSelectInput(editor, `spec.${property}`);

        await userEvent.click(selectInput);
        await userEvent.click(findSelectOption(editor, 2));

        const resource = getLastResourceState(resourceChangeHandler);
        expect(resource.spec[property]).toBe('bar');
        expect(selectInput.textContent).toBe('Bar');
      });
    });

    it('should change value on empty value selection', async () => {
      const selectInput = findSelectInput(editor, `spec.selectOptional`);

      await userEvent.click(selectInput);
      await userEvent.click(findSelectOption(editor, 3));

      const resource = getLastResourceState(resourceChangeHandler);
      expect(resource.spec.selectOptional).toBeUndefined();
      expect(selectInput.textContent).toBe('Empty');
    });
  });

  describe('(type: number)', () => {
    ['selectNumberOptional', 'selectNumberRequired'].forEach(property => {
      it('should have current value from resource', () => {
        const selectInput = findSelectInput(editor, `spec.${property}`);

        expect(selectInput.textContent).toBe('Number 1');
      });

      it(`should change value on new value selection (${property})`, async () => {
        const selectInput = findSelectInput(editor, `spec.${property}`);

        await userEvent.click(selectInput);
        await userEvent.click(findSelectOption(editor, 2));

        const resource = getLastResourceState(resourceChangeHandler);
        expect(resource.spec[property]).toBe(2);
        expect(selectInput.textContent).toBe('Number 2');
      });
    });

    it('should change value on empty value selection', async () => {
      const selectInput = findSelectInput(editor, `spec.selectNumberOptional`);

      await userEvent.click(selectInput);
      await userEvent.click(findSelectOption(editor, 3));

      const resource = getLastResourceState(resourceChangeHandler);
      expect(resource.spec.selectNumberOptional).toBeUndefined();
      expect(selectInput.textContent).toBe('Empty');
    });
  });

  it('should have sentence-cased auto-generated names', () => {
    expect(findSelectLabel(editor, `spec.selectOptional`).textContent).toBe('Select optional');
    expect(findSelectLabel(editor, `spec.selectNumberRequired`).textContent).toBe('Select number required');
    expect(findSelectLabel(editor, `spec.selectRequired`).textContent).toBe('Select required');
  });

  it('should have custom name if provided', () => {
    expect(findSelectLabel(editor, `spec.selectCustomName`).textContent).toBe('Fizz buzz');
  });
});
