mkdir -p ~/Library/Application\ Support/xbar/plugins/
mkdir -p ~/Applications


pyinstaller tasks_api.spec

ln -s "$(pwd)/dist/tasks_api" ~/Applications/
ln -s "$(pwd)/tasks_api.1m.sh" ~/Library/Application\ Support/xbar/plugins/

open -a xbar