/**
 * Copyright 2022 Google LLC
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

import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import React from 'react';
import { packageRouteRef } from '../../routes';
import { PackageRevision } from '../../types/PackageRevision';
import { getPackageRevisionTitle } from '../../utils/packageRevision';
import { useLinkStyles } from './styles';

type PackageLinkProps = {
  packageRevision: PackageRevision;
  breadcrumb?: boolean;
  packageNameOnly?: boolean;
  stopPropagation?: boolean;
};

export const PackageLink = ({ packageRevision, breadcrumb, packageNameOnly, stopPropagation }: PackageLinkProps) => {
  const packageRef = useRouteRef(packageRouteRef);

  const classes = useLinkStyles();
  const className = breadcrumb ? classes.breadcrumb : '';

  const repositoryName = packageRevision.spec.repository;
  const packageName = packageRevision.metadata.name;

  return (
    <Link
      className={className}
      onClick={e => {
        if (stopPropagation) {
          e.stopPropagation();
        }
      }}
      to={packageRef({ repositoryName, packageName })}
    >
      {getPackageRevisionTitle(packageRevision, !!packageNameOnly)}
    </Link>
  );
};
