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

import { cloneDeep } from 'lodash';
import {
  Condition,
  ConditionStatus,
  PackageRevision,
  PackageRevisionLifecycle,
  PackageRevisionSpec,
  PackageRevisionTask,
} from '../types/PackageRevision';
import { toLowerCase } from './string';

const getRevisionNumber = (revision: string, defaultNumber: number = NaN): number => {
  if (revision && revision.startsWith('v')) {
    const revisionNumber = parseInt(revision.substring(1), 10);

    if (Number.isInteger(revisionNumber)) {
      return revisionNumber;
    }
  }

  return defaultNumber;
};

const getNextRevision = (revision: string): string => {
  const revisionNumber = getRevisionNumber(revision, 0);

  return `v${revisionNumber + 1}`;
};

type UpstreamPackageRevisionDetails = {
  repositoryUrl: string;
  packageName: string;
  revision: string;
};

export const getUpstreamPackageRevisionDetails = (
  packageRevision: PackageRevision,
): UpstreamPackageRevisionDetails | undefined => {
  const upstreamLock = packageRevision.status?.upstreamLock;

  if (upstreamLock?.git) {
    const repositoryUrl = upstreamLock.git.repo;

    const upstreamRef = upstreamLock.git.ref;
    const separatorIdx = upstreamRef.lastIndexOf('/');

    if (separatorIdx > 0) {
      const packageName = upstreamRef.slice(0, separatorIdx);
      const revision = upstreamRef.slice(separatorIdx + 1);

      return { repositoryUrl, packageName, revision };
    }
  }

  return undefined;
};

export const isLatestPublishedRevision = (packageRevision: PackageRevision): boolean => {
  return (
    packageRevision.spec.lifecycle === PackageRevisionLifecycle.PUBLISHED &&
    !!packageRevision.metadata.labels?.['kpt.dev/latest-revision']
  );
};

export const findLatestPublishedRevision = (packageRevisions: PackageRevision[]): PackageRevision | undefined => {
  const latestPublishedRevision = packageRevisions.find(isLatestPublishedRevision);

  return latestPublishedRevision;
};

export const findPackageRevision = (
  packageRevisions: PackageRevision[],
  packageName: string,
  revision: string,
  repositoryName: string,
): PackageRevision | undefined => {
  return packageRevisions.find(
    packageRevision =>
      packageRevision.spec.repository === repositoryName &&
      packageRevision.spec.packageName === packageName &&
      packageRevision.spec.revision === revision,
  );
};

export const getPackageRevisionRevision = (packageRevision: PackageRevision): string => {
  return packageRevision.spec.revision || '';
};

export const isPublishedRevision = (packageRevision: PackageRevision): boolean => {
  return packageRevision.spec.lifecycle === PackageRevisionLifecycle.PUBLISHED;
};

export const getPackageRevisionTitle = (packageRevision: PackageRevision, packageNameOnly: boolean = false): string => {
  const { packageName, lifecycle, revision } = packageRevision.spec;

  if (packageNameOnly) {
    return packageName;
  }

  if (isPublishedRevision(packageRevision)) {
    return `${packageName} ${revision}`;
  }

  return `${packageName} ${toLowerCase(lifecycle)} revision`;
};

export const filterPackageRevisions = (
  packageRevisions: PackageRevision[],
  packageName: string,
  repositoryName: string,
): PackageRevision[] => {
  return packageRevisions.filter(
    packageRevision =>
      packageRevision.spec.packageName === packageName &&
      packageRevision.spec.repository === repositoryName &&
      (!isPublishedRevision(packageRevision) ||
        Number.isFinite(getRevisionNumber(packageRevision.spec.revision || ''))),
  );
};

export const getPackageRevision = (packageRevisions: PackageRevision[], fullPackageName: string): PackageRevision => {
  const packageRevision = packageRevisions.find(
    thisPackageRevision => thisPackageRevision.metadata.name === fullPackageName,
  );

  if (!packageRevision) {
    throw new Error(`Package revision ${fullPackageName} does not exist`);
  }

  return packageRevision;
};

export const canCloneRevision = (packageRevision: PackageRevision): boolean => {
  return isLatestPublishedRevision(packageRevision);
};

export const isNotAPublishedRevision = (packageRevision: PackageRevision): boolean => {
  return !isPublishedRevision(packageRevision);
};

export const getInitTask = (description: string, keywords: string, site: string): PackageRevisionTask => {
  const initTask: PackageRevisionTask = {
    type: 'init',
    init: {
      description: description ?? '',
      keywords: keywords ? keywords.split(',').map(keyword => keyword.trim()) : undefined,
      site: site || undefined,
    },
  };

  return initTask;
};

export const getCloneTask = (fullPackageName: string): PackageRevisionTask => {
  const cloneTask: PackageRevisionTask = {
    type: 'clone',
    clone: {
      upstreamRef: {
        upstreamRef: {
          name: fullPackageName,
        },
      },
    },
  };

  return cloneTask;
};

export const getUpdateTask = (fullUpstreamPackageName: string): PackageRevisionTask => {
  const updateTask: PackageRevisionTask = {
    type: 'update',
    update: {
      upstreamRef: {
        upstreamRef: {
          name: fullUpstreamPackageName,
        },
      },
    },
  };

  return updateTask;
};

export const getPackageRevisionResource = (
  repositoryName: string,
  packageName: string,
  workspaceName: string,
  lifecycle: PackageRevisionLifecycle,
  tasks: PackageRevisionTask[],
): PackageRevision => {
  const resource: PackageRevision = {
    apiVersion: 'porch.kpt.dev/v1alpha1',
    kind: 'PackageRevision',
    metadata: {
      name: '', // Porch will populate
    },
    spec: {
      packageName: packageName,
      workspaceName: workspaceName,
      repository: repositoryName,
      lifecycle: lifecycle,
      tasks: tasks,
    },
  };

  return resource;
};

export const getNextPackageRevisionResource = (currentRevision: PackageRevision): PackageRevision => {
  const { repository, packageName, tasks } = currentRevision.spec;
  const nextRevision = getNextRevision(getPackageRevisionRevision(currentRevision));

  const resource = getPackageRevisionResource(
    repository,
    packageName,
    nextRevision,
    PackageRevisionLifecycle.DRAFT,
    cloneDeep(tasks),
  );

  return resource;
};

export const getUpgradePackageRevisionResource = (
  currentRevision: PackageRevision,
  upgradePackageRevisionName: string,
): PackageRevision => {
  const { repository, packageName, tasks } = currentRevision.spec;
  const nextRevision = getNextRevision(getPackageRevisionRevision(currentRevision));

  const upgradePackageTasks = [...cloneDeep(tasks), getUpdateTask(upgradePackageRevisionName)];

  const resource = getPackageRevisionResource(
    repository,
    packageName,
    nextRevision,
    PackageRevisionLifecycle.DRAFT,
    upgradePackageTasks,
  );

  return resource;
};

export const sortByPackageNameAndRevisionComparison = (
  packageRevision1: PackageRevision,
  packageRevision2: PackageRevision,
): number => {
  const packageSpec1 = packageRevision1.spec;
  const packageSpec2 = packageRevision2.spec;

  const getRevisionNumberForCompare = (spec: PackageRevisionSpec): number => {
    return spec.revision ? getRevisionNumber(spec.revision, -1) : Infinity;
  };

  if (packageSpec1.packageName === packageSpec2.packageName) {
    return getRevisionNumberForCompare(packageSpec2) - getRevisionNumberForCompare(packageSpec1);
  }

  return packageSpec1.packageName > packageSpec2.packageName ? 1 : -1;
};

export const getPackageConditions = (packageRevision: PackageRevision): Condition[] => {
  if (!packageRevision.status) {
    throw new Error('Package revision status is undefined');
  }

  const readinessGates = packageRevision.spec.readinessGates ?? [];
  const conditions = packageRevision.status.conditions ?? [];

  const allConditions = cloneDeep(conditions);

  const readinessConditions = readinessGates.map(gate => gate.conditionType);
  const existingConditions = conditions.map(condition => condition.type);

  const missingReadinessConditions = readinessConditions.filter(type => !existingConditions.includes(type));
  missingReadinessConditions.forEach(type =>
    allConditions.push({
      type: type,
      status: ConditionStatus.UNKNOWN,
      reason: 'missing',
      message: 'condition exists as readiness gate however does not exist as status condition',
    }),
  );

  return allConditions;
};
