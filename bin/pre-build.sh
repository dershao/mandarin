#!/usr/bin/bash

if [ $(ls -1 src/data/svgs | wc -l) -gt 0 ]; then
    echo "Data is already downloaded - if data is missing, clean the folder and re-run script"
    exit
fi

echo "No data found, downloading..."

DATA_FOLDER_NAME=makemeahanzi
GIT_DOWNLOAD_CHARACTER_DATA="git clone --single-branch --branch hsk3 https://github.com/dershao/$DATA_FOLDER_NAME"
MV_SVGS_TO_DESTINATION="mv makemeahanzi/svgs src/data/"
MV_SVGS_STILL_TO_DESTINATION="mv makemeahanzi/svgs-still src/data/"
MV_CHARACTER_IMAGES_TO_DESTINATION="mv makemeahanzi/character_images src/data/"

$GIT_DOWNLOAD_CHARACTER_DATA
echo "Moving SVG data to folder..."
$MV_SVGS_TO_DESTINATION
echo "Moving SVG still data to folder..."
$MV_SVGS_STILL_TO_DESTINATION
echo "Moving character images to folder..."
$MV_CHARACTER_IMAGES_TO_DESTINATION
echo "Deleting folder... $DATA_FOLDER_NAME"
rm -rf $DATA_FOLDER_NAME
echo "Done!"