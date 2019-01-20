#!/bin/sh

if [ -f "./package.json" ]; then
    echo "========================================="
    echo "Run yarn install"
    echo "========================================="
    yarn install
fi

if [ -d "./node_modules/webpack/bin" ]; then
    echo "========================================="
    echo "Run webpack"
    echo "========================================="
    yarn dev
fi
