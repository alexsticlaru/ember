// https://github.com/brainly/nodejs-onesky-utils
exports.pullBack = function() {
    copyLanguageToFile('en_US', 'mails');
    copyLanguageToFile('fr', 'mails');
    copyLanguageToFile('de', 'mails');
    // copyLanguageToFile('nl', 'mails');
    // copyLanguageToFile('es', 'mails');

    copyLanguageToFile('en_US', 'content');
    copyLanguageToFile('fr', 'content');
    copyLanguageToFile('de', 'content');
    // copyLanguageToFile('nl', 'content');
    // copyLanguageToFile('es', 'content');

    copyLanguageToFile('en_US', 'app');
    copyLanguageToFile('fr', 'app');
    copyLanguageToFile('de', 'app');
    // copyLanguageToFile('nl', 'app');
    // copyLanguageToFile('es', 'app');

    copyLanguageToFile('en_US', 'chatbot');
    copyLanguageToFile('fr', 'chatbot');
    copyLanguageToFile('de', 'chatbot');
    // copyLanguageToFile('nl', 'chatbot');
    // copyLanguageToFile('es', 'chatbot');

    copyLanguageToFile('en_US', 'notifications');
    copyLanguageToFile('fr', 'notifications');
    copyLanguageToFile('de', 'notifications');
    // copyLanguageToFile('nl', 'notifications');
    // copyLanguageToFile('es', 'notifications');

    copyLanguageToFile('en_US', 'questionnaire');
    copyLanguageToFile('fr', 'questionnaire');
    copyLanguageToFile('de', 'questionnaire');

};

const copyLanguageToFile = function(locale, type) {
  const fs = require('fs');
  const onesky = require('onesky-utils');

  const options = {
    language: locale,
    secret: 'i7nQdOkKG4XtJvv6jZ7ouxZefn5sAzNJ',
    apiKey: 'w0pzFAacuXw4jR0tGYI0lx5qL0JcqmLN',
    projectId: '94575',
    fileName: type + '.en.yml'
  };

  var destination="../oneSky-translates/civb/pulled/app/Resources/translations/" + type + "." + locale.substr(0, 2) + ".yml";

  // Download translated files from OneSky
  onesky.getFile(options).then(function(content) {
    // Put the content in the translation files
	console.log('');
	//console.log( locale.substr(0, 2) + " civb pulling to "+process.cwd()+"/"+destination );
    fs.writeFile(destination, content, function(err) {
        if(err) {
            return console.log(err);
        }

        //console.log(type + "." + locale.substr(0, 2) + " translations pulled");
		console.log( locale.substr(0, 2) + " civb translations pulled : "+process.cwd()+"/"+destination );
    });

  }).catch(function(error) {
	console.log('');
    console.log(locale+" catched an error for pulling");
    console.log("from OneSky: "+options.fileName);
    console.log("to : "+process.cwd()+"/"+destination);
    console.log(error);
  });
};

if (!module.parent) {
  exports.pullBack();
}
