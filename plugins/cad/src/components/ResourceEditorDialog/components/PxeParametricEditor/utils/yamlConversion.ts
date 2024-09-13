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

import { dump, load } from 'js-yaml';

export const parseYaml = <T extends object>(
  yamlText: string,
): { yamlObject: T } => ({
  yamlObject: load(yamlText) as T,
});

export const stringifyYaml = <T extends object>(yamlObject: T): string =>
  dump(yamlObject, {
    // TODO The fact of hard-setting of formatting options leads to multiple changes in the editor output.
    // Solution probably requires switching to "yaml" package.
    noArrayIndent: true,
    quotingType: '"',
  });
