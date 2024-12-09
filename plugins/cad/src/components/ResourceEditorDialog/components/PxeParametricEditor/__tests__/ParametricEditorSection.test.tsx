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

// FIXME This test suite is probably obsolete.

// import { renderWithEffects } from '@backstage/test-utils';
// import { RenderResult } from '@testing-library/react';
// import React from 'react';
// import { PxeConfiguration } from '../types/PxeConfiguration.types';
// import { PxeConfigurationFactory } from '../configuration';
// import { PxeParametricEditor } from '../PxeParametricEditor';
// import { findSection, findSectionDescription } from './testUtils/findEditorElement';
//
// const { arrayTypeRoster, rowLayout, singleLineText, objectTypeRoster } = PxeConfigurationFactory;
//
// const CONFIGURATION: PxeConfiguration = {
//   topLevelProperties: ['spec'],
//   entries: [
//     section(
//       { name: 'Top section' },
//       singleLineText({ path: 'spec.valueA' }),
//       singleLineText({ path: 'spec.valueB' }),
//       rowLayout(singleLineText({ path: 'spec.valueC' }), singleLineText({ path: 'spec.valueD' })),
//       arrayTypeRoster({ name: 'Array contents', path: 'spec.roster1' }, singleLineText({ path: '$value' })),
//       objectTypeRoster(
//         { name: 'Object contents', path: 'spec.roster2' },
//         rowLayout(singleLineText({ path: '$key' }), singleLineText({ path: '$value' })),
//       ),
//       section(
//         { name: 'Nested section' },
//         singleLineText({ path: 'spec.valueE' }),
//         singleLineText({ path: 'spec.valueF' }),
//         rowLayout(singleLineText({ path: 'spec.valueG' }), singleLineText({ path: 'spec.valueH' })),
//       ),
//       section(
//         { name: 'Section with custom value name' },
//         singleLineText({ path: 'spec.valueI', name: 'custom value' }),
//       ),
//     ),
//   ],
// };
//
// const YAML = `
// spec:
//   valueA: foo1
//   valueB: bar1
//   valueC: fizz1
//   valueD: buzz1
//   valueE: foo2
//   valueF: bar2
//   valueG: fizz2
//   valueH: buzz2
//   valueI: foo3
//   roster1: []
//   roster2: {}
// `;
//
// describe('ParametricEditorSection', () => {
//   let editor: RenderResult;
//   let resourceChangeHandler: jest.Mock;
//
//   beforeEach(async () => {
//     resourceChangeHandler = jest.fn();
//
//     editor = await renderWithEffects(
//       <PxeParametricEditor configuration={CONFIGURATION} yamlText={YAML} onResourceChange={resourceChangeHandler} />,
//     );
//   });
//
//   it('should have description which includes direct children and in-layout descendant widgets', async () => {
//     const sectionDescription = findSectionDescription(findSection(editor, 'Top section'));
//
//     expect(sectionDescription.textContent).toBe('Value a: foo1, Value b: bar1, Value c: fizz1, Value d: buzz1');
//   });
//
//   it('should have description which includes direct children and in-layout descendant widgets (nested section)', async () => {
//     const sectionDescription = findSectionDescription(findSection(editor, 'Nested section'));
//
//     expect(sectionDescription.textContent).toBe('Value e: foo2, Value f: bar2, Value g: fizz2, Value h: buzz2');
//   });
//
//   it('should have description which includes customized value name', async () => {
//     const sectionDescription = findSectionDescription(findSection(editor, 'Section with custom value name'));
//
//     expect(sectionDescription.textContent).toBe('Custom value: foo3');
//   });
//
//   describe('(as implicit roster section)', () => {
//     it('should have description based on array-based roster item count', async () => {
//       const sectionDescription = findSectionDescription(findSection(editor, 'Array contents'));
//
//       expect(sectionDescription.textContent).toBe('0 Array contents');
//     });
//
//     it('should have description based on object-based roster item count', async () => {
//       const sectionDescription = findSectionDescription(findSection(editor, 'Object contents'));
//
//       expect(sectionDescription.textContent).toBe('0 Object contents');
//     });
//   });
// });
