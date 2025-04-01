#!/usr/bin/env bash

# Tasks API controller for macOS menu bar (xbar plugin)
# <xbar.title>Tasks API</xbar.title>
# <xbar.version>v1.0</xbar.version>
# <xbar.author>User</xbar.author>
# <xbar.desc>Start and stop the Tasks API server</xbar.desc>

PROCESS_NAME="tasks_api"
APP_PATH="$HOME/Applications/tasks_api" # Path where the executable will be installed

# Port the server runs on (for status check and browser link)
PORT=8001

# Check if server is running
check_running() {
  pgrep -f "$PROCESS_NAME" >/dev/null
  return $?
}

# Status icons
if check_running; then
  echo "🚀 | color=green"
  echo "---"
  echo "Stop Server | bash='pkill -f $PROCESS_NAME' terminal=false refresh=true"
  echo "Open in Browser | bash='open http://localhost:$PORT' terminal=false"
  echo "View Tasks | bash='open http://localhost:$PORT/tasks' terminal=false"
else
  echo "🛑 | color=red"
  echo "---"
  echo "Start Server | bash='$APP_PATH' terminal=false refresh=true"
fi

echo "---"
echo "Refresh | refresh=true" 