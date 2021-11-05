#!/bin/bash -
#===============================================================================
#
#          FILE: jenkinscron.sh
#
#         USAGE: ./jenkinscron.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Nicolas Broussard
#       CREATED: 28.06.2017 11:11:36 CEST
#      REVISION:  ---
#===============================================================================

# Try to access jenkins
url=jenkins.civocracy.org/login?from=%2F
urlstatus=$(curl -o /dev/null --silent --head --write-out '%{http_code}' "$url")

# If it fails
if (("$urlstatus" == "502"))
then
	echo "Jenkins blocked!"
	# Kill potentially blocked processes
	sudo killall ember phantomjs
	# Restart jenkins
	sudo service jenkins start
else
	echo "Jenkins status: $urlstatus"
fi

