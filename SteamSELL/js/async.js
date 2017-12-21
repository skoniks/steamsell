(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?factory(exports):typeof define==='function'&&define.amd?define(['exports'],factory):(factory((global.async=global.async||{})));}(this,(function(exports){'use strict';function slice(arrayLike,start){start=start|0;var newLen=Math.max(arrayLike.length- start,0);var newArr=Array(newLen);for(var idx=0;idx<newLen;idx++){newArr[idx]=arrayLike[start+ idx];}
return newArr;}
var initialParams=function(fn){return function(){var args=slice(arguments);var callback=args.pop();fn.call(this,args,callback);};};function isObject(value){var type=typeof value;return value!=null&&(type=='object'||type=='function');}
var hasSetImmediate=typeof setImmediate==='function'&&setImmediate;var hasNextTick=typeof process==='object'&&typeof process.nextTick==='function';function fallback(fn){setTimeout(fn,0);}
function wrap(defer){return function(fn){var args=slice(arguments,1);defer(function(){fn.apply(null,args);});};}
var _defer;if(hasSetImmediate){_defer=setImmediate;}else if(hasNextTick){_defer=process.nextTick;}else{_defer=fallback;}
var setImmediate$1=wrap(_defer);function asyncify(func){return initialParams(function(args,callback){var result;try{result=func.apply(this,args);}catch(e){return callback(e);}
if(isObject(result)&&typeof result.then==='function'){result.then(function(value){invokeCallback(callback,null,value);},function(err){invokeCallback(callback,err.message?err:new Error(err));});}else{callback(null,result);}});}
function invokeCallback(callback,error,value){try{callback(error,value);}catch(e){setImmediate$1(rethrow,e);}}
function rethrow(error){throw error;}
var supportsSymbol=typeof Symbol==='function';function isAsync(fn){return supportsSymbol&&fn[Symbol.toStringTag]==='AsyncFunction';}
function wrapAsync(asyncFn){return isAsync(asyncFn)?asyncify(asyncFn):asyncFn;}
function applyEach$1(eachfn){return function(fns){var args=slice(arguments,1);var go=initialParams(function(args,callback){var that=this;return eachfn(fns,function(fn,cb){wrapAsync(fn).apply(that,args.concat(cb));},callback);});if(args.length){return go.apply(this,args);}
else{return go;}};}
var freeGlobal=typeof global=='object'&&global&&global.Object===Object&&global;var freeSelf=typeof self=='object'&&self&&self.Object===Object&&self;var root=freeGlobal||freeSelf||Function('return this')();var Symbol$1=root.Symbol;var objectProto=Object.prototype;var hasOwnProperty=objectProto.hasOwnProperty;var nativeObjectToString=objectProto.toString;var symToStringTag$1=Symbol$1?Symbol$1.toStringTag:undefined;function getRawTag(value){var isOwn=hasOwnProperty.call(value,symToStringTag$1),tag=value[symToStringTag$1];try{value[symToStringTag$1]=undefined;var unmasked=true;}catch(e){}
var result=nativeObjectToString.call(value);if(unmasked){if(isOwn){value[symToStringTag$1]=tag;}else{delete value[symToStringTag$1];}}
return result;}
var objectProto$1=Object.prototype;var nativeObjectToString$1=objectProto$1.toString;function objectToString(value){return nativeObjectToString$1.call(value);}
var nullTag='[object Null]';var undefinedTag='[object Undefined]';var symToStringTag=Symbol$1?Symbol$1.toStringTag:undefined;function baseGetTag(value){if(value==null){return value===undefined?undefinedTag:nullTag;}
value=Object(value);return(symToStringTag&&symToStringTag in value)?getRawTag(value):objectToString(value);}
var asyncTag='[object AsyncFunction]';var funcTag='[object Function]';var genTag='[object GeneratorFunction]';var proxyTag='[object Proxy]';function isFunction(value){if(!isObject(value)){return false;}
var tag=baseGetTag(value);return tag==funcTag||tag==genTag||tag==asyncTag||tag==proxyTag;}
var MAX_SAFE_INTEGER=9007199254740991;function isLength(value){return typeof value=='number'&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER;}
function isArrayLike(value){return value!=null&&isLength(value.length)&&!isFunction(value);}
var breakLoop={};function noop(){}
function once(fn){return function(){if(fn===null)return;var callFn=fn;fn=null;callFn.apply(this,arguments);};}
var iteratorSymbol=typeof Symbol==='function'&&Symbol.iterator;var getIterator=function(coll){return iteratorSymbol&&coll[iteratorSymbol]&&coll[iteratorSymbol]();};function baseTimes(n,iteratee){var index=-1,result=Array(n);while(++index<n){result[index]=iteratee(index);}
return result;}
function isObjectLike(value){return value!=null&&typeof value=='object';}
var argsTag='[object Arguments]';function baseIsArguments(value){return isObjectLike(value)&&baseGetTag(value)==argsTag;}
var objectProto$3=Object.prototype;var hasOwnProperty$2=objectProto$3.hasOwnProperty;var propertyIsEnumerable=objectProto$3.propertyIsEnumerable;var isArguments=baseIsArguments(function(){return arguments;}())?baseIsArguments:function(value){return isObjectLike(value)&&hasOwnProperty$2.call(value,'callee')&&!propertyIsEnumerable.call(value,'callee');};var isArray=Array.isArray;function stubFalse(){return false;}
var freeExports=typeof exports=='object'&&exports&&!exports.nodeType&&exports;var freeModule=freeExports&&typeof module=='object'&&module&&!module.nodeType&&module;var moduleExports=freeModule&&freeModule.exports===freeExports;var Buffer=moduleExports?root.Buffer:undefined;var nativeIsBuffer=Buffer?Buffer.isBuffer:undefined;var isBuffer=nativeIsBuffer||stubFalse;var MAX_SAFE_INTEGER$1=9007199254740991;var reIsUint=/^(?:0|[1-9]\d*)$/;function isIndex(value,length){length=length==null?MAX_SAFE_INTEGER$1:length;return!!length&&(typeof value=='number'||reIsUint.test(value))&&(value>-1&&value%1==0&&value<length);}
var argsTag$1='[object Arguments]';var arrayTag='[object Array]';var boolTag='[object Boolean]';var dateTag='[object Date]';var errorTag='[object Error]';var funcTag$1='[object Function]';var mapTag='[object Map]';var numberTag='[object Number]';var objectTag='[object Object]';var regexpTag='[object RegExp]';var setTag='[object Set]';var stringTag='[object String]';var weakMapTag='[object WeakMap]';var arrayBufferTag='[object ArrayBuffer]';var dataViewTag='[object DataView]';var float32Tag='[object Float32Array]';var float64Tag='[object Float64Array]';var int8Tag='[object Int8Array]';var int16Tag='[object Int16Array]';var int32Tag='[object Int32Array]';var uint8Tag='[object Uint8Array]';var uint8ClampedTag='[object Uint8ClampedArray]';var uint16Tag='[object Uint16Array]';var uint32Tag='[object Uint32Array]';var typedArrayTags={};typedArrayTags[float32Tag]=typedArrayTags[float64Tag]=typedArrayTags[int8Tag]=typedArrayTags[int16Tag]=typedArrayTags[int32Tag]=typedArrayTags[uint8Tag]=typedArrayTags[uint8ClampedTag]=typedArrayTags[uint16Tag]=typedArrayTags[uint32Tag]=true;typedArrayTags[argsTag$1]=typedArrayTags[arrayTag]=typedArrayTags[arrayBufferTag]=typedArrayTags[boolTag]=typedArrayTags[dataViewTag]=typedArrayTags[dateTag]=typedArrayTags[errorTag]=typedArrayTags[funcTag$1]=typedArrayTags[mapTag]=typedArrayTags[numberTag]=typedArrayTags[objectTag]=typedArrayTags[regexpTag]=typedArrayTags[setTag]=typedArrayTags[stringTag]=typedArrayTags[weakMapTag]=false;function baseIsTypedArray(value){return isObjectLike(value)&&isLength(value.length)&&!!typedArrayTags[baseGetTag(value)];}
function baseUnary(func){return function(value){return func(value);};}
var freeExports$1=typeof exports=='object'&&exports&&!exports.nodeType&&exports;var freeModule$1=freeExports$1&&typeof module=='object'&&module&&!module.nodeType&&module;var moduleExports$1=freeModule$1&&freeModule$1.exports===freeExports$1;var freeProcess=moduleExports$1&&freeGlobal.process;var nodeUtil=(function(){try{return freeProcess&&freeProcess.binding('util');}catch(e){}}());var nodeIsTypedArray=nodeUtil&&nodeUtil.isTypedArray;var isTypedArray=nodeIsTypedArray?baseUnary(nodeIsTypedArray):baseIsTypedArray;var objectProto$2=Object.prototype;var hasOwnProperty$1=objectProto$2.hasOwnProperty;function arrayLikeKeys(value,inherited){var isArr=isArray(value),isArg=!isArr&&isArguments(value),isBuff=!isArr&&!isArg&&isBuffer(value),isType=!isArr&&!isArg&&!isBuff&&isTypedArray(value),skipIndexes=isArr||isArg||isBuff||isType,result=skipIndexes?baseTimes(value.length,String):[],length=result.length;for(var key in value){if((inherited||hasOwnProperty$1.call(value,key))&&!(skipIndexes&&(key=='length'||(isBuff&&(key=='offset'||key=='parent'))||(isType&&(key=='buffer'||key=='byteLength'||key=='byteOffset'))||isIndex(key,length)))){result.push(key);}}
return result;}
var objectProto$5=Object.prototype;function isPrototype(value){var Ctor=value&&value.constructor,proto=(typeof Ctor=='function'&&Ctor.prototype)||objectProto$5;return value===proto;}
function overArg(func,transform){return function(arg){return func(transform(arg));};}
var nativeKeys=overArg(Object.keys,Object);var objectProto$4=Object.prototype;var hasOwnProperty$3=objectProto$4.hasOwnProperty;function baseKeys(object){if(!isPrototype(object)){return nativeKeys(object);}
var result=[];for(var key in Object(object)){if(hasOwnProperty$3.call(object,key)&&key!='constructor'){result.push(key);}}
return result;}
function keys(object){return isArrayLike(object)?arrayLikeKeys(object):baseKeys(object);}
function createArrayIterator(coll){var i=-1;var len=coll.length;return function next(){return++i<len?{value:coll[i],key:i}:null;}}
function createES2015Iterator(iterator){var i=-1;return function next(){var item=iterator.next();if(item.done)
return null;i++;return{value:item.value,key:i};}}
function createObjectIterator(obj){var okeys=keys(obj);var i=-1;var len=okeys.length;return function next(){var key=okeys[++i];return i<len?{value:obj[key],key:key}:null;};}
function iterator(coll){if(isArrayLike(coll)){return createArrayIterator(coll);}
var iterator=getIterator(coll);return iterator?createES2015Iterator(iterator):createObjectIterator(coll);}
function onlyOnce(fn){return function(){if(fn===null)throw new Error("Callback was already called.");var callFn=fn;fn=null;callFn.apply(this,arguments);};}
function _eachOfLimit(limit){return function(obj,iteratee,callback){callback=once(callback||noop);if(limit<=0||!obj){return callback(null);}
var nextElem=iterator(obj);var done=false;var running=0;function iterateeCallback(err,value){running-=1;if(err){done=true;callback(err);}
else if(value===breakLoop||(done&&running<=0)){done=true;return callback(null);}
else{replenish();}}
function replenish(){while(running<limit&&!done){var elem=nextElem();if(elem===null){done=true;if(running<=0){callback(null);}
return;}
running+=1;iteratee(elem.value,elem.key,onlyOnce(iterateeCallback));}}
replenish();};}
function eachOfLimit(coll,limit,iteratee,callback){_eachOfLimit(limit)(coll,wrapAsync(iteratee),callback);}
function doLimit(fn,limit){return function(iterable,iteratee,callback){return fn(iterable,limit,iteratee,callback);};}
function eachOfArrayLike(coll,iteratee,callback){callback=once(callback||noop);var index=0,completed=0,length=coll.length;if(length===0){callback(null);}
function iteratorCallback(err,value){if(err){callback(err);}else if((++completed===length)||value===breakLoop){callback(null);}}
for(;index<length;index++){iteratee(coll[index],index,onlyOnce(iteratorCallback));}}
var eachOfGeneric=doLimit(eachOfLimit,Infinity);var eachOf=function(coll,iteratee,callback){var eachOfImplementation=isArrayLike(coll)?eachOfArrayLike:eachOfGeneric;eachOfImplementation(coll,wrapAsync(iteratee),callback);};function doParallel(fn){return function(obj,iteratee,callback){return fn(eachOf,obj,wrapAsync(iteratee),callback);};}
function _asyncMap(eachfn,arr,iteratee,callback){callback=callback||noop;arr=arr||[];var results=[];var counter=0;var _iteratee=wrapAsync(iteratee);eachfn(arr,function(value,_,callback){var index=counter++;_iteratee(value,function(err,v){results[index]=v;callback(err);});},function(err){callback(err,results);});}
var map=doParallel(_asyncMap);var applyEach=applyEach$1(map);function doParallelLimit(fn){return function(obj,limit,iteratee,callback){return fn(_eachOfLimit(limit),obj,wrapAsync(iteratee),callback);};}
var mapLimit=doParallelLimit(_asyncMap);var mapSeries=doLimit(mapLimit,1);var applyEachSeries=applyEach$1(mapSeries);var apply=function(fn){var args=slice(arguments,1);return function(){var callArgs=slice(arguments);return fn.apply(null,args.concat(callArgs));};};function arrayEach(array,iteratee){var index=-1,length=array==null?0:array.length;while(++index<length){if(iteratee(array[index],index,array)===false){break;}}
return array;}
function createBaseFor(fromRight){return function(object,iteratee,keysFunc){var index=-1,iterable=Object(object),props=keysFunc(object),length=props.length;while(length--){var key=props[fromRight?length:++index];if(iteratee(iterable[key],key,iterable)===false){break;}}
return object;};}
var baseFor=createBaseFor();function baseForOwn(object,iteratee){return object&&baseFor(object,iteratee,keys);}
function baseFindIndex(array,predicate,fromIndex,fromRight){var length=array.length,index=fromIndex+(fromRight?1:-1);while((fromRight?index--:++index<length)){if(predicate(array[index],index,array)){return index;}}
return-1;}
function baseIsNaN(value){return value!==value;}
function strictIndexOf(array,value,fromIndex){var index=fromIndex- 1,length=array.length;while(++index<length){if(array[index]===value){return index;}}
return-1;}
function baseIndexOf(array,value,fromIndex){return value===value?strictIndexOf(array,value,fromIndex):baseFindIndex(array,baseIsNaN,fromIndex);}
var auto=function(tasks,concurrency,callback){if(typeof concurrency==='function'){callback=concurrency;concurrency=null;}
callback=once(callback||noop);var keys$$1=keys(tasks);var numTasks=keys$$1.length;if(!numTasks){return callback(null);}
if(!concurrency){concurrency=numTasks;}
var results={};var runningTasks=0;var hasError=false;var listeners=Object.create(null);var readyTasks=[];var readyToCheck=[];var uncheckedDependencies={};baseForOwn(tasks,function(task,key){if(!isArray(task)){enqueueTask(key,[task]);readyToCheck.push(key);return;}
var dependencies=task.slice(0,task.length- 1);var remainingDependencies=dependencies.length;if(remainingDependencies===0){enqueueTask(key,task);readyToCheck.push(key);return;}
uncheckedDependencies[key]=remainingDependencies;arrayEach(dependencies,function(dependencyName){if(!tasks[dependencyName]){throw new Error('async.auto task `'+ key+'` has a non-existent dependency `'+
dependencyName+'` in '+
dependencies.join(', '));}
addListener(dependencyName,function(){remainingDependencies--;if(remainingDependencies===0){enqueueTask(key,task);}});});});checkForDeadlocks();processQueue();function enqueueTask(key,task){readyTasks.push(function(){runTask(key,task);});}
function processQueue(){if(readyTasks.length===0&&runningTasks===0){return callback(null,results);}
while(readyTasks.length&&runningTasks<concurrency){var run=readyTasks.shift();run();}}
function addListener(taskName,fn){var taskListeners=listeners[taskName];if(!taskListeners){taskListeners=listeners[taskName]=[];}
taskListeners.push(fn);}
function taskComplete(taskName){var taskListeners=listeners[taskName]||[];arrayEach(taskListeners,function(fn){fn();});processQueue();}
function runTask(key,task){if(hasError)return;var taskCallback=onlyOnce(function(err,result){runningTasks--;if(arguments.length>2){result=slice(arguments,1);}
if(err){var safeResults={};baseForOwn(results,function(val,rkey){safeResults[rkey]=val;});safeResults[key]=result;hasError=true;listeners=Object.create(null);callback(err,safeResults);}else{results[key]=result;taskComplete(key);}});runningTasks++;var taskFn=wrapAsync(task[task.length- 1]);if(task.length>1){taskFn(results,taskCallback);}else{taskFn(taskCallback);}}
function checkForDeadlocks(){var currentTask;var counter=0;while(readyToCheck.length){currentTask=readyToCheck.pop();counter++;arrayEach(getDependents(currentTask),function(dependent){if(--uncheckedDependencies[dependent]===0){readyToCheck.push(dependent);}});}
if(counter!==numTasks){throw new Error('async.auto cannot execute tasks due to a recursive dependency');}}
function getDependents(taskName){var result=[];baseForOwn(tasks,function(task,key){if(isArray(task)&&baseIndexOf(task,taskName,0)>=0){result.push(key);}});return result;}};function arrayMap(array,iteratee){var index=-1,length=array==null?0:array.length,result=Array(length);while(++index<length){result[index]=iteratee(array[index],index,array);}
return result;}
var symbolTag='[object Symbol]';function isSymbol(value){return typeof value=='symbol'||(isObjectLike(value)&&baseGetTag(value)==symbolTag);}
var INFINITY=1/0;var symbolProto=Symbol$1?Symbol$1.prototype:undefined;var symbolToString=symbolProto?symbolProto.toString:undefined;function baseToString(value){if(typeof value=='string'){return value;}
if(isArray(value)){return arrayMap(value,baseToString)+'';}
if(isSymbol(value)){return symbolToString?symbolToString.call(value):'';}
var result=(value+'');return(result=='0'&&(1/value)==-INFINITY)?'-0':result;}
function baseSlice(array,start,end){var index=-1,length=array.length;if(start<0){start=-start>length?0:(length+ start);}
end=end>length?length:end;if(end<0){end+=length;}
length=start>end?0:((end- start)>>>0);start>>>=0;var result=Array(length);while(++index<length){result[index]=array[index+ start];}
return result;}
function castSlice(array,start,end){var length=array.length;end=end===undefined?length:end;return(!start&&end>=length)?array:baseSlice(array,start,end);}
function charsEndIndex(strSymbols,chrSymbols){var index=strSymbols.length;while(index--&&baseIndexOf(chrSymbols,strSymbols[index],0)>-1){}
return index;}
function charsStartIndex(strSymbols,chrSymbols){var index=-1,length=strSymbols.length;while(++index<length&&baseIndexOf(chrSymbols,strSymbols[index],0)>-1){}
return index;}
function asciiToArray(string){return string.split('');}
var rsAstralRange='\\ud800-\\udfff';var rsComboMarksRange='\\u0300-\\u036f\\ufe20-\\ufe23';var rsComboSymbolsRange='\\u20d0-\\u20f0';var rsVarRange='\\ufe0e\\ufe0f';var rsZWJ='\\u200d';var reHasUnicode=RegExp('['+ rsZWJ+ rsAstralRange+ rsComboMarksRange+ rsComboSymbolsRange+ rsVarRange+']');function hasUnicode(string){return reHasUnicode.test(string);}
var rsAstralRange$1='\\ud800-\\udfff';var rsComboMarksRange$1='\\u0300-\\u036f\\ufe20-\\ufe23';var rsComboSymbolsRange$1='\\u20d0-\\u20f0';var rsVarRange$1='\\ufe0e\\ufe0f';var rsAstral='['+ rsAstralRange$1+']';var rsCombo='['+ rsComboMarksRange$1+ rsComboSymbolsRange$1+']';var rsFitz='\\ud83c[\\udffb-\\udfff]';var rsModifier='(?:'+ rsCombo+'|'+ rsFitz+')';var rsNonAstral='[^'+ rsAstralRange$1+']';var rsRegional='(?:\\ud83c[\\udde6-\\uddff]){2}';var rsSurrPair='[\\ud800-\\udbff][\\udc00-\\udfff]';var rsZWJ$1='\\u200d';var reOptMod=rsModifier+'?';var rsOptVar='['+ rsVarRange$1+']?';var rsOptJoin='(?:'+ rsZWJ$1+'(?:'+[rsNonAstral,rsRegional,rsSurrPair].join('|')+')'+ rsOptVar+ reOptMod+')*';var rsSeq=rsOptVar+ reOptMod+ rsOptJoin;var rsSymbol='(?:'+[rsNonAstral+ rsCombo+'?',rsCombo,rsRegional,rsSurrPair,rsAstral].join('|')+')';var reUnicode=RegExp(rsFitz+'(?='+ rsFitz+')|'+ rsSymbol+ rsSeq,'g');function unicodeToArray(string){return string.match(reUnicode)||[];}
function stringToArray(string){return hasUnicode(string)?unicodeToArray(string):asciiToArray(string);}
function toString(value){return value==null?'':baseToString(value);}
var reTrim=/^\s+|\s+$/g;function trim(string,chars,guard){string=toString(string);if(string&&(guard||chars===undefined)){return string.replace(reTrim,'');}
if(!string||!(chars=baseToString(chars))){return string;}
var strSymbols=stringToArray(string),chrSymbols=stringToArray(chars),start=charsStartIndex(strSymbols,chrSymbols),end=charsEndIndex(strSymbols,chrSymbols)+ 1;return castSlice(strSymbols,start,end).join('');}
var FN_ARGS=/^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;var FN_ARG_SPLIT=/,/;var FN_ARG=/(=.+)?(\s*)$/;var STRIP_COMMENTS=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;function parseParams(func){func=func.toString().replace(STRIP_COMMENTS,'');func=func.match(FN_ARGS)[2].replace(' ','');func=func?func.split(FN_ARG_SPLIT):[];func=func.map(function(arg){return trim(arg.replace(FN_ARG,''));});return func;}
function autoInject(tasks,callback){var newTasks={};baseForOwn(tasks,function(taskFn,key){var params;var fnIsAsync=isAsync(taskFn);var hasNoDeps=(!fnIsAsync&&taskFn.length===1)||(fnIsAsync&&taskFn.length===0);if(isArray(taskFn)){params=taskFn.slice(0,-1);taskFn=taskFn[taskFn.length- 1];newTasks[key]=params.concat(params.length>0?newTask:taskFn);}else if(hasNoDeps){newTasks[key]=taskFn;}else{params=parseParams(taskFn);if(taskFn.length===0&&!fnIsAsync&&params.length===0){throw new Error("autoInject task functions require explicit parameters.");}
if(!fnIsAsync)params.pop();newTasks[key]=params.concat(newTask);}
function newTask(results,taskCb){var newArgs=arrayMap(params,function(name){return results[name];});newArgs.push(taskCb);wrapAsync(taskFn).apply(null,newArgs);}});auto(newTasks,callback);}
function DLL(){this.head=this.tail=null;this.length=0;}
function setInitial(dll,node){dll.length=1;dll.head=dll.tail=node;}
DLL.prototype.removeLink=function(node){if(node.prev)node.prev.next=node.next;else this.head=node.next;if(node.next)node.next.prev=node.prev;else this.tail=node.prev;node.prev=node.next=null;this.length-=1;return node;};DLL.prototype.empty=function(){while(this.head)this.shift();return this;};DLL.prototype.insertAfter=function(node,newNode){newNode.prev=node;newNode.next=node.next;if(node.next)node.next.prev=newNode;else this.tail=newNode;node.next=newNode;this.length+=1;};DLL.prototype.insertBefore=function(node,newNode){newNode.prev=node.prev;newNode.next=node;if(node.prev)node.prev.next=newNode;else this.head=newNode;node.prev=newNode;this.length+=1;};DLL.prototype.unshift=function(node){if(this.head)this.insertBefore(this.head,node);else setInitial(this,node);};DLL.prototype.push=function(node){if(this.tail)this.insertAfter(this.tail,node);else setInitial(this,node);};DLL.prototype.shift=function(){return this.head&&this.removeLink(this.head);};DLL.prototype.pop=function(){return this.tail&&this.removeLink(this.tail);};DLL.prototype.toArray=function(){var arr=Array(this.length);var curr=this.head;for(var idx=0;idx<this.length;idx++){arr[idx]=curr.data;curr=curr.next;}
return arr;};DLL.prototype.remove=function(testFn){var curr=this.head;while(!!curr){var next=curr.next;if(testFn(curr)){this.removeLink(curr);}
curr=next;}
return this;};function queue(worker,concurrency,payload){if(concurrency==null){concurrency=1;}
else if(concurrency===0){throw new Error('Concurrency must not be zero');}
var _worker=wrapAsync(worker);var numRunning=0;var workersList=[];function _insert(data,insertAtFront,callback){if(callback!=null&&typeof callback!=='function'){throw new Error('task callback must be a function');}
q.started=true;if(!isArray(data)){data=[data];}
if(data.length===0&&q.idle()){return setImmediate$1(function(){q.drain();});}
for(var i=0,l=data.length;i<l;i++){var item={data:data[i],callback:callback||noop};if(insertAtFront){q._tasks.unshift(item);}else{q._tasks.push(item);}}
setImmediate$1(q.process);}
function _next(tasks){return function(err){numRunning-=1;for(var i=0,l=tasks.length;i<l;i++){var task=tasks[i];var index=baseIndexOf(workersList,task,0);if(index>=0){workersList.splice(index);}
task.callback.apply(task,arguments);if(err!=null){q.error(err,task.data);}}
if(numRunning<=(q.concurrency- q.buffer)){q.unsaturated();}
if(q.idle()){q.drain();}
q.process();};}
var isProcessing=false;var q={_tasks:new DLL(),concurrency:concurrency,payload:payload,saturated:noop,unsaturated:noop,buffer:concurrency/4,empty:noop,drain:noop,error:noop,started:false,paused:false,push:function(data,callback){_insert(data,false,callback);},kill:function(){q.drain=noop;q._tasks.empty();},unshift:function(data,callback){_insert(data,true,callback);},remove:function(testFn){q._tasks.remove(testFn);},process:function(){if(isProcessing){return;}
isProcessing=true;while(!q.paused&&numRunning<q.concurrency&&q._tasks.length){var tasks=[],data=[];var l=q._tasks.length;if(q.payload)l=Math.min(l,q.payload);for(var i=0;i<l;i++){var node=q._tasks.shift();tasks.push(node);data.push(node.data);}
numRunning+=1;workersList.push(tasks[0]);if(q._tasks.length===0){q.empty();}
if(numRunning===q.concurrency){q.saturated();}
var cb=onlyOnce(_next(tasks));_worker(data,cb);}
isProcessing=false;},length:function(){return q._tasks.length;},running:function(){return numRunning;},workersList:function(){return workersList;},idle:function(){return q._tasks.length+ numRunning===0;},pause:function(){q.paused=true;},resume:function(){if(q.paused===false){return;}
q.paused=false;setImmediate$1(q.process);}};return q;}
function cargo(worker,payload){return queue(worker,1,payload);}
var eachOfSeries=doLimit(eachOfLimit,1);function reduce(coll,memo,iteratee,callback){callback=once(callback||noop);var _iteratee=wrapAsync(iteratee);eachOfSeries(coll,function(x,i,callback){_iteratee(memo,x,function(err,v){memo=v;callback(err);});},function(err){callback(err,memo);});}
function seq(){var _functions=arrayMap(arguments,wrapAsync);return function(){var args=slice(arguments);var that=this;var cb=args[args.length- 1];if(typeof cb=='function'){args.pop();}else{cb=noop;}
reduce(_functions,args,function(newargs,fn,cb){fn.apply(that,newargs.concat(function(err){var nextargs=slice(arguments,1);cb(err,nextargs);}));},function(err,results){cb.apply(that,[err].concat(results));});};}
var compose=function(){return seq.apply(null,slice(arguments).reverse());};function concat$1(eachfn,arr,fn,callback){var result=[];eachfn(arr,function(x,index,cb){fn(x,function(err,y){result=result.concat(y||[]);cb(err);});},function(err){callback(err,result);});}
var concat=doParallel(concat$1);function doSeries(fn){return function(obj,iteratee,callback){return fn(eachOfSeries,obj,wrapAsync(iteratee),callback);};}
var concatSeries=doSeries(concat$1);var constant=function(){var values=slice(arguments);var args=[null].concat(values);return function(){var callback=arguments[arguments.length- 1];return callback.apply(this,args);};};function identity(value){return value;}
function _createTester(check,getResult){return function(eachfn,arr,iteratee,cb){cb=cb||noop;var testPassed=false;var testResult;eachfn(arr,function(value,_,callback){iteratee(value,function(err,result){if(err){callback(err);}else if(check(result)&&!testResult){testPassed=true;testResult=getResult(true,value);callback(null,breakLoop);}else{callback();}});},function(err){if(err){cb(err);}else{cb(null,testPassed?testResult:getResult(false));}});};}
function _findGetResult(v,x){return x;}
var detect=doParallel(_createTester(identity,_findGetResult));var detectLimit=doParallelLimit(_createTester(identity,_findGetResult));var detectSeries=doLimit(detectLimit,1);function consoleFunc(name){return function(fn){var args=slice(arguments,1);args.push(function(err){var args=slice(arguments,1);if(typeof console==='object'){if(err){if(console.error){console.error(err);}}else if(console[name]){arrayEach(args,function(x){console[name](x);});}}});wrapAsync(fn).apply(null,args);};}
var dir=consoleFunc('dir');function doDuring(fn,test,callback){callback=onlyOnce(callback||noop);var _fn=wrapAsync(fn);var _test=wrapAsync(test);function next(err){if(err)return callback(err);var args=slice(arguments,1);args.push(check);_test.apply(this,args);}
function check(err,truth){if(err)return callback(err);if(!truth)return callback(null);_fn(next);}
check(null,true);}
function doWhilst(iteratee,test,callback){callback=onlyOnce(callback||noop);var _iteratee=wrapAsync(iteratee);var next=function(err){if(err)return callback(err);var args=slice(arguments,1);if(test.apply(this,args))return _iteratee(next);callback.apply(null,[null].concat(args));};_iteratee(next);}
function doUntil(iteratee,test,callback){doWhilst(iteratee,function(){return!test.apply(this,arguments);},callback);}
function during(test,fn,callback){callback=onlyOnce(callback||noop);var _fn=wrapAsync(fn);var _test=wrapAsync(test);function next(err){if(err)return callback(err);_test(check);}
function check(err,truth){if(err)return callback(err);if(!truth)return callback(null);_fn(next);}
_test(check);}
function _withoutIndex(iteratee){return function(value,index,callback){return iteratee(value,callback);};}
function eachLimit(coll,iteratee,callback){eachOf(coll,_withoutIndex(wrapAsync(iteratee)),callback);}
function eachLimit$1(coll,limit,iteratee,callback){_eachOfLimit(limit)(coll,_withoutIndex(wrapAsync(iteratee)),callback);}
var eachSeries=doLimit(eachLimit$1,1);function ensureAsync(fn){if(isAsync(fn))return fn;return initialParams(function(args,callback){var sync=true;args.push(function(){var innerArgs=arguments;if(sync){setImmediate$1(function(){callback.apply(null,innerArgs);});}else{callback.apply(null,innerArgs);}});fn.apply(this,args);sync=false;});}
function notId(v){return!v;}
var every=doParallel(_createTester(notId,notId));var everyLimit=doParallelLimit(_createTester(notId,notId));var everySeries=doLimit(everyLimit,1);function baseProperty(key){return function(object){return object==null?undefined:object[key];};}
function filterArray(eachfn,arr,iteratee,callback){var truthValues=new Array(arr.length);eachfn(arr,function(x,index,callback){iteratee(x,function(err,v){truthValues[index]=!!v;callback(err);});},function(err){if(err)return callback(err);var results=[];for(var i=0;i<arr.length;i++){if(truthValues[i])results.push(arr[i]);}
callback(null,results);});}
function filterGeneric(eachfn,coll,iteratee,callback){var results=[];eachfn(coll,function(x,index,callback){iteratee(x,function(err,v){if(err){callback(err);}else{if(v){results.push({index:index,value:x});}
callback();}});},function(err){if(err){callback(err);}else{callback(null,arrayMap(results.sort(function(a,b){return a.index- b.index;}),baseProperty('value')));}});}
function _filter(eachfn,coll,iteratee,callback){var filter=isArrayLike(coll)?filterArray:filterGeneric;filter(eachfn,coll,wrapAsync(iteratee),callback||noop);}
var filter=doParallel(_filter);var filterLimit=doParallelLimit(_filter);var filterSeries=doLimit(filterLimit,1);function forever(fn,errback){var done=onlyOnce(errback||noop);var task=wrapAsync(ensureAsync(fn));function next(err){if(err)return done(err);task(next);}
next();}
var groupByLimit=function(coll,limit,iteratee,callback){callback=callback||noop;var _iteratee=wrapAsync(iteratee);mapLimit(coll,limit,function(val,callback){_iteratee(val,function(err,key){if(err)return callback(err);return callback(null,{key:key,val:val});});},function(err,mapResults){var result={};var hasOwnProperty=Object.prototype.hasOwnProperty;for(var i=0;i<mapResults.length;i++){if(mapResults[i]){var key=mapResults[i].key;var val=mapResults[i].val;if(hasOwnProperty.call(result,key)){result[key].push(val);}else{result[key]=[val];}}}
return callback(err,result);});};var groupBy=doLimit(groupByLimit,Infinity);var groupBySeries=doLimit(groupByLimit,1);var log=consoleFunc('log');function mapValuesLimit(obj,limit,iteratee,callback){callback=once(callback||noop);var newObj={};var _iteratee=wrapAsync(iteratee);eachOfLimit(obj,limit,function(val,key,next){_iteratee(val,key,function(err,result){if(err)return next(err);newObj[key]=result;next();});},function(err){callback(err,newObj);});}
var mapValues=doLimit(mapValuesLimit,Infinity);var mapValuesSeries=doLimit(mapValuesLimit,1);function has(obj,key){return key in obj;}
function memoize(fn,hasher){var memo=Object.create(null);var queues=Object.create(null);hasher=hasher||identity;var _fn=wrapAsync(fn);var memoized=initialParams(function memoized(args,callback){var key=hasher.apply(null,args);if(has(memo,key)){setImmediate$1(function(){callback.apply(null,memo[key]);});}else if(has(queues,key)){queues[key].push(callback);}else{queues[key]=[callback];_fn.apply(null,args.concat(function(){var args=slice(arguments);memo[key]=args;var q=queues[key];delete queues[key];for(var i=0,l=q.length;i<l;i++){q[i].apply(null,args);}}));}});memoized.memo=memo;memoized.unmemoized=fn;return memoized;}
var _defer$1;if(hasNextTick){_defer$1=process.nextTick;}else if(hasSetImmediate){_defer$1=setImmediate;}else{_defer$1=fallback;}
var nextTick=wrap(_defer$1);function _parallel(eachfn,tasks,callback){callback=callback||noop;var results=isArrayLike(tasks)?[]:{};eachfn(tasks,function(task,key,callback){wrapAsync(task)(function(err,result){if(arguments.length>2){result=slice(arguments,1);}
results[key]=result;callback(err);});},function(err){callback(err,results);});}
function parallelLimit(tasks,callback){_parallel(eachOf,tasks,callback);}
function parallelLimit$1(tasks,limit,callback){_parallel(_eachOfLimit(limit),tasks,callback);}
var queue$1=function(worker,concurrency){var _worker=wrapAsync(worker);return queue(function(items,cb){_worker(items[0],cb);},concurrency,1);};var priorityQueue=function(worker,concurrency){var q=queue$1(worker,concurrency);q.push=function(data,priority,callback){if(callback==null)callback=noop;if(typeof callback!=='function'){throw new Error('task callback must be a function');}
q.started=true;if(!isArray(data)){data=[data];}
if(data.length===0){return setImmediate$1(function(){q.drain();});}
priority=priority||0;var nextNode=q._tasks.head;while(nextNode&&priority>=nextNode.priority){nextNode=nextNode.next;}
for(var i=0,l=data.length;i<l;i++){var item={data:data[i],priority:priority,callback:callback};if(nextNode){q._tasks.insertBefore(nextNode,item);}else{q._tasks.push(item);}}
setImmediate$1(q.process);};delete q.unshift;return q;};function race(tasks,callback){callback=once(callback||noop);if(!isArray(tasks))return callback(new TypeError('First argument to race must be an array of functions'));if(!tasks.length)return callback();for(var i=0,l=tasks.length;i<l;i++){wrapAsync(tasks[i])(callback);}}
function reduceRight(array,memo,iteratee,callback){var reversed=slice(array).reverse();reduce(reversed,memo,iteratee,callback);}
function reflect(fn){var _fn=wrapAsync(fn);return initialParams(function reflectOn(args,reflectCallback){args.push(function callback(error,cbArg){if(error){reflectCallback(null,{error:error});}else{var value;if(arguments.length<=2){value=cbArg;}else{value=slice(arguments,1);}
reflectCallback(null,{value:value});}});return _fn.apply(this,args);});}
function reject$1(eachfn,arr,iteratee,callback){_filter(eachfn,arr,function(value,cb){iteratee(value,function(err,v){cb(err,!v);});},callback);}
var reject=doParallel(reject$1);function reflectAll(tasks){var results;if(isArray(tasks)){results=arrayMap(tasks,reflect);}else{results={};baseForOwn(tasks,function(task,key){results[key]=reflect.call(this,task);});}
return results;}
var rejectLimit=doParallelLimit(reject$1);var rejectSeries=doLimit(rejectLimit,1);function constant$1(value){return function(){return value;};}
function retry(opts,task,callback){var DEFAULT_TIMES=5;var DEFAULT_INTERVAL=0;var options={times:DEFAULT_TIMES,intervalFunc:constant$1(DEFAULT_INTERVAL)};function parseTimes(acc,t){if(typeof t==='object'){acc.times=+t.times||DEFAULT_TIMES;acc.intervalFunc=typeof t.interval==='function'?t.interval:constant$1(+t.interval||DEFAULT_INTERVAL);acc.errorFilter=t.errorFilter;}else if(typeof t==='number'||typeof t==='string'){acc.times=+t||DEFAULT_TIMES;}else{throw new Error("Invalid arguments for async.retry");}}
if(arguments.length<3&&typeof opts==='function'){callback=task||noop;task=opts;}else{parseTimes(options,opts);callback=callback||noop;}
if(typeof task!=='function'){throw new Error("Invalid arguments for async.retry");}
var _task=wrapAsync(task);var attempt=1;function retryAttempt(){_task(function(err){if(err&&attempt++<options.times&&(typeof options.errorFilter!='function'||options.errorFilter(err))){setTimeout(retryAttempt,options.intervalFunc(attempt));}else{callback.apply(null,arguments);}});}
retryAttempt();}
var retryable=function(opts,task){if(!task){task=opts;opts=null;}
var _task=wrapAsync(task);return initialParams(function(args,callback){function taskFn(cb){_task.apply(null,args.concat(cb));}
if(opts)retry(opts,taskFn,callback);else retry(taskFn,callback);});};function series(tasks,callback){_parallel(eachOfSeries,tasks,callback);}
var some=doParallel(_createTester(Boolean,identity));var someLimit=doParallelLimit(_createTester(Boolean,identity));var someSeries=doLimit(someLimit,1);function sortBy(coll,iteratee,callback){var _iteratee=wrapAsync(iteratee);map(coll,function(x,callback){_iteratee(x,function(err,criteria){if(err)return callback(err);callback(null,{value:x,criteria:criteria});});},function(err,results){if(err)return callback(err);callback(null,arrayMap(results.sort(comparator),baseProperty('value')));});function comparator(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0;}}
function timeout(asyncFn,milliseconds,info){var fn=wrapAsync(asyncFn);return initialParams(function(args,callback){var timedOut=false;var timer;function timeoutCallback(){var name=asyncFn.name||'anonymous';var error=new Error('Callback function "'+ name+'" timed out.');error.code='ETIMEDOUT';if(info){error.info=info;}
timedOut=true;callback(error);}
args.push(function(){if(!timedOut){callback.apply(null,arguments);clearTimeout(timer);}});timer=setTimeout(timeoutCallback,milliseconds);fn.apply(null,args);});}
var nativeCeil=Math.ceil;var nativeMax=Math.max;function baseRange(start,end,step,fromRight){var index=-1,length=nativeMax(nativeCeil((end- start)/ (step || 1)), 0),
result=Array(length);while(length--){result[fromRight?length:++index]=start;start+=step;}
return result;}
function timeLimit(count,limit,iteratee,callback){var _iteratee=wrapAsync(iteratee);mapLimit(baseRange(0,count,1),limit,_iteratee,callback);}
var times=doLimit(timeLimit,Infinity);var timesSeries=doLimit(timeLimit,1);function transform(coll,accumulator,iteratee,callback){if(arguments.length<=3){callback=iteratee;iteratee=accumulator;accumulator=isArray(coll)?[]:{};}
callback=once(callback||noop);var _iteratee=wrapAsync(iteratee);eachOf(coll,function(v,k,cb){_iteratee(accumulator,v,k,cb);},function(err){callback(err,accumulator);});}
function tryEach(tasks,callback){var error=null;var result;callback=callback||noop;eachSeries(tasks,function(task,callback){wrapAsync(task)(function(err,res){if(arguments.length>2){result=slice(arguments,1);}else{result=res;}
error=err;callback(!err);});},function(){callback(error,result);});}
function unmemoize(fn){return function(){return(fn.unmemoized||fn).apply(null,arguments);};}
function whilst(test,iteratee,callback){callback=onlyOnce(callback||noop);var _iteratee=wrapAsync(iteratee);if(!test())return callback(null);var next=function(err){if(err)return callback(err);if(test())return _iteratee(next);var args=slice(arguments,1);callback.apply(null,[null].concat(args));};_iteratee(next);}
function until(test,iteratee,callback){whilst(function(){return!test.apply(this,arguments);},iteratee,callback);}
var waterfall=function(tasks,callback){callback=once(callback||noop);if(!isArray(tasks))return callback(new Error('First argument to waterfall must be an array of functions'));if(!tasks.length)return callback();var taskIndex=0;function nextTask(args){var task=wrapAsync(tasks[taskIndex++]);args.push(onlyOnce(next));task.apply(null,args);}
function next(err){if(err||taskIndex===tasks.length){return callback.apply(null,arguments);}
nextTask(slice(arguments,1));}
nextTask([]);};var index={applyEach:applyEach,applyEachSeries:applyEachSeries,apply:apply,asyncify:asyncify,auto:auto,autoInject:autoInject,cargo:cargo,compose:compose,concat:concat,concatSeries:concatSeries,constant:constant,detect:detect,detectLimit:detectLimit,detectSeries:detectSeries,dir:dir,doDuring:doDuring,doUntil:doUntil,doWhilst:doWhilst,during:during,each:eachLimit,eachLimit:eachLimit$1,eachOf:eachOf,eachOfLimit:eachOfLimit,eachOfSeries:eachOfSeries,eachSeries:eachSeries,ensureAsync:ensureAsync,every:every,everyLimit:everyLimit,everySeries:everySeries,filter:filter,filterLimit:filterLimit,filterSeries:filterSeries,forever:forever,groupBy:groupBy,groupByLimit:groupByLimit,groupBySeries:groupBySeries,log:log,map:map,mapLimit:mapLimit,mapSeries:mapSeries,mapValues:mapValues,mapValuesLimit:mapValuesLimit,mapValuesSeries:mapValuesSeries,memoize:memoize,nextTick:nextTick,parallel:parallelLimit,parallelLimit:parallelLimit$1,priorityQueue:priorityQueue,queue:queue$1,race:race,reduce:reduce,reduceRight:reduceRight,reflect:reflect,reflectAll:reflectAll,reject:reject,rejectLimit:rejectLimit,rejectSeries:rejectSeries,retry:retry,retryable:retryable,seq:seq,series:series,setImmediate:setImmediate$1,some:some,someLimit:someLimit,someSeries:someSeries,sortBy:sortBy,timeout:timeout,times:times,timesLimit:timeLimit,timesSeries:timesSeries,transform:transform,tryEach:tryEach,unmemoize:unmemoize,until:until,waterfall:waterfall,whilst:whilst,all:every,any:some,forEach:eachLimit,forEachSeries:eachSeries,forEachLimit:eachLimit$1,forEachOf:eachOf,forEachOfSeries:eachOfSeries,forEachOfLimit:eachOfLimit,inject:reduce,foldl:reduce,foldr:reduceRight,select:filter,selectLimit:filterLimit,selectSeries:filterSeries,wrapSync:asyncify};exports['default']=index;exports.applyEach=applyEach;exports.applyEachSeries=applyEachSeries;exports.apply=apply;exports.asyncify=asyncify;exports.auto=auto;exports.autoInject=autoInject;exports.cargo=cargo;exports.compose=compose;exports.concat=concat;exports.concatSeries=concatSeries;exports.constant=constant;exports.detect=detect;exports.detectLimit=detectLimit;exports.detectSeries=detectSeries;exports.dir=dir;exports.doDuring=doDuring;exports.doUntil=doUntil;exports.doWhilst=doWhilst;exports.during=during;exports.each=eachLimit;exports.eachLimit=eachLimit$1;exports.eachOf=eachOf;exports.eachOfLimit=eachOfLimit;exports.eachOfSeries=eachOfSeries;exports.eachSeries=eachSeries;exports.ensureAsync=ensureAsync;exports.every=every;exports.everyLimit=everyLimit;exports.everySeries=everySeries;exports.filter=filter;exports.filterLimit=filterLimit;exports.filterSeries=filterSeries;exports.forever=forever;exports.groupBy=groupBy;exports.groupByLimit=groupByLimit;exports.groupBySeries=groupBySeries;exports.log=log;exports.map=map;exports.mapLimit=mapLimit;exports.mapSeries=mapSeries;exports.mapValues=mapValues;exports.mapValuesLimit=mapValuesLimit;exports.mapValuesSeries=mapValuesSeries;exports.memoize=memoize;exports.nextTick=nextTick;exports.parallel=parallelLimit;exports.parallelLimit=parallelLimit$1;exports.priorityQueue=priorityQueue;exports.queue=queue$1;exports.race=race;exports.reduce=reduce;exports.reduceRight=reduceRight;exports.reflect=reflect;exports.reflectAll=reflectAll;exports.reject=reject;exports.rejectLimit=rejectLimit;exports.rejectSeries=rejectSeries;exports.retry=retry;exports.retryable=retryable;exports.seq=seq;exports.series=series;exports.setImmediate=setImmediate$1;exports.some=some;exports.someLimit=someLimit;exports.someSeries=someSeries;exports.sortBy=sortBy;exports.timeout=timeout;exports.times=times;exports.timesLimit=timeLimit;exports.timesSeries=timesSeries;exports.transform=transform;exports.tryEach=tryEach;exports.unmemoize=unmemoize;exports.until=until;exports.waterfall=waterfall;exports.whilst=whilst;exports.all=every;exports.allLimit=everyLimit;exports.allSeries=everySeries;exports.any=some;exports.anyLimit=someLimit;exports.anySeries=someSeries;exports.find=detect;exports.findLimit=detectLimit;exports.findSeries=detectSeries;exports.forEach=eachLimit;exports.forEachSeries=eachSeries;exports.forEachLimit=eachLimit$1;exports.forEachOf=eachOf;exports.forEachOfSeries=eachOfSeries;exports.forEachOfLimit=eachOfLimit;exports.inject=reduce;exports.foldl=reduce;exports.foldr=reduceRight;exports.select=filter;exports.selectLimit=filterLimit;exports.selectSeries=filterSeries;exports.wrapSync=asyncify;Object.defineProperty(exports,'__esModule',{value:true});})));