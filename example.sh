#!/bin/bash

# Read the values of the USER and HOME environment variables
USER_NAME="$USER"
HOME_DIR="$HOME"

# Generate the new environment.ts file with the correct values
cat <<EOF > src/environments/environment.ts
export const environment = {
  production: false,
  user: '${USER_NAME}',
};
EOF

ng build
