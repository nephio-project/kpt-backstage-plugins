# Configuration as Data Backend Plugin

Welcome to the Configuration as Data backend plugin!

## Installation

### Adding the plugin

Navigate to `packages/backend` of your Backstage app, and install the
`@kpt/backstage-plugin-cad-backend` package.

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @kpt/backstage-plugin-cad-backend
```

Next, you'll need to add the plugin to the router in your `backend` package. You
can do this by creating a file called `packages/backend/src/plugins/cad.ts`

```tsx
import { createRouter } from '@kpt/backstage-plugin-cad-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
  });
}
```

With the `cad.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```ts
import cad from './plugins/cad';
// ...

async function main() {
  // ...
  const cadEnv = useHotMemoize(module, () => createEnv('cad'));

  // ...
  apiRouter.use('/config-as-data', await cad(cadEnv));
```

### Configuration

The following configuration will need to be added to `app-config.yaml`:

```yaml
configAsData:
  # The namespace where Porch managed resources live.
  resourcesNamespace: default

  # Determines the GitOps delivery tool to use.
  gitOpsDeliveryTool: config-sync

  # Optional. Determines the maximum http request body size.
  maxRequestSize: 1mb

  clusterLocatorMethod:
    # Determines how the client will locate the Kubernetes cluster.
    type: current-context

    # Determines how the client will authenticate with the Kubernetes cluster.
    authProvider: current-context

    # Optional. Determines the OIDC token provider to use when using the 'oidc' auth provider.
    oidcTokenProvider: okta

    # Optional. The service account token to be used when using the 'service-account' auth provider.
    serviceAccountToken: ${CAD_SERVICE_ACCOUNT_TOKEN}
```

`resourcesNamespace` defines the namespace where Porch managed resources live

`gitOpsDeliveryTool` determines what tool to use for GitOps

`maxRequestSize` determines the maximum http request body size. Default is 1mb.
HTTP Status Code 413 will be returned for any requests exceeding this size.

Valid values:
| Values | Description |
| ------ | ----------- |
| none | Use no GitOps delivery tool |
| config-sync | Use [Config Sync](https://github.com/GoogleContainerTools/kpt-config-sync). Config Sync must be installed on the cluster. |

`clusterLocatorMethod` determines where to receive the cluster configuration
from

`clusterLocatorMethod.type` determines how the cluster will be located

Valid values:
| Values | Description |
| ------ | ----------- |
| current-context | Connect to the cluster as defined by the kubeconfig current context |
| in-cluster | Connect to the same cluster that Backstage is running in |

`clusterLocatorMethod.authProvider` determines how the client will authenticate
with the cluster.

Valid values:
| Values | Description |
| ------ | ----------- |
| current-context | Authenticate to the cluster with the user in the kubeconfig current context |
| google | Authenticate to the cluster using the user's access token token from the [Google auth provider](https://backstage.io/docs/auth/google/provider) |
| oidc | Authenticate to the cluster using OIDC (OpenID Connect) |
| service-account | Authenticate to the cluster using a Kubernetes service account token |

`clusterLocatorMethod.oidcTokenProvider` determines which configured [Backstage auth provider](https://backstage.io/docs/auth/) to
use to authenticate to the cluster with. This field is required with the `oidc` auth provider.

Valid values:
| Values | Description |
| ------ | ----------- |
| google | Authenticate to the cluster with the [Google auth provider](https://backstage.io/docs/auth/google/provider) |
| okta | Authenticate to the cluster with the [Okta auth provider](https://backstage.io/docs/auth/okta/provider) |

`clusterLocatorMethod.serviceAccountToken` defines the service account token to be used with the `service-account` auth provider. You can get the service account token with the following command:

```bash
kubectl -n <NAMESPACE> get secret $(kubectl -n <NAMESPACE> get sa <SERVICE_ACCOUNT_NAME> -o=json \
  | jq -r '.secrets[0].name') -o=json \
  | jq -r '.data["token"]' \
  | base64 --decode
```
