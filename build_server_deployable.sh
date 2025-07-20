#!/bin/bash
set -e

rm -rf deploy/
mkdir deploy

cp -r dist/ deploy/
cp -r server/ deploy/
cp -r prisma/ deploy/
cp package.json package-lock.json deploy/
cp database.sqlite deploy/

cd deploy
zip -r ../deploy.zip .
cd ..