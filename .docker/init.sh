#!/bin/sh

if [ -f "./package.json" ]; then
    echo "========================================="
    echo "Run yarn install"
    echo "========================================="
    yarn install
fi

if [ -d "./node_modules/gulp/bin" ]; then
    echo "========================================="
    echo "Run gulp"
    echo "========================================="
    ./node_modules/gulp/bin/gulp.js
fi

