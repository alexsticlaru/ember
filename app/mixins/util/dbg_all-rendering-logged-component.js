import Mixin from '@ember/object/mixin';

/*
 * This is an introspection tool made for components.
 *
 * <usage>
 * import dbg_AllStepsLogedMixin from '../mixins/util/dbg_all-rendering-logged-component';
 * export default Component.extend(dbg_AllStepsLogedMixin, {
 * 		componentName: 'MyComponent',
 * 		... component code ...
 * }
 * </usage>
 *
 * It will log in the console all the lifecycle hooks called and also will compare the properties of the component between two hooks call and highlight the changes.
 * A lot of dev/crapy code but the feature should work fine.
 */

export default Mixin.create({
	//Log through all component lifecycle hooks
    //https://guides.emberjs.com/v3.4.0/components/the-component-lifecycle/
	componentName: "Please set the free string 'componentName' property in your component!",


	_snapshot : [],
	_templateArgs : [],

	_logBuffer: [],

	__log: function(){
		let logBuffer = this.get('_logBuffer');
		for( var d in arguments )
			logBuffer.push( arguments[d] );
		this.set('_logBuffer', logBuffer);
	},

	__getLog: function(){
		let logBuffer = this.get('_logBuffer');
		if(!logBuffer.length)return;
this.get('dbgS').notify(this.get('componentName')+'__log(): ', ...logBuffer);
		this.set('_logBuffer', []);
	},

	_dumpProp: function(prop, val, level){
		//let val=this.get(prop);
		let dbg = false;
		if( !level )level = 1;
		if( val==undefined )return 'undefined';
		if( typeof val === "function" || (val.inner && typeof val.inner === "function") )return null;
		if(prop.indexOf('__EMBER_ARRAY__')===0)return null;
		if(prop.indexOf('__ember')===0)return null;
		if(prop.indexOf('__INIT_WAS_CALLED__')===0)return null;
		if(prop.indexOf('_state')===0)return null;
		if(prop.indexOf('__ROOT_REF__')===0)return null;
/*
		if( prop === '@each' || prop === 'observersForKey' || prop === 'cacheFor' || prop === 'copy' || prop === 'frozenCopy' || prop === '_pendingSave' || prop === 'hasObserverFor' || prop === 'propertyWillChange' || prop === 'addObserver' || prop === 'propertyDidChange' || prop === 'endPropertyChanges' || prop === 'beginPropertyChanges' || prop === 'setProperties' || prop === 'set' || prop === 'getProperties' || prop === 'get' || prop === 'setObjects' || prop === 'reverseObjects' || prop === 'unshiftObjects' || prop === 'unshiftObject' || prop === 'shiftObjects' || prop === 'shiftObject' || prop === 'popObject' || prop === 'pushObjects'
		)
			return "function";
*/
		if( typeof val==='object' && !val.inner && !val._lastValue )
			return null;

if(dbg)this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_A , '+level+' {'+typeof val+'}-'+prop+'=', val);

		if( val.inner!==undefined ){
			if( typeof val.inner==='function' ){
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_B-'+prop+'=>"function"');
this.__getLog();}
				return 'function';
			}else if( typeof val.inner==='object' ){
				let vals = this.__dumpObj(val.inner, level+1);
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_C1-'+prop+'=>"object{}:'+vals+'"');
this.__getLog();}
				return 'object{}:'+vals;
			}
			//string/int/boolean:
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_C2-'+prop+'=>"'+val.inner+'"');
this.__getLog();}
			return val.inner;
		}else if( val._lastValue!==undefined && val._lastValue ){
			if( typeof val._lastValue==='object' ){
				if( val._lastValue._debugContainerKey!==undefined ){
					if( val._lastValue._debugContainerKey.indexOf('model:')===0 ){
						//Ember model
						let vals = this.__dumpObj( val._lastValue._internalModel.__recordData.__data , level+1);
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_D-'+prop+'=>"object{'+val._lastValue._debugContainerKey+'.'+val._lastValue._internalModel.__recordData.id+'}:'+vals+'"');
this.__getLog();}
						return 'object{'+val._lastValue._debugContainerKey+'.'+val._lastValue._internalModel.__recordData.id+'}:'+vals;
					}
					//object/array
					//let vals = this.__dumpObj( val._lastValue.?? , level+1);
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_E-'+prop+'=>"object{'+val._lastValue._debugContainerKey+'}?"');
this.__getLog();}
					return 'object{'+val._lastValue._debugContainerKey+'}?';
				}

				if( val._lastValue.modelName!==undefined ){
					//Ember model collection (dynamic get : no data dumped here, no model id)
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_F-'+prop+'=>"object{'+val._lastValue.modelName+' collection}"');
this.__getLog();}
						return 'object{'+val._lastValue.modelName+' collection}';
				}
			}
			//computed/observer:
			if( typeof val._lastValue === 'object' ){
				let vals = this.__dumpObj( val._lastValue , level+1);
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_G-'+prop+'=>"computed:'+JSON.stringify(vals)+'"');
this.__getLog();}
				return 'computed:'+JSON.stringify(vals);
			}

if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_H-'+prop+'=>"'+val._lastValue+'"');
this.__getLog();}
			//return this._dumpProp(prop, val._lastValue, level+1);
			return val._lastValue;
		}else if( val._lastValue!==undefined ){
//if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_H2-'+prop+' has a _lastValue but null ! =>"', val, '"');
			if( typeof val._lastValue==='function' ){
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_H1-'+prop+'=>"function"');
this.__getLog();}
				return 'function';
			}
			//computed/observer:
			if( typeof val._lastValue === 'object' ){
if(dbg)this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_H2-'+prop+'=>"object"');
				let vals = this.__dumpObj( val._lastValue , level+1);
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_G-'+prop+'=>"computed:'+JSON.stringify(vals)+'"');
this.__getLog();}
				return 'computed:'+JSON.stringify(vals);
			}
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_H3-'+prop+'=>"mixed"', val._lastValue);
this.__getLog();}
			return val._lastValue;
		}
		/**/
		if( typeof val==='function' ){
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_I-'+prop+'=>"function"');
this.__getLog();}
			return 'function';
		}
		if( typeof val === 'object' ){
			let vals = this.__dumpObj(val, level+1);
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_J-'+prop+'=>"object{}:'+vals+'"');
this.__getLog();}
//return null;//PROBLEM HERE !
			return 'object{}:'+vals;
		}
if(dbg){this.get('dbgS').notify(this.get('componentName')+'_DUMPPROP_LAST-'+prop+'=', val);
this.__getLog();this.__getLog();}
		return val;

	},

	__dumpObj: function( object, level ){
		//return "N/A";
//this.get('dbgS').notify(this.get('componentName')+'__dumpObj(object, '+level+');');
this.__log( this.get('componentName')+'__dumpObj(object, '+level+');' );
		if( !level )level = 1;
		if( level > 2 ){
			return "NODUMP!";
		}
		let vals = [];
		for(var subprop in object){
			if(subprop.indexOf('__EMBER_ARRAY__')===0)continue;
			if(subprop.indexOf('__ember')===0)continue;
			if(subprop.indexOf('__INIT_WAS_CALLED__')===0)continue;
			if(subprop.indexOf('_state')===0)continue;
			if(subprop.indexOf('__ROOT_REF__')===0)continue;
			if( typeof object[subprop] === 'function' ){
				vals[subprop] = "function";
				continue;
			}
			if( typeof object[subprop] === 'object' ){
//this.get('dbgS').notify(this.get('componentName')+'__dumpObj:object['+subprop+']');
this.__log(this.get('componentName')+'__dumpObj:object['+subprop+']');
				vals[subprop] = "object:"+this.__dumpObj(object[subprop], level+1);
				continue;
			}
			if(typeof object[subprop] === "function")return null;
			if(subprop.indexOf('__EMBER_ARRAY__')===0)return null;
//this.get('dbgS').notify(this.get('componentName')+'__dumpObj:=> this._dumpProp('+subprop+', object[subprop], '+(level+1)+')');
this.__log(this.get('componentName')+'__dumpObj:=> this._dumpProp('+subprop+', object[subprop], '+(level+1)+')');
			vals[subprop] = this._dumpProp(subprop, object[subprop], level+1);
		}
		if(!vals.length)return "{}";
		return JSON.stringify( vals );
	},

	_getComponentSnapshot:function (){
		let snapshot=[];
		let tpltArgs=[];
		for( var d in this ){
			if( !this.get(d) /* || ( !this.get(d)._lastValue && !this.get(d).inner || this.get(d).inner.toString().indexOf('function ')===0 ) )*/ || typeof this.get(d) === "function" )continue;
			if( !tpltArgs.length && d.indexOf("__ARGS__")===0 ){
//this.get('dbgS').notify('SNAPPING tpltArgs!');
				let pval = this.get(d);
				for(let arg in pval){
					let dump = this._dumpProp(arg, pval[arg]);
					if(!dump)continue;
					let val = [ arg, dump ];
					tpltArgs.push( val );
				}
				continue;
			}
			//propsList += d+"=", this.get(d), ' --\n ';
			let dump = this._dumpProp(d, this.get(d));
			if(!dump)continue;
			let val = [ d, dump ];
			//snapshot[d] = val;
			snapshot.push(val);
			//this.get('dbgS').notify('willUpdate '+this.get('componentName')+'.'+d+'{'+typeof val+'}=', val, snapshot.d, snapshot.length);
		}
		this.set( '_templateArgs', tpltArgs );
//this.get('dbgS').notify('SNAP tpltArgs! {'+tpltArgs.length+'}', tpltArgs);
//this.get('dbgS').notify('SNAP! {'+snapshot.length+'}', snapshot);
		return snapshot;
	},

	_compareComponentToSnapshot:function (){
		let snapshot=this._getComponentSnapshot();
		if( !this.get('_snapshot').length ){
//this.get('dbgS').notify('BURP!', this.get('_snapshot'));
//this.get('dbgS').notify('_compareComponentToSnapshot A0');
			this.set('_snapshot', snapshot);
this.get('dbgS').notify( this.get('componentName')+'\nSNAPSHOT=', snapshot);
			return;
		}
//this.get('dbgS').notify('_compareComponentToSnapshot A2');
/*
if(false){
		let snapshot=new Array();
		for( var d in this ){
			if( !this.get(d) // || ( !this.get(d)._lastValue && !this.get(d).inner || this.get(d).inner.toString().indexOf('function ')===0 ) )
			|| typeof this.get(d) === "function" )continue;
			//propsList += d+"=", this.get(d), ' --\n ';
			let val = this.get(d);
			//this.get('dbgS').notify('willUpdate '+this.get('componentName')+'.'+d+'{'+typeof val+'}=', val);
			snapshot[d] = val;
		}
}
*/
		let lastshot=this.get('_snapshot');
		let changes = [];
		let noChanges = [];
		for( var d in snapshot ){
			let propName = snapshot[d][0];
			let found = false;
			for( var e in lastshot ){
				if( lastshot[e][0] === propName ){
					found = true;
					break;
				}
			}

			if( !found )
				changes.push( [snapshot[d][0], 'N/A', snapshot[d][1]] );
			else if( lastshot[e][1] !== snapshot[d][1] )
				changes.push( [snapshot[d][0], lastshot[e][1], snapshot[d][1]] );
			else if(lastshot[e][1]!==undefined || snapshot[d][1]!==undefined)
				noChanges.push( [d, snapshot[d][0], lastshot[e][1], snapshot[d][1]] );

// 			let prop1 = this.get(lastshot[d][0]);
// 			let prop2 = this.get(snapshot[d][0]);
// 			let val1 = this.get(lastshot[d][1]);
// 			let val2 = this.get(snapshot[d][1]);
			//if( val1 !== val2 ){
				//let val = this.get(d);
				//this.get('dbgS').notify('Component property changed : '+this.get('componentName')+'.'+d+'{'+typeof val1+'-'+prop1+'/'+prop2+'}=', val1, ' -- PREVIOUS =', val2);
			//}
		}
//this.get('dbgS').notify('_compareComponentToSnapshot B');
		this.set('_snapshot', snapshot);
//this.get('dbgS').notify('_compareComponentToSnapshot C');
		if( changes.length ){
			this.get('dbgS').notify( this.get('componentName')+' - component properties CHANGED !\nchanges=', changes, '\nnoChanges=', noChanges, '\ntemplateArgs=', this.get( '_templateArgs' ) );
this.get('dbgS').notify( this.get('componentName')+'\nNew SNAPSHOT=', snapshot);
		}
	},

	init:function(){
		this.get('dbgS').notify(this.get('componentName')+' init(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	//Initial or Re-render :
	didReceiveAttrs:function(){
		this.get('dbgS').notify(this.get('componentName')+' didReceiveAttrs(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	willRender:function(){
		this.get('dbgS').notify(this.get('componentName')+' willRender(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	didInsertElement:function(){
		this.get('dbgS').notify(this.get('componentName')+' didInsertElement(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	didRender:function(){
		this.get('dbgS').notify(this.get('componentName')+' didRender(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},


	//Re-render :
	didUpdateAttrs:function(){
		this.get('dbgS').notify(this.get('componentName')+' didUpdateAttrs(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	willUpdate:function(){
		this.get('dbgS').notify(this.get('componentName')+' willUpdate(', ...arguments, ');');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	didUpdate:function(){
		this.get('dbgS').notify(this.get('componentName')+' didUpdate(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

	//Destroy :
	willDestroyElement:function(){
		this.get('dbgS').notify(this.get('componentName')+' willDestroyElement(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},
	willClearRender:function(){
		this.get('dbgS').notify(this.get('componentName')+' willClearRender(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},
	didDestroyElement:function(){
		this.get('dbgS').notify(this.get('componentName')+' didDestroyElement(', ...arguments, ')');
		this._compareComponentToSnapshot();
		this._super(...arguments);
	},

});
