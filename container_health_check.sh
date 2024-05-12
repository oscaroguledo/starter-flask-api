#!/bin/bash

# Check if the correct number of arguments is provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <container_name> <email_address>"
    exit 1
fi

# Assign the first argument to 'container_name' and the second to 'email'
container_name=$1
email=$2

# Get the health status of the specified dcker container
status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name")

# Send an email if the container is not healthy
if [ "$status" != "healthy" ]; then
    echo "Container $container_name is unhealthy" | mail -s "Container Status Alert for $container_name" "$email"
fi

# This script can be run as a cron job to periodically check the health status of any specific container.
