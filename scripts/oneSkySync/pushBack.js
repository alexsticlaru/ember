// https://github.com/brainly/nodejs-onesky-utils
exports.PushBack = function() {
    sendLanguageToOneSky('en_US', 'mails');
    sendLanguageToOneSky('en_US', 'content');
    sendLanguageToOneSky('en_US', 'notifications');
    //sendLanguageToOneSky('en_US', 'app');
    //sendLanguageToOneSky('en_US', 'chatbot');
    sendLanguageToOneSky('en_US', 'questionnaire');
};

const sendLanguageToOneSky = function(locale, type) {
  const fs = require('fs');
  const onesky = require('onesky-utils');
  let destination = "../oneSky-translates/civb/toPush/app/Resources/translations/";
  fs.readFile(destination + type + "." + locale.substr(0, 2) + ".yml", 'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    }

    const options = {
      language: locale,
      secret: 'i7nQdOkKG4XtJvv6jZ7ouxZefn5sAzNJ',
      apiKey: 'w0pzFAacuXw4jR0tGYI0lx5qL0JcqmLN',
      projectId: '94575',
      fileName: type + '.en.yml',
      format: 'YAML',
      content: data,
      keepStrings: false
    };

    onesky.postFile(options).then(function() {
      //console.log(type + "." + locale.substr(0, 2) + " translations pushed");
      console.log( locale.substr(0, 2) + " civb "+type+" translations pushed from : "+process.cwd()+"/"+destination + type + "." + locale.substr(0, 2) + ".yml" );
    }).catch(function(error) {
      console.log(error);
    });

  });

};

if (!module.parent) {
  exports.PushBack();
}
