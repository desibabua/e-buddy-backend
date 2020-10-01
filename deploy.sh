#! /bin/bash

rm -rf ${BACKEND}
echo 'Cloning backend...'
git clone  https://github.com/${USER_NAME}/${BACKEND}.git 2> /dev/null
cd ${BACKEND}

echo 'Installing dependencies...'
npm install 2> /dev/null
npm test

cd ..
rm -rf ${FRONTEND}
echo 'Cloning frontend ...'
git clone https://github.com/${USER_NAME}/${FRONTEND}.git 2> /dev/null
cd ${FRONTEND}

echo 'Installing dependencies...'
npm install 2> /dev/null
npm test

echo 'Creating build ...'
npm run build 2> /dev/null

echo 'Merging build ...'
mkdir -p ../public
mv build/* ../public/.
cd ../${BACKEND}
rm .travis.yml
cd ..
cp -r ${BACKEND}/* ./

echo 'Removing un-neccessaries...'
rm -rf ${FRONTEND}
rm -rf ${BACKEND}
echo 'Process completed...'  