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
import { get } from 'lodash';
import React from 'react';
import { PxeParametricEditor } from '../PxeParametricEditor';
import { PxeConfiguration } from '../types/PxeConfiguration.types';
import { PxeConfigurationFactory } from '../configuration';
import { findRosterAddButton, findRosterItem, findTextFieldInput } from './testUtils/findEditorElement';
import { getLastResourceState } from './testUtils/getLastResourceState';

const { arrayTypeRoster, objectTypeRoster, rowLayout, singleLineText } = PxeConfigurationFactory;

const CONFIGURATION: PxeConfiguration = {
  topLevelProperties: ['spec'],
  tabs: [
    {
      name: 'Test',
      entries: [
        arrayTypeRoster(
          { path: 'spec.arr.string.opt', name: 'Test' },
          singleLineText({ path: '$value', isRequired: false }),
        ),
        arrayTypeRoster(
          { path: 'spec.arr.string.req', name: 'Test' },
          singleLineText({ path: '$value', isRequired: true }),
        ),
        objectTypeRoster(
          { path: 'spec.obj.string.opt', name: 'Test' },
          rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: false })),
        ),
        objectTypeRoster(
          { path: 'spec.obj.string.req', name: 'Test' },
          rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: true })),
        ),
      ],
    },
  ],
};

const YAML = `
spec:
  arr:
    string:
      opt: ['foo']
      req: ['foo']
  obj:
    string:
      opt: { foo: 'bar' }
      req: { foo: 'bar' }
`;

describe('ParametricEditorRosterWidget', () => {
  let editor: RenderResult;
  let resourceChangeHandler: jest.Mock;

  beforeEach(async () => {
    resourceChangeHandler = jest.fn();

    editor = await renderWithEffects(
      <PxeParametricEditor configuration={CONFIGURATION} yamlText={YAML} onResourceChange={resourceChangeHandler} />,
    );
  });

  describe('array-based', () => {
    describe('(optional string item)', () => {
      const rosterPath = 'spec.arr.string.opt';

      it('should change item value on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$value');

        await userEvent.type(textInput, 'bar');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['foobar']);
      });

      it('should add null item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['foo', null]);
      });

      it('should add null item on Add button click (x2)', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['foo', null, null]);
      });
    });

    describe('(required string item)', () => {
      const rosterPath = 'spec.arr.string.req';

      it('should change item value on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$value');

        await userEvent.type(textInput, 'bar');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['foobar']);
      });

      it('should add empty string item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['foo', '']);
      });

      it('should add empty string item on Add button click (x2)', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['foo', '', '']);
      });
    });
  });

  describe('object-based', () => {
    describe('(optional string item)', () => {
      const rosterPath = 'spec.obj.string.opt';

      it('should change item key on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$key');

        await userEvent.type(textInput, 'fizz');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foofizz: 'bar' });
      });

      it('should clear item key on text input clear', async () => {
        const keyTextInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$key');

        await userEvent.clear(keyTextInput);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ '': 'bar' });
      });

      it('should change item value on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$value');

        await userEvent.type(textInput, 'fizz');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foo: 'barfizz' });
      });

      it('should add null item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foo: 'bar', '': null });
      });

      it('should disable Add button when item with empty key is added', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        expect(addButton.disabled).toBeTruthy();
      });

      it('should not update resource when roster is in illegal state (duplicate key)', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        const keyTextInput = findTextFieldInput(findRosterItem(editor, rosterPath, 1), '$key');
        await userEvent.type(keyTextInput, 'foo');
        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);

        expect(resourceChangeHandler.mock.calls.length).toBe(3);
        expect(roster).toEqual({ foo: 'bar', fo: null });
      });

      it('should recover from illegal state (duplicate key) when duplicate key is edited', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        const keyTextInput = findTextFieldInput(findRosterItem(editor, rosterPath, 1), '$key');
        await userEvent.type(keyTextInput, 'foo2');

        expect(resourceChangeHandler.mock.calls.length).toBe(4);
        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foo: 'bar', foo2: null });
      });
    });

    describe('(required string item)', () => {
      const rosterPath = 'spec.obj.string.req';

      it('should change item key on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$key');

        await userEvent.type(textInput, 'fizz');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foofizz: 'bar' });
      });

      it('should clear item key on text input clear', async () => {
        const keyTextInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$key');

        await userEvent.clear(keyTextInput);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ '': 'bar' });
      });

      it('should change item value on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$value');

        await userEvent.type(textInput, 'fizz');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foo: 'barfizz' });
      });

      it('should add empty string item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foo: 'bar', '': '' });
      });

      it('should disable Add button when item with empty key is added', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        expect(addButton.disabled).toBeTruthy();
      });

      it('should not update resource when roster is in illegal state (duplicate key)', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        const keyTextInput = findTextFieldInput(findRosterItem(editor, rosterPath, 1), '$key');
        await userEvent.type(keyTextInput, 'foo');
        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);

        expect(resourceChangeHandler.mock.calls.length).toBe(3);
        expect(roster).toEqual({ foo: 'bar', fo: '' });
      });

      it('should recover from illegal state (duplicate key) when duplicate key is edited', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        const keyTextInput = findTextFieldInput(findRosterItem(editor, rosterPath, 1), '$key');
        await userEvent.type(keyTextInput, 'foo2');

        expect(resourceChangeHandler.mock.calls.length).toBe(4);
        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foo: 'bar', foo2: '' });
      });
    });
  });
});
