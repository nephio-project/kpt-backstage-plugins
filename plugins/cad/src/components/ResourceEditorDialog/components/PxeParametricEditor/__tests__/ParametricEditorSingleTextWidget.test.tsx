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
import { PxeConfiguration } from '../types/PxeConfiguration.types';
import { PxeConfigurationFactory } from '../configuration';
import { findTextFieldInput } from './testUtils/findEditorElement';
import { getLastResourceState } from './testUtils/getLastResourceState';

const { singleLineText } = PxeConfigurationFactory;

const CONFIGURATION: PxeConfiguration = {
  topLevelProperties: ['spec'],
  entries: [
    singleLineText({ path: 'spec.textOptional' }),
    singleLineText({ path: 'spec.textRequired', isRequired: true }),
  ],
};

const YAML = `
spec:
  textOptional: "foo"
  textRequired: "foo"
`;

describe('ParametricEditorSingleTextWidget', () => {
  let editor: RenderResult;
  let resourceChangeHandler: jest.Mock;

  beforeEach(async () => {
    resourceChangeHandler = jest.fn();

    editor = await renderWithEffects(
      <PxeParametricEditor configuration={CONFIGURATION} yamlText={YAML} onResourceChange={resourceChangeHandler} />,
    );
  });

  ['textOptional', 'textRequired'].forEach(property => {
    it(`should change value on text input (${property})`, async () => {
      const textInput = findTextFieldInput(editor, `spec.${property}`);

      await userEvent.type(textInput, 'bar');

      const resource = getLastResourceState(resourceChangeHandler);
      expect(resource.spec[property]).toBe('foobar');
    });
  });

  it('should change value on text clear (optional => undefined)', async () => {
    const textInput = findTextFieldInput(editor, 'spec.textOptional');

    await userEvent.clear(textInput);

    const resource = getLastResourceState(resourceChangeHandler);
    expect(resource.spec.textOptional).toBeUndefined();
  });

  it('should change value on text clear (required => empty string)', async () => {
    const textInput = findTextFieldInput(editor, 'spec.textRequired');

    await userEvent.clear(textInput);

    const resource = getLastResourceState(resourceChangeHandler);
    expect(resource.spec.textRequired).toBe('');
  });
});

// TODO Add tests for other options of single text widget.
