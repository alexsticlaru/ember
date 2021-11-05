
window.zEmbed||(function(){
  var queue = [];
alert('ICI1');
  window.zEmbed = function() {
alert('ICI2');
    queue.push(arguments);
  }
alert('ICI3');
  window.zE = window.zE || window.zEmbed;
  document.zendeskHost = 'civocracy.zendesk.com';
  document.zEQueue = queue;
}());

