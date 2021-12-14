# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.203.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
RUN su node -c "npm install -g expo-cli eas-cli"

# RUN su node -c "npm install"
# RUN su node -c "npm install -g express-generator"
# RUN npm build

# EXPOSE 3000

# CMD [ "pm2-runtime", "start", "lib/app.js", "-i", "max" ]


# FROM python:3.5-alpine

# # which version of the AWS EB CLI to install.
# # https://pypi.python.org/pypi/awsebcli/
# ARG AWS_EB_CLI_VERSION="3.10.1"

# ENV PIP_DISABLE_PIP_VERSION_CHECK=true

# RUN \
#   pip install awsebcli==${AWS_EB_CLI_VERSION} && \
#   mkdir -p "${HOME}/.aws"

# ARG VARIANT_PYTHON="3-bullseye"
# FROM mcr.microsoft.com/vscode/devcontainers/python:${VARIANT_PYTHON}