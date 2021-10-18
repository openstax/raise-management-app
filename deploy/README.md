# RAISE Management Application deployment

## Overview

This application is deployed using Kubernetes. The deployment is automated via [CodePipeline](https://docs.aws.amazon.com/codepipeline). This directory includes all deployment related configuration files used for the application, with the exception of the AWS infrastructure resource definitions which live with the rest of the k12 IaC code. The subdirectories include:

* `buildspec/` - [CodeBuild](https://docs.aws.amazon.com/codebuild) buildspec files used in pipeline stages
* `k8s/` - Kubernetes resource definitions

In some cases, there is a coupling between these two whereby values in the Kubernetes resource definitions are patched during pipeline execution using [`yq`](https://mikefarah.gitbook.io/yq/). By convention, to make it easier to see which values are managed in this manner, the base definitions use `REPLACED_IN_PIPELINE`. If you need to deploy manually to a k8s cluster (either on AWS or a local [minikube](https://minikube.sigs.k8s.io/docs/)), you should modify these values locally before running `kubectl apply -R -f k8s` from this directory.

This use of `yq` as a mechanism to patch resource definitions is intended to be used sparingly and should be limited to:

* Secrets - The "source of truth" for our secrets is typically AWS SecretsManager. When deploying required secrets into k8s, we use the `buildspec` to pass / inject secrets automatically from SecretsManager into the cluster.

* Dynamic values - Some variables are only determined during the context of a pipeline run (e.g. a Docker image tag), and we use the `buildspec` to splice those values in automatically.

* Environment specific values where ConfigMaps don't apply - A current example of this is keeping `IngressRoute` definitions DRY since the matcher will vary depending upon the environment.

In general, we should try to utilize k8s native alternatives such as [ConfigMaps](https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/config-map-v1/) whenever possible.

## References

* [Build specification reference for CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)
* [Kubernetes API](https://kubernetes.io/docs/reference/kubernetes-api/)
