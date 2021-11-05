#!/bin/bash
#Nginx need to write in the translations dir:
sudo chown www-data:www-data -R /var/www/civ/dist/translations/


if [ -f /var/www/civ/dist/env-preproduction ]; then
	export BUILD_ENVIRONMENT="preproduction"
elif [ -f /var/www/civ/dist/env-production ]; then
	export BUILD_ENVIRONMENT="production"
elif [ -f /var/www/civ/dist/env-development ]; then
	export BUILD_ENVIRONMENT="development"
else
	#not really used as this script is only called on AWS
	export BUILD_ENVIRONMENT="local"
fi

# Pushing the en.json on the backend to add new placeholders (+triggers the backend's json refreshed for this locale) :
if $BUILD_ENVIRONMENT == "production" ;
	then
		curl -d "dzadRE578zaCDEAnqba54757poieroFKs7saaaLMHX9132=eded479XAf321bgfnfZdaFERX&locale=en" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Ember $BUILD_ENVIRONMENT" -X POST https://admin.civocracy.org/api/v7/translationstrings
else
	curl -d "dzadRE578zaCDEAnqba54757poieroFKs7saaaLMHX9132=eded479XAf321bgfnfZdaFERX&locale=en" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Ember $BUILD_ENVIRONMENT" -X POST https://beta-back.civocracy.org/api/v7/translationstrings
fi

echo "EN pushed to backend"

# Now we need to download the latest translations from the backend for all locales ! (add them here if there are more !)
# The requests here goes to localhost's civocracy.bmp php script to trigger the frontend's script for downloading the relevant backend json

echo "Starting translations download from backend"
curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=en" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "EN downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=de" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "DE downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=ca" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "CA downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=de" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "DE downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=es" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "ES downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=fr" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "FR downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=hr" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "HR downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=it" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "IT downloaded from backend"

curl -d "ZADLKJ5efz4efzSAnqba54757poieroFKs7saaaLMHX9132=dza64gez321bgfnfZdaFERX&locale=nl" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Edward $BUILD_ENVIRONMENT" -X POST 127.0.0.1/images/civocracy.bmp &
echo "NL downloaded from backend"
