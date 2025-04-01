#!/bin/bash

# Check if the server is running
if pgrep -f "tasks_api" > /dev/null; then
    echo "Stopping Tasks API server..."
    pkill -f "tasks_api"
    echo "Server stopped."
else
    echo "Starting Tasks API server..."
    "$HOME/Applications/tasks_api" &
    echo "Server started."
    echo "Access it at http://localhost:8001"
fi

exit 0 