// https://github.com/brainly/nodejs-onesky-utils
exports.PushFront = function(event, context, callback) {
    sendLanguageToOneSky('en_US');
	 // Uncomment to push refactored keys
    //sendLanguageToOneSky('fr');
    //sendLanguageToOneSky('de');
    //sendLanguageToOneSky('nl');
    //sendLanguageToOneSky('es');
};

const sendLanguageToOneSky = function(locale) {
  const fs = require('fs');
  const onesky = require('onesky-utils');

  //fs.readFile(__dirname + "/../../app/locales/" + locale.substr(0, 2) + "/translations.js",
  var destination = "../oneSky-translates/civf/toPush/app/locales/" + locale.substr(0, 2) + "/translations.js";
  fs.readFile(destination,'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    }

    data = data.substring(15);
    data = data.trim().slice(0, -1);

    data = JSON.stringify(JSON.parse(data));

    const options = {
      language: locale,
      secret: 'i7nQdOkKG4XtJvv6jZ7ouxZefn5sAzNJ',
      apiKey: 'w0pzFAacuXw4jR0tGYI0lx5qL0JcqmLN',
      projectId: '94575',
      fileName: 'translations_en.json',
      format: 'HIERARCHICAL_JSON',
      content: data,
      keepStrings: false
    };

    onesky.postFile(options).then(function(content) {
      //console.log(locale.substr(0, 2) + " translations pushed");
		console.log( locale.substr(0, 2) + " civf translations pushed from : "+process.cwd()+"/"+destination );
    }).catch(function(error) {
      console.log(error);
    });

  });

};

if (!module.parent) {
  exports.PushFront();
}
