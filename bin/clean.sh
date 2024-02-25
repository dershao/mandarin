#!/usr/bin/bash

if [ -z "$(ls -A src/data/svgs)" ]; then
    echo "svgs cleaned"
else
    echo "Cleaning src/data/svgs"
    rm src/data/svgs/*.*
fi


if [ -z "$(ls -A src/data/svgs-still)" ]; then

    echo "svgs-still cleaned"
else
    echo "Cleaning src/data/svgs-still"
    rm src/data/svgs-still/*.*
fi