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
  entries: [
    arrayTypeRoster(
      { path: 'spec.arr.string.opt.nonEmpty', name: 'Test' },
      singleLineText({ path: '$value', isRequired: false }),
    ),
    arrayTypeRoster(
      { path: 'spec.arr.string.opt.empty', name: 'Test' },
      singleLineText({ path: '$value', isRequired: false }),
    ),
    arrayTypeRoster(
      { path: 'spec.arr.string.req.nonEmpty', name: 'Test' },
      singleLineText({ path: '$value', isRequired: true }),
    ),
    arrayTypeRoster(
      { path: 'spec.arr.string.req.empty', name: 'Test' },
      singleLineText({ path: '$value', isRequired: true }),
    ),
    objectTypeRoster(
      { path: 'spec.obj.string.opt.nonEmpty', name: 'Test' },
      rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: false })),
    ),
    objectTypeRoster(
      { path: 'spec.obj.string.opt.empty', name: 'Test' },
      rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: false })),
    ),
    objectTypeRoster(
      { path: 'spec.obj.string.req.nonEmpty', name: 'Test' },
      rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: true })),
    ),
    objectTypeRoster(
      { path: 'spec.obj.string.req.empty', name: 'Test' },
      rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value', isRequired: true })),
    ),
  ],
};

const YAML = `
spec:
  arr:
    string:
      opt:
        nonEmpty: ['foo']
        empty: []
      req:
        nonEmpty: ['foo']
        empty: []
  obj:
    string:
      opt:
        nonEmpty: { foo: 'bar' }
        empty: {}
      req:
        nonEmpty: { foo: 'bar' }
        empty: {}
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
    describe('(optional string item, initially non-empty)', () => {
      const rosterPath = 'spec.arr.string.opt.nonEmpty';

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

    describe('(optional string item, initially empty)', () => {
      const rosterPath = 'spec.arr.string.opt.empty';

      it('should add null item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual([null]);
      });

      it('should add null item on Add button click (x2)', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual([null, null]);
      });
    });

    describe('(required string item, initially non-empty)', () => {
      const rosterPath = 'spec.arr.string.req.nonEmpty';

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

    describe('(required string item, initially empty)', () => {
      const rosterPath = 'spec.arr.string.req.empty';

      it('should add empty string item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['']);
      });

      it('should add empty string item on Add button click (x2)', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);
        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual(['', '']);
      });
    });
  });

  describe('object-based', () => {
    describe('(optional string item, initially non-empty)', () => {
      const rosterPath = 'spec.obj.string.opt.nonEmpty';

      it('should change item key on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$key');

        await userEvent.type(textInput, 'fizz');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foofizz: 'bar' });
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
    });

    describe('(optional string item, initially empty)', () => {
      const rosterPath = 'spec.obj.string.opt.empty';

      it('should add null item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ '': null });
      });

      it('should disable Add button when item with empty key is added', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        expect(addButton.disabled).toBeTruthy();
      });
    });

    describe('(required string item, initially non-empty)', () => {
      const rosterPath = 'spec.obj.string.req.nonEmpty';

      it('should change item key on text input', async () => {
        const textInput = findTextFieldInput(findRosterItem(editor, rosterPath, 0), '$key');

        await userEvent.type(textInput, 'fizz');

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ foofizz: 'bar' });
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
    });

    describe('(required string item, initially empty)', () => {
      const rosterPath = 'spec.obj.string.req.empty';

      it('should add empty string item on Add button click', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        const roster = get(getLastResourceState(resourceChangeHandler), rosterPath);
        expect(roster).toEqual({ '': '' });
      });

      it('should disable Add button when item with empty key is added', async () => {
        const addButton = findRosterAddButton(editor, rosterPath);

        await userEvent.click(addButton);

        expect(addButton.disabled).toBeTruthy();
      });
    });
  });
});
