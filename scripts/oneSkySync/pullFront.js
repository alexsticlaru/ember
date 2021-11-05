// https://github.com/brainly/nodejs-onesky-utils
exports.pullFront = function() {
    copyLanguageToFile('en_US');
    copyLanguageToFile('fr');
    copyLanguageToFile('de');
    copyLanguageToFile('nl');
    copyLanguageToFile('es');
};

const copyLanguageToFile = function(locale) {
  const fs = require('fs');
  const onesky = require('onesky-utils');

  const options = {
    language: locale,
    secret: 'i7nQdOkKG4XtJvv6jZ7ouxZefn5sAzNJ',
    apiKey: 'w0pzFAacuXw4jR0tGYI0lx5qL0JcqmLN',
    projectId: '94575',
    fileName: 'translations_en.json'
  };
  var destination = "../oneSky-translates/civf/pulled/app/locales/" + locale.substr(0, 2) + "/translations.js";

  // Download translated files from OneSky
  onesky.getFile(options).then(function(content) {
    //console.log("Getting files from oneSky for:" + locale);

    content = JSON.parse(content);
    content = JSON.stringify(content, null, " ");
    content = 'export default ' + content + ';';

    // Put the content in the translation files
	//    fs.writeFile(__dirname + "/../../app/locales/" + locale.substr(0, 2) + "/translations.js",
    fs.writeFile( destination, content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log( locale.substr(0, 2) + " civf translations pulled" );
    console.log("from OneSky: "+options.fileName);
    console.log("to : "+process.cwd()+"/"+destination);
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
  exports.pullFront();
}
