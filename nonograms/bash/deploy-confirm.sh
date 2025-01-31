#!/bin/bash
read -p "are you sure you want to deploy? (yes/no): " answer
if [[ $answer == "yes" ]]; then
  npm run deploy:force
else
  echo "deploy cancelled"
fi