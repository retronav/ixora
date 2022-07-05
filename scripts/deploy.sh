#!/bin/bash -ex

export DEPLOYMENT_BRANCH="pages"
export DEPLOYMENT_DIR="dist"

if [[ ! -z $CI ]]; then
    mkdir -p ~/.ssh
    echo $GIT_SSH_KEY >> ~/.ssh/id_rsa
    git config --global "user.name" "codeberg-ci"
    git config --global "user.email" "noreply@noreply.codeberg.org"
fi

cd www/

mkdir /tmp/pages.git
rsync -av $DEPLOYMENT_DIR/* /tmp/pages.git/

cd /tmp/pages.git/
git init
git remote add origin https://retronav:$CODEBERG_TOKEN@codeberg.org/retronav/ixora.git
git checkout --orphan $DEPLOYMENT_BRANCH
git add .
git commit -m "Deploy site"
git push -f origin pages

