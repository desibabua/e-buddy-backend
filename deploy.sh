#! /bin/bash

rm -rf ${BACKEND}
echo 'Cloning backend...'
git clone  https://github.com/${USERNAME}/${BACKEND}.git 2> /dev/null
cd ${BACKEND}

echo 'Installing dependencies...'
npm install 2> /dev/null
npm test


cd ..
rm -rf ${FRONTEND}
echo 'Cloning frontend...'
git clone https://github.com/${USERNAME}/${FRONTEND}.git 2> /dev/null
cd ${FRONTEND}

echo 'Installing dependencies...'
npm install 2> /dev/null
npm test

echo 'Creating build ...'
npm run build 2> /dev/null

echo 'Merging ...'
mkdir -p ../public
mv build/* ../public/.

echo 'Removing un-neccessaries...'
cd ../${BACKEND}
rm .travis.yml
cd ..
rm -rf ${FRONTEND}
mv ${BACKEND}/* ${BACKEND}/.* .
rm -rf ${BACKEND}
echo 'Build created...'