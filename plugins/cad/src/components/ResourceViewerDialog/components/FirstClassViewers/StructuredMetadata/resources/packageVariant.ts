/**
 * Copyright 2023 The Nephio Authors.
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

import { KubernetesResource } from '../../../../../../types/KubernetesResource';
import { PackageVariant } from '../../../../../../types/PackageVariant';
import { Metadata } from '../StructuredMetadata';
import { getKptFunctionDescription } from './kptfile';

const getValue = (fieldValue: any): string => {
  if (typeof fieldValue === 'boolean') {
    return fieldValue ? 'true' : 'false';
  }
  return fieldValue;
};

const setContextdata = (contextdata: Metadata, resourceField: any, fieldName: string): void => {
  if (Array.isArray(resourceField)) {
    const isArrayFieldObject = typeof resourceField[0] === 'object';

    if (isArrayFieldObject) {
      const manyInstances = resourceField.length > 1;

      for (const [idx, oneValue] of resourceField.entries()) {
        const arrayFieldName = `${fieldName}${manyInstances ? idx + 1 : ''}`;
        setContextdata(contextdata, oneValue, arrayFieldName);
      }
    } else {
      contextdata[fieldName] = resourceField.map(getValue).join(', ');
    }
  } else if (typeof resourceField === 'object') {
    const objFields = Object.keys(resourceField);

    for (const field of objFields) {
      const newFieldName = `${fieldName}/${field}`;
      setContextdata(contextdata, resourceField[field], newFieldName);
    }
  } else {
    contextdata[fieldName] = getValue(resourceField);
  }
};

export const getPackageVariantStructuredMetadata = (resource: KubernetesResource): Metadata => {
  const packageVariant = resource as PackageVariant;

  const contextdata: Metadata = {};
  setContextdata(contextdata, packageVariant.spec.packageContext, 'packageContext');

  const customMetadata: Metadata = {
    variantLabels: getValue(packageVariant.spec.labels),
    variantAnnotations: getValue(packageVariant.spec.annotations),
    upstream: packageVariant.spec.upstream
      ? `${packageVariant.spec.upstream.repo}/${packageVariant.spec.upstream.package}@${packageVariant.spec.upstream?.revision}`
      : '',
    downstream: packageVariant.spec.downstream
      ? `${packageVariant.spec.downstream.repo}/${packageVariant.spec.downstream.package}`
      : '',
    packageContext: '',
    adoptionPolicy: packageVariant.spec.adoptionPolicy,
    deletionPolicy: packageVariant.spec.deletionPolicy,
    mutators: packageVariant.spec.pipeline?.mutators?.map(getKptFunctionDescription),
    validators: packageVariant.spec.pipeline?.validators?.map(getKptFunctionDescription),
    injectors: packageVariant.spec.injectors
      ? `${packageVariant.spec.injectors.group}/${packageVariant.spec.injectors.version}/${packageVariant.spec.injectors.kind}@${packageVariant.spec.injectors?.name}`
      : '',
  };

  for (const thisKey of Object.keys(contextdata)) {
    const isPrefix = thisKey.includes('/');
    const thisKeyName = isPrefix ? thisKey.slice(0, thisKey.indexOf('/')) : thisKey;

    if (!customMetadata[thisKeyName]) {
      customMetadata[thisKeyName] = [];
    }

    const fieldKey = thisKey.slice(thisKeyName.length + 1);
    customMetadata[thisKeyName].push(isPrefix ? `${fieldKey}: ${contextdata[thisKey]}` : contextdata[thisKey]);
  }
  return customMetadata;
};
