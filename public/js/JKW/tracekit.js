function getUrlScriptName(urlstr , useRelativeBase){
 if(!urlstr)return "";
 var surlstr=urlstr;
 if( useRelativeBase && urlstr!==useRelativeBase ){
  var relu=getUrlPathPart(urlstr,true);
    var reluB=getUrlPathPart(useRelativeBase,true);
 }
 if(!useRelativeBase || urlstr===useRelativeBase || relu===reluB){
  var pos=urlstr.lastIndexOf("?");
  if(pos<0)pos=urlstr.length;
  var posb=urlstr.lastIndexOf("/",pos);  if(pos>0 && posb>0)var scriptName=urlstr.substring(posb+1,pos);
  else if(posb>0)var scriptName=urlstr.substring(posb+1);
  else var scriptName=urlstr;
 }else{  var au=parseUrlToArray(urlstr,true,true);
  var auB=parseUrlToArray(useRelativeBase,true,true);
  var scriptName="";
  for(var d in au){
   if( !(!auB[d]) && auB[d]===au[d] )continue;
   scriptName+=auB[d]+"/";
  }
  scriptName=truncEnd(scriptName,"/");
 }
  return scriptName;
}

function trim(sString){
 if(sString==null || sString=="")return "";
 if(typeof sString!="string")return sString;
 return sString.replace(/^\s+|\s+$/g,'');
}

function DOMType(object){ if(isDOMEvent(object))return 'event';
 if(!isDOMNode(object)){
  var tp=typeOf_advanced(object);
  if(tp==='list')tp='array';
  return tp;
 }
 if(object===document)return "html";
 else  if(object===document.body)return "body";
 else  if(object===document.documentElement)return "html";
 if( (!object.tagName) )return null;
 return object.tagName.toLowerCase();
}

function isTextNode(noeud){/*node html ou text ?*/
  return noeud.nodeType == 3;
}

function isImage(noeud) {
  return !isTextNode(noeud) && noeud.nodeName == "IMG";
}

function isString(val){return ( ( (typeof val).toLowerCase()==='string' ) ? true : false );}
function isEnumerable(val){
 var tst=typeOf_advanced(val);
 return ( ( tst=='object' || tst=='event' || tst=='error' || tst=='list' ) ? true : false );
}
function isObject(val){
 var tst=typeOf_advanced(val);
 return ( ( tst=='object' || tst=='event' || tst=='error' ) ? true : false );
}
function isNumber(val,strict=true){
 if( strict && val.charAt!==undefined && val.charAt(0)==="0" )return false; return ( ( (typeof val).toLowerCase()=='number' ) ? true : ( (parseInt(val)==val) ? true : false ) );
}
function intval(val){return parseInt(val);}
function isInt(val,strict=true){return isNumber(val,strict);}
function isNumeric(val){ if(val===undefined){return false;}
 var exp=new RegExp("^[0-9]*$","g");
 return exp.test( trim(val) );
}
function isStrictInt(val){return (parseInt(val)===val);}
function isBool(val){return ( ( (typeof val).toLowerCase()=='boolean' ) ? true : false );}
function isFunction(val){return ( ( (typeof val).toLowerCase()=='function' ) ? true : false );}
//--
function isArray(val){var tp=typeOf_advanced(val);return ( ( tp=='list' || tp=='object' ) ? true : false );}
function isArrayStrict(val){var tp=typeOf_advanced(val);return ( ( tp=='list' ) ? true : false );}
function isIntKeysArray(val){return ( ( typeOf_advanced(val)=='list' ) ? true : false );}
function isDate(val){return ( ( typeOf_advanced(val)=='date' ) ? true : false );}

function isJSObject(val){return ( ( typeOf_advanced(val)=='object' ) ? true : false );}
function isHtmlElement(val){return isDOMNode(val);}
function isDOMNode(val){return ( ( typeOf_advanced(val)=='node' ) ? true : false );}
function isDOMElement(val){return isDOMNode(val);}
function isError(val){return isDOMError(val);}
function isDOMError(val){return ( ( typeOf_advanced(val)=='error' ) ? true : false );}
function isDOMEvent(val){return ( ( typeOf_advanced(val)=='event' ) ? true : false );}

var __typeOf_advanced_running=false;
function typeOf_advanced(el,dbg){
  __typeOf_advanced_running=true;
 var elType = typeof el;
 elType=elType.toLowerCase();
  if( el===null ){
  __typeOf_advanced_running=false;
  return 'null';
 }
 if( elType==="undefined" || el===undefined )return "undefined";
  if(elType=='number'||elType=='string'||elType=='function'||elType=='boolean'){
  __typeOf_advanced_running=false;
  return elType;
 }
  if( !(!el.getTime) ){
  __typeOf_advanced_running=false;
  return "date";
 }
   if( elType=="object" && ( el===document || el===window || !(!el.tagName) ) ){
  __typeOf_advanced_running=false;
  return 'node';
 }
   if( elType==="object" && ( !(!el.type) || !(!el.target) || ( !(!el.toString) && ( ( el.toString().indexOf('event') >= 0) || (el.toString().indexOf('Event') >= 0) ) ) ) ){  __typeOf_advanced_running=false;
  return 'event';
 }
    if( el.length!==undefined ){
  __typeOf_advanced_running=false;
  return 'list';
 }
   if(el.message!=null && el.name!=null && el.name.search("Error")>-1){
  __typeOf_advanced_running=false;
  return 'error';
 }
   __typeOf_advanced_running=false;
 return 'object';
}


/*TraceKit - Cross brower stack traces - github.com/occ/TraceKit
MIT license*/

function trace(paddLen){return getPaddingString(paddLen);}
function getPaddingString(paddLen){
 if(!paddLen)paddLen=30;
 var tr=getPadding(paddLen);
 if(!tr)return null;
  var ret="{len:"+tr['len']+"}";
 var dloc=document.location;
 if(isArray(dloc))dloc=dloc.hrf;
 for(var d in tr){
  if(!isNumeric(d))continue;
  if(d<3 || d==='len' || !(!tr[d].trunc) )continue;  var file=getUrlScriptName( tr[d].url, dloc );
  ret+=" < "+file+" L."+tr[d].line+" C."+tr[d].column+"::"+tr[d].func;
 }
 if(tr[d].trunc)ret+=" [trunc "+tr[d].trunc+"]";
 return ret;
}

function getPadding(paddLen){
 if(!paddLen)paddLen=30;
 var trace=getBacktrace();
/*console.log( toString(trace) );*/
 if(!trace)return false;
 var padding=new Array();
 padding['len']=trace.length;
 for(var d in trace){
  if(!isNumeric(d))continue;
  if(d<2)continue;  if( paddLen && paddLen < d ){
   padding[d]={trunc: (trace.length-paddLen) };
   break;
  }
  padding[d]={
   url:trace[d]['url'],
   line:trace[d]['line'],
   column:trace[d]['column'],
   func:trace[d]['func'],
  };
 }
 return padding;
}

function getBacktrace(){
  var evt=new Error('tracekitPadding_noError');
 return TraceKit.computeStackTrace(evt,null,true).stack;
 }

;(function(window, undefined) {
var TraceKit = {};
var _oldTraceKit = window.TraceKit;

var _slice = [].slice;
var UNKNOWN_FUNCTION = '?';


function _has(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
}

function _isUndefined(what) {
    return typeof what === 'undefined';
}

TraceKit.noConflict = function noConflict() {
    window.TraceKit = _oldTraceKit;
    return TraceKit;
};

TraceKit.wrap = function traceKitWrapper(func) {
    function wrapped() {
        try {
            return func.apply(this, arguments);
        } catch (e) {
            TraceKit.report(e);
            throw e;
        }
    }
    return wrapped;
};

TraceKit.report = (function reportModuleWrapper() {
    var handlers = [],
        lastException = null,
        lastExceptionStack = null;

        function subscribe(handler) {
        installGlobalHandler();
        handlers.push(handler);
    }

        function unsubscribe(handler) {
        for (var i = handlers.length - 1; i >= 0; --i) {
            if (handlers[i] === handler) {
                handlers.splice(i, 1);
            }
        }
    }

        function notifyHandlers(stack, windowError) {
        var exception = null;
        if (windowError && !TraceKit.collectWindowErrors) {
          return;
        }
        for (var i in handlers) {
         if(!isNumeric(i))continue;
            if (_has(handlers, i)) {
                try {
                    handlers[i].apply(null, [stack].concat(_slice.call(arguments, 2)));
                } catch (inner) {
                    exception = inner;
                }
            }
        }

        if (exception) {
            throw exception;
        }
    }

    var _oldOnerrorHandler, _onErrorHandlerInstalled;

        function traceKitWindowOnError(message, url, lineNo) {
        var stack = null;

        if (lastExceptionStack) {
            TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(lastExceptionStack, url, lineNo, message);
            stack = lastExceptionStack;
            lastExceptionStack = null;
            lastException = null;
        } else {
            var location = {
                'url': url,
                'line': lineNo
            };
            if( launchOnloadRack_running ){
             if( isArrayKeyDefined(onloadRack,launchOnloadRack_running_idx) ){
              var code=onloadRack[ launchOnloadRack_running_idx ];
              location.func="launchOnloadRack() - item "+launchOnloadRack_running_idx;
              location.code=code;
              if( code.indexOf('\n')>-1 )var exCd=code.split('\n');
              else{
               var exCd=new Array();
               exCd[1]=code;
              }
              location.context={0:'context: '+exCd};
             }else{
              location.func="launchOnloadRack() - item ??";
              location.context = TraceKit.computeStackTrace.gatherContext(location.url, location.line, location);
             }
             stack = {
                           'padding': getPaddingString(),
                              'mode': 'onerror',
                 'message': message,
                 'url': document.location.href,
                 'stack': [location],
                 'useragent': navigator.userAgent
             };
            }else if( launchOnUnloadRack_running ){
             if( isArrayKeyDefined(onloadRack,launchOnUnloadRack_running_idx) ){
              var code=onloadRack[ launchOnUnloadRack_running_idx ];
              location.func="launchOnUnloadRack() - item "+launchOnUnloadRack_running_idx;
              location.code=code;
              if( code.indexOf('\n')>-1 )var exCd=code.split('\n');
              else{
               var exCd=new Array();
               exCd[1]=code;
              }
              location.context={0:'context: '+exCd};
             }else{
              location.func="launchOnUnloadRack() - item ??";
              location.context = TraceKit.computeStackTrace.gatherContext(location.url, location.line, location);
             }
             stack = {
                           'padding': getPaddingString(),
                              'mode': 'onerror',
                 'message': message,
                 'url': document.location.href,
                 'stack': [location],
                 'useragent': navigator.userAgent
             };
            }else{
             location.func = TraceKit.computeStackTrace.guessFunctionName(location.url, location.line);
             location.context = TraceKit.computeStackTrace.gatherContext(location.url, location.line, location);
             stack = {
                          'padding': getPaddingString(),
                              'mode': 'onerror',
                 'message': message,
                 'url': document.location.href,
                 'stack': [location],
                 'useragent': navigator.userAgent
             };
            }
        }

        notifyHandlers(stack, 'from window.onerror');

        if (_oldOnerrorHandler) {
            return _oldOnerrorHandler.apply(this, arguments);
        }

        return false;
    }

    function installGlobalHandler ()
    {
        if (_onErrorHandlerInstalled === true) {
            return;
        }
        _oldOnerrorHandler = window.onerror;
        window.onerror = traceKitWindowOnError;
        _onErrorHandlerInstalled = true;
    }

        function report(ex) {
        var args = _slice.call(arguments, 1);
        if (lastExceptionStack) {
            if (lastException === ex) {
                return;             } else {
                var s = lastExceptionStack;
                lastExceptionStack = null;
                lastException = null;
                notifyHandlers.apply(null, [s, null].concat(args));
            }
        }
        var stack = TraceKit.computeStackTrace(ex);
        lastExceptionStack = stack;
        lastException = ex;

        window.setTimeout(function () {
            if (lastException === ex) {
                lastExceptionStack = null;
                lastException = null;
                notifyHandlers.apply(null, [stack, null].concat(args));
            }
        }, (stack.incomplete ? 2000 : 10));
        if(ex.message==="tracekitPadding_noError" )return;
        throw ex;     }

    report.subscribe = subscribe;
    report.unsubscribe = unsubscribe;
    return report;
}());

TraceKit.computeStackTrace = (function computeStackTraceWrapper() {
    var debug = false,
        sourceCache = {},
        noXHRLoad=false;

        function getXHR() {
     try {
      return new window.XMLHttpRequest();
     }catch (e) {
            return new window.ActiveXObject('Microsoft.XMLHTTP');
     }
    }

    function loadSource(url) {
        if (!TraceKit.remoteFetching) { //Only attempt request if remoteFetching is on.
            return '';
        }
        try {
            var request = getXHR();
                                                if( url.substring(0,7)!=="http://" && url.substring(0,8)!=="https://" )request.open('GET', js_base_url+url, false);
            else request.open('GET', url, false);
            request.send('');
            return request.responseText;
        } catch (e) {
            return '';
        }
    }

        function getSource(url) {

                if ( !noXHRLoad && !_has(sourceCache, url) ) {
                                var source = '';
            if (url.indexOf(document.domain) !== -1) {
                source = loadSource(url);
            }
            sourceCache[url] = source ? source.split('\n') : [];
        }

                if( !(!sourceCache[url]) )return sourceCache[url];
        else return "";
            }

        function guessFunctionName(url, lineNo) {
        var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/,
            reGuessFunction = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
            line = '',
            maxLines = 10,
            source = getSource(url),
            m;

        if (!source.length) {
            return UNKNOWN_FUNCTION;
        }

                for (var i = 0; i < maxLines; ++i) {
            if(lineNo - i >= 0)line = source[lineNo - i] + line;
            else line=0;
            if (!_isUndefined(line)) {
                if ((m = reGuessFunction.exec(line))) {
                    return m[1];
                } else if ((m = reFunctionArgNames.exec(line))) {
                    return m[1];
                }
            }
        }

        return UNKNOWN_FUNCTION;
    }

        function gatherContext(url, line, element) {
        var source = getSource(url);
                if( url.indexOf(" ")>-1 )url=url.substring(0,element.url.indexOf(" "));
                var context = [],
                        linesBefore = Math.floor(TraceKit.linesOfContext / 2),
                        linesAfter = linesBefore + (TraceKit.linesOfContext % 2),
            start = Math.max(0, line - linesBefore - 1),
            end = Math.min(source.length, line + linesAfter - 1);

        line -= 1;
        for (var i = start; i < end; ++i) {
            if (!_isUndefined(source[i])) {
                context.push(source[i]);
            }
        }

        return context.length > 0 ? context : null;
    }

        function escapeRegExp(text) {
        return text.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, '\\$&');
    }

        function escapeCodeAsRegExpForMatchingInsideHTML(body) {
        return escapeRegExp(body).replace('<', '(?:<|&lt;)').replace('>', '(?:>|&gt;)').replace('&', '(?:&|&amp;)').replace('"', '(?:"|&quot;)').replace(/\s+/g, '\\s+');
    }

        function findSourceInUrls(re, urls) {
        var source, m;
        for (var i = 0, j = urls.length; i < j; ++i) {
                        if ((source = getSource(urls[i])).length) {
                source = source.join('\n');
                if ((m = re.exec(source))) {

                    return {
                        'url': urls[i],
                        'line': source.substring(0, m.index).split('\n').length,
                        'column': m.index - source.lastIndexOf('\n', m.index) - 1
                    };
                }
            }
        }

        // console.log('no match');

        return null;
    }

        function findSourceInLine(fragment, url, line) {
        var source = getSource(url),
            re = new RegExp('\\b' + escapeRegExp(fragment) + '\\b'),
            m;

        line -= 1;

        if (source && source.length > line && (m = re.exec(source[line]))) {
            return m.index;
        }

        return null;
    }

        function findSourceByFunctionBody(func) {
        var urls = [window.location.href],
            scripts = document.getElementsByTagName('script'),
            body,
            code = '' + func,
            codeRE = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,
            eventRE = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,
            re,
            parts,
            result;

        for (var i = 0; i < scripts.length; ++i) {
            var script = scripts[i];
            if (script.src) {
                urls.push(script.src);
            }
        }

        if (!(parts = codeRE.exec(code))) {
            re = new RegExp(escapeRegExp(code).replace(/\s+/g, '\\s+'));
        }

                else {
            var name = parts[1] ? '\\s+' + parts[1] : '',
                args = parts[2].split(',').join('\\s*,\\s*');

            body = escapeRegExp(parts[3]).replace(/;$/, ';?');             re = new RegExp('function' + name + '\\s*\\(\\s*' + args + '\\s*\\)\\s*{\\s*' + body + '\\s*}');
        }

                if ((result = findSourceInUrls(re, urls))) {
            return result;
        }

                if ((parts = eventRE.exec(code))) {
            var event = parts[1];
            body = escapeCodeAsRegExpForMatchingInsideHTML(parts[2]);

                        re = new RegExp('on' + event + '=[\\\'"]\\s*' + body + '\\s*[\\\'"]', 'i');

            if ((result = findSourceInUrls(re, urls[0]))) {
                return result;
            }

                        re = new RegExp(body);

            if ((result = findSourceInUrls(re, urls))) {
                return result;
            }
        }

        return null;
    }
        function computeStackTraceFromStackProp(ex) {

        if (!ex.stack) {
            return null;
        }


        var chrome = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
            gecko = /^\s*(\S*)(?:\((.*?)\))?@((?:file|http|https).*?):(\d+)(?::(\d+))?\s*$/i,
            lines = ex.stack.split('\n'),
            stack = [],
            parts,
            element,
            reference = /^(.*) is undefined$/.exec(ex.message);

        for (var i = 0, j = lines.length; i < j; ++i) {
            if ((parts = gecko.exec(lines[i]))) {
                element = {
                    'url': parts[3],
                    'func': parts[1] || UNKNOWN_FUNCTION,
                    'args': parts[2] ? parts[2].split(',') : '',
                    'line': +parts[4],
                    'column': parts[5] ? +parts[5] : null
                };
            } else if ((parts = chrome.exec(lines[i]))) {
                element = {
                    'url': parts[2],
                    'func': parts[1] || UNKNOWN_FUNCTION,
                    'line': +parts[3],
                    'column': parts[4] ? +parts[4] : null
                };
            } else {
                continue;
            }
                        if( element.url.indexOf(" ")>-1 )element.url=element.url.substring(0,element.url.indexOf(" "));
                        if (!element.func && element.line) {
                element.func = guessFunctionName(element.url, element.line);
            }

            if (element.line) {
                              element.context = gatherContext(element.url, element.line, element);
            }
            stack.push(element);
        }
if( !(!ex.evstr) ){
 var tp=ex.evstr.split(/\n/);
 var ctxt=new Array();
 var cnt=0;
 if( !(!ex.lineNumber) )var ln=ex.lineNumber;
 else var ln=ex.line;
 var totl=tp.length;
 while( cnt < ex.lineNumber+5 && cnt < totl ){if(ex.lineNumber>cnt+5){cnt++;continue;}ctxt[(cnt-ex.lineNumber)]=tp[cnt];cnt++;}
 stack.unshift({url:stack[0].url,func:'eval',line:( ex.lineNumber ? ex.lineNumber : (ex.line?ex.line:0) ),context:ctxt});}
        if (stack[0] && stack[0].line && !stack[0].column && reference) {
            stack[0].column = findSourceInLine(reference[1], stack[0].url, stack[0].line);
        }
        if (!stack.length) {
            return null;
        }
        return {
            'mode': 'stack',
            'name': ex.name,
            'message': ex.message,
            'url': document.location.href,
            'stack': stack,
            'useragent': navigator.userAgent
        };
    }

        function computeStackTraceFromStacktraceProp(ex) {
        if ( (!ex.stacktrace) )return null;
        var stacktrace = ex.stacktrace;
        if (!stacktrace)return null;

        var testRE = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i,
            lines = stacktrace.split('\n'),
            stack = [],
            parts;

        for (var i = 0, j = lines.length; i < j; i += 2) {
            if ((parts = testRE.exec(lines[i]))) {
                var element = {
                    'line': +parts[1],
                    'column': +parts[2],
                    'func': parts[3] || parts[4],
                    'args': parts[5] ? parts[5].split(',') : [],
                    'url': parts[6]
                };

                if (!element.func && element.line) {
                    element.func = guessFunctionName(element.url, element.line);
                }
                if (element.line) {
                    try {
                        element.context = gatherContext(element.url, element.line, element);
                    } catch (exc) {}
                }

                if (!element.context) {
                    element.context = [lines[i + 1]];
                }

                stack.push(element);
            }
        }

        if (!stack.length) {
            return null;
        }

        return {
            'mode': 'stacktrace',
            'name': ex.name,
            'message': ex.message,
            'url': document.location.href,
            'stack': stack,
            'useragent': navigator.userAgent
        };
    }

        function computeStackTraceFromOperaMultiLineMessage(ex) {
        if(!ex.message)return null;
        var lines = ex.message.split('\n');
        if (lines.length < 4) {
            return null;
        }

        var lineRE1 = /^\s*Line (\d+) of linked script ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i,
            lineRE2 = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i,
            lineRE3 = /^\s*Line (\d+) of function script\s*$/i,
            stack = [],
            scripts = document.getElementsByTagName('script'),
            inlineScriptBlocks = [],
            parts,
            i,
            len,
            source;

        for (i in scripts) {
         if(!isNumeric(i))continue;
            if (_has(scripts, i) && !scripts[i].src) {
                inlineScriptBlocks.push(scripts[i]);
            }
        }

        for (i = 2, len = lines.length; i < len; i += 2) {
            var item = null;
            if ((parts = lineRE1.exec(lines[i]))) {
                item = {
                    'url': parts[2],
                    'func': parts[3],
                    'line': +parts[1]
                };
            } else if ((parts = lineRE2.exec(lines[i]))) {
                item = {
                    'url': parts[3],
                    'func': parts[4]
                };
                var relativeLine = (+parts[1]);                 var script = inlineScriptBlocks[parts[2] - 1];
                if (script) {
                    source = getSource(item.url);
                    if (source) {
                        source = source.join('\n');
                        var pos = source.indexOf(script.innerText);
                        if (pos >= 0) {
                            item.line = relativeLine + source.substring(0, pos).split('\n').length;
                        }
                    }
                }
            } else if ((parts = lineRE3.exec(lines[i]))) {
                var url = window.location.href.replace(/#.*$/, ''),
                    line = parts[1];
                var re = new RegExp(escapeCodeAsRegExpForMatchingInsideHTML(lines[i + 1]));
                source = findSourceInUrls(re, [url]);
                item = {
                    'url': url,
                    'line': source ? source.line : line,
                    'func': ''
                };
            }

            if (item) {
                if (!item.func) {
                    item.func = guessFunctionName(item.url, item.line);
                }
                var context = gatherContext(item.url, item.line, item);
                var midline = (context ? context[Math.floor(context.length / 2)] : null);
                if (context && midline.replace(/^\s*/, '') === lines[i + 1].replace(/^\s*/, '')) {
                    item.context = context;
                } else {
                                        item.context = [lines[i + 1]];
                }
                stack.push(item);
            }
        }
        if (!stack.length) {
            return null;        }

        return {
            'mode': 'multiline',
            'name': ex.name,
            'message': lines[0],
            'url': document.location.href,
            'stack': stack,
            'useragent': navigator.userAgent
        };
    }

        function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
        var initial = {
            'url': url,
            'line': lineNo
        };

        if (initial.url && initial.line) {
            stackInfo.incomplete = false;

            if (!initial.func) {
                initial.func = guessFunctionName(initial.url, initial.line);
            }

            if (!initial.context) {
                initial.context = gatherContext(initial.url, initial.line, initial);
            }

            var reference = / '([^']+)' /.exec(message);
            if (reference) {
                initial.column = findSourceInLine(reference[1], initial.url, initial.line);
            }

            if (stackInfo.stack.length > 0) {
                if (stackInfo.stack[0].url === initial.url) {
                    if (stackInfo.stack[0].line === initial.line) {
                        return false;                    } else if (!stackInfo.stack[0].line && stackInfo.stack[0].func === initial.func) {
                        stackInfo.stack[0].line = initial.line;
                        stackInfo.stack[0].context = initial.context;
                        return false;
                    }
                }
            }

            stackInfo.stack.unshift(initial);
            stackInfo.partial = true;
            return true;
        } else {
            stackInfo.incomplete = true;
        }

        return false;
    }

        function computeStackTraceByWalkingCallerChain(ex, depth) {
        var functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
            stack = [],
            funcs = {},
            recursion = false,
            parts,
            item,
            source;

        for (var curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller) {
            if (curr === computeStackTrace || curr === TraceKit.report) {
                                continue;
            }

            item = {
                'url': null,
                'func': UNKNOWN_FUNCTION,
                'line': null,
                'column': null
            };

            if (curr.name) {
                item.func = curr.name;
            } else if ((parts = functionName.exec(curr.toString()))) {
                item.func = parts[1];
            }

            if ((source = findSourceByFunctionBody(curr))) {
                item.url = source.url;
                item.line = source.line;

                if (item.func === UNKNOWN_FUNCTION) {
                    item.func = guessFunctionName(item.url, item.line);
                }

                var reference = / '([^']+)' /.exec(ex.message || ex.description);
                if (reference) {
                    item.column = findSourceInLine(reference[1], source.url, source.line);
                }
            }

            if (funcs['' + curr]) {
                recursion = true;
            }else{
                funcs['' + curr] = true;
            }

            stack.push(item);
        }

        if (depth) {
                                    stack.splice(0, depth);
        }

        var result = {
            'mode': 'callers',
            'name': ex.name,
            'message': ex.message,
            'url': document.location.href,
            'stack': stack,
            'useragent': navigator.userAgent
        };
        augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description);
        return result;
    }

        function computeStackTrace(ex, depth, noXHRLoadarg) {
        var stack = null;
                noXHRLoad=noXHRLoadarg;

        depth = (depth == null ? 0 : +depth);

        try {
                        stack = computeStackTraceFromStacktraceProp(ex);
            if (stack) {
                return stack;
            }
        } catch (e) {
            if (debug) {
                throw e;
            }
        }

        try {
            stack = computeStackTraceFromStackProp(ex);
            if (stack) {
                return stack;
            }
        } catch (e) {
            if (debug) {
                throw e;
            }
        }

        try {
            stack = computeStackTraceFromOperaMultiLineMessage(ex);
            if (stack) {
                return stack;
            }
        } catch (e) {
            if (debug) {
                throw e;
            }
        }

        try {
            stack = computeStackTraceByWalkingCallerChain(ex, depth + 1);
            if (stack) {
                return stack;
            }
        } catch (e) {
            if (debug) {
                throw e;
            }
        }

        return {
            'mode': 'failed'
        };
    }

        function computeStackTraceOfCaller(depth) {
        depth = (depth == null ? 0 : +depth) + 1;         try {
            throw new Error();
        } catch (ex) {
            return computeStackTrace(ex, depth + 1);
        }

        return null;
    }

    computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement;
    computeStackTrace.guessFunctionName = guessFunctionName;
    computeStackTrace.gatherContext = gatherContext;
    computeStackTrace.ofCaller = computeStackTraceOfCaller;

    return computeStackTrace;
}());

(function extendToAsynchronousCallbacks() {
    var _helper = function _helper(fnName) {
        var originalFn = window[fnName];
        window[fnName] = function traceKitAsyncExtension() {
                        var args = _slice.call(arguments);
            var originalCallback = args[0];
            if (typeof (originalCallback) === 'function') {
                args[0] = TraceKit.wrap(originalCallback);
            }
                        if (originalFn.apply) {
                return originalFn.apply(this, args);
            } else {
                return originalFn(args[0], args[1]);
            }
        };
    };

    _helper('setTimeout');
    _helper('setInterval');
}());

if (!TraceKit.remoteFetching) {
  TraceKit.remoteFetching = true;
}
if (!TraceKit.collectWindowErrors) {
  TraceKit.collectWindowErrors = true;
}
if (!TraceKit.linesOfContext || TraceKit.linesOfContext < 1) {
    TraceKit.linesOfContext = 11;
}

window.TraceKit = TraceKit;

}(window));
