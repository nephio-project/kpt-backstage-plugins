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
import { noop } from 'lodash';
import React from 'react';
import { findTextFieldInput } from './testUtils/findEditorElement';
import { PxeConfiguration } from '../types/PxeConfiguration.types';
import { PxeConfigurationFactory } from '../configuration';
import { PxeParametricEditor } from '../PxeParametricEditor';

const { arrayTypeRoster, rowLayout, section, selectValue, singleLineText, objectTypeRoster } = PxeConfigurationFactory;

const CONFIGURATION: PxeConfiguration = {
  topLevelProperties: ['spec'],
  entries: [
    section(
      { name: 'Section' },
      rowLayout(
        singleLineText({ path: 'spec.singleLineText' }),
        selectValue({ path: 'spec.selectValue', options: [{ value: 'foo', label: 'foo' }] }),
      ),
      arrayTypeRoster({ name: 'Array', path: 'spec.arrayTypeRoster' }, singleLineText({ path: '$value' })),
      objectTypeRoster(
        { name: 'Array', path: 'spec.objectTypeRoster' },
        rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value' })),
      ),
    ),
  ],
};

const YAML = `
spec:
  singleLineText: "foo"
  selectValue: "foo"
  arrayTypeRoster:
    - foo
  objectTypeRoster:
    foo: bar
`;

describe('PxeParametricEditor performance', () => {
  const INITIAL_NON_ITEM_NODE_COUNT = 6;
  const INITIAL_ROSTER_SECTION_COUNT = 2;
  const INITIAL_ITEM_NODE_COUNT = 4;
  const INITIAL_NODE_COUNT = INITIAL_NON_ITEM_NODE_COUNT + INITIAL_ITEM_NODE_COUNT + INITIAL_ROSTER_SECTION_COUNT;

  let editor: RenderResult;
  let renderReporter: jest.Mock;

  beforeEach(async () => {
    renderReporter = jest.fn();

    editor = await renderWithEffects(
      <PxeParametricEditor
        configuration={CONFIGURATION}
        yamlText={YAML}
        onResourceChange={noop}
        __diagnosticsReporter={{ reportRender: renderReporter }}
      />,
    );
  });

  it('should render with minimal number of component renders', () => {
    expect(renderReporter.mock.calls.length).toBe(INITIAL_NODE_COUNT);
  });

  it('should rerender text widget when single character is inputted', async () => {
    const textInput = findTextFieldInput(editor, `spec.singleLineText`);

    await userEvent.type(textInput, 'a');

    expect(renderReporter.mock.calls.length).toBe(INITIAL_NODE_COUNT + 1);
  });

  it('should rerender text widget multiple times when multiple characters are inputted', async () => {
    const textInput = findTextFieldInput(editor, `spec.singleLineText`);

    await userEvent.type(textInput, 'aaa');

    expect(renderReporter.mock.calls.length).toBe(INITIAL_NODE_COUNT + 3);
  });
});