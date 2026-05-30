#!/bin/bash
echo "Setting up Jest for testing..."
npm install --save-dev jest
echo '"test": "jest"' >> package.json
mkdir -p __tests__
echo "Testing setup complete!"
