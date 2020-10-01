#! /bin/bash

rm -rf ./public

echo "Started clonning..."
git clone https://github.com/desibabua/E-buddy.git 2> /dev/null
echo "Clonning completed..."

echo "Installing dependencies..."
cd E-buddy
npm install
npm test

echo "Creating build..."
npm run build

cd ..
echo "Started merging..."
mkdir public
cp -r ./E-buddy/build/* ./public 
rm -rf E-buddy        
