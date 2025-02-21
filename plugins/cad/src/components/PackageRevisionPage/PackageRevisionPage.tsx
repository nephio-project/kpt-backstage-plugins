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

import { Breadcrumbs, ContentHeader, Progress } from '@backstage/core-components';
import { errorApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { makeStyles, Typography } from '@material-ui/core';
import Alert, { Color } from '@material-ui/lab/Alert';
import { cloneDeep, uniq } from 'lodash';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { configAsDataApiRef } from '../../apis';
import { packageRouteRef } from '../../routes';
import { ConditionStatus, PackageRevision, PackageRevisionLifecycle } from '../../types/PackageRevision';
import { PackageRevisionResourcesMap, Result } from '../../types/PackageRevisionResource';
import { Repository } from '../../types/Repository';
import { RepositorySummary } from '../../types/RepositorySummary';
import { RootSync } from '../../types/RootSync';
import {
  findRootSyncForPackage,
  getRootSync,
  getRootSyncSecret,
  getSyncStatus,
  SyncStatus,
  SyncStatusState,
} from '../../utils/configSync';
import { isConfigSyncEnabled } from '../../utils/featureFlags';
import { getFunctionNameFromImage } from '../../utils/function';
import {
  filterPackageRevisions,
  findLatestPublishedRevision,
  findPackageRevision,
  getNextPackageRevisionResource,
  getPackageConditions,
  getPackageRevision,
  getPackageRevisionTitle,
  getUpgradePackageRevisionResource,
  getUpstreamPackageRevisionDetails,
  isLatestPublishedRevision,
  sortByPackageNameAndRevisionComparison,
} from '../../utils/packageRevision';
import { getPackageRevisionResources, getPackageRevisionResourcesResource } from '../../utils/packageRevisionResources';
import { getPackageSummaries, PackageSummary } from '../../utils/packageSummary';
import {
  findRepository,
  getPackageDescriptor,
  isDeploymentRepository,
  isReadOnlyRepository,
} from '../../utils/repository';
import { getRepositorySummaries, getRepositorySummary } from '../../utils/repositorySummary';
import { getRevisionSummary, RevisionSummary } from '../../utils/revisionSummary';
import { toLowerCase } from '../../utils/string';
import { Badge, ConfirmationDialog } from '../Controls';
import { Tabs } from '../Controls';
import { LandingPageLink, PackageLink, RepositoryLink } from '../Links';
import { AdvancedPackageRevisionOptions } from './components/AdvancedPackageRevisionOptions';
import { ConditionsTable } from './components/ConditionsTable';
import { PackageRevisionOptions, RevisionOption } from './components/PackageRevisionOptions';
import { PackageRevisionsTable } from './components/PackageRevisionsTable';
import { RelatedPackagesContent } from './components/RelatedPackagesContent';
import { RelatedTabContent } from './components/RelatedTabContent';
import { AlertMessage, ResourcesTabContent } from './components/ResourcesTabContent';
import { processUpdatedResourcesMap } from './updatedResourcesMap/processUpdatedResourcesMap';

export enum PackageRevisionPageMode {
  EDIT = 'edit',
  VIEW = 'view',
}

type PackageRevisionPageProps = {
  mode: PackageRevisionPageMode;
};

type RenderErrorMessage = {
  title: string;
  message: string;
};

const useStyles = makeStyles({
  packageRevisionOptions: {
    display: 'inherit',
    '& > *': {
      marginTop: 'auto',
      '&:not(:first-child)': {
        marginLeft: '10px',
      },
    },
  },
  syncStatusBanner: {
    padding: '2px 16px',
  },
  messageBanner: {
    whiteSpace: 'break-spaces',
    marginBottom: '16px',
  },
});

const getDownstreamUpgradesAvailableMessage = (
  downstreamPackagesPendingUpgrade: PackageSummary[],
  packageDescriptor: string,
): AlertMessage => {
  const packagesCount = downstreamPackagesPendingUpgrade.length;
  const descriptors = uniq(downstreamPackagesPendingUpgrade.map(downstream => downstream.packageDescriptor));
  const downstreamDescriptor =
    (descriptors.length === 1 ? toLowerCase(descriptors[0]) : 'package') + (packagesCount > 1 ? 's' : '');
  const need = packagesCount > 1 ? 'need' : 'needs';

  const packagesList = downstreamPackagesPendingUpgrade.map((downstreamPackage, index) => (
    <Fragment key={downstreamPackage.latestRevision.metadata.name}>
      <PackageLink packageRevision={downstreamPackage.latestPublishedRevision ?? downstreamPackage.latestRevision} />
      {index !== packagesCount - 1 && packagesCount > 2 && <Fragment>, </Fragment>}
      {index === packagesCount - 2 && <Fragment> and </Fragment>}
    </Fragment>
  ));

  const alertMessage: AlertMessage = {
    key: 'downstream-upgrades-available',
    message: (
      <Fragment>
        The {packagesList} {downstreamDescriptor} {need} to be upgraded to bring the {downstreamDescriptor} up to date
        with the latest changes in this {toLowerCase(packageDescriptor)}.
      </Fragment>
    ),
  };

  return alertMessage;
};

const getUpgradeAvailableMessage = (
  packageRevision: PackageRevision,
  latestRevision: PackageRevision,
  upstreamPackageSummary: PackageSummary,
): AlertMessage => {
  const upstreamRevision = upstreamPackageSummary.latestRevision;
  const upstreamDescriptor = toLowerCase(upstreamPackageSummary.packageDescriptor);

  const onLatestRevision = latestRevision === packageRevision;
  const isLatestRevisionUpgraded =
    getUpstreamPackageRevisionDetails(latestRevision)?.revision === upstreamRevision.spec.revision;

  const upgradeAvailableMessage = (
    <Fragment>
      The <PackageLink packageRevision={upstreamRevision} packageNameOnly /> upstream {upstreamDescriptor} has been
      upgraded.{' '}
      {onLatestRevision && (
        <Fragment>
          Use the 'Upgrade to Latest Blueprint' button to create a revision that pulls in changes from the upgraded{' '}
          {upstreamDescriptor}.
        </Fragment>
      )}
      {!onLatestRevision && isLatestRevisionUpgraded && (
        <Fragment>
          The latest <PackageLink packageRevision={latestRevision} /> already includes changes from the upgraded{' '}
          {upstreamDescriptor}.
        </Fragment>
      )}
      {!onLatestRevision && !isLatestRevisionUpgraded && (
        <Fragment>
          The latest <PackageLink packageRevision={latestRevision} /> does not include changes from the upgraded{' '}
          {upstreamDescriptor}. The revision must be either published or deleted before changes from the upgraded{' '}
          {upstreamDescriptor} can be pulled in.
        </Fragment>
      )}
    </Fragment>
  );

  const upgradeMessage: AlertMessage = {
    key: 'upgrade-available',
    message: upgradeAvailableMessage,
  };

  return upgradeMessage;
};

export const PackageRevisionPage = ({ mode }: PackageRevisionPageProps) => {
  const { repositoryName, packageName } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const api = useApi(configAsDataApiRef);
  const errorApi = useApi(errorApiRef);

  const packageRef = useRouteRef(packageRouteRef);

  const allRepositories = useRef<Repository[]>([]);
  const [repositorySummary, setRepositorySummary] = useState<RepositorySummary>();
  const [packageRevision, setPackageRevision] = useState<PackageRevision>();
  const [upstreamRepository, setUpstreamRepository] = useState<Repository>();
  const [upstreamRevisionSummary, setUpstreamRevisionSummary] = useState<RevisionSummary>();
  const [upstreamPackageSummary, setUpstreamPackageSummary] = useState<PackageSummary>();
  const [downstreamPackageSummaries, setDownstreamPackageSummaries] = useState<PackageSummary[]>([]);
  const [siblingPackageSummaries, setSiblingPackageSummaries] = useState<PackageSummary[]>([]);

  const [revisionSummaries, setRevisionSummaries] = useState<RevisionSummary[]>([]);
  const resourcesMapResourceVersion = useRef<string>('');
  const [resourcesMap, setResourcesMap] = useState<PackageRevisionResourcesMap>({});
  const [rootSync, setRootSync] = useState<RootSync | null>();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>();
  const [userInitiatedApiRequest, setUserInitiatedApiRequest] = useState<boolean>(false);

  const [openRestoreDialog, setOpenRestoreDialog] = useState<boolean>(false);
  const [isUpgradeAvailable, setIsUpgradeAvailable] = useState<boolean>(false);

  const [renderErrorMessages, setRenderErrorMessages] = useState<RenderErrorMessage[]>([]);

  const latestPublishedUpstream = useRef<PackageRevision>();

  const configSyncEnabled = isConfigSyncEnabled();

  const packageRevisions = useMemo(
    () => revisionSummaries.map(revisionSummary => revisionSummary.revision),
    [revisionSummaries],
  );

  const loadRepositorySummary = async (): Promise<void> => {
    const { items: thisAllRepositories } = await api.listRepositories();
    const repositorySummaries = getRepositorySummaries(thisAllRepositories);
    const thisRepositorySummary = await getRepositorySummary(repositorySummaries, repositoryName);

    allRepositories.current = thisAllRepositories;
    setRepositorySummary(thisRepositorySummary);
  };

  const loadPackageRevision = async (): Promise<void> => {
    const asyncPackageRevisions = api.listPackageRevisions();
    const asyncAllPackageResources = api.listPackageRevisionResources();

    const [thisPackageRevisions, { items: thisAllPackagesResources }] = await Promise.all([
      asyncPackageRevisions,
      asyncAllPackageResources,
    ]);

    const thisResources = getPackageRevisionResources(thisAllPackagesResources, packageName);

    const thisPackageRevision = getPackageRevision(thisPackageRevisions, packageName);

    const thisSortedRevisions = filterPackageRevisions(
      thisPackageRevisions,
      thisPackageRevision.spec.packageName,
      thisPackageRevision.spec.repository,
    ).sort(sortByPackageNameAndRevisionComparison);

    const thisRevisionSummaries: RevisionSummary[] = thisSortedRevisions.map(revision => {
      const revisionResourcesMap = getPackageRevisionResources(thisAllPackagesResources, revision.metadata.name).spec
        .resources;

      const revisionSummary = getRevisionSummary(revision, revisionResourcesMap);

      return revisionSummary;
    });

    setRevisionSummaries(thisRevisionSummaries);
    setPackageRevision(thisPackageRevision);
    setResourcesMap(thisResources.spec.resources);
    resourcesMapResourceVersion.current = thisResources.metadata.resourceVersion || '';

    let upgradeAvailable = false;
    let thisUpstreamRepository: Repository | undefined = undefined;
    let thisUpstreamRevisionSummary: RevisionSummary | undefined = undefined;

    const upstream = getUpstreamPackageRevisionDetails(thisPackageRevision);

    if (upstream) {
      thisUpstreamRepository = findRepository(allRepositories.current, {
        repositoryUrl: upstream.repositoryUrl,
      });

      if (thisUpstreamRepository) {
        const upstreamRepositoryName = thisUpstreamRepository.metadata.name;

        const upstreamPackageRevision = findPackageRevision(
          thisPackageRevisions,
          upstream.packageName,
          upstream.revision,
          upstreamRepositoryName,
        );

        if (upstreamPackageRevision) {
          if (isLatestPublishedRevision(thisPackageRevision)) {
            const allUpstreamRevisions = filterPackageRevisions(
              thisPackageRevisions,
              upstream.packageName,
              upstreamRepositoryName,
            );
            latestPublishedUpstream.current = findLatestPublishedRevision(allUpstreamRevisions);

            if (upstream.revision !== latestPublishedUpstream.current?.spec.revision) {
              upgradeAvailable = true;
            }
          }

          const upstreamResourcesMap = getPackageRevisionResources(
            thisAllPackagesResources,
            upstreamPackageRevision.metadata.name,
          ).spec.resources;

          thisUpstreamRevisionSummary = getRevisionSummary(upstreamPackageRevision, upstreamResourcesMap);
        }
      }
    }

    const allPackageSummaries = getPackageSummaries(
      thisPackageRevisions,
      getRepositorySummaries(allRepositories.current),
      allRepositories.current,
    );

    const downstreamPackages = allPackageSummaries.filter(
      summary =>
        summary.upstreamPackageName === thisPackageRevision.spec.packageName &&
        summary.upstreamRepositoryName === thisPackageRevision.spec.repository,
    );

    const upstreamPackage = allPackageSummaries.find(
      summary =>
        !!thisUpstreamRevisionSummary &&
        summary.latestRevision.spec.packageName === thisUpstreamRevisionSummary.revision.spec.packageName &&
        summary.latestRevision.spec.repository === thisUpstreamRevisionSummary.revision.spec.repository,
    );

    const siblingPackages = allPackageSummaries.filter(
      summary =>
        !!thisUpstreamRevisionSummary &&
        summary.upstreamPackageName === thisUpstreamRevisionSummary.revision.spec.packageName &&
        summary.upstreamRepositoryName === thisUpstreamRevisionSummary.revision.spec.repository &&
        !(
          summary.latestRevision.spec.packageName === thisPackageRevision.spec.packageName &&
          summary.latestRevision.spec.repository === thisPackageRevision.spec.repository
        ),
    );

    setDownstreamPackageSummaries(downstreamPackages);
    setSiblingPackageSummaries(siblingPackages);
    setUpstreamPackageSummary(upstreamPackage);

    setUpstreamRevisionSummary(thisUpstreamRevisionSummary);
    setUpstreamRepository(thisUpstreamRepository);
    setIsUpgradeAvailable(upgradeAvailable);
  };

  const { loading, error } = useAsync(
    async () => Promise.all([loadRepositorySummary(), loadPackageRevision()]),
    [repositoryName, packageName, mode],
  );

  const isLatestPublishedPackageRevision = packageRevision && isLatestPublishedRevision(packageRevision);
  const isDeploymentPackage = repositorySummary && isDeploymentRepository(repositorySummary.repository);

  useAsync(async () => {
    if (!loading && packageRevision && repositorySummary) {
      if (isLatestPublishedPackageRevision && isDeploymentPackage && configSyncEnabled) {
        const { items: allRootSyncs } = await api.listRootSyncs();

        const thisRootSync = findRootSyncForPackage(allRootSyncs, packageRevision, repositorySummary.repository);

        setRootSync(thisRootSync ?? null);
      } else {
        setRootSync(undefined);
      }
    }
  }, [loading, packageRevision, repositorySummary]);

  useEffect(() => {
    if (rootSync) {
      const refreshRootSync = async (): Promise<void> => {
        const latestRootSync = await api.getRootSync(rootSync.metadata.name);
        setRootSync(latestRootSync);
      };

      const refreshSeconds = rootSync.status ? 5 : 1;
      const refreshTimeout = setTimeout(() => refreshRootSync(), refreshSeconds * 1000);

      return () => {
        clearTimeout(refreshTimeout);
      };
    }

    return undefined;
  }, [api, rootSync]);

  useEffect((): void => {
    if (rootSync && rootSync.status) {
      const thisSyncStatus = getSyncStatus(rootSync.status);
      setSyncStatus(thisSyncStatus);
    } else {
      setSyncStatus(undefined);
    }
  }, [rootSync]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!repositorySummary || !packageRevision || !revisionSummaries) {
    return <Alert severity="error">Unexpected undefined value</Alert>;
  }

  const repository = repositorySummary.repository;
  const packageDescriptor = getPackageDescriptor(repository);
  const packageRevisionTitle = getPackageRevisionTitle(packageRevision);

  const rejectProposedPackage = async (): Promise<void> => {
    const targetPackageRevision = cloneDeep(packageRevision);
    targetPackageRevision.spec.lifecycle = PackageRevisionLifecycle.DRAFT;

    await api.replacePackageRevision(targetPackageRevision);

    await loadPackageRevision();
  };

  const moveToProposed = async (): Promise<void> => {
    const targetPackageRevision = cloneDeep(packageRevision);
    targetPackageRevision.spec.lifecycle = PackageRevisionLifecycle.PROPOSED;

    await api.replacePackageRevision(targetPackageRevision);

    await loadPackageRevision();
  };

  const updateRootSyncToLatestPackage = async (thisPackageRevision: PackageRevision): Promise<void> => {
    const { items: allRootSyncs } = await api.listRootSyncs();

    const previousRootSync = findRootSyncForPackage(allRootSyncs, packageRevision, repositorySummary.repository, false);

    if (previousRootSync) {
      const newRootSync = getRootSync(repository, thisPackageRevision, previousRootSync.spec.git?.secretRef?.name);

      await api.deleteRootSync(previousRootSync.metadata.name);
      await api.createRootSync(newRootSync);
    }
  };

  const approveProposedPackage = async (): Promise<void> => {
    setUserInitiatedApiRequest(true);

    try {
      const targetRevision = cloneDeep(packageRevision);
      targetRevision.spec.lifecycle = PackageRevisionLifecycle.PUBLISHED;

      const approvedRevision = await api.approvePackageRevision(targetRevision);

      if (isDeploymentPackage && configSyncEnabled) {
        await updateRootSyncToLatestPackage(approvedRevision);
      }

      await loadPackageRevision();
    } finally {
      setUserInitiatedApiRequest(false);
    }
  };

  const createSync = async (): Promise<void> => {
    const repoSecretName = repositorySummary.repository.spec.git?.secretRef?.name;

    if (repoSecretName) {
      const baseName = packageRevision.spec.packageName;
      const newSecretName = `${baseName}-sync`;

      const repoSecret = await api.getSecret(repoSecretName);

      const syncSecret = await getRootSyncSecret(newSecretName, repoSecret);
      const createdSyncSecret = await api.createSecret(syncSecret);

      const rootSyncResource = getRootSync(
        repositorySummary.repository,
        packageRevision,
        createdSyncSecret.metadata.name,
      );

      const newRootSync = await api.createRootSync(rootSyncResource);

      setRootSync(newRootSync);
    }
  };

  const createUpgradeRevision = async (): Promise<void> => {
    if (!latestPublishedUpstream.current) {
      throw new Error('The latest published upstream package is not defined');
    }

    const blueprintPackageRevisionName = latestPublishedUpstream.current.metadata.name;

    const requestPackageRevision = getUpgradePackageRevisionResource(packageRevision, blueprintPackageRevisionName);

    const newPackageRevision = await api.createPackageRevision(requestPackageRevision);
    const newPackageName = newPackageRevision.metadata.name;

    navigate(packageRef({ repositoryName, packageName: newPackageName }));
  };

  const createNewRevision = async (): Promise<void> => {
    const requestPackageRevision = getNextPackageRevisionResource(packageRevision);

    const newPackageRevision = await api.createPackageRevision(requestPackageRevision);
    const newPackageName = newPackageRevision.metadata.name;

    navigate(packageRef({ repositoryName, packageName: newPackageName }));
  };

  const createRestoreRevision = async (): Promise<void> => {
    setUserInitiatedApiRequest(true);

    try {
      const latestPublishedRevision = findLatestPublishedRevision(packageRevisions) as PackageRevision;
      const latestRevision = packageRevisions[0];

      if (latestPublishedRevision !== latestRevision) {
        throw new Error(
          'Unable to create a new revision since an unpublished revision already exists for this package.',
        );
      }

      const createNextRevision = async (): Promise<string> => {
        const requestPackageRevision = getNextPackageRevisionResource(latestPublishedRevision);

        const newPackageRevision = await api.createPackageRevision(requestPackageRevision);

        return newPackageRevision.metadata.name;
      };

      const replaceRevisionsResources = async (thisPackageName: string): Promise<void> => {
        const packageRevisionResources = getPackageRevisionResourcesResource(
          thisPackageName,
          resourcesMap,
          resourcesMapResourceVersion.current,
        );

        await api.replacePackageRevisionResources(packageRevisionResources);
      };

      const newPackageName = await createNextRevision();
      await replaceRevisionsResources(newPackageName);

      navigate(packageRef({ repositoryName, packageName: newPackageName }));
    } finally {
      setUserInitiatedApiRequest(false);
      setOpenRestoreDialog(false);
    }
  };

  const getPackageLifecycleDescription = (): JSX.Element | null => {
    if (packageRevision.spec.lifecycle !== PackageRevisionLifecycle.PUBLISHED) {
      return (
        <div>
          {packageRevision.spec.lifecycle} {packageDescriptor}
        </div>
      );
    }

    return null;
  };

  const getCurrentSyncStatus = (): JSX.Element | null => {
    if (syncStatus) {
      const getAlertSeverity = (thisSyncStatus: SyncStatus): Color => {
        switch (thisSyncStatus.state) {
          case SyncStatusState.ERROR:
          case SyncStatusState.STALLED:
            return 'error';
          case SyncStatusState.RECONCILING:
          case SyncStatusState.PENDING:
            return 'info';
          case SyncStatusState.SYNCED:
            return 'success';
          default:
            return 'error';
        }
      };

      const statusSeverity = getAlertSeverity(syncStatus);

      return (
        <Alert key="sync-status" severity={statusSeverity} className={classes.syncStatusBanner}>
          {syncStatus.state}
        </Alert>
      );
    }

    if (rootSync) {
      return (
        <Alert key="sync-status" severity="warning" className={classes.syncStatusBanner}>
          No Status
        </Alert>
      );
    }

    return null;
  };

  const savePackageRevision = async (): Promise<void> => {
    const packageRevisionResources = getPackageRevisionResourcesResource(
      packageName,
      resourcesMap,
      resourcesMapResourceVersion.current,
    );

    const resourcesResponse = await api.replacePackageRevisionResources(packageRevisionResources);
    const resourcesResponseStatus = resourcesResponse.status;

    const renderErrors: RenderErrorMessage[] = [];

    if (resourcesResponseStatus) {
      const functionResults: Result[] = resourcesResponseStatus.renderStatus?.result.items || [];

      for (const fn of functionResults) {
        if (fn.results) {
          const fnResults = fn.results.filter(result => result.severity === 'error');
          renderErrors.push(
            ...fnResults.map(r => ({
              title: `${getFunctionNameFromImage(fn.image)} function`,
              message: r.message,
              severity: r.severity,
            })),
          );
        }
      }

      if (renderErrors.length === 0) {
        const renderError = resourcesResponseStatus.renderStatus?.error;

        if (renderError) {
          renderErrors.push({
            title: 'rendering error',
            message: renderError,
          });
        }
      }
    }

    setRenderErrorMessages(renderErrors);

    const anyRenderingErrors = renderErrors.length > 0;

    if (anyRenderingErrors) {
      errorApi.post(
        new Error(`Porch is unable to render the package. Please correct any errors and resave the package.`),
      );
    } else {
      navigate(packageRef({ repositoryName, packageName }));
    }
  };

  const handleUpdatedResourcesMap = async (latestResources: PackageRevisionResourcesMap): Promise<void> => {
    const updatedResources = await processUpdatedResourcesMap(api, resourcesMap, latestResources);

    setResourcesMap(updatedResources);
  };

  const executeUserInitiatedApiRequest = async (apiRequest: () => Promise<void>): Promise<void> => {
    setUserInitiatedApiRequest(true);

    try {
      await apiRequest();
    } finally {
      setUserInitiatedApiRequest(false);
    }
  };

  const onRevisionOptionClick = async (option: RevisionOption): Promise<void> => {
    switch (option) {
      case RevisionOption.CREATE_NEW_REVISION:
        await executeUserInitiatedApiRequest(createNewRevision);
        break;

      case RevisionOption.SAVE_REVISION:
        await executeUserInitiatedApiRequest(savePackageRevision);
        break;

      case RevisionOption.PROPOSE_REVISION:
        await executeUserInitiatedApiRequest(moveToProposed);
        break;

      case RevisionOption.REJECT_PROPOSED_REVISION:
        await executeUserInitiatedApiRequest(rejectProposedPackage);
        break;

      case RevisionOption.APPROVE_PROPOSED_REVISION:
        await executeUserInitiatedApiRequest(approveProposedPackage);
        break;

      case RevisionOption.CREATE_UPGRADE_REVISION:
        await executeUserInitiatedApiRequest(createUpgradeRevision);
        break;

      case RevisionOption.RESTORE_REVISION:
        setOpenRestoreDialog(true);
        break;

      case RevisionOption.CREATE_SYNC:
        await executeUserInitiatedApiRequest(createSync);
        break;

      default:
        throw new Error(`Unexpected option, '${option}'`);
    }
  };

  const isViewMode = mode === PackageRevisionPageMode.VIEW;

  const alertMessages: AlertMessage[] = [];

  if (isReadOnlyRepository(repository)) {
    alertMessages.push({
      key: 'read-only',
      message: (
        <Fragment>
          This {toLowerCase(packageDescriptor)} is read-only since this {toLowerCase(packageDescriptor)} exists in a
          read-only repository.
        </Fragment>
      ),
    });
  }

  if (isUpgradeAvailable) {
    if (!upstreamPackageSummary) {
      throw new Error('The upstream package summary is not defined');
    }

    alertMessages.push(getUpgradeAvailableMessage(packageRevision, packageRevisions[0], upstreamPackageSummary));
  }

  if (isLatestPublishedPackageRevision) {
    const downstreamPackagesPendingUpgrade = downstreamPackageSummaries.filter(summary => summary.isUpgradeAvailable);

    if (downstreamPackagesPendingUpgrade.length > 0) {
      alertMessages.push(getDownstreamUpgradesAvailableMessage(downstreamPackagesPendingUpgrade, packageDescriptor));
    }
  }

  const showDownstreamPackages = !isDeploymentPackage || downstreamPackageSummaries.length > 0;

  const packageConditions = getPackageConditions(packageRevision);
  const incompleteConditions = packageConditions.filter(c => c.status !== ConditionStatus.TRUE).length;

  return (
    <div>
      <Breadcrumbs>
        <LandingPageLink breadcrumb />
        <RepositoryLink repository={repository} breadcrumb />
        {isViewMode && <Typography>{packageRevisionTitle}</Typography>}
        {!isViewMode && <PackageLink packageRevision={packageRevision} breadcrumb />}
        {!isViewMode && <Typography>Edit</Typography>}
      </Breadcrumbs>

      <ContentHeader title={packageRevisionTitle}>
        <div className={classes.packageRevisionOptions}>
          <RelatedPackagesContent
            upstreamRepository={upstreamRepository}
            upstreamPackageRevision={upstreamRevisionSummary?.revision}
            downstreamPackages={downstreamPackageSummaries}
            showDownstream={showDownstreamPackages}
          />

          {getPackageLifecycleDescription()}

          {getCurrentSyncStatus()}

          <PackageRevisionOptions
            repositorySummary={repositorySummary}
            mode={mode}
            packageRevision={packageRevision}
            packageRevisions={packageRevisions}
            isUpgradeAvailable={isUpgradeAvailable}
            rootSync={rootSync}
            onClick={onRevisionOptionClick}
            disabled={userInitiatedApiRequest}
          />
        </div>
      </ContentHeader>

      <Fragment>
        {syncStatus?.errors?.map((syncError: string) => (
          <Alert severity="error" className={classes.messageBanner}>
            {syncError}
          </Alert>
        ))}
      </Fragment>

      <Fragment>
        {renderErrorMessages.map((message: RenderErrorMessage) => (
          <Alert key={message.message} severity="error" className={classes.messageBanner}>
            {message.title}: {message.message}
          </Alert>
        ))}
      </Fragment>

      <ConfirmationDialog
        open={openRestoreDialog}
        onClose={() => setOpenRestoreDialog(false)}
        title="Restore Revision"
        contentText={`Create new revision to restore ${packageRevision.spec.packageName} to revision ${packageRevision.spec.revision}?`}
        actionText="Create Revision"
        onAction={() => executeUserInitiatedApiRequest(createRestoreRevision)}
      />

      <Tabs
        tabs={[
          {
            label: 'Resources',
            content: (
              <ResourcesTabContent
                packageName={packageName}
                resourcesMap={resourcesMap}
                revisions={revisionSummaries}
                onUpdatedResourcesMap={handleUpdatedResourcesMap}
                mode={mode}
                upstreamRevision={upstreamRevisionSummary}
                alertMessages={alertMessages}
              />
            ),
          },
          {
            icon: <Badge badgeContent={incompleteConditions}>Conditions</Badge>,
            content: <ConditionsTable conditions={packageConditions} />,
          },
          {
            label: 'Revisions',
            content: (
              <PackageRevisionsTable
                repository={repositorySummary.repository}
                currentRevision={packageRevision}
                revisions={revisionSummaries ?? []}
              />
            ),
          },
          {
            label: 'Related',
            content: (
              <RelatedTabContent
                packageDescriptor={packageDescriptor}
                upstreamPackage={upstreamPackageSummary}
                siblingPackages={siblingPackageSummaries}
                downstreamPackages={downstreamPackageSummaries}
              />
            ),
          },
          {
            label: 'Advanced',
            content: (
              <AdvancedPackageRevisionOptions repository={repository} packageName={packageName} rootSync={rootSync} />
            ),
          },
        ]}
      />
    </div>
  );
};
