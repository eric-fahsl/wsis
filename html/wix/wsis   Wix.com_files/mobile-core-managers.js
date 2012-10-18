W.Managers.list.combine([{Class:"mobile.core.managers.data.DataManager",target:"Data"},{Class:"mobile.core.managers.data.ComponentDataManager",target:"ComponentData"},{Class:"mobile.core.managers.ThemeManager",target:"Theme"},{Class:"mobile.core.managers.CssManager",target:"Css"},{Class:"mobile.core.managers.ComponentManager",target:"Components"},{Class:"mobile.core.managers.SkinManager",target:"Skins"},{Class:"mobile.core.managers.ConfigurationManager",target:"Config"},{Class:"mobile.core.managers.ResourceManager",target:"Resources"},{Class:"mobile.core.managers.LinkTypesManager",target:"LinkTypes"},{Class:"mobile.core.managers.ViewManager",target:"Viewer"},{Class:"mobile.core.managers.HtmlScriptsLoader",target:"HtmlScriptsLoader"}]);
(function(){var d={getType:function(){return""
}};
var b=function(g){if(!g.dataInstance){g.dataInstance=d
}var e=g.idPrefix?g.idPrefix+"___":"";
var i=g.logicClass.prototype.className;
var h=i.lastIndexOf(".");
i=h>-1?i.substr(h):i;
var m=g.viewNode.getProperty("id")||W.Utils.getUniqueId(e+i);
var j=new g.logicClass(m,g.viewNode,g.compData.argsObject);
var f=new g.skinClass();
if(g.compData.innerStyle){f.applyStyle(g.compData.innerStyle)
}j.setSkin(f);
if(g.style){j.setStyle(g.style)
}var l=j.getAcceptableDataTypes();
var k=g.dataInstance.getType();
if(g.compProperties){j.setComponentProperties(g.compProperties)
}if(l.indexOf(k)!=-1){if(g.dataInstance!==d){j.setDataItem(g.dataInstance)
}}else{LOG.reportError(wixErrors.WIXIFY_INVALID_DATA_TYPE,"wrong data type",k,", data type: "+k+", acceptable types: "+l+", component: "+j.className)
}g.viewNode.getLogic=function(){return j
};
g.viewNode.fireEvent(Constants.ComponentEvents.WIXIFIED);
j.fireEvent(Constants.ComponentEvents.WIXIFIED)
};
Element.implement({wixify:function(u,j,g,o,q){var n,i,t,s,h,k,p,m,v,e;
n=this.getProperty("comp");
i=this.getProperty("skin");
t=this.getProperty("dataQuery");
s=this.getProperty("propertyQuery");
k={argsObject:u,innerStyle:q};
e=this.getProperty("styleId");
if(!o&&Constants.WixifyTimeOut){o=Constants.WixifyTimeOut
}var l=new c(b,o,n);
if(e){W.Theme.getStyle(e,function(w){l.setParam("style",w);
W.Skins.getSkin(w.getSkin(),l.getAsyncSetterFor("skinClass"))
},i)
}else{l.setParam("style",undefined);
if(!i){LOG.reportError(wixErrors.WIXIFY_NO_SKIN,"Element","wixify",n);
return
}W.Skins.getSkin(i,l.getAsyncSetterFor("skinClass"))
}if(!n){LOG.reportError(wixErrors.WIXIFY_NO_COMP,"Element","wixify",n);
return
}if(this.getLogic){LOG.reportError(wixErrors.WIXIFY_ALREADY_WIXIFIED,"Element","wixify",n);
return
}h=this;
h.fireEvent("wixifyStarted");
l.setParam("viewNode",h);
l.setParam("idPrefix",g);
l.setParam("compData",k);
if(j){l.setParam("dataInstance",j)
}else{if(t){var r,f=this.getProperty("dataQuerySource");
if(!f||f!="preview"||!W.Editor){r=W.Data
}else{r=W.Preview.getPreviewManagers().Data
}r.getDataByQuery(t,l.getAsyncSetterFor("dataInstance"))
}else{l.setParam("dataInstance",d)
}}if(s){this.isTimedOut=false;
this.propQueryTimer=setTimeout(function(){this.isTimedOut=true;
l.setParam("compProperties",undefined)
}.bind(this),10000);
W.ComponentData.getDataByQuery(s,function(w){if(!this.isTimedOut){clearTimeout(this.propQueryTimer);
l.getAsyncSetterFor("compProperties")(w)
}}.bind(this))
}else{l.setParam("compProperties",undefined)
}W.Components.getComponent(n,l.getAsyncSetterFor("logicClass"));
l.run();
return this
}});
Elements.implement({wixify:function(f,e){for(var g=this.length-1;
g>-1;
--g){this[g].wixify(f,e)
}return this
}});
var a=2000;
function c(g,e,f){this._requiredParams={compData:null,compProperties:null,idPrefix:null,logicClass:null,skinClass:null,dataInstance:null,viewNode:null,style:null};
this._wixifyCallback=g;
this._paramsSet={};
this._className=f;
this._startTime=new Date().getTime();
this._wixifyTimeout=e?e:a
}c.prototype={_timedOut:null,_timeOutId:null,run:function(){this._timeOutHandler=setTimeout(function(){this._clearTimeout();
this._onWixifyTimeout()
}.bind(this),this._wixifyTimeout)
},_clearTimeout:function(){clearTimeout(this._timeOutHandler)
},setParam:function(e,f){if(!this._requiredParams.hasOwnProperty(e)){throw ("this wixifier is not waiting for a parameter named "+e)
}this._requiredParams[e]=f;
this._paramsSet[e]=new Date().getTime()-this._startTime;
this._checkIfEverythingIsThere()
},getAsyncSetterFor:function(e){return function(f){this.setParam(e,f)
}.bind(this)
},_checkIfEverythingIsThere:function(){var e=true;
for(var f in this._requiredParams){if(this._requiredParams.hasOwnProperty(f)){if(this._paramsSet[f]===undefined){e=false;
break
}}}if(e){this._onAllWixifyParamsReady()
}},_onAllWixifyParamsReady:function(){this._clearTimeout();
if(this._wixifyCallback){this._wixifyCallback(this._requiredParams)
}if(this._timedOut){var e=new Date().getTime()-this._startTime;
LOG.reportError(wixErrors.WIXIFY_FINISHED_AFTER_TIMEOUT,e,this._timeOutId,e)
}},_onWixifyTimeout:function(){this._timedOut=new Date().getTime()-this._startTime;
this._timeOutId="["+this._className+":"+this._timedOut+"]";
var j=this._requiredParams,e=this._paramsSet;
var g=[];
var f=[];
for(var i in j){if(j.hasOwnProperty(i)){if(e[i]===undefined){g.push(i)
}}}var h="Time: "+this._wixifyTimeout+". missing: "+g.join(",");
W.Utils.debugTrace("Wixify Error",this._className,this._timeOutId,h);
if((g.length==1)&&(g[0])=="compProperties"){LOG.reportError(wixErrors.WIXIFY_TIMEOUT,this._className,this._timeOutId,h);
this._onAllWixifyParamsReady()
}},toString:function(){return"[Wixifier]"
}}
})();
(function(){Constants.Background={VALID_WIDTH:["auto","contain","cover"],VALID_POSITION_X:["left","right","center"],VALID_POSITION_Y:["top","bottom","center"],VALID_ATTACHMENT:["scroll","fixed"],VALID_REPEAT:["repeat","no-repeat"],DEFAULT_PYRAMID_SIZE:1920};
W.Background=new WClass({className:"Background",initialize:function(a,b){this.setThemeManager(b);
if(!a){return
}if(a.getThemeString){a=a.getThemeString()
}var c=a.split(" ").filter(function(d){return !!d
});
this.set.apply(this,c)
},setThemeManager:function(a){this._themeManager=a
},set:function(b,j,e,i,h,a,g,f,d,c){this._setColor(c);
this.setImage(b,j,e);
this.setRepeat(g,f);
this.setAttachment(d);
this.setPosition(i,h);
this.setWidth(a)
},setWidth:function(b){var a=parseInt(b,10);
var c=Constants.Background.VALID_WIDTH;
this._width=(c.contains(b)||!isNaN(a))?b:(this._width||c[0])
},setPosition:function(b,e){if(typeof e=="undefined"){var a=b.split(" ");
if(a.length===2){b=a[0];
e=a[1]
}}var d=Constants.Background.VALID_POSITION_X;
var c=Constants.Background.VALID_POSITION_Y;
this._x=(d.contains(b))?b:this._x||d[0];
this._y=(c.contains(e))?e:this._y||c[0]
},setAttachment:function(a){var b=Constants.Background.VALID_ATTACHMENT;
this._attachment=(b.contains(a))?a:this._attachment||b[0]
},setColorReference:function(a){this._colorSource="theme";
this._colorName=a;
this._color=new W.Color(this._themeManager&&this._themeManager.getProperty(a)).getHex()
},setColor:function(a){this._colorSource="value";
this._colorName="";
this._color=new W.Color(a).getHex()
},_setColor:function(c){var a="";
var b=c&&(c.test(/\{.+\}/)||c.test(/\[.+\]/));
if(c&&(b)){a=(b&&c.substring(1,c.length-1))||c;
this.setColorReference(a)
}else{this.setColor(c)
}},setImage:function(a,b,c){this._imageId=a||"none";
this._imageW=b||0;
this._imageH=c||0
},setPyramidSize:function(a){this._pyramid=a
},setRepeat:function(a,d){if(typeof d=="undefined"){var b=a.split(" ");
switch(b.length){case 1:d=a;
break;
case 2:a=b[0];
d=b[1]
}}var c=Constants.Background.VALID_REPEAT;
this._repeatX=(c.contains(a))?a:this._repeatX||c[0];
this._repeatY=(c.contains(d))?d:this._repeatY||c[0]
},getCssValue:function(a){var b=(a)?"background:":"";
if(this.getImageId()){b+=[this.getUrl(),this.getPosition(),this.getRepeatUnified(),this.getAttachment()].join(" ")+" "
}b+=this.getColor();
return b
},getCssSizeValue:function(a){return this.getWidth(a)
},getCssRule:function(a){var b=this.getCssValue(true);
if(a){b+=";"+this.getCssSizeValue(true)
}return b
},getCssRules:function(){return[this.getUrl(true),this.getPosition(true),this.getWidth(true),this.getRepeat(true),this.getAttachment(true),this.getColor(true)].join(";")
},getThemeString:function(){var a=(this._colorSource==="theme")?"{"+this.getColorReference()+"}":this.getColor();
return[this.getImageId(),this.getImageSize()[0],this.getImageSize()[1],this.getPosition(),this.getWidth(),this.getRepeat(),this.getAttachment(),a].join(" ")
},getWidth:function(a){var b=(a)?"background-size:":"";
b+=this._width;
return b
},getWidthInline:function(a){if((Modernizr&&Modernizr.backgroundsize)||a){return"/"+this.getWidth()
}return""
},getPosition:function(a){var b=(a)?"background-position:":"";
b+=this.getPositionX()+" "+this.getPositionY();
return b
},getPositionX:function(a){var b=(a)?"background-position-x:":"";
b+=this._x;
return b
},getPositionY:function(a){var b=(a)?"background-position-y:":"";
b+=this._y;
return b
},getAttachment:function(a){var b=(a)?"background-attachment:":"";
b+=this._attachment;
return b
},getColor:function(a){var b=(a)?"background-color:":"";
b+=this._color;
return b
},getColorReference:function(){return this._colorName
},getUrl:function(a){var b=W.Config.getServiceTopologyProperty("staticMediaUrl")+"/";
var c=(a)?"background-image:":"";
if(this._imageId=="none"){c+=this._imageId
}else{c+="url("+b+this._imageId+this._getPyramidSuffix()+")"
}return c
},getImageSize:function(){return[this._imageW,this._imageH]
},getImageId:function(){return this._imageId||"none"
},_getPyramidSuffix:function(){var c="";
var f=this._pyramid||Constants.Background.DEFAULT_PYRAMID_SIZE;
var a=[];
var e=1;
var b;
var d;
a[0]=parseInt(this.getImageSize()[0],10);
a[1]=parseInt(this.getImageSize()[1],10);
e=a[0]/a[1];
b=a[0];
d=a[1];
if(a[0]>f||a[1]>f){b=(a[0]>=a[1])?f:Math.round(e*f);
d=(a[1]>=a[0])?f:Math.round((1/e)*f)
}c="_crp_0_0_"+a[0]+"_"+a[1]+"_"+b+"_"+d+"_crp";
return c
},getRepeat:function(a){var b=(a)?"background-repeat:":"";
b+=this._repeatX+" "+this._repeatY;
return b
},getRepeatUnified:function(a){var b=(a)?"background-repeat:":"";
if(this._repeatX==this._repeatY){b+=(this._repeatX=="no-repeat")?"no-repeat":"repeat"
}else{b+=(this._repeatX=="repeat")?"repeat-x":"repeat-y"
}return b
},toString:function(){return this.getCssValue()
}})
}());
(function(){Constants.FONT={STYLE:["normal","italic"],VARIANT:["normal","small-caps","inherit"],WEIGHT:["normal","bold","bolder","lighter"],UNITS:["px","em","pt","ex","in","cm","mm","pc"]};
W.Font=new WClass({className:"Font",initialize:function(d,b){this.setThemeManager(b);
if(typeOf(d)=="string"){this._parseFontString(d)
}else{var c=d||{};
this.setStyle((c.getStyle&&typeOf(c.getStyle)=="function")?c.getStyle():undefined);
this.setVariant((c.getVariant&&typeOf(c.getVariant)=="function")?c.getVariant():undefined);
this.setWeight((c.getWeight&&typeOf(c.getWeight)=="function")?c.getWeight():undefined);
this.setSize((c.getSize&&typeOf(c.getSize)=="function")?c.getSize():undefined);
this.setLineHeight((c.getLineHeight&&typeOf(c.getLineHeight)=="function")?c.getLineHeight():undefined);
this.setFontFamily((c.getFontFamily&&typeOf(c.getFontFamily)=="function")?c.getFontFamily():undefined);
if(c.getColorReference&&typeOf(c.getColorReference)=="function"&&c.getColorReference()!==""){this.setColorReference(c.getColorReference())
}else{var a=(c.getColor&&typeOf(c.getColor)=="function")?c.getColor():"#000000";
this.setColor(a)
}}},getThemeString:function(){var a=(this._colorSource==="theme")?"{"+this.getColorReference()+"}":this.getColor();
return[this._style,this._variant,this._weight,this.getSize()+"/"+this.getLineHeight(),this.getFontFamilyWithNoSpaces(),a].join(" ")
},getCssRule:function(){return["font:",this.getCssValue(),"; color:",this.getColor()].join(" ")
},getCssValue:function(){var a=this.getFontFamilyWithFallbacks();
return[this._style,this._variant,this._weight,this.getSize()+"/"+this.getLineHeight(),a].join(" ")
},getStyle:function(){return this._style
},getVariant:function(){return this._variant
},getWeight:function(){return this._weight
},getSize:function(){return this._fontSize+this._fontUnit
},getLineHeight:function(){return this._lineHeightSize+this._lineHeightUnit
},getFontFamily:function(){return this._fontFamily
},getFontFamilyWithNoSpaces:function(){return this._fontFamily.replace(/\s/g,"+")
},getFontFamilyWithFallbacks:function(){return W.Css.getFontFallbacksCss(this._fontFamily)
},getColorReference:function(){return this._colorName
},getColor:function(){return this._color
},_parseFontString:function(a){var b=a.split(" ");
var c=b[3]?b[3].split("/"):[];
this.setStyle(b[0]);
this.setVariant(b[1]);
this.setWeight(b[2]);
this.setSize(c[0]);
this.setLineHeight(c[1]);
this.setFontFamily(b[4]);
this._setColor(b[5])
},setThemeManager:function(a){this._themeManager=a
},setStyle:function(a){a=(Constants.FONT.STYLE.contains(a))?a:Constants.FONT.STYLE[0];
this._style=a
},setVariant:function(a){a=(Constants.FONT.VARIANT.contains(a))?a:Constants.FONT.VARIANT[0];
this._variant=a
},setWeight:function(a){a=(Constants.FONT.WEIGHT.contains(a))?a:Constants.FONT.WEIGHT[0];
this._weight=a
},setSize:function(a){var b=this._seperateSizeFromUnit(a);
this._fontSize=b.size;
this._fontUnit=b.unit
},setLineHeight:function(a){var b=this._seperateSizeFromUnit(a);
this._lineHeightSize=b.size;
this._lineHeightUnit=b.unit
},setFontFamily:function(a){a=a&&a.replace(/\+/g," ");
var b=W.Css.getFontType(a);
if(!b){a=W.Css.getDefaultFont();
b="system"
}this._fontFamily=a
},setColorReference:function(a){this._colorSource="theme";
this._colorName=a;
this._color=new W.Color(this._themeManager&&this._themeManager.getProperty(a)).getHex()
},setColor:function(a){this._colorSource="value";
this._colorName="";
this._color=new W.Color(a).getHex()
},_setColor:function(c){var a="";
var b=c&&(c.test(/\{.+\}/)||c.test(/\[.+\]/));
if(c&&(b)){a=(b&&c.substring(1,c.length-1))||c;
this.setColorReference(a)
}else{this.setColor(c)
}},_seperateSizeFromUnit:function(c){c=String(c);
var a=parseFloat(c);
var b=c.split(String(a)).join("");
a=(!isNaN(a))?a:this._getDefaultFontSize();
b=(Constants.FONT.UNITS.contains(b))?b:this._getDefaultFontUnit();
return{unit:b,size:a}
},_getDefaultFontSize:function(){return(this._fontSize)?this._fontSize:12
},_getDefaultFontUnit:function(){return(this._fontUnit)?this._fontUnit:Constants.FONT.UNITS[0]
},toString:function(){return this.getCssValue()
}})
})();
Constants.ComponentEvents={DISPLAYED:"displayed",READY:"componentReady",WIXIFIED:"wixified",PROPERTY_CHANGE:"componentPropertyChange",READY_FOR_RENDER:"readyForRender",RENDER:"render"};
Constants.ComponentPartTypes={HTML_ELEMENT:"htmlElement"};
var SizeLimits=new Class({minW:null,minH:null,maxW:null,maxH:null,initialize:function(){},clone:function(){var a=new SizeLimits();
a.minW=this.minW;
a.minH=this.minH;
a.maxW=this.maxW;
a.maxH=this.maxH;
return a
}});
W.BaseComponentClassData={name:"mobile.core.components.base.BaseComponent",Class:{Extends:Events,Binds:["getComponentProperties","_setSkinPartElements","_onDataChange","_onDefaultAction","_replaceSkin","_replaceSkinAsync","_onRenderingTriggerEvent","_onComponentWixified","_onEditModeChanged","_skinParamsChange"],Static:{MINIMUM_X_DEFAULT:-2000,MAXIMUM_X_DEFAULT:2000,MINIMUM_Y_DEFAULT:-1000,MAXIMUM_Y_DEFAULT:40000,MINIMUM_WIDTH_DEFAULT:5,MINIMUM_HEIGHT_DEFAULT:5,MAXIMUM_WIDTH_DEFAULT:2500,MAXIMUM_HEIGHT_DEFAULT:2000},_renderTriggers:[],initialize:function(d,b,a){this._compId=d;
this._view=b;
this._styleNameSpace=a&&a.styleNameSpace;
this._isEnabled=!b.disabled;
this._view.setProperty("id",(a&&a.id)||d);
this._allComponentPartsReady=false;
this._componentReady=false;
this._isRenderNeeded=true;
this._autoBoundParts=null;
this._isDisposed=false;
this._isRendered=false;
this._editorMode="CURRENT_PAGE";
var c=(a&&a.command)||b.getAttribute("command");
this._commandParameter=(a&&a.commandParameter)||b.getAttribute("commandParameter");
this._command=null;
this._commandName=null;
this._usesExternalData=false;
this._callLaterIDs=[];
this._stateGrpDict={};
this._sizeLimits=this.getSizeLimits();
this._minimumTimeBetweenRenders=this._minimumTimeBetweenRenders||0;
this._lastRenderTime=-9999;
this._renderDelayed=false;
if(c){this.setCommand(c,this._commandParameter)
}this._isDisplayed=false;
b.addEvent(Constants.ComponentEvents.WIXIFIED,this._onComponentWixified);
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onEditModeChanged)
},toString:function(){return"[Component "+this.className+" #"+this._compId+"]"
},getComponentId:function(){return this._compId
},getComponentType:function(){return this._view.get("comp")
},_getDataManager:function(){return this._data.getDataManager()
},getViewNode:function(){return this._view
},getStyleNameSpace:function(){return this._styleNameSpace||this.getOriginalClassName()
},getSizeLimits:function(){if(this._sizeLimits===undefined){this._sizeLimits=new SizeLimits();
this._sizeLimits.minW=this._sizeLimits.minW||this.MINIMUM_WIDTH_DEFAULT;
this._sizeLimits.minH=this._sizeLimits.minH||this.MINIMUM_HEIGHT_DEFAULT;
this._sizeLimits.maxW=this._sizeLimits.maxW||this.MAXIMUM_WIDTH_DEFAULT;
this._sizeLimits.maxH=this._sizeLimits.maxH||this.MAXIMUM_HEIGHT_DEFAULT;
this._originalSizeLimits=this._sizeLimits.clone()
}return this._sizeLimits
},_initSizeLimits:function(){},setMinW:function(a){this.getSizeLimits().minW=a;
this._originalSizeLimits.minW=a;
this._applySizeLimitsIfNeeded()
},setMinH:function(a){this.getSizeLimits().minH=a;
this._originalSizeLimits.minH=a;
this._applySizeLimitsIfNeeded()
},setMaxW:function(a){this.getSizeLimits().maxW=a;
this._originalSizeLimits.maxW=a;
this._applySizeLimitsIfNeeded()
},setMaxH:function(a){this.getSizeLimits().maxH=a;
this._originalSizeLimits.maxH=a;
this._applySizeLimitsIfNeeded()
},_applySizeLimitsIfNeeded:function(){if(this._$width<this.getSizeLimits().minW||this._$width>this.getSizeLimits().maxW){this.setWidth(this._$width)
}if(this._$height<this.getSizeLimits().minH||this._$height>this.getSizeLimits().maxH){this.setHeight(this._$height)
}},getAcceptableDataTypes:function(){return[""]
},getRawData:function(){return this._data?this._data.getData():undefined
},getDataItem:function(){return this._data
},isUsingExternalData:function(){return this._usesExternalData
},setDataItem:function(a){var c=this._data;
try{if(c){c.removeComponentWithInterest(this);
c.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
}}catch(b){}this._data=a;
if(a&&a!=c){this._data.addComponentWithInterest(this);
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
}this._onDataChange(a);
this._tryCreatingComponentParts()
},setDataByQuery:function(a,b){this.injects().Data.getDataByQuery(a,function(c){this.setDataItem(c);
b()
}.bind(this))
},_setSkinPartElements:function(a){this._validateSkinParts(a);
this._skinPartElements=a;
this._tryCreatingComponentParts()
},_validateSkinParts:function(b){for(var a in this._skinPartsSchema){var c=this._skinPartsSchema[a];
if(!b[a]&&!c.optional&&c.autoCreate!==false&&!c.repeater){LOG.reportError(wixErrors.SKIN_PART_MISSING,this.$className+" / "+this._skin.$className,"_validateSkinParts",a)()
}}},_tryCreatingComponentParts:function(){if(this._skinPartElements&&(this._data||this.getAcceptableDataTypes().indexOf("")>=0)){this._loadComponentParts()
}},_loadComponentParts:function(){this._allComponentPartsReady=false;
this._skinParts=this._skinPartElements;
var a=[];
for(var b in this._skinPartsSchema){if("view"==b){continue
}var d=this._createInnerComponent(b,this._skinParts[b],true);
if(d){a.push(d)
}}delete this._skinPartElements;
if(a.length!==0){var c=new Async.Bulk(a,null,{completeEvent:Constants.ComponentEvents.READY,onComplete:function(){for(var g=0;
g<a.length;
g++){var e=a[g];
var f=e.get("skinPart");
if(f){this._skinParts[f]=e.getLogic()
}}this._setAllPartsReady()
}.bind(this)})
}else{this._setAllPartsReady()
}},_createInnerComponent:function(b,a,d){var c=this.getSkinPartDefinition(b);
if(c.type==Constants.ComponentPartTypes.HTML_ELEMENT||c.repeater){return
}if(d&&c.autoCreate===false){return
}c.skin=c.skin||a.getProperty("skin");
return this._createComponentbyDefinition(c,a)
},_createComponentbyDefinition:function(c,b,g){b=b||new Element("div");
b.setProperty("skinPart",c.id);
var e;
if(c.dataQuery){e=c.dataQuery
}else{if(c.dataRefField){var f=c.dataRefField;
if(f=="*"){e=this._data
}else{e=this._data.get(f)
}}else{if(c.dataItem){e=c.dataItem
}else{if(c.dataType){e=this._data.getDataManager().addDataItemWithUniqueId("",{type:c.dataType}).dataObject;
e.setMeta("isPersistent",false)
}}}}if(this._data&&this._data.getDataManager()!=W.Data){b.set("dataQuerySource","preview")
}else{if(c.dataQuerySource){b.set("dataQuerySource",c.dataQuerySource)
}}c.argObject=c.argObject||{};
var a;
if(c.styleGroup&&this._style){a=(c.styleGroup=="inherit")?this._style:this._style.getStyleByGroupName(c.styleGroup)
}var d;
if(g||a){d=function(h){if(a){}if(g){g(h)
}}
}return this.injects().Components.createComponent({compNode:b,type:c.type,skin:c.skin,data:e,args:c.argObject,componentReadyCallback:d,innerStyle:a})
},getSkinPartDefinition:function(a){var e=this._skinPartsSchema[a];
if(!e){LOG.reportError(wixErrors.CM_NO_PART,this.className,"getSkinPartParams",skinPartName);
return ret
}var d=this._skinPartsSchema[a]||{};
var b=(this._skin&&this._skin.getCompPartsDefinition()[a])||{};
var c=Object.merge({id:a},b,d);
if(c.hookMethod&&typeOf(this[c.hookMethod])=="function"){c.argObject=c.argObject||{};
c=this[c.hookMethod](c)
}return c
},_setAllPartsReady:function(){if(this._allComponentPartsReady){return
}this._allComponentPartsReady=true;
this._registerDataBindings();
this._registerSkinPartCommands();
this._applySizeLimitsIfNeeded();
this._onAllSkinPartsReady(this._skinParts);
this._renderIfReady()
},setTextContent:function(){W.Utils.debugTrace("")
},setSkin:function(b){if(this._skin){this._skin.unRegister()
}if(this._skinParts&&this._skinParts.inlineContent){var d=this._skin.getInlineContent();
this._view.empty();
this._view.adopt(d)
}this._skin=b;
var c=this.getSizeLimits();
var a=this._originalSizeLimits;
c.minW=this._skin.minW||a.minW;
c.minH=this._skin.minH||a.minH;
c.maxW=this._skin.maxW||a.maxW;
c.maxH=this._skin.maxH||a.maxH;
this._skin.register(this._view,this._setSkinPartElements,this._skinParamsChange)
},_skinParamsChange:function(a){},setStyle:function(a){if(a===this._style){return
}if(this._style){this._style.removeEvent("skinChange",this._replaceSkinAsync)
}this._style=a;
if(a.getSkin()!=this._skin.getOriginalClassName()){this._skin.injects().Skins.getSkin(a.getSkin(),this._replaceSkin)
}else{this._skin.applyStyle(a)
}this._updateViewAttributes();
this._style.addEvent("skinChange",this._replaceSkinAsync);
this._onStyleReady()
},_onEditModeChanged:function(b){var a=this._editorMode;
this._editorMode=b;
this._editModeChanged(b,a)
},_editModeChanged:function(b,a){},_onStyleReady:function(){},getStyle:function(){return this._style
},_replaceSkinAsync:function(){this._skin.injects().Skins.getSkin(this._style.getSkin(),this._replaceSkin)
},_replaceSkin:function(b){var a=new b();
a.applyStyle(this._style);
this.setSkin(a)
},_updateViewAttributes:function(){this._view.removeAttribute("styleId");
this._view.removeAttribute("styleid");
this._view.setAttribute("skin",this._skin.$className);
if(this._style){this._view.removeAttribute("skin");
this._view.setAttribute("styleId",this._style.getId())
}},render:function(){},_onAllSkinPartsReady:function(){},_onDataChange:function(a,c,b){if(!this._preventRenderOnDataChange(a,c,b)){this._renderIfReady()
}},_preventRenderOnDataChange:function(a,c,b){},_renderIfReady:function(){if(this._componentReady){this._tryRender(true)
}else{this._testComponentReady()
}},renderIfNeeded:function(){if(this._componentReady){this._tryRender(false)
}else{this._testComponentReady()
}},_tryRender:function(c){this._isRenderNeeded=this._isRenderNeeded||(!!c);
if(!this._componentReady||!this._needsRender()||!this._allComponentPartsReady){return this._componentReady&&this._allComponentPartsReady
}var b=false;
if(this._minimumTimeBetweenRenders===0||this._timeSinceLastRender()>this._minimumTimeBetweenRenders){if(this._prepareForRender()){b=true;
this.fireEvent(Constants.ComponentEvents.READY_FOR_RENDER);
if(!this._skipRender&&this._isDisplayed){this._isRenderNeeded=false;
this._newlyDisplayed=false;
this._lastRenderTime=new Date().getTime();
this.render();
this._isRendered=true;
this._refreshDataBindings();
if(!this._areRenderingTriggersAttached){this._areRenderingTriggersAttached=true;
this._attachRenderTriggers()
}this.fireEvent(Constants.ComponentEvents.RENDER);
this._view.fireEvent(Constants.ComponentEvents.RENDER)
}}}else{if(!this._renderDelayed){this._renderDelayed=true;
var a=Math.max(10,this._minimumTimeBetweenRenders-this._timeSinceLastRender());
this.callLater(this._delayedRenderCB,[c],a)
}}return b
},_delayedRenderCB:function(a){this._renderDelayed=false;
this._tryRender(a)
},_timeSinceLastRender:function(){return new Date().getTime()-this._lastRenderTime
},_needsRender:function(){return this._isRenderNeeded
},isReady:function(){return this._componentReady
},isRendered:function(){return this._isRendered
},setCollapsed:function(a){if(a){this.collapse()
}else{this.uncollapse()
}},callLater:function(d,a,b){var c=this.injects().Utils.callLater(d,a,this,b);
if(c){this._callLaterIDs.push(c)
}return c
},callRenderLater:function(a){a=a||100;
if(!this._renderDelayed){this._renderDelayed=true;
this.callLater(function(){this._renderDelayed=false;
this._renderIfReady()
}.bind(this),[],a)
}},collapse:function(){if(this._view){this._view.collapse()
}},uncollapse:function(a){if(this._view){this._view.uncollapse(a)
}},setState:function(d,a){this._processStates();
var c=this._currentState;
if(!a){a=this._stateGrpDict[d]||"DEFAULT"
}a=a.toUpperCase();
var b=this._stateMap[a];
if(!b){LOG.reportError(wixErrors.CM_UNKNOWN_STATE_GROUP,this.$className,"setState",a)
}else{if(b.indexOf(d)<0){LOG.reportError(wixErrors.CM_UNKNOWN_STATE_NAME,this.$className,"setState",a+":"+d)
}else{this._currentStateMap[a]=d;
this._syncState()
}}},hasState:function(c,a){this._processStates();
if(!a){a=this._stateGrpDict[c]||"DEFAULT"
}a=a.toUpperCase();
var b=this._stateMap[a];
if(!b){return false
}else{if(b.indexOf(c)<0){return false
}else{return true
}}},removeState:function(d,a){this._processStates();
a=(a||"DEFAULT").toUpperCase();
var b=this._stateMap[a];
if(!b){LOG.reportError(wixErrors.CM_UNKNOWN_STATE_GROUP,this.$className,"removeState",a)
}else{var c=this._currentStateMap[a];
if(c==d){delete this._currentStateMap[a]
}this._syncState()
}},_syncState:function(){var d=[];
for(var e in this._stateMap){if(this._currentStateMap[e]){d.push(this._currentStateMap[e])
}}var b=d.join(" ");
var a=this._view;
var c=this._currentState||"";
this._currentState=b;
if(a===null){return
}a.setProperty("state",b);
a.addClass("FOCRE_REFLOW_PLEASE");
a.removeClass("FOCRE_REFLOW_PLEASE");
if(b!=c){this._onStateChange(b,c);
this.fireEvent("stateChange",{newState:b,oldState:c});
a.triggerDisplayChanged()
}},getState:function(b){var a;
if(b){if(!this._currentStateMap){this._processStates()
}a=(this._currentStateMap[b.toUpperCase()])
}else{a=this._view.getProperty("state")
}return a||""
},_processStates:function(){if(this._stateMap){return
}var d,e;
this._currentStateMap={};
this._stateMap={DEFAULT:[]};
var b=this._states||[];
var a={};
if(b instanceof Array){for(d=0;
d<b.length;
++d){e=b[d];
if(typeof(e)!="string"){LOG.reportError(wixErrors.CM_MALFORMED_STATES,this.$className,"_processStates",b)
}else{this._stateMap.DEFAULT.push(e)
}}}else{if(typeof(b)=="object"){for(var g in b){var f=b[g];
if(f instanceof Array){var c=g.toUpperCase();
this._stateMap[c]=f.concat();
for(d=0;
d<f.length;
++d){e=f[d];
if(e in a){LOG.reportError(wixErrors.CM_DUPLICATE_STATE_NAME,this.$className,"_processStates",e)
}a[e]=true;
this._stateGrpDict[e]=c
}}else{LOG.reportError(wixErrors.CM_MALFORMED_STATES,this.$className,"_processStates",g)
}}}else{LOG.reportError(wixErrors.CM_MALFORMED_STATES,this.$className,"_processStates",b)
}}},dispose:function(){if(this._isDisposed){return LOG.reportError(wixErrors.COMPONENT_ALREADY_DISPOSED,this.className,"dispose",this._compId)
}if(this._view){this._view.cleanup();
this._view.destroy();
this._view=null;
this._isDisposed=true
}if(this._data){this._data.removeComponentWithInterest(this);
this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
this._data.getDataManager().removeDataItem(this._data);
delete this._data
}if(this._properties){this._properties.removeComponentWithInterest(this);
this._properties.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
this._properties.getDataManager().removeDataItem(this._properties);
delete this._properties
}while(this._callLaterIDs.length>0){var g=this._callLaterIDs.pop();
if(g){this.injects().Utils.clearCallLater(g)
}}this.removeEvents();
var a=this.injects().Commands;
if(a){a.unregisterListener(this)
}if(this.getSkin()){this.getSkin().dispose()
}if(this._skinParts){for(var b in this._skinParts){var c=this._skinParts[b];
if(c){if(c._compId){try{c.dispose()
}catch(f){}}else{try{c.cleanup();
c.destroy()
}catch(d){}}}}this._skinParts=null
}},getIsDisposed:function(){return this._isDisposed
},_onComponentWixified:function(){var d=this._view;
if(this._canFocus){d.addEvent(Constants.CoreEvents.FOCUS,this._onFocus.bind(this));
d.addEvent(Constants.CoreEvents.BLUR,this._onBlur.bind(this))
}this._isDisplayed=d.isNodeDisplayed();
this._areRenderingTriggersAttached=false;
var g=this._triggers;
if(g){for(var f=g.length-1;
f>=0;
--f){var e=g[f];
d.addEvent(e,this._onDefaultAction)
}}var h=Constants.DisplayEvents,a=this._onRenderingTriggerEvent;
for(var b in Constants.DisplayEvents){d.addEvent(h[b],a)
}},_onComponentReady:function(){var a=this._view
},_attachRenderTriggers:function(){var c=this._renderTriggers||[];
var a=this._view;
for(var b=c.length-1;
b>=0;
--b){a.addEvent(c[b],this._onRenderingTriggerEvent)
}},_testComponentReady:function(){if(this._componentReady){return
}if(this._view.getLogic){if(this._isBaseComponentReady()){this._componentReady=true;
if(this._isEnabled){this._handleEnabled()
}else{this._handleDisabled()
}if(this._tryRender()){this.fireEvent(Constants.ComponentEvents.READY);
this._view.fireEvent(Constants.ComponentEvents.READY)
}else{this._componentReady=false
}}}else{var a=function(){this._view.removeEvent(Constants.ComponentEvents.WIXIFIED,a);
this._testComponentReady()
}.bind(this);
this._view.addEvent(Constants.ComponentEvents.WIXIFIED,a)
}},_isBaseComponentReady:function(){return this._allComponentPartsReady&&!!this._skinParts&&(!!this._data||this.getAcceptableDataTypes().indexOf("")>=0)
},_prepareForRender:function(){return true
},_onStateChange:function(b,a){},fancify:function(b){var a=this.injects().Components.createComponent("mobile.editor.components.FancyItem","mobile.editor.skins.FancyItemSkin",undefined,{},null,function(){var c=this;
a.getLogic().createGui({dataPanel:this,upClickHandler:b.upCallback,downClickHandler:b.downCallback,deleteHandler:b.deleteCallback,showHideToggleHandler:b.isHiddenCallback,isHidden:b.initialIsHidden},this._skinParts.fancyContainer);
a.getLogic()._skinParts.view.insertInto(c._skinParts.view);
this._tryRender(true);
b.readyCallback&&b.readyCallback()
}.bind(this))
},_refreshDataBindings:function(){var o=this._autoBoundParts;
if(!o||!o.length){return
}var g=this._data&&this._data.getData();
var n=this.injects();
var k=n.Resources;
var m=n.Utils;
var c=this._skinParts;
for(var h=o.length-1;
h>=0;
--h){var d=o[h];
var j;
var f=c[d.skinPart];
if(!f){continue
}if(d.bindToData){j=g&&g[d.bindToData];
if(null===j||undefined===j){LOG.reportError(wixErrors.CM_NO_DATA,this.className,"refreshDataBindings",d.bindToData);
continue
}}else{if(d.bindToDictionary){j=k.get("EDITOR_LANGUAGE",d.bindToDictionary);
if(null===j||undefined===j){LOG.reportError(wixErrors.CM_NO_DICTIONARY_DATA,this.className,"refreshDataBindings",d.bindToDictionary);
continue
}}else{if(d.bindToSelf){j=this[d.bindToSelf]
}}}if(d.dictionaryFallback&&j.match(/^\s*$/)){j=k.get("EDITOR_LANGUAGE",d.dictionaryFallback)
}if(d.isView){var e=d.viewType;
if(""===e){var a=f.nodeName;
if(a.toLowerCase()=="input"){var b=f.getAttribute("type").toLowerCase();
if("text"==b){e="textinput"
}else{if("checkbox"==b||"radio"==b){e="check"
}}}else{e="text"
}d.viewType=e
}if("textinput"==e){f.setAttribute("value",j)
}else{if("check"==e){var l=m.stringToBoolean(j);
if(l){f.setAttribute("checked",true)
}else{f.removeAttribute("checked")
}}else{f.innerHTML=j
}}}else{f.setTextContent(j)
}}},hide:function(){if(this._view){this._view.hide()
}},show:function(){if(this._view){this._view.show()
}},_disableLinks:function(b){var a=this;
b.addEvent("click",function(e){var f=a.injects().Viewer;
if(f.getPreviewMode()){e.preventDefault();
if(W.Viewer.getLinkTipFunc()){var d=$(this).getProperty("href")||"";
var c=a.injects().Data.createDataItem({type:"Link",target:d,linkType:"FREE_LINK"});
W.Viewer.getLinkTipFunc()(c)
}}})
},_sanitizeLinks:function(c){for(var a=0;
a<c.length;
++a){var b=c[a];
this._sanitizeLink(b)
}},_sanitizeLink:function(b){var a=b.get("href");
if(a){if(a.indexOf("http://")!==0&&a.indexOf("https://")!==0){if(a.indexOf("telnet://")!==0&&a.indexOf("ftp://")!==0&&a.indexOf("mailto:")!==0){if(a.indexOf("@")>0){b.set("href","mailto:"+a)
}else{if(a.indexOf("www")===0||(a.indexOf("www")!==0&&a.indexOf("#")!==0)){b.set("href","http://"+a)
}}}}}},_onFocus:function(){},_onBlur:function(){},_onDefaultAction:function(){this.executeCommand()
},executeCommand:function(c){if(!this._command){if(this._commandName){var a=W.Commands.getCommand(this._commandName);
if(a){this.setCommand(a,this._commandParameter)
}}}if(this._command){var b=arguments.length>0?c:this._commandParameter;
if(b){b=this._parseDataReference(b)
}this._command.execute(b,this)
}},enable:function(){if(!this._isEnabled){this._isEnabled=true;
this._view.removeAttribute("disabled");
this._handleEnabled()
}},disable:function(){if(this._isEnabled){this._isEnabled=false;
this._view.setAttribute("disabled","disabled");
this._handleDisabled()
}},isEnabled:function(){return this._isEnabled
},setCommand:function(c,b){var a=this.injects().Commands;
if(typeof(c)=="string"){this._commandName=c;
c=a.getCommand(c)
}else{if(!(c instanceof a.Command)){LOG.reportError(wixErrors.BAD_COMMAND,this.className,"setCommand",c);
return
}}this._commandParameter=b;
if(this._command){this._command.unregisterListener(this);
this._command=null
}if(c){this._command=c;
c.registerListener(this,null,this._onCommandStatusChanged);
if(this._commandName){delete this._commandName
}}else{if(this._commandName){a.registerCommandListenerByName(this._commandName,this,null,this._onCommandStatusChanged)
}}},getCommandName:function(){return this._command?this._command.getName():this._commandName
},getCommandParameter:function(){return this._commandParameter
},_onCommandStatusChanged:function(a){if(a.isEnabled()){this.enable()
}else{this.disable()
}},_onEnabled:function(){},_handleEnabled:function(){var b=this._view;
var a=b.tabIndex;
var c=b._savedTabIndex;
if(null===a||undefined===a){a=-1
}if(-1==a){if(c!==undefined){b.tabIndex=c
}else{if(this._canFocus){b.tabIndex=0
}}}if(this._canFocus){b.addClass("focusable")
}if(this._componentReady){this._onEnabled()
}},_onDisabled:function(){},_handleDisabled:function(){var b=this._view;
var a=b.tabIndex;
if(null===a||undefined===a){a=-1
}if(a>=0){b._savedTabIndex=a;
b.tabIndex=-1
}if(document.activeElement==b){b.blur()
}if(this._canFocus){b.removeClass("focusable")
}if(this._componentReady){this._onDisabled()
}},_onRenderingTriggerEvent:function(c){var a=this._view.isNodeDisplayed();
switch(c){case Constants.DisplayEvents.COLLAPSED:case Constants.DisplayEvents.REMOVED_FROM_DOM:this._isDisplayed=false;
this._newlyDisplayed=false;
break;
case Constants.DisplayEvents.SKIN_CHANGE:if(this._renderTriggers.contains(Constants.DisplayEvents.SKIN_CHANGE)){if(a){this._renderIfReady()
}else{this._skinSizeInvalidated=true
}}break;
case Constants.DisplayEvents.MOVED_IN_DOM:if(this._view.isNodeDisplayed()&&this._renderTriggers.contains(Constants.DisplayEvents.MOVED_IN_DOM)){this._renderIfReady()
}this._skin.renderCssIfNeeded();
break;
default:var d=this._isDisplayed;
this._isDisplayed=a;
this._newlyDisplayed=this._newlyDisplayed||(!d&&this._isDisplayed);
var b=this._renderTriggers.contains(c)||this._renderTriggers.contains(Constants.DisplayEvents.DISPLAY_CHANGED);
if(this._newlyDisplayed&&(b||!this._areRenderingTriggersAttached||this._skinSizeInvalidated)){this._skinSizeInvalidated=false;
this._renderIfReady()
}this._skin.renderCssIfNeeded();
this._addedToDom();
break
}},getIsDisplayed:function(){return this._isDisplayed
},_addedToDom:function(){},checkVisibility:function(){this._isDisplayed=this._view.isNodeDisplayed();
return this._isDisplayed
},_setDataField:function(b,a){this._data.set(b,a,true)
},_setMetaDataField:function(b,a){this._data.setMeta(b,a)
},getFocusNode:function(){var b=this._skinParts.view;
for(var a in this._skinPartsSchema){if(this._skinPartsSchema[a].focus){b=this._skinParts[a]||b
}}return b
},getSkinPart:function(a){return this._skinParts[a]
},getSkin:function(){return this._skin
},setComponentProperties:function(b){var a=this._properties;
this._properties=b;
b.addComponentWithInterest(this);
if(b&&b!=a){this._properties.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
}},getComponentProperty:function(a){if(!this._properties){this._createComponentProperties()
}return this._properties.get(a)
},setComponentProperty:function(c,b,a){if(!this._properties){this._createComponentProperties()
}this._properties.set(c,b,a)
},_createComponentProperties:function(){var a=this._compId;
var b=this._propertiesSchemaName;
if(!b){return null
}this._properties=W.ComponentData.addDataItem(a,{type:b},this);
this._properties.addComponentWithInterest(this);
this._view.setProperty("propertyQuery",a);
this._properties.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
},deleteComponentProperty:function(a){},_onComponentPropertyChange:function(b,a){},_loadComponentProperties:function(){},getComponentProperties:function(){if(!this._properties){this._createComponentProperties()
}return this._properties
},_registerSkinPartCommands:function(){var c=this._skinPartsSchema;
var g=this.injects().Commands;
for(var h in c){var d=c[h];
var e=this._skinParts[h];
var i=this._parseDataReference(d.command);
if(!e||!i){continue
}var a;
if(typeof(i)=="string"){a=g.getCommand(i)
}else{a=i
}if("view"==h||d.type==Constants.ComponentPartTypes.HTML_ELEMENT){var b=this._parseDataReference(d.commandParameter);
if(a){e._command=a
}else{e._commandName=i
}e._commandParameter=b;
var f=e.nodeName.toLowerCase();
if(f=="select"){e.addEvent(Constants.CoreEvents.CHANGE,this._elementChangeExecuteCommand)
}else{e.addEvent(Constants.CoreEvents.CLICK,this._elementExecuteCommand)
}}else{e.setCommand(a||i,d.commandParameter)
}}},_registerDataBindings:function(){var a=[];
var d=this._skinPartsSchema;
for(var h in d){var e=d[h];
var f=this._skinParts[h];
if(!f){continue
}var b=(e.type==Constants.ComponentPartTypes.HTML_ELEMENT);
var g=b?f:f.getViewNode();
var c=null;
var i=e.autoBindData||(g&&g.getAttribute("autoBindData"));
if(i){c={bindToData:i}
}else{i=e.autoBindDictionary||(g&&g.getAttribute("autoBindDictionary"));
if(i){c={bindToDictionary:i}
}else{i=e.autoBindThis||(g&&g.getAttribute("autoBindThis"));
if(i){c={bindToSelf:i}
}}}if(c){c.skinPart=h;
c.isView=b;
c.viewType="";
c.dictionaryFallback=e.dictionaryFallback;
a.push(c)
}}if(a.length){this._autoBoundParts=a
}},_parseDataReference:function(c){if(!c||(typeof(c)!="string")){return c
}var b=c;
try{var d=c.indexOf("this.");
if(0===d){try{b=this[c.substring(5)]
}catch(f){b=null
}if(!b){W.Utils.debugTrace(this.className+" unknown part data reference "+c)
}}else{d=c.indexOf("data.");
if(0===d){if(!this._data||!(b=this._data.get(c.substring(5)))){W.Utils.debugTrace(this.className+" missing data for skinpart "+c)
}}}}catch(a){W.Utils.debugTrace(this.className+" error processing partData "+c)
}return b
},_elementExecuteCommand:function(a){var b=this._command||(this._command=W.Commands.getCommand(this._commandName));
if(b){b.execute(this._commandParameter||a,this)
}},_elementChangeExecuteCommand:function(a){var c=this.value;
var b=this._command||(this._command=W.Commands.getCommand(this._commandName));
if(b){b.execute(c)
}},onDraggedToStage:function(){},hasChildren:function(){return false
}}};
W.Classes.newClass({name:"mobile.core.managers.data.DataItemBase",Class:{Extends:Events,Binds:["fireDataChangeEvent"],Static:{METADATA_DEFAULTS:{isPreset:false,isHidden:false,description:"",isPersistent:true},getFieldsFilterArray:function(a){if(typeOf(a)=="array"){return a
}return Object.keys(a)
}},initialize:function(b,a){this._data=b;
if(b.type&&(typeof(b.type)!="string")){throw ("invalid data type. must be string")
}this._dataType=b.type;
this._dataManager=a||this.injects().Data;
this.componentsWithInterest=[]
},setData:function(a,c){var b=(this._data!==a);
this._data=a;
this._dataType=a.type;
b&&!c&&this.fireDataChangeEvent()
},setFields:function(b){var a={};
var d={};
var c=this._data;
Object.forEach(b,function(f,e){if(c[e]!==f){a[e]=c[e];
d[e]=f
}this.set(e,f,true)
}.bind(this));
if(Object.keys(a).length>0){this.fireDataChangeEvent(d,a)
}},setMeta:function(b,d,c){if(b in this.METADATA_DEFAULTS){this._data.metaData=this._data.metaData||{};
this._data.metaData[b]=d;
if(c){var e={key:d};
var a={};
this.fireDataChangeEvent(e,a)
}}else{LOG.reportError(wixErrors.INVALID_METADATA_FIELD,"DataItemBase","setMeta",b)()
}},set:function(c,e,d,b){e=this.injects().Utils.sanitizeUnicode(e);
if(this._data[c]!==e){var a={};
a[c]=this._data[c];
this._data[c]=e;
this.setMeta("isPreset",false);
if(!d){var f={};
f[c]=e;
this.fireDataChangeEvent(c,f,a,b)
}}},getFields:function(c){var a={};
var b=this.getFieldsFilterArray(c);
b.forEach(function(d){a[d]=this.get(d)
}.bind(this));
return a
},getData:function(){return this._data
},getType:function(){return this._data.type
},getMeta:function(a){if(a in this.METADATA_DEFAULTS){var b=this._data.metaData&&this._data.metaData[a];
if(b!==undefined){return b
}return this.METADATA_DEFAULTS[a]
}else{LOG.reportError(wixErrors.INVALID_METADATA_FIELD,"DataItemBase","getMeta",a)()
}},get:function(a){var b=this._data[a];
if(typeof(b)==="string"){b=this._sanitizeString(b)
}return b
},_sanitizeString:function(a){return a.replace(/[\u0080\u0099\u009C]/g,"")
},fireDataChangeEvent:function(b,e,c,d){this.markDataAsDirty();
var a=(b!==undefined)?[this,b,e,c]:[this];
this.fireEvent(Constants.DataEvents.DATA_CHANGED,a);
this._dataManager.reportDataItemChangeEvent(this,e,c,d)
},markDataAsDirty:function(){this._dataManager.markDirtyObject(this);
this._dataManager.flagDataChange()
},toString:function(){return"[Data Object]"
},getDataManager:function(){return this._dataManager
},addComponentWithInterest:function(a){this.componentsWithInterest.include(a)
},removeComponentWithInterest:function(a){this.componentsWithInterest.erase(a)
},cloneData:function(){return Object.clone(this.getData())
},hasField:function(b){var a=this._data[b];
return a!==null&&a!=undefined
}}});
W.Classes.newClass({name:"mobile.core.managers.data.DataItemWithSchema",Class:{Extends:"mobile.core.managers.data.DataItemBase",Implements:[Events],Static:{FIELD_TYPE_DEFAULTS:{refList:[],ref:"",number:Number.NaN,string:"",color:"255,255,255,1","boolean":false,object:{},list:[]}},initialize:function(c,b,a){this._schema=c;
this._snapshot={};
this.parent(b,a);
this._setSchemaDefaults()
},reset:function(){for(var b in this._schema){var a=this._schema[b]["default"];
if(this._data[b]!=a){this.set(b,a)
}}},removeField:function(a){delete this._data[a]
},takeSnapshot:function(){var a={};
this._cloneBySchema(a,this._data);
this._snapshot=a
},restoreSnapshot:function(a){if(this._snapshot){this._cloneBySchema(this._data,this._snapshot);
this.discardSnapshot();
if(a!==false){this.fireDataChangeEvent()
}}else{LOG.reportError(wixErrors.DATA_MISSING_SNAPSHOT,"DataItem","restoreSnapshot",this._dataType)
}},discardSnapshot:function(){this._snapshot=null
},getSchema:function(){return this._schema
},setSchema:function(a){this._schema=a
},getFieldSchema:function(a){return this._schema[a]
},_setSchemaDefaults:function(){for(var c in this._schema){var d=this._schema[c];
if(d&&d["default"]){var b=this._data[c];
var a=this.get(c);
if(!b&&b!=a){this.set(c,a)
}}}},get:function(b){var d=this.parent(b);
var c=this._schema[b];
if(d!==undefined&&d!==null){if(Constants.DataTypes.TYPE_RESOURCE_KEY==c){var a=this.getDataManager().getResourceManager();
if(a){d=a.get("EDITOR_LANGUAGE",d,d)
}}}else{d=this._getDefaultValue(b);
this._data[b]=d
}if("color"==c){return new W.Color(value)
}return d
},getFieldType:function(a){return this._schema[a]
},_getDefaultValue:function(c){var b=this._schema[c];
var a;
if(!b){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"DataItemWithSchema","_getDefaultValue",[this._data,this._schema,c])();
return
}if(typeof b=="string"){a=this.FIELD_TYPE_DEFAULTS[b]
}else{if(b.hasOwnProperty("default")){a=b["default"]
}else{a=this.FIELD_TYPE_DEFAULTS[b.type]
}}return this._cloneDefaultObject(a)
},_cloneDefaultObject:function(a){if(a instanceof Array){return a.splice(0,0)
}if(typeof a=="object"){return Object.clone(a)
}return a
},_cloneBySchema:function(c,d){for(var b in this._schema){var e=d[b];
var a=typeof e;
if("object"==a){c[b]=Object.clone(e)
}else{c[b]=e
}}return c
},copySchemaFieldsFrom:function(a,b){this._cloneBySchema(this._data,a._data);
if(!b){this.fireDataChangeEvent()
}},copySchemaFieldsTo:function(a,b){this._cloneBySchema(a._data,this._data);
if(!b){a.fireDataChangeEvent()
}},setData:function(a,b){if(a===this._data){return
}if(!this._data){this.parent(a,b)
}else{if(this._data.type==a.type){a.id=this._data.id;
this.parent(a,false);
this._setSchemaDefaults();
if(b!==false){this.fireDataChangeEvent()
}}}},hasField:function(b){var a=this._data[b];
return a!==null&&a!=undefined
}}});
W.Classes.newClass({name:"mobile.core.managers.data.PropertiesItem",Class:{Extends:"mobile.core.managers.data.DataItemWithSchema",initialize:function(d,b,a,c){this.parent(d,b,a);
this._ownerComponent=c
}}});
Constants.StyleEvents={SKIN_CHANGED:"skinChange",READY:"styleReady",PROPERTY_CHANGED:"propertyChange"};
W.Classes.newClass({name:"mobile.core.managers.style.Style",Class:{Extends:"mobile.core.managers.style.StyleProperties",initialize:function(a){if(a){this._setStyleDataItem(a)
}},_setStyleDataItem:function(a){this._skinName=a.get("skin");
this._resetDataCollection();
if(!a.get("style")){a.set("style",{})
}this._configStyle(a.get("style"),a,this._skinName,this)
},_resetDataCollection:function(){this._groupIdCounter=0;
var a=this._onProcessAllSkins.bind(this);
this.unprocessedSkins={map:{},size:0,add:function(b){if(this.map[b]){this.map[b]=1
}else{this.map[b]++
}this.size++
},remove:function(b){if(this.map[b]){this.map[b]--
}else{}this.size--;
if(this.size===0){a()
}}}
},_onProcessAllSkins:function(){this._garbageCollection();
if(this._oldSkinName!=this._skinName){this.fireEvent(Constants.StyleEvents.SKIN_CHANGED)
}this.fireEvent(Constants.StyleEvents.READY,this)
},getNewGroupId:function(){this._groupIdCounter=this._groupIdCounter||0;
this._groupIdCounter++;
return this._groupIdCounter
},setSkin:function(a){if(this._skinName==a){return false
}this._resetUsedSkinNameArray();
this.setStyleRenderFlag(false);
this._oldSkinName=this._skinName;
this._skinName=a;
this._styleDataItem.set("skin",a);
this._styleRawData.properties={};
this._styleRawData.propertiesSource={};
this._styleRawData.groups={};
this._resetData(this._styleRawData.properties,this._styleRawData.propertiesSource,this._styleRawData.groups);
this.createStylesAndRawData(this._styleRawData,a);
return true
},getSkin:function(){return this._skinName
},getId:function(){return this._styleDataItem.get("id")
}}});
Constants.STYLE={SOURCE:{THEME:"theme",VALUE:"value"}};
W.Classes.newClass({name:"mobile.core.managers.style.StyleProperties",imports:["mobile.core.managers.utils.BufferFunction"],Class:{Extends:Events,Binds:["_onThemePropertiesChange"],Static:{STYLE_PROPERTIES_FILTER:{color:[Constants.STYLE.SOURCE.THEME],font:[Constants.STYLE.SOURCE.THEME],radius:[Constants.STYLE.SOURCE.VALUE],size:[Constants.STYLE.SOURCE.VALUE],boxShadow:[Constants.STYLE.SOURCE.VALUE]},PROPERTY_TYPE_EXTRA_PARAMS:{color:{alpha:{prefix:"alpha",defaultValue:1,type:"number"}},boxShadow:{isOn:{prefix:"boxShadowToggleOn",defaultValue:true,type:"boolean"}}}},initialize:function(d,c,b,a){if(d&&c&&b&&a){this._configStyle(d,c,b,a)
}},setRedirectCssTarget:function(a){this._redirectCssTarget=(a===true)
},isCssRedirectedToStyle:function(){return this._redirectCssTarget
},updateCssRule:function(a,b){this._changedCssClasses[a]=b;
this._dispatchCssChanges()
},_dispatchCssChanges:function(){this.fireEvent("cssChanged",this._changedCssClasses);
this._changedCssClasses={}
},_configStyle:function(e,d,c,b){this._redirectCssTarget=false;
this._changedCssClasses={};
var a=new this.imports.BufferFunction(this,"_dispatchCssChanges");
a.setBufferTime(50);
this._resetUsedSkinNameArray();
this.StyleClass=W.Classes.get("mobile.core.managers.style.StyleProperties");
this._isStyleRendered={};
this._groupId=d.get("id")+"-"+b.getNewGroupId();
this._topLevelStyle=b;
this._styleDataItem=d;
this._styleRawData=e;
e.properties=e.properties||{};
e.propertiesSource=e.propertiesSource||{};
e.groups=e.groups||{};
this._resetData(e.properties,e.propertiesSource,e.groups);
this._changes={};
this.createStylesAndRawData(e,c);
W.Theme.getDataItem().addEvent(Constants.DataEvents.DATA_CHANGED,this._onThemePropertiesChange)
},_resetData:function(b,a,c){this._properties=b||{};
this._propertiesSource=a||{};
this._groups=c||{};
this._propertiesTypes={};
this._propertiesCounter={};
this._propertiesLangKey={};
this._groupsStyleObjects={}
},_onThemePropertiesChange:function(a,b){for(var d in b){for(var c in this._properties){if(this._propertiesSource[c]==Constants.STYLE.SOURCE.THEME&&this._properties[c]==d){this._firePropertyChangesEvent(c)
}}}},_firePropertyChangesEvent:function(a){this._changes[a]=this._propertiesTypes[a];
this.injects().Utils.clearCallLater(this._dispatchEventId);
this._dispatchEventId=this.injects().Utils.callLater(this._dispatchChangeEventAndResetChanges,[],this,50)
},_dispatchChangeEventAndResetChanges:function(){this.fireEvent(Constants.StyleEvents.PROPERTY_CHANGED,{style:this,properties:this._changes});
this._changes={}
},isStyleRenderedForSkin:function(a){return this._isStyleRendered[a]||false
},isStyleRenderedForAllSkins:function(){for(var a in this._isStyleRendered){if(!this._isStyleRendered[a]){return false
}}return true
},setStyleRenderFlag:function(a){for(var b in this._isStyleRendered){this.setStyleRenderFlagForSkin(b,a)
}},setStyleRenderFlagForSkin:function(b,a){this._isStyleRendered[b]=a
},invalidateStyle:function(){this.setStyleRenderFlag(false);
for(var a in this._groupsStyleObjects){this._groupsStyleObjects[a].invalidateStyle()
}},get:function(a){return this._properties[a]
},getStyleByGroupName:function(a){return this._groupsStyleObjects[a]
},set:function(d,b){var c={};
var a={};
c[d]=b;
a[d]=this._properties[d];
this._properties[d]=b;
this._styleDataItem.fireDataChangeEvent(d,c,a);
this._firePropertyChangesEvent(d)
},changePropertySource:function(b,a,c){if(this._isPropertySourceValid(c)){this._propertiesSource[b]=c;
this.set(b,a)
}else{LOG.reportError(wixErrors.STYLE_PROP_SRC_UNKNOWN,"StyleProperties","changePropertySource",c)()
}},_isPropertySourceValid:function(c){var b=false;
for(var a in Constants.STYLE.SOURCE){if(Constants.STYLE.SOURCE[a]===c){b=true
}}return b
},getPropertyExtraParamValue:function(e,b){var c=this.getPropertyType(e);
var a=this._getExtraParamDefinitionByType(c,b);
if(!a){LOG.reportError("STYLE_EXTRA_PARAM_DEFINITION_MISSING","StyleProperties","setPropertyExtraParamValue",c+"-"+b)();
return
}var d=this._getPropertyExtraParamId(e,a.prefix);
return this._convertStringToType(this._properties[d],a.type)
},setPropertyExtraParamValue:function(e,b,h,i){var d=this.getPropertyType(e);
var g=this._getExtraParamDefinitionByType(d,b);
if(!g){LOG.reportError("STYLE_EXTRA_PARAM_DEFINITION_MISSING","StyleProperties","setPropertyExtraParamValue",d+"-"+b)();
return
}var f=this._getPropertyExtraParamId(e,g.prefix);
this._properties[f]=String(h);
var c={};
var a={};
c[f]=this._properties[f];
this._styleDataItem.fireDataChangeEvent(e,c,a);
if(i){this._firePropertyChangesEvent(e,c,a)
}},_convertStringToType:function(b,a){switch(a){case"number":b=Number(b);
break;
case"boolean":b=String(b).toLowerCase()==="true";
break
}return b
},_getExtraParamDefinitionByType:function(b,a){return this.PROPERTY_TYPE_EXTRA_PARAMS[b]&&this.PROPERTY_TYPE_EXTRA_PARAMS[b][a]
},_getPropertyExtraParamId:function(b,a){return a+"-"+b
},isPropertyAvailable:function(a){return this._propertiesTypes.hasOwnProperty(a)
},createStylesAndRawData:function(b,a){this._topLevelStyle.unprocessedSkins.add(a);
W.Skins.getSkin(a,function(c){this._addUsedSkinName(a);
var d=new c();
this._saveSkinParamsAsProperties(d.getParams());
this._parseSkinInnerComponents(b,d.getCompPartsDefinition());
this._topLevelStyle.unprocessedSkins.remove(a)
}.bind(this))
},_saveSkinParamsAsProperties:function(b){for(var a=0;
a<b.length;
a++){this._addProperty(b[a])
}},_addProperty:function(b){var c=b.id;
var a=this._getParamData(b);
if(a.source!="unknown"&&!a.ignore){this._properties[c]=this._properties[c]||b.defaultTheme||b.defaultValue;
this._propertiesTypes[c]=a.type;
this._propertiesSource[c]=this._propertiesSource[c]||a.source;
this._propertiesLangKey[c]=a.langKey;
this._increasePropertyUseCount(c);
this._setPropertyExtraParams(c,a)
}},_parseSkinInnerComponents:function(f,a){for(var e in a){var c=a[e].skin;
var b=a[e].styleGroup;
if(!b||b.toLowerCase()=="undefined"){continue
}if(b=="inherit"){this.createStylesAndRawData(f,c)
}else{if(!f.groups[b]){f.groups[b]={properties:{},groups:{}}
}var g=f.groups[b];
if(!this._groupsStyleObjects[b]){var d=new this.StyleClass(g,this._styleDataItem,c,this._topLevelStyle);
this._groupsStyleObjects[b]=d
}else{this._groupsStyleObjects[b].createStylesAndRawData(g,c)
}}}},_getParamData:function(c){var b={source:"unknown"};
if(c.defaultTheme){b.source=Constants.STYLE.SOURCE.THEME;
b.value=c.defaultTheme;
b.type=W.Theme.getPropertyType(c.defaultTheme)
}else{if(c.defaultValue){b.source=Constants.STYLE.SOURCE.VALUE;
b.value=c.defaultValue;
b.type=this._getGeneralTypeFromCssType(c.type)
}}b.langKey=c.lang||c.id;
b.styleDefaults=c.styleDefaults||{};
var e=(c.noshow===true);
var d=this.STYLE_PROPERTIES_FILTER[b.type];
var a=d&&d.contains(b.source);
b.ignore=(e===true||a!==true);
return b
},_increasePropertyUseCount:function(a){if(this._propertiesCounter[a]){this._propertiesCounter[a]+=1
}else{this._propertiesCounter[a]=1
}},_garbageCollection:function(){for(var b in this._properties){if(!this._propertiesCounter[b]){delete this._properties[b]
}}this.setStyleRenderFlag(false);
for(var a in this._groupsStyleObjects){this._groupsStyleObjects[a]._garbageCollection()
}},_getGeneralTypeFromCssType:function(a){return Constants.SkinParamCssTypesToGeneralTypesMap[a]||"unknown"
},_setPropertyExtraParams:function(h,f){var d=f.type;
var e=this.PROPERTY_TYPE_EXTRA_PARAMS[d];
if(e){var g=f.styleDefaults;
for(var b in e){var a=e[b];
var c=this._getPropertyExtraParamId(h,a.prefix);
this._properties[c]=this._properties[c]||g[a.prefix]||a.defaultValue;
this._propertiesTypes[c]=d+"-"+b;
this._increasePropertyUseCount(c)
}}},getId:function(){return this._groupId
},getProperties:function(){return this._properties
},getGroups:function(){return this._groupsStyleObjects
},getPropertyType:function(a){return this._propertiesTypes[a]
},getPropertySource:function(a){return this._propertiesSource[a]
},getPropertyLangKey:function(a){return this._propertiesLangKey[a]
},_addUsedSkinName:function(a){this._usedSkinNamesArray.push(a)
},_resetUsedSkinNameArray:function(){this._usedSkinNamesArray=[]
},getSkinArray:function(){return this._usedSkinNamesArray
}}});
W.Classes.newClass({name:"mobile.core.managers.style.SkinParamMapper",imports:["mobile.core.managers.utils.BufferFunction","mobile.core.managers.style.SkinParamParser","mobile.core.managers.style.SkinParamRenderHandler"],Class:{Extends:Events,Binds:["_onThemePropertiesChange"],initialize:function(a,c,b){this.SkinParserClass=this.imports.SkinParamParser;
this.SkinParamRenderHandlerClass=this.imports.SkinParamRenderHandler;
this._dataItem=a;
this._rawData=c;
this._mapId=this._dataItem.get("id")+"-"+this.getNewGroupIdCounter();
this._skin=new b();
this._initMapProperties();
this._skinParser=new this.SkinParserClass(this._dataItem,this._rawData,this._skin);
this._skinParamRenderHandler=new this.SkinParamRenderHandlerClass(this.getGroups());
this._garbageCollection();
W.Theme.getDataItem().addEvent(Constants.DataEvents.DATA_CHANGED,this._onThemePropertiesChange)
},_initMapProperties:function(){this._rawData.properties=this._rawData.properties||{};
this._rawData.groups=this._rawData.groups||{};
this._rawData.propertiesSource=this._rawData.propertiesSource||{}
},setSkin:function(b){var a=new b();
if(this._skin.$className==a.$className){return false
}this._skin=a;
this._dataItem.set("skin",this._skin.$className);
this._rawData.properties={};
this._rawData.propertiesSource={};
this._rawData.groups={};
this._skinParser=new this.SkinParserClass(this._dataItem,this._rawData,this._skin);
this._skinParamRenderHandler=new this.SkinParamRenderHandlerClass(this.getGroups());
this.fireEvent(Constants.StyleEvents.SKIN_CHANGED);
this.fireEvent(Constants.StyleEvents.READY);
return true
},getSkin:function(){return this._skin.className
},getPropertyExtraParamValue:function(b,a){return this._skinParser.getPropertyExtraParamValue(b,a)
},setPropertyExtraParamValue:function(c,a,e,g){var d=this._skinParser.setPropertyExtraParamValue(c,a,e);
var f={};
var b={};
f[d]=this._skinParser.getProperty(d);
this._dataItem.fireDataChangeEvent(c,f,b);
if(g){this._firePropertyChangesEvent(c,f)
}},_onThemePropertiesChange:function(a,c){for(var e in c){var b=this._skinParser.getProperties();
for(var d in b){if(this.getPropertySource(d)==Constants.STYLE.SOURCE.THEME&&b[d]==e){this._firePropertyChangesEvent(d)
}}}},_firePropertyChangesEvent:function(a){if(!this._changes){this._changes={}
}this._changes[a]=this._skinParser.getPropertyType(a);
this.injects().Utils.clearCallLater(this._dispatchEventId);
this._dispatchEventId=this.injects().Utils.callLater(this._dispatchChangeEventAndResetChanges,[],this,50)
},_dispatchChangeEventAndResetChanges:function(){this.fireEvent(Constants.StyleEvents.PROPERTY_CHANGED,{style:this,properties:this._changes});
this._changes={}
},updateCssRule:function(a,b){if(!this._changedCssClasses){this._changedCssClasses={}
}this._changedCssClasses[a]=b;
this._dispatchCssChanges()
},_dispatchCssChanges:function(){this.fireEvent("cssChanged",this._changedCssClasses);
this._changedCssClasses={}
},setRedirectCssTarget:function(a){this._redirectCssTarget=(a===true)
},isCssRedirectedToStyle:function(){return this._redirectCssTarget
},_garbageCollection:function(){this.setStyleRenderFlag(false);
this._skinParser.garbageCollection()
},addInnerSkin:function(b,a,c){this._skinParser.parseSkinByInstance(b,a,c)
},getNewGroupIdCounter:function(){this._groupIdCounter=this._groupIdCounter||0;
this._groupIdCounter++;
return this._groupIdCounter
},getMapId:function(){return this._mapId
},getId:function(){return this._dataItem.get("id")
},getProperty:function(a){return this._skinParser.getProperty(a)
},setProperty:function(b,d){this._skinParser.setProperty(b,d);
var a={};
var c={};
a[b]=d;
c[b]=this.getProperty(b);
this._dataItem.fireDataChangeEvent(b,a,c);
this._firePropertyChangesEvent(b)
},getProperties:function(){return this._skinParser.getProperties()
},getGroups:function(){return this._skinParser.getInnerSkins()
},isPropertyAvailable:function(a){if(this._skinParser.getProperty(a)){return true
}return false
},getPropertySource:function(a){return this._skinParser.getPropertySource(a)
},getPropertyType:function(a){return this._skinParser.getPropertyType(a)
},getStyleByGroupName:function(a){return this._skinParser.getInnerSkin(a)
},getSkinArray:function(){return this._skinParser.getUsedSkinArray()
},changePropertySource:function(a,b,c){this._skinParser.setPropertySource(a,c);
this.setProperty(a,b)
},getPropertyLangKey:function(a){return this._skinParser.getPropertyLangKey(a)
},isStyleRenderedForSkin:function(a){return this._skinParamRenderHandler.isSkinParamRenderedForSkin(a)
},isStyleRenderedForAllSkins:function(){return this._skinParamRenderHandler.isSkinParamRenderedForAllSkins()
},setStyleRenderFlag:function(a){this._skinParamRenderHandler.setSkinParamRenderFlag(a)
},setStyleRenderFlagForSkin:function(a,b){this._skinParamRenderHandler.setSkinParamRenderFlagForSkin(a,b)
},invalidateStyle:function(){this._skinParamRenderHandler.invalidateSkinParamMapper()
}}});
W.Classes.newClass({name:"mobile.core.managers.style.SkinParamParser",imports:["mobile.core.managers.style.SkinParamSourceHandler","mobile.core.managers.style.SkinExtraParamHandler"],Class:{Extends:Events,Static:{STYLE_PROPERTIES_FILTER:{color:[Constants.STYLE.SOURCE.THEME],font:[Constants.STYLE.SOURCE.THEME],radius:[Constants.STYLE.SOURCE.VALUE],size:[Constants.STYLE.SOURCE.VALUE],boxShadow:[Constants.STYLE.SOURCE.VALUE]}},initialize:function(b,e,d){this._innerSkinMaps={};
this._properties=e.properties||{};
this._propertiesTypes={};
this._propertiesCounter={};
this._propertiesLangKey={};
this._usedSkinNamesArray=[];
this.SkinMapperClass=W.Classes.get("mobile.core.managers.style.SkinParamMapper");
var c=this.imports.SkinParamSourceHandler;
var a=this.imports.SkinExtraParamHandler;
this._paramSourceHandler=new c(e.propertiesSource);
this._extraParamHandler=new a(this._properties,this._propertiesTypes,this._propertiesCounter);
this._parseSkinAndData(b,e,d)
},parseSkinByInstance:function(a,d,b){var c=new b();
this._parseSkinAndData(a,d,c)
},_parseSkinAndData:function(a,c,b){this._addUsedSkinName(b.$className);
this._saveSkinParams(b.getParams());
this._parseSkinInnerComponents(a,c,b.getCompPartsDefinition(),b.imports)
},_addUsedSkinName:function(a){this._usedSkinNamesArray.push(a)
},_saveSkinParams:function(b){for(var a=0;
a<b.length;
a++){this._addProperty(b[a])
}},_addProperty:function(b){var d=b.id;
var a=this._createParamDataObj(b);
if(a.source!="unknown"&&!a.ignore){this._properties[d]=this._properties[d]||b.defaultTheme||b.defaultValue;
this._propertiesTypes[d]=a.type;
this._propertiesLangKey[d]=a.langKey;
var c=this.getPropertySource(d)||a.source;
this.setPropertySource(d,c);
this._increasePropertyUseCount(d);
this._extraParamHandler.setPropertyExtraParams(d,a)
}},_createParamDataObj:function(c){var b={};
if(c.defaultTheme){b.source=Constants.STYLE.SOURCE.THEME;
b.value=c.defaultTheme;
b.type=W.Theme.getPropertyType(c.defaultTheme)
}else{if(c.defaultValue){b.source=Constants.STYLE.SOURCE.VALUE;
b.value=c.defaultValue;
b.type=this._getGeneralTypeFromCssType(c.type)
}}b.langKey=c.lang||c.id;
b.styleDefaults=c.styleDefaults||{};
var e=(c.noshow===true);
var d=this.STYLE_PROPERTIES_FILTER[b.type];
var a=d&&d.contains(b.source);
b.ignore=(e===true||a!==true);
return b
},_getGeneralTypeFromCssType:function(a){return Constants.SkinParamCssTypesToGeneralTypesMap[a]||"unknown"
},_increasePropertyUseCount:function(a){if(this._propertiesCounter[a]){this._propertiesCounter[a]+=1
}else{this._propertiesCounter[a]=1
}},garbageCollection:function(){for(var a in this._properties){if(!this._propertiesCounter[a]){delete this._properties[a]
}}},_parseSkinInnerComponents:function(b,a,h,d){for(var i in h){var f=h[i].skin;
var c=h[i].styleGroup;
var j=this._findSkinByName(f,d);
if(!c){continue
}if(c=="inherit"){this.parseSkinByInstance(b,a,j)
}else{var e=a.groups&&a.groups[c]?a.groups[c]:{properties:{},groups:{}};
if(!this._innerSkinMaps[c]){var g=new this.SkinMapperClass(b,e,j);
this._innerSkinMaps[c]=g
}else{this._innerSkinMaps[c].addInnerSkin(b,e,j)
}}}},_findSkinByName:function(b,d){var a=b.substring(b.lastIndexOf(".")+1);
var c=Object.filter(d,function(f,e){return e==a
});
return c[a]
},getInnerSkins:function(){return this._innerSkinMaps
},getInnerSkin:function(a){return this._innerSkinMaps[a]
},getProperties:function(){return this._properties
},getProperty:function(a){return this._properties[a]
},setProperty:function(a,b){this._properties[a]=b
},getPropertiesTypes:function(){return this._propertiesTypes
},getPropertySource:function(a){return this._paramSourceHandler.getPropertySource(a)
},setPropertySource:function(a,b){return this._paramSourceHandler.setPropertySource(a,b)
},getPropertyType:function(a){return this._propertiesTypes[a]
},getUsedSkinArray:function(){return this._usedSkinNamesArray
},setPropertyExtraParamValue:function(b,a,c){return this._extraParamHandler.setPropertyExtraParamValue(b,a,c)
},getPropertyExtraParamValue:function(b,a){return this._extraParamHandler.getPropertyExtraParamValue(b,a)
},getPropertyLangKey:function(a){return this._propertiesLangKey[a]
}}});
W.Classes.newClass({name:"mobile.core.managers.style.SkinExtraParamHandler",Class:{Extends:Events,Static:{PROPERTY_TYPE_EXTRA_PARAMS:{color:{alpha:{prefix:"alpha",defaultValue:1,type:"number"}},boxShadow:{isOn:{prefix:"boxShadowToggleOn",defaultValue:true,type:"boolean"}}}},initialize:function(b,a,c){this._properties=b;
this._propertiesTypes=a;
this._propertiesCounter=c
},getPropertyExtraParamValue:function(c,b){var a=this._getPropertyExtraParamDefinition(c,b);
if(!a){return
}var d=this._getPropertyExtraParamId(c,a.prefix);
return this._convertStringToType(this._properties[d],a.type)
},_getPropertyExtraParamDefinition:function(c,b){var d=this._propertiesTypes[c];
var a=this._getExtraParamDefinitionByType(d,b);
if(!a){LOG.reportError(wixErrors.STYLE_EXTRA_PARAM_DEFINITION_MISSING,"SkinExtraParamHandler","_getPropertyExtraParamDefinition",d+"-"+b)();
return
}return a
},_getExtraParamDefinitionByType:function(b,a){return this.PROPERTY_TYPE_EXTRA_PARAMS[b]&&this.PROPERTY_TYPE_EXTRA_PARAMS[b][a]
},_getPropertyExtraParamId:function(b,a){return a+"-"+b
},_convertStringToType:function(b,a){switch(a){case"number":b=Number(b);
break;
case"boolean":b=String(b).toLowerCase()==="true";
break
}return b
},setPropertyExtraParamValue:function(c,b,e){var a=this._getPropertyExtraParamDefinition(c,b);
if(!a){return
}var d=this._getPropertyExtraParamId(c,a.prefix);
this._properties[d]=String(e);
return d
},setPropertyExtraParams:function(c,g){var b=g.type;
var h=this.PROPERTY_TYPE_EXTRA_PARAMS[b];
if(h){var i=g.styleDefaults;
for(var a in h){var e=h[a];
var d=this._getPropertyExtraParamId(c,e.prefix);
var f;
if(this._properties[d]){f=this._properties[d]
}else{if(i&&i[e.prefix]){f=i[e.prefix]
}else{f=e.defaultValue
}}this._properties[d]=f;
this._propertiesTypes[d]=b+"-"+a;
this._increasePropertyUseCount(d)
}}},_increasePropertyUseCount:function(a){if(this._propertiesCounter[a]){this._propertiesCounter[a]+=1
}else{this._propertiesCounter[a]=1
}}}});
W.Classes.newClass({name:"mobile.core.managers.style.SkinParamRenderHandler",Class:{initialize:function(a){this._innerSkinMaps=a;
this._skinParamRenderFlags={}
},isSkinParamRenderedForSkin:function(a){return this._skinParamRenderFlags[a]||false
},isSkinParamRenderedForAllSkins:function(){for(var a in this._skinParamRenderFlags){if(!this._skinParamRenderFlags[a]){return false
}}return true
},setSkinParamRenderFlag:function(a){for(var b in this._skinParamRenderFlags){this.setSkinParamRenderFlagForSkin(b,a)
}},setSkinParamRenderFlagForSkin:function(a,b){this._skinParamRenderFlags[a]=b
},invalidateSkinParamMapper:function(){this.setSkinParamRenderFlag(false);
for(var a in this._innerSkinMaps){this._innerSkinMaps[a].invalidateSkinParamMapper()
}}}});
Constants.SKIN_PARAM={SOURCE:{THEME:"theme",VALUE:"value"}};
W.Classes.newClass({name:"mobile.core.managers.style.SkinParamSourceHandler",Class:{initialize:function(a){this._propertiesSource=a||{}
},getPropertiesSource:function(){return this._propertiesSource
},getPropertySource:function(a){return this._propertiesSource[a]
},setPropertySource:function(a,b){if(this._isPropertySourceValid(b)){this._propertiesSource[a]=b
}else{LOG.reportError(wixErrors.STYLE_PROP_SRC_UNKNOWN,"SkinParamSourceHandler","setPropertySource",b)()
}},_isPropertySourceValid:function(a){var c=false;
for(var b in Constants.STYLE.SOURCE){if(Constants.STYLE.SOURCE[b]===a){c=true
}}return c
}}});
W.Classes.newClass({name:"mobile.core.skins.BaseSkin",Class:{Binds:["_onStylePropChange"],initialize:function(){this._isDisposed=false
},_comps:[],_params:[{type:"domId",name:"Component ID",id:"compId",inherited:true}],_html:"<div></div>",_css:["base {}"],_viewNode:null,_updatePartsCallback:null,_skinParts:null,_inlineContainer:null,applyStyle:function(a){if(!a||this._style===a){return
}this._removeOldStyle();
this._addStyle(a);
this._render()
},_removeOldStyle:function(){if(this._style){this._style.removeEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._onStylePropChange)
}delete this._style
},_addStyle:function(a){this._style=a;
this._style.addEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._onStylePropChange)
},register:function(a,b,c){if(!this._isRegistered()){this._viewNode=a;
this._updatePartsCallback=b;
this._skinParamChangeCallback=c;
this._render()
}else{LOG.reportError(wixErrors.SKIN_MANAGER_RE_REGISTER,"mobile.core.skins.BaseSkin","register",a.getProperty("id"))
}},unRegister:function(){this._viewNode=null;
this.dispose()
},_isRegistered:function(){return(this._viewNode&&this._updatePartsCallback)
},getInlineContent:function(){if(!this._skinParts){return this._viewNode.getChildren()
}if(this._skinParts.inlineContent){return this._skinParts.inlineContent.getChildren()
}return null
},_render:function(){if(!this._isRegistered()){return
}var b=this.getInlineContent();
this._skinParts=this._buildSkin();
if(this._skinParts.inlineContent&&b){this._skinParts.inlineContent.empty();
for(var a=0;
a<b.length;
a++){b[a].insertInto(this._skinParts.inlineContent,"bottom",Constants.DisplayEvents.MOVED_IN_DOM)
}}this._updatePartsCallback(this._skinParts)
},_onStylePropChange:function(a){this.injects().Skins.stylePropertiesChangedForSkin(this.className,this._style,a.properties);
this._skinParamChangeCallback(a.properties)
},_informLogicOfParamChanges:function(){},_buildSkin:function(a){this._renderCss();
return this._renderHtml(a)
},_renderCss:function(){this.injects().Skins.buildSkinCSS(this.className,this._style)
},_renderHtml:function(b){var a=this._viewNode;
if(b&&b.viewNode){a=b.viewNode
}return this.injects().Skins.buildSkinHTML(this.className,a,this._style)
},renderCssIfNeeded:function(){var c=true;
if(this._style){c=this._style.isStyleRenderedForAllSkins()
}else{var b=this.getSkinClassData();
var d=b.CSSBuildFlags;
for(var a in d){if(!d[a]){c=false;
break
}}}if(!c){this._renderCss()
}},getStyle:function(){return this._style
},getParams:function(){return this._params
},getCompPartsDefinition:function(){return this.compParts||{}
},getCompPartSkinName:function(a){var b=this.compParts;
return b&&b[a].skSin
},getUniqueClass:function(a){return this.injects().Skins.getUniqueClass(a,this.$className)
},dispose:function(){this._isDisposed=true;
this._updatePartsCallback=null;
this._removeOldStyle()
},getParamValue:function(a){return this.injects().Skins.getSkinParamValue(this.$className,a,this._style)
}}});
Constants.ServerErrors={NO_DATA:{errorDescription:"no data",errorCode:-9999,payload:"no data"},SERVER_UNHANDLED_ERROR:{errorDescription:"server unhandled error",errorCode:-9999,payload:"no data"}};
W.Classes.newClass({name:"mobile.core.managers.serverfacade.RESTClient",Class:{Static:{CALLBACK_STATUS:{SUCCESS:"success",ERROR:"error"},REQUEST_OBJECT:{jsonrpc:"2.0",id:1,method:"",params:[]}},initialize:function(){},get:function(b,e,d){var a=this._createRequestOptions(b,e,d);
var c=new Request.JSON(a);
if(e){c.get(JSON.encode(e))
}else{c.get()
}},post:function(b,e,d){var a=this._createRequestOptions(b,e,d);
a.headers={"Content-Type":"application/json; charset=utf-8"};
var c=new Request.JSON(a);
c.post(JSON.encode(e))
},jsonp:function(c,f,e,b){var a=this._createRequestOptions(c,f,e);
if(b){a.onComplete=function(h,g){this._onComplete(g,e)
}.bind(this)
}var d=new Request.JSONP(a);
d.send(JSON.encode(f))
},jsonrpc:function(a,e,c,b){var d=Object.clone(this.REQUEST_OBJECT);
d.method=e;
d.params=c;
this.post(a,d,{onSuccess:function(f){if(f.result&&typeof(b.onSuccess)==="function"){b.onSuccess(f.result)
}else{if(typeof(b.onError)==="function"){b.onError({errorDescription:"json-rpc returned an error",errorCode:-9999,payload:f.error})
}}},onError:b.onError})
},responseCallback:null,_createRequestOptions:function(b,h,d){var g=function(i){this._onSuccess(i,d)
}.bind(this);
var c=function(i){this._onError(i,d)
}.bind(this);
var f=function(i){this._onComplete(i,d)
}.bind(this);
var e=function(i,j){this._onRequest(i,j,d)
}.bind(this);
var a={url:b,urlEncoded:false,onSuccess:g,onFailure:c,onComplete:f,onRequest:e};
return a
},_onSuccess:function(a,b){if(a){this._executeSuccessCallback(b.onSuccess,a)
}else{this._executeFailureCallback(b.onError,Constants.ServerErrors.NO_DATA)
}this._executeUsersCallback(this.CALLBACK_STATUS.SUCCESS,a)
},_onError:function(b,c){if(b){var a=Object.clone(Constants.ServerErrors.SERVER_UNHANDLED_ERROR);
a.errorCode=b.status;
this._executeFailureCallback(c.onError,a)
}else{this._executeFailureCallback(c.onError,Constants.ServerErrors.NO_DATA)
}this._executeUsersCallback(this.CALLBACK_STATUS.ERROR,b)
},_onComplete:function(a,b){this._executeSuccessCallback(b.onComplete,a)
},_onRequest:function(b,f,d){var e=W.Utils.getQueryParam("callback",b).split(".");
var a=window;
for(var c=0;
c<e.length;
c++){a=a[e[c]]
}if(typeof(d.onRequest)==="function"){d.onRequest(a,b,f)
}},_executeSuccessCallback:function(b,a){if(typeOf(b)==="function"){b(a)
}},_executeFailureCallback:function(b,a){if(typeOf(b)==="function"){b(a.errorDescription,a.errorCode,a.payload)
}},_executeUsersCallback:function(a,b){if(this.responseCallback&&typeOf(this.responseCallback)==="function"){this.responseCallback(a,b)
}}}});
W.Classes.newClass({name:"mobile.core.managers.serverfacade.WixRESTClient",Class:{Extends:"mobile.core.managers.serverfacade.RESTClient",initialize:function(){},_onSuccess:function(a,b){this._validateServerSuccessResponse(a);
if(a){if(a.success){this._executeSuccessCallback(b.onSuccess,a)
}else{this._executeFailureCallback(b.onError,a)
}}else{this._executeFailureCallback(b.onError,Constants.ServerErrors.NO_DATA)
}this._executeUsersCallback(this.CALLBACK_STATUS.SUCCESS,a.payload)
},_onComplete:function(a,b){this._validateServerSuccessResponse(a);
this.parent(a,b)
},_validateServerSuccessResponse:function(a){if(!a||a.success===false){LOG.reportError(wixErrors.SERVER_RETURNED_ERROR,"RESTClient","_onComplete",a)
}},_executeSuccessCallback:function(c,a){var b=(a&&a.payload)||a;
this.parent(c,b)
},_executeUsersCallback:function(a,b){var c=(b&&b.payload)||b;
this.parent(a,c)
}}});
W.Classes.newClass({name:"mobile.core.managers.serverfacade.CorsRESTClient",Class:{Extends:"mobile.core.managers.serverfacade.RESTClient",initialize:function(){},get:function(a,d,b){var c=this._createCorsXhr(a);
c.onabort=function(f){this._onXhrEvent("abort",c,b)
}.bind(this);
c.ontimeout=function(f){this._onXhrEvent("timeout",c,b)
}.bind(this);
c.onerror=function(f){this._onXhrEvent("error",c,b)
}.bind(this);
c.onload=function(f){this._onXhrEvent("load",c,b)
}.bind(this);
c.send()
},_createCorsXhr:function(b,f){var a=f||"GET";
var d=null;
try{d=new XMLHttpRequest()
}catch(c){}if(d&&"withCredentials" in d){d.open(a,b,true)
}else{if(typeof XDomainRequest!="undefined"){d=new XDomainRequest();
d.open(a,b);
d.setRequestHeader=function(e,g){}
}}return d
},_onXhrEvent:function(b,c,d){if(b=="load"&&(this._isIExplorer()||c.readyState==4)){var a={};
try{a=JSON.parse(c.responseText)
}catch(f){}this._onSuccess(a,d)
}else{this._onError(c,d)
}},_isIExplorer:function(){return navigator.userAgent.indexOf("MSIE")!=-1
},post:undefined,jsonp:undefined,jsonrpc:undefined}});
Constants.SkinParamTypes={BORDER_RADIUS:"cssBorderRadius",BG_COLOR:"cssBgColor",BOX_SHADOW:"boxShadow",COLOR:"color",COLOR_ALPHA:"color_alpha",FONT:"cssFont",SIZE:"size",OTHER:"cssStr",URL:"url",TRANSITION:"transition"};
Constants.SkinParamCssTypesToGeneralTypesMap={cssBorderRadius:"radius",cssBgColor:"color",boxShadow:"boxShadow",color:"color",color_alpha:"color",cssFont:"font",size:"size",cssStr:"string",url:"url",transition:"transition"};
Constants.skinManager={STYLE_CSS_PLACEHOLDER:"[STYLE_PH]",FEATURES:{}};
(function(){var b=new Element("div");
var a=function(d,e,c){b.style.cssText=e;
Constants.skinManager.FEATURES[d]=c(b)
};
a("filter_alpha","filter:alpha(opacity=0.9);",function(c){return(c.style.filter!==undefined&&c.style.filter.indexOf("alpha")!=-1)
});
a("opacity","opacity:0.7;",function(c){return(c.style.opacity!==undefined&&c.style.opacity=="0.7")
});
a("background-color_rgba","background-color:rgba(255,0,0,0.5);",function(c){return(c.style.backgroundColor!==undefined&&c.style.backgroundColor.indexOf("rgba")!=-1)
});
a("border-radius","border-top-right-radius:0.1em;",function(c){return(c.style.borderTopRightRadius!==undefined&&c.style.borderTopRightRadius.indexOf("0.1em")!=-1)
});
a("-webkit-border-radius","-webkit-border-top-right-radius:0.2em;",function(c){return(c.style.webkitBorderTopRightRadius!==undefined&&c.style.webkitBorderTopRightRadius.indexOf("0.2em")!=-1)
});
a("-moz-border-radius","-moz-border-radius-topright:0.3em;",function(c){return(c.style.MozBorderRadiusTopright!==undefined&&c.style.MozBorderRadiusTopright.indexOf("0.3em")!=-1)
})
})();
W.Classes.newClass({name:"mobile.core.managers.SkinManager",Class:{Extends:"mobile.core.managers.BaseManager",Binds:["buildSkinCSS","_onThemeChange","_checkThemePropChanges","_checkStylePropChanges"],initialize:function(){this._SkinParserClass=W.Classes.get("mobile.core.managers.skin.SkinParser");
this._SkinRendererClass=W.Classes.get("mobile.core.managers.skin.SkinRenderer");
this._CssGarbageCollectorClass=W.Classes.get("mobile.core.managers.skin.CssGarbageCollector");
this._skinParser=new this._SkinParserClass();
this._skinRenderer=new this._SkinRendererClass();
this._skinQue=new W.Queue();
this._skinClassMap={};
this._skinDataMap={};
this._styleDataMap={};
this._cssGarbageCollector=new this._CssGarbageCollectorClass(this._styleDataMap,this._skinDataMap,this._skinRenderer);
if(W.Classes.getClassStatus("mobile.core.skins.BaseSkin")=="missing"){this.newSkin(W.BaseSkinClassData)
}W.Theme.addEvent("propertyChange",this._onThemeChange);
setInterval(this._cssGarbageCollector.runGarbageCollector,10000)
},newSkin:function(f){if(this._skinClassMap[f.name]||this._skinDataMap[f.name]){LOG.reportError(wixErrors.SKIN_ALREADY_EXIST,this.className,"newSkin",f.name+"");
return
}var e=f.Class;
var b=(f.imports||[]);
f.imports=b;
var g=e.compParts||{};
for(var c in g){var d=g[c].skin;
if(d&&b.indexOf(d)<0){b.push(d)
}}if(f.name!="mobile.core.skins.BaseSkin"&&!instanceOf(e.Extends,String)){e.Extends="mobile.core.skins.BaseSkin"
}if(f.onSkinReady){this._skinQue.add(f.name,f.onSkinReady)
}f.onClassReady=function(h){var i=this._skinParser.parseSkinData(h.prototype);
this._skinDataMap[f.name]=i;
h.prototype.getSkinClassData=function(){return i
};
this._onSkinReady(h,f.name)
}.bind(this);
var a=W.Classes;
a.newClass(f)
},override:function(b,a){if(!b){throw new Error("null/undefine skin name to override: ")
}this.getSkin(b,function(){this._skinClassMap[b]=a
}.bind(this))
},getSkin:function(a,b){if(this._skinClassMap[a]){W.Utils.callLater(b,[this._skinClassMap[a]]);
return this._skinClassMap[a]
}else{this._skinQue.add(a,b);
W.Classes.get(a,function(){});
return null
}},_onSkinReady:function(b,a){this._skinClassMap[a]=b;
this._skinQue.getQueue(a).forEach(function(c){c(this._skinClassMap[a])
}.bind(this));
this._skinQue.removeKey(a)
},_$getCssId:function(){return this._skinRenderer.getCssNodeId()
},clone:function(){var a=this.parent();
Object.forEach(this._skinClassMap,function(c,b){a._skinClassMap[b]=c
});
Object.forEach(this._skinDataMap,function(c,b){a._skinDataMap[b]=c
});
return a
},isReady:function(){return(!this._skinQue.hasQueue())
},buildSkinCSS:function(a,c){var d=this._skinDataMap[a];
if(!d){LOG.reportError(wixErrors.SKIN_MANAGER_NO_DATA_FOR_SKIN,"mobile.core.managers.SkinManager","buildSkinCSS",a);
return
}var b=this._skinRenderer.getStyleId(c);
if(d.CSSBuildFlags[b]||(c&&c.isStyleRenderedForSkin(a))){return
}if(c){this._styleDataMap[b]=c;
c.setStyleRenderFlagForSkin(a,true)
}else{d.CSSBuildFlags[b]=true
}this._skinRenderer.registerSkinCSSNow(d,c)
},buildSkinHTML:function(b,a,e){if(!(b&&a)){var c=a&&a.getProperty("id");
LOG.reportError(wixErrors.SKIN_MANAGER_MISSING_ARGUMENTS,"mobile.core.managers.SkinManager","buildSkinHTML","skinName="+b+" compId="+c+"compViewNode: "+a);
return{}
}var d=this._skinDataMap[b];
if(!d){LOG.reportError(wixErrors.SKIN_MANAGER_NO_DATA_FOR_SKIN,"mobile.core.managers.SkinManager","buildSkinHTML",b);
return{}
}return this._skinRenderer.buildSkinHTML(d,a,e)
},stylePropertiesChangedForSkin:function(a,d,c){var b=d&&d.getId();
if(a&&b&&c){if(!this._styleChangedProps){this._styleChangedProps={}
}this._styleChangedProps[a]=this._styleChangedProps[a]||{};
this._styleChangedProps[a][b]=this._styleChangedProps[a][b]||{style:d,props:{}};
for(var e in c){this._styleChangedProps[a][b].props[e]=""
}if(!this._styleChangeCallLater){this._styleChangeCallLater=W.Utils.callOnNextRender(this._checkStylePropChanges,100)
}}},_onThemeChange:function(b){var a=b.name;
if(a){if(!this._themeChangedProps){this._themeChangedProps={}
}this._themeChangedProps[a]=b;
if(!this._themeChangeCallCallLater){this._themeChangeCallCallLater=W.Utils.callOnNextRender(this._checkThemePropChanges,100)
}}},_checkStylePropChanges:function(){var a,h,f,b,g,e,d,c;
delete this._styleChangeCallLater;
for(a in this._styleChangedProps){h=this._styleChangedProps[a];
f=this._skinDataMap[a];
for(b in h){g=h[b].style;
e=h[b].props;
d=f.css;
for(c=0;
c<d.length;
++c){if(this._isSkinCssClassContainsPartialParams(d[c],e,"id")){this._skinRenderer.updateSkinCSSClass(d[c].selector,d[c].rules,d[c].params,f.params,g)
}}}}delete this._styleChangedProps
},_checkThemePropChanges:function(){delete this._themeChangeCallCallLater;
if(this===W.Skins){for(var a in this._skinDataMap){var d=this._skinDataMap[a];
var c=this._skinDataMap[a].css;
for(var b=0;
b<c.length;
++b){if(this._isSkinCssClassContainsPartialParams(c[b],this._themeChangedProps,"defaultTheme")){this._skinRenderer.updateSkinCSSClass(c[b].selector,c[b].rules,c[b].params,d.params)
}}}}delete this._themeChangedProps
},_isSkinCssClassContainsPartialParams:function(d,c,f){var e=d.params;
for(var a in c){for(var b=0;
b<e.length;
++b){if(e[b][f]&&e[b][f]==a){return true
}}}return false
},getSkinParamValue:function(a,b,d){var f=this._skinDataMap[a].params;
for(var c=0;
c<f.length;
c++){var e=f[c];
if(e.id==b){return this._skinRenderer.getParamValue(e,d)
}}return null
},getUniqueClass:function(d,b){var c=this._skinParser.getSkinCSSName(b);
var a=this._skinParser.getUniqueClass(d,c);
return a.uniqueClass
}}});
W.Classes.newClass({name:"mobile.core.managers.skin.SkinParser",Class:{parseSkinData:function(d){var b=d.className;
var f=d._params||[];
var l=d._html||"";
var m=d._css||[];
var o=[];
var j={};
var g={};
var k=this._addStylePlaceHolder(this.getSkinCSSName(b));
f=this._processSkinParams(f,b);
for(var h=0;
h<m.length;
++h){var c=m[h];
if(!c){var a="";
try{a=m.join(",")
}catch(n){}LOG.reportError(wixErrors.SKIN_PROBLEM_WITH_RULE,this.className,"_registerSkinData",b+"("+h+") : "+a)
}else{this._processSkinCssClass(c,f,k,g,j,o)
}}return{params:f,html:l,css:o,compParts:d.compParts||{},skinPartClasses:j,skinSpecificClasses:g,skinCSSName:k,CSSBuildFlags:{},canFocus:!!d.canFocus}
},getSkinCSSName:function(a){return a.replace(/\./g,"_")
},_processSkinParams:function(e,a){for(var c=0;
c<e.length;
++c){var d=e[c];
if(d.defaultParam){refLoop:for(var b=0;
b<e.length;
++b){if(e[b].id==d.defaultParam){d.defaultParam=e[b];
break refLoop
}}if(typeof d.defaultParam=="string"){LOG.reportError(wixErrors.SKIN_PARAM_REF_NOT_FOUND,a,"_processSkinParams",d.id)();
delete d.defaultParam;
d.defaultValue=""
}}}return e
},_processSkinCssClass:function(n,d,h,e,g,i){var a=n.indexOf("{");
var k=n.lastIndexOf("}");
if(a!=-1&&k!=-1&&(a<k-1)){var b=n.substr(0,a);
var m=n.substring(a+1,k);
var c=this._getParamsUsed(m,d);
var l=b.split(",");
for(var f=0;
f<l.length;
++f){b=this._processSkinCssSelector(l[f],h,e,g);
i.push({selector:b,rules:m,params:c})
}}},_processSkinCssSelector:function(a,d,h,g){var b=this._convertCssSelector(a,d,h,g);
var c=a.length?a.charAt(0):"";
var f=(c=="["||c==":"||c===""||c=="{"||c=="."||c==">");
if(f||(b==a)){var e=f?"":" ";
b="."+d+e+b
}b=b.trim().replace(/\s+/g," ");
return b
},_convertCssSelector:function(b,g,c,e){var f=/%(\.?[a-z0-9]+)%/i;
var i,a,d;
i=b.match(f);
while(i){if(i.length<2){break
}a=i[1];
var h=this.getUniqueClass(a,g);
if(h.type=="class"){c[a.substring(1)]=h.uniqueClass
}else{e[a]=h.uniqueClass
}b=b.replace(f,"."+h.uniqueClass);
i=b.match(f)
}return b
},getUniqueClass:function(b,c){var a={};
if(b.charAt(0)=="."){var d=b.substring(1);
a.uniqueClass=c+"-c-"+d;
a.type="class"
}else{a.uniqueClass=c+"-"+b;
a.type="skinPart"
}return a
},_getParamsUsed:function(h,g){var e=[];
if(!h||(!g||g.length===0)){return e
}for(var d=0,a=g.length;
d<a;
++d){if(h.indexOf("["+g[d].id+"]")!=-1){e[g[d].id]=g[d]
}}var c={};
for(var b in e){var f=e[b];
if(f.defaultParam){while(f.defaultParam!==undefined){f=f.defaultParam
}c[f.id]=f
}}return Object.values(Object.merge(e,c))
},_addStylePlaceHolder:function(a){return a+Constants.skinManager.STYLE_CSS_PLACEHOLDER
}}});
(function(){var a;
W.Classes.newClass({name:"mobile.core.managers.skin.SkinRenderer",Class:{initialize:function(){this._stylesheet=this._generateSkinsStylesSheet()
},replaceStylePlaceHolder:function(c,b){return c.split(Constants.skinManager.STYLE_CSS_PLACEHOLDER).join(b)
},registerSkinCSSNow:function(e,d){var c=e.css;
for(var b=0;
b<c.length;
++b){this.updateSkinCSSClass(c[b].selector,c[b].rules,c[b].params,e.params,d)
}},updateSkinCSSClass:function(g,m,l,n,b){styleId=this.getStyleId(b);
for(var h=0;
h<l.length;
++h){var c=l[h];
var d=c.id;
var f=this._getParamValue(c,b);
var j=this._paramValueToCss(f,c);
if(j===null){j=""
}m=m.split("["+d+"]").join(j)
}g=this.replaceStylePlaceHolder(g,styleId);
if(b&&b.isCssRedirectedToStyle()){b.updateCssRule(g,m)
}else{try{this._stylesheet.updateRule(g,m)
}catch(k){}}},getParamValue:function(b,c){return this._getParamValue(b,c)
},_getParamValue:function(c,d){var g=null;
if(c.defaultParam){var h=c.defaultParam;
return this._applyParamMutators(this._getParamValue(h,d),c)
}if(d&&d.get(c.id)){var b=d.getPropertySource(c.id);
g=d.get(c.id);
if(b=="theme"){g=this.injects().Theme.getProperty(g)
}g=this._castToType(g,c);
g=this._addExtraToParamByType(c,g,d);
return this._applyParamMutators(g,c)
}if(c.defaultTheme){var f=c.defaultTheme;
var e=W.Theme.getProperty(f);
e=this._castToType(e,c);
return this._applyParamMutators(e,c)
}if(c.defaultValue){g=this._castToType(c.defaultValue,c);
return this._applyParamMutators(g,c)
}return null
},_castToType:function(c,b){switch(b.type){case Constants.SkinParamTypes.COLOR:case Constants.SkinParamTypes.COLOR_ALPHA:case Constants.SkinParamTypes.BG_COLOR:c=new W.Color(c);
break;
case Constants.SkinParamTypes.SIZE:c=new W.Size(c);
break;
case Constants.SkinParamTypes.BOX_SHADOW:c=new W.BoxShadow(c);
break;
case Constants.SkinParamTypes.BORDER_RADIUS:c=new W.BorderRadius(c);
break
}return c
},_addExtraToParamByType:function(b,d,c){var f=c.getPropertyType(b.id);
if(f=="color"){var e=c.getPropertyExtraParamValue(b.id,"alpha");
d.setAlpha(e)
}if(f=="boxShadow"){d.setToggleOn(c.getPropertyExtraParamValue(b.id,"isOn")===true)
}return d
},_applyParamMutators:function(e,d){if(d.mutators){for(var c=0;
c<d.mutators.length;
c+=2){var f=e[d.mutators[c]];
if(f&&typeof f=="function"){var b=d.mutators[c+1];
if(!b||typeOf(b)!="array"){b=(!b)?[]:[b]
}e=f.apply(e,b)
}else{LOG.reportError(wixErrors.SKIN_PARAM_MUTATOR_FUNC_NOT_FOUND,"SkinRenderer","_applyParamMutators",f)()
}}}return e
},_paramValueToCss:function(f,c){var e=Constants.skinManager.FEATURES;
if(f!==undefined&&f!==null){c=c||{};
switch(c.type){case Constants.SkinParamTypes.BG_COLOR:var b=f;
var d=b.getAlpha();
if(d>0){if(Modernizr.rgba===true&&d<1){f="background-color:rgba("+b.getRgba()+");"
}else{f="background-color:"+b.getHex(false)+";";
if(e.filter_alpha&&d<1){f+="filter:alpha(opacity="+(d*100)+");"
}}}else{f="background-color:transparent;"
}break;
case Constants.SkinParamTypes.BORDER_RADIUS:var g=W.Utils.getCSSBrowserFeature("border-radius");
if(g){f=g+":"+f+";"
}else{f=""
}break;
case Constants.SkinParamTypes.TRANSITION:g=W.Utils.getCSSBrowserFeature("transition");
if(g){f=g+":"+f+";"
}else{f=""
}break;
case Constants.SkinParamTypes.BOX_SHADOW:if(W.Utils.getCSSBrowserFeature("box-shadow")){f=W.Utils.getCSSBrowserFeature("box-shadow")+":"+f.getCssValue()+";"
}else{f=""
}break;
case Constants.SkinParamTypes.FONT:f="font:"+f.getCssValue()+";";
break;
case Constants.SkinParamTypes.SIZE:f=f.getCssValue();
break;
case Constants.SkinParamTypes.COLOR:f=(f.getHex!==undefined)?f.getHex(false):f;
break;
case Constants.SkinParamTypes.COLOR_ALPHA:b=f;
d=b.getAlpha();
if(d>0){if(Modernizr.rgba===true&&d<1){f="rgba("+b.getRgba()+")"
}else{f=b.getHex(false)
}}else{f="transparent"
}break
}return f
}else{return null
}},buildSkinHTML:function(r,q,d){styleId=this.getStyleId(d);
var o=r.html;
var n=this.replaceStylePlaceHolder(r.skinCSSName,styleId);
q.empty();
q.set("html",o);
if(r.canFocus){q.tabIndex=0
}else{if(q.tabIndex===0){q.tabIndex=-1
}}if(q._wixCSSName){q.removeClass(q._wixCSSName);
delete q._wixCSSName
}if(n){q.addClass(n);
q._wixCSSName=n
}var c={view:q};
var h=$$(q.getElements("[skinPart]"));
var f=r.compParts||{};
var m=r.skinPartClasses||{};
for(var l=0;
l<h.length;
++l){var k=h[l];
var b=k.getAttribute("skinPart");
c[b]=k;
var s=m[b];
if(s){k.addClass(this.replaceStylePlaceHolder(s,styleId))
}var e=k.getAttribute("skin");
if(!e&&f[b]&&f[b].skin){e=f[b].skin;
if(e){k.setAttribute("skin",e)
}}}var j=r.skinSpecificClasses||{};
for(var g in j){var p=$(q).getElements("."+g);
p.removeClass(g).addClass(this.replaceStylePlaceHolder(j[g],styleId))
}return c
},getStyleId:function(b){return(b&&b.getId())||""
},_skinStyleNodeId:null,_generateSkinsStylesSheet:function(){if(!a){a=W.Utils.createStyleSheet("WIX_SKIN_STYLES")
}this._skinStyleNodeId=a.styleNode.get("id");
return a
},getCssNodeId:function(){return this._skinStyleNodeId
},removeCssRule:function(b){this._stylesheet.removeRuleBySelector(b)
}}})
})();
W.Classes.newClass({name:"mobile.core.managers.skin.CssGarbageCollector",Class:{Binds:["runGarbageCollector"],initialize:function(a,c,b){this._styleDataMap=a;
this._skinDataMap=c;
this._skinRenderer=b;
this._DomTraverserClass=W.Classes.get("mobile.core.managers.skin.GCDomTraverse")
},runGarbageCollector:function(){this._domTraverser=new this._DomTraverserClass();
this._domTraverser.traverseDomAndCollectUsedStyles(function(a,b){this._runGarbageCollectorOnStyles(a);
this._runGarbageCollectorOnSkins(b)
}.bind(this))
},_runGarbageCollectorOnStyles:function(d){var b=this._findUnusedStyles(d);
for(var a in b){if(!b[a]){continue
}var c=b[a];
this._processUnusedStyles(c)
}},_findUnusedStyles:function(b){var a=Object.filter(this._styleDataMap,function(d,c){return(!b.contains(c))
});
return a
},_runGarbageCollectorOnSkins:function(d){var a=this._findUnusedSkins(d);
for(var b in a){var c=this._skinDataMap[b];
if(c){this._removeUnusedSkinRules(c)
}}},_findUnusedSkins:function(b){var a=Object.filter(this._skinDataMap,function(d,c){return(!b.contains(c))
});
return a
},_processUnusedStyles:function(b){var e=b.getSkinArray();
var g=b.getGroups();
for(var d in g){var f=g[d];
this._processUnusedStyles(f)
}for(var a=0;
a<e.length;
a++){var c=this._skinDataMap[e[a]];
if(c){this._removeUnusedSkinRules(c,b.getId())
}}b.setStyleRenderFlag(false)
},_removeUnusedSkinRules:function(e,b){var d=e.css;
if(!d){return
}for(var c=0;
c<d.length;
c++){if(!b){b=""
}var a=this._skinRenderer.replaceStylePlaceHolder(d[c].selector,b);
this._skinRenderer.removeCssRule(a);
e.CSSBuildFlags[b]=false
}}}});
W.Classes.newClass({name:"mobile.core.managers.skin.GCDomTraverse",Class:{initialize:function(){this._usedStyles=[];
this._usedSkins=[]
},traverseDomAndCollectUsedStyles:function(a){this._traverseElementAndCollect($(document.body));
a(this._usedStyles,this._usedSkins)
},_traverseElementAndCollect:function(c){var d=c.isDisplayed();
if(!d){return
}this._collectElementStylesSkins(c);
var b=c.getChildren();
if(!b||!b.length){return
}for(var a=0;
a<b.length;
a++){this._traverseElementAndCollect(b[a])
}},_collectElementStylesSkins:function(a){var d=a.getAttribute("styleId");
if(d){this._usedStyles.push(d)
}var c=a.getAttribute("skin");
if(c){this._usedSkins.push(c)
}var b=a.getLogic&&a.getLogic().getSkin&&a.getLogic().getSkin().$className;
if(b){this._usedSkins.include(b)
}}}});
Constants.add("components.DEFAULT_PREFIX","c");
Constants.add("components.BASE_LIST_ITEM_PREFIX","bli");
W.Classes.newClass({name:"mobile.core.managers.ComponentManager",Class:{Extends:"mobile.core.managers.BaseManager",Binds:["getComponent"],initialize:function(){this._componentQue=new W.Queue();
if(W.BaseComponentClassData){W.Classes.newClass(W.BaseComponentClassData);
delete W.BaseComponentClassData
}this._componentMap={"mobile.core.components.base.BaseComponent":W.Classes.get("mobile.core.components.base.BaseComponent")};
if(!this._componentMap["mobile.core.components.base.BaseComponent"]){LOG.reportError(wixErrors.MANAGERS_INVALID_CLASS,"ComponentManager","initialize","W.BaseComponentClassData is missing")()
}},newComponent:function(d){if(this._componentMap[d.name]){LOG.reportError(wixErrors.CM_NAME_ALREADY_EXIST,this.className,"newComponent",d.name)();
return
}if(d.name!="mobile.core.components.base.BaseComponent"&&!instanceOf(d.Class.Extends,String)){LOG.reportError(wixErrors.CM_NO_EXTEND,this.className,"newComponent","")();
return
}var e=d.skinParts||{};
d.Class._skinPartsSchema=e;
var a=(d.imports||[]);
d.imports=a;
for(var b in e){var c=e[b].type;
if(c&&c!=Constants.ComponentPartTypes.HTML_ELEMENT&&a.indexOf(c)<0){a.push(c)
}}d.Class._propertiesSchemaName=d.propertiesSchemaName;
if(d.onComponentReady){this._componentQue.add(d.name,d.onComponentReady)
}d.onClassReady=function(f){this._onComponentClassReady(f,d.name)
}.bind(this);
W.Classes.newClass(d)
},override:function(a,b){if(!a){throw new Error("null/undefined component name for override")
}this._componentMap[a]=b
},getComponent:function(a,b){if(this._componentMap[a]){W.Utils.callLater(b,[this._componentMap[a]]);
return this._componentMap[a]
}else{this._componentQue.add(a,b);
W.Classes.get(a,function(){});
return null
}},getOverrideComponentName:function(a,c){var b=this.getComponent(a,function(d){W.Utils.callLater(c,[d.prototype.className])
}.bind(this));
return b
},_onComponentClassReady:function(c,b){this._componentMap[b]=c;
var a=this._componentQue.getQueue(b);
a.forEach(function(d){d(this._componentMap[b])
}.bind(this));
this._componentQue.removeKey(b)
},createComponent:function(h,k,c,f,m,l,d,g,b,e){if(h&&typeOf(h)=="object"){var a=h;
h=a.type;
k=a.skin||k;
c=a.data||c;
f=a.args||f;
m=a.wixifyCallback||m;
l=a.componentReadyCallback||l;
d=a.domIdPrefix||d;
g=a.compNode||g;
e=a.innerStyle
}if(!h||typeOf(h)!="string"){LOG.reportError(wixErrors.CM_LOGIC_TYPE,this.className,"createComponent","created from:"+this.className+"");
return new Element("span")
}var j={comp:h,skin:k};
if(c){var i=typeof(c);
if(i=="string"){j.dataQuery=c;
c=null
}else{if(i=="object"){if(!c._dataType){LOG.reportError(wixErrors.WIXIFY_MISSING_DATA_TYPE,this.className,"createComponent","created from:"+this.className)
}}}}if(g){g.setProperties(j)
}else{g=new Element("div",j)
}if(m&&typeof m=="function"){g.addEvent("wixified",function(){m(g.getLogic())
})
}if(l&&typeof l=="function"){g.addEvent(Constants.ComponentEvents.READY,function(){g.removeEvent(Constants.ComponentEvents.READY,arguments.callee);
l(g.getLogic())
})
}if(c&&c._dataType){g.wixify(f,c,d,b,e)
}else{g.wixify(f,null,d,b,e)
}return g
},clone:function(){var b=this.parent();
for(var a in this._componentMap){b._componentMap[a]=this._componentMap[a]
}for(a in this._componentQue.map){b._componentQue.map[a]=this._componentQue.map[a]
}return b
},isReady:function(){return(this._componentMap["mobile.core.components.base.BaseComponent"]&&!this._componentQue.hasQueue())
}}});
Constants.DataEvents={DATA_CHANGED:"dataChanged",BEFORE_CHANGE:"beforeDataChange",AFTER_CHANGE:"afterDataChange"};
Constants.DataTypes={TYPE_RESOURCE_KEY:"resourceKey"};
W.Classes.newClass({name:"mobile.core.managers.data.DataManager",Class:{Extends:Events,initialize:function(){this.dataMap={};
this.dirtyDataObjectsMap={};
this.dataTypesMap={};
this.dataTypesSchemaMap={};
this.dataTypesClassMap={};
this.callbackQueue=new W.Queue();
this._DataItemBase=W.Classes.get("mobile.core.managers.data.DataItemBase");
this._DataItemWithSchema=W.Classes.get("mobile.core.managers.data.DataItemWithSchema");
this._dataPropsAdds={};
this._schemaPropsAdds={}
},flagDataChange:function(){this._dataChanged=true
},clearDataChange:function(){this._dataChanged=false
},isDataChange:function(){return(this._dataChanged===true)
},registerDataTypeSchema:function(a,c){var b=c["extends"];
if(b){var d=this.dataTypesSchemaMap[b];
if(!d){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"DataManager","registerDataTypeSchema",[a,b])();
return
}Object.merge(c,d)
}this._appendSchemaPropAdds(a,c);
this.dataTypesSchemaMap[a]=c;
this._runCallbacks(a,c)
},getSchema:function(a,c){var b=null;
if(a){b=this.dataTypesSchemaMap[a];
if(!b){this.callbackQueue.add(a,c)
}else{W.Utils.callLater(c,[b])
}}return b
},registerDataTypeClass:function(b){b.onClassReady=function(c){this._onDataTypeClassReady(c,b.type)
}.bind(this);
var a=W.Classes;
a.newClass(b)
},_onDataTypeClassReady:function(a,b){this.dataTypesClassMap[b]=a
},clearDirtyObjectsMap:function(){this.dirtyDataObjectsMap={}
},hasDirtyObjects:function(){return W.Utils.objectSizeDelta(this.dirtyDataObjectsMap)
},markDirtyObject:function(a){var c=a._data;
var b=c.id;
this.dirtyDataObjectsMap[b]=a
},setInitDataItems:function(a){this.skipDirtyMarking=true;
this.addDataItems(a);
delete this.skipDirtyMarking
},addDataItems:function(a){for(var b in a){this.addDataItem(b,a[b])
}},addDataItem:function(c,b){this._appendDataPropAdds(c,b);
var a=this.createDataItem(b);
a._data.id=c;
this.dataMap[c]=a;
this._runCallbacks(c,a);
if(!this.skipDirtyMarking){this.markDirtyObject(a)
}return a
},override:function(b,a){if(!b||!this.dataMap[b]){throw new Error("Invalid data id name for override: "+b)
}this.dataMap[b]=a
},addDataProps:function(b,c,a){this._dataPropsAdds[b]=this._dataPropsAdds[b]||{};
if(typeOf(a)=="array"){this._dataPropsAdds[b][c]=this._dataPropsAdds[b][c]||[];
this._dataPropsAdds[b][c].combine(a)
}else{if(typeOf(a)=="object"){this._dataPropsAdds[b][c]=this._dataPropsAdds[b][c]||{};
Object.merge(this._dataPropsAdds[b][c],(a))
}}},addSchemaProps:function(b,a){this._schemaPropsAdds[b]=this._schemaPropsAdds[b]||{};
Object.merge(this._schemaPropsAdds[b],a)
},_appendDataPropAdds:function(b,a){if(this._dataPropsAdds.hasOwnProperty(b)){var c=this._dataPropsAdds[b];
Object.each(c,function(e,d){if(typeOf(a[d])=="array"){a[d].combine(e)
}else{if(typeOf(a[d])=="object"){Object.merge(a[d],(e))
}}})
}},_appendSchemaPropAdds:function(a,b){if(this._schemaPropsAdds.hasOwnProperty(a)){Object.merge(b,this._schemaPropsAdds[a])
}},addDataItemWithUniqueId:function(c,b){var d;
do{d=c+Number.random(0,99999).toString(36);
d=d.replace(" ","_")
}while(this.dataMap[d]);
var a=this.addDataItem(d,b);
return{id:d,dataObject:a}
},reportDataItemChangeEvent:function(b,d,a,c){this.fireEvent(Constants.DataEvents.DATA_CHANGED,[b,d,a,c])
},_runCallbacks:function(b,a){this.callbackQueue.popQueue(b).forEach(function(c){c(a)
})
},createDataItem:function(a,b){b=b||a.type;
var d=this.dataTypesSchemaMap[b];
var e=this.dataTypesClassMap[b];
if(!d&&!e&&b!==undefined){var c="/schema=["+b+"]";
LOG.reportError(wixErrors.SCHEMA_MISSING,"DataManager","createDataItem"+c,[b])
}if(d){return new this._DataItemWithSchema(d,a,this)
}else{if(e){return new e(a,this)
}else{return new this._DataItemBase(a,this)
}}},isDataItem:function(a){return a&&instanceOf(a,this._DataItemBase)
},getDataByQuery:function(d,c){var b=null;
if(d.indexOf("#")===0){var a=d.substr(1);
b=this.dataMap[a];
if(!b){this.callbackQueue.add(a,c)
}else{W.Utils.callLater(c,[b]);
return b
}}else{LOG.reportError(wixErrors.DM_MALFORMED_QUERY,"DataManager","getDataByQuery",d);
W.Utils.callLater(c,[null])
}},isDataAvailable:function(c){var b=null;
if(c.indexOf("#")===0){var a=c.substr(1);
b=this.dataMap[a];
if(b){return true
}else{return false
}}else{LOG.reportError(wixErrors.DM_MALFORMED_QUERY,"DataManager","isDataAvailable",c);
return false
}},getDataByQueryList:function(a,j){var b={};
var c=function(i){return function(l){b[i]=l;
var m=true;
for(var k=0;
k<a.length;
++k){if(!b[a[k]]){m=false;
break
}}if(m&&j){j(b)
}}
};
if(a.length===0){var f={};
W.Utils.callLater(j,[f])
}else{var g={};
var e=true;
for(var d=0;
d<a.length;
++d){var h=this.getDataByQuery(a[d],c(a[d]));
if(h){g[a[d]]=h
}else{e=false
}}if(e){return g
}}},getDataMap:function(){return this.dataMap
},getDirtyDataObjectsMap:function(){return Object.filter(this.dirtyDataObjectsMap,function(a){return a.getMeta("isPersistent")
})
},clone:function(){var a=new this.$class();
this._copyData(a);
return a
},isReady:function(){return true
},_copyData:function(b){b.dataTypesMap=Object.clone(this.dataTypesMap);
b.dataTypesSchemaMap=Object.clone(this.dataTypesSchemaMap);
b.dataTypesClassMap=Object.clone(this.dataTypesClassMap);
for(var a in this.dataMap){var c=Object.clone(this.dataMap[a].getData());
b.addDataItem(a,c)
}},toString:function(){return"[Data Manager]"
},markAllDirty:function(){for(var a in this.dataMap){this.dirtyDataObjectsMap[a]=this.dataMap[a]
}},getResourceManager:function(){return W.Resources
},removeDataItem:function(a){var b=typeof a=="string"?a:this.getQueryOfDataItem(a);
this._removeIfSafe(b)
},_removeIfSafe:function(b){var a=b&&this.dataMap[b.substr(1)];
if(!a){return
}if(a.componentsWithInterest.length===0&&!this._isReferenced(b)){a.removeAllEvents();
delete this.dataMap[b.substr(1)]
}},_isReferenced:function(b){var c,a;
for(c in this.dataMap){a=this.dataMap[c].getData();
if(a&&a.items&&a.items.indexOf&&a.items.indexOf(b)!==-1){return true
}}return false
},getQueryOfDataItem:function(a){var b;
for(b in this.dataMap){if(a===this.dataMap[b]){return"#"+b
}}}}});
Constants.Theme={COLOR_PALETTE_INDEX:11,COLOR_SUB_PALETTE_SIZE:5};
W.Classes.newClass({name:"mobile.core.managers.ThemeManager",Class:{Extends:"mobile.core.managers.data.DataManager",Binds:["_onDataChanged","_onDataReady","_onPropChange","_updateEffectedProps"],Static:{INIT_STYLE_RAW_DATA:{type:"TopLevelStyle",skin:"skin-name-place-holder",style:{properties:{},groups:{}}},TEXT_STYLE_SHEET:""},getStyle:function(b,d,a){if(this._styleCache[b]){W.Utils.callLater(d,[this._styleCache[b]])
}else{this._styleQueue.add(b,d);
if(this._styleQueue.getQueue(b).length>1){return
}var c=function(e){e.removeEvent(Constants.StyleEvents.READY,c);
this._styleCache[b]=e;
this._styleQueue.getQueue(b).forEach(function(f){f(e)
});
this._styleQueue.removeKey(b)
}.bind(this);
if(this.isStyleAvailable(b)){this.getDataByQuery("#"+b,function(e){var g=e.get("style");
var f=new this.TopLevelStyleClass(e);
f.addEvent(Constants.StyleEvents.READY,c)
}.bind(this))
}else{this.createStyle(b,"",a,c)
}}},isStyleAvailable:function(a){return this.isDataAvailable("#"+a)
},invalidateStyle:function(a){if(this._styleCache[a]){this._styleCache[a].invalidateStyle()
}},createStyle:function(b,f,a,h){if(this._stylesInProcess[b]||this._styleCache[b]){LOG.reportError(wixErrors.STYLE_ALREADY_EXISTS,"ThemeManager","createStyle",b)()
}var g=Object.clone(this.INIT_STYLE_RAW_DATA);
g.skin=a;
var c=this.addDataItem(b,g);
var e=new this.TopLevelStyleClass(c);
this._stylesInProcess[b]=e;
var d=function(){e.removeEvent("styleReady",d);
var i=e.getId();
delete this._stylesInProcess[i];
this._styleCache[i]=e;
h(e)
}.bind(this);
e.addEvent("styleReady",d)
},initialize:function(a){this.parent();
this.TopLevelStyleClass=W.Classes.get("mobile.core.managers.style.Style");
this._placeHoldersMap={};
this._isReady=false;
this._styleQueue=new W.Queue();
this._styleCache={};
this._stylesInProcess={};
this._isOperating=false;
if(a){this._onDataReady(a)
}},setInitDataItems:function(a){this.parent(a);
var b="#THEME_DATA";
if(this.isDataAvailable(b)){this.getDataByQuery(b,this._onDataReady)
}else{W.Data.getDataByQuery(b,this._onDataReady)
}},getPropertyType:function(a){return this._data.getFieldSchema(a).type
},_onDataReady:function(a){var e=a.get("type")==="Theme";
if(e){var c=a;
a=this.addDataItem(c.get("id"),{type:this._getThemeSchemaTypeName()});
var d=c.get("properties");
for(var b in d){a.set(b,d[b].value)
}}this._setData(a);
this._isReady=true
},_getThemeSchemaTypeName:function(){return"WFlatTheme"
},_setData:function(a){this._flattenData(a);
if(this._data){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChanged)
}this._data=a;
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChanged);
this._indexAllPlaceholders();
W.Css.updateAllThemeCss()
},_flattenData:function(b){this._flattenedDataItems={};
var a=b.getData();
var e=b.getSchema();
var g={};
var j,f,p;
for(p in a){if(typeOf(a[p])=="array"){j=p;
var o=a[p];
var n=o.length;
var d=e[p].defaultItems;
if(d.length>n){for(var c=n;
c<d.length;
c++){o.push(d[c]);
n++
}}for(f=0;
f<n;
f++){g[j+"_"+f]=o[f];
this._flattenedDataItems[j+"_"+f]=j
}}else{g[p]=a[p]
}}b.setData(g);
var l={};
for(p in e){if(e[p].type=="array"){j=p;
var m=e[p].itemType;
var h=e[p].defaultItems;
for(f=0;
f<h.length;
f++){l[j+"_"+f]={type:m,"default":h[f]};
if(!this._flattenedDataItems[j+"_"+f]){this._flattenedDataItems[j+"_"+f]=j
}}}else{l[p]=e[p]
}}b.setSchema(l)
},_indexAllPlaceholders:function(){this._placeHoldersMap={};
var b=this._data.getSchema();
for(var a in b){this._updatePlaceholdersInProperty(a,this.getRawProperty(a))
}},_updatePlaceholdersInProperty:function(b,f,c){var d=this._getPlaceholders(f,true);
var a=(c)?this._getPlaceholders(c,true):{};
var e=Object.merge({},a,d);
for(var g in e){this._placeHoldersMap[g]=this._placeHoldersMap[g]||{};
if(d[g]&&!a[g]){this._placeHoldersMap[g][b]=b
}else{if(!d[g]){delete this._placeHoldersMap[g][b]
}}}},_getPlaceholders:function(g,e){var f=/\[([^}]+)\]/g;
var c=/\{([^}]+)\}|\[([^}]+)\]/g;
var d=(e)?c:f;
var a={};
var b=d.exec(g);
while(b){var h=b[1]||b[2];
if(h){a[h]=h
}b=d.exec(g)
}return a
},clone:function(){var b=this.parent();
this._copyData(b);
var a=b.dataMap.THEME_DATA;
b._setData(a);
return b
},isReady:function(){return this._isReady
},getProperties:function(){var a={};
var c=this._data.getSchema();
for(var b in c){a[b]={value:this.getRawProperty(b),type:this._data.getFieldSchema(b).type}
}return a
},getProperty:function(b,h,d){var g=this._data.get(b);
var f=typeOf(g)=="string"?g:Object.clone(g);
var a=this._data.getFieldSchema(b);
if(!a){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"ThemeManager","getProperty",[b,this._data.getData(),null]);
return null
}var c=this.getPropertyType(b);
if(!h&&typeOf(f)=="string"&&(f.indexOf("[")!=-1)){for(var e in this._data.getSchema()){if(f.indexOf("["+e+"]")!=-1){f=f.split("["+e+"]").join(this.getProperty(e))
}}}if(d){return f
}switch(c){case"themeUrl":return W.Config.getCoreThemesUrl("html-client-core")+"/"+f+"/";
case"color":return new W.Color(f);
case"background":return new W.Background(f,this);
case"font":return new W.Font(f,this);
case"radius":return new W.BorderRadius(f);
case"webThemeUrl":return W.Config.getServiceTopologyProperty("staticThemeUrlWeb")+"/"+f+"/"
}return f
},_onDataChanged:function(a,c){if(this._isOperating){return
}this._isOperating=true;
this._indexAllPlaceholders();
if(typeof c=="string"){this._updateEffectedProps(c)
}else{for(var b in c){this._updateEffectedProps(b)
}}this._isOperating=false
},getRawProperty:function(a){return this.getProperty(a,true,true)
},clearOverrides:function(){this._data.reset()
},getOverrides:function(){return this.getProperties()
},getDataItem:function(){return this._data
},setProperty:function(b,d){var a=this._data.getFieldSchema(b);
if(!a){LOG.reportError(wixErrors.SCHEMA_MISSING_KEY,"ThemeManager","setProperty",[b,this._data.getData(),null]);
return
}var c=a.type;
if(c=="color"){if(d&&d.getRgba){d=d.getRgba()
}}this._updatePlaceholdersInProperty(b,d,this.getRawProperty(b));
this._data.set(b,d);
this._updateEffectedProps(b)
},getPropertiesAccordingToType:function(b){var a=[];
var d=this._data.getSchema();
for(var c in d){if(b==this._data.getFieldSchema(c).type){a.push(c)
}}return a
},_onPropChange:function(a,e){var d=[a];
e=e||this.getProperty(a);
this.fireEvent("propertyChange",{name:a,newVal:e,type:"propertyChange"});
var c=this._placeHoldersMap[a];
for(var b in c){d.combine(this._onPropChange(b,this.getProperty(b)))
}return d
},_updateEffectedProps:function(b){var c=this._onPropChange(b);
var a={};
c.forEach(function(d){a[d]=this._data.get(d)
}.bind(this));
this._data.fireDataChangeEvent(a)
},getDirtyDataObjectsMap:function(){var c=this.parent();
if(c&&c.THEME_DATA){c.THEME_DATA=this.createDataItem(Object.clone(c.THEME_DATA.getData()),this._getThemeSchemaTypeName());
var d=c.THEME_DATA.getData();
for(var a in d){if(this._flattenedDataItems[a]){var b=this._flattenedDataItems[a];
if(!d[b]){d[b]=[]
}d[b].push(d[a]);
delete d[a]
}}}return c
}}});
W.Managers.ThemeDataManager=new WClass({className:"themeDataManager",Extends:W.Managers.DataManager});
Constants.CSS={COLORS:["transparent","aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"],SYSTEM_FONTS:{"sans-serif":[["Arial","Helvetica"],["Arial Black","Gadget"],["Impact","Charcoal"],["Lucida Sans Unicode","Lucida Grande"],["Tahoma","Geneva"],["Verdana","Geneva"]],serif:["Georgia",["Palatino Linotype","Book Antiqua","Palatino"],["Times New Roman","Times"]],cursive:["Comic Sans MS"],monospace:["Courier New",["Lucida Console","Monaco"]]},CUSTOM_FONTS:{"sans-serif":["Anton","Basic","Jockey One","Jura","Open Sans","Overlock","Play","Signika","Spinnaker","Chelsea Market"],serif:["Caudex","EB Garamond","Enriqueta","Forum","Noticia Text","Fredericka the Great","Kelly Slab","Josefin Slab"],cursive:["Lobster","Niconne","Marck Script","Mr De Haviland","Patrick Hand","Sarina","Corben"],monospace:[]}};
W.Classes.newClass({name:"mobile.core.managers.CssManager",Class:{Extends:"mobile.core.managers.BaseManager",Binds:["_onThemePropertyChange"],Static:{GLOBAL_THEME_CSS_TYPES:["font","color"],FONT_SERVICE_URL:"http://fonts.googleapis.com/css?family=",THEME_STYLE_SHEET:null},initialize:function(){this._themeStyleSheet=this._generateThemeStylesSheet();
this._addHelveticaToWixSites();
this._configureSystemFonts();
this._configureCustomFonts();
W.Theme.addEvent("propertyChange",this._onThemePropertyChange)
},_configureSystemFonts:function(){this._systemFontsCssDefinition={};
this._systemFontsNames=[];
for(var a in Constants.CSS.SYSTEM_FONTS){var f=Constants.CSS.SYSTEM_FONTS[a];
for(var c=0;
c<f.length;
++c){var e=f[c];
var d=(typeOf(e)=="array")?e[0]:e;
this._systemFontsNames.push(d);
var b=(typeOf(e)=="array")?e.concat().reverse():[e];
b.push(a);
this._addQuoteToArrayElementsIfContainSpaces(b);
this._systemFontsCssDefinition[d]=b.join(",")
}}},_configureCustomFonts:function(){this._customFontsCssDefinition={};
this._customFontsNames=[];
for(var a in Constants.CSS.CUSTOM_FONTS){var f=Constants.CSS.CUSTOM_FONTS[a];
for(var c=0;
c<f.length;
++c){var e=f[c];
var d=(typeOf(e)=="array")?e[0]:e;
this._customFontsNames.push(d);
var b=(typeOf(e)=="array")?e.concat().reverse():[e];
b.push(a);
this._addQuoteToArrayElementsIfContainSpaces(b);
this._customFontsCssDefinition[d]=b.join(",")
}}},_addQuoteToArrayElementsIfContainSpaces:function(b){for(var a=0;
a<b.length;
++a){if(b[a].indexOf(" ")){b[a]='"'+b[a]+'"'
}}},_onThemePropertyChange:function(b){var a=W.Theme.getPropertyType(b.name);
if(this.GLOBAL_THEME_CSS_TYPES.contains(a)){this._updateThemeGlobalCssByPropertyName(b.name,a)
}},updateAllThemeCss:function(){for(var c=0;
c<this.GLOBAL_THEME_CSS_TYPES.length;
++c){var d=this.GLOBAL_THEME_CSS_TYPES[c];
var b=W.Theme.getPropertiesAccordingToType(d);
for(var a=0;
a<b.length;
++a){this._updateThemeGlobalCssByPropertyName(b[a],d)
}}},_updateThemeGlobalCssByPropertyName:function(b,c){var e=this.getThemeGlobalPropertyCssDefinition(b,c);
this._themeStyleSheet.updateRule(e.selector,e.rules);
if(c=="font"){var a=W.Theme.getProperty(b).getFontFamily();
var d=this.getFontType(a);
if(d=="custom"){this.loadFont(a)
}}},getThemeGlobalPropertyCssDefinition:function(c,d,e){d=d||W.Theme.getPropertyType(c);
var b=W.Theme.getProperty(c);
var a;
var f="";
switch(d){case"font":a="."+c;
if(!e){f=b.getCssRule()
}else{f="font: "+b.getCssValue()
}break;
case"color":a="."+c;
f="color:"+b.getHex(false);
break
}return{selector:a,rules:f}
},_generateThemeStylesSheet:function(){if(!this.$class.THEME_STYLE_SHEET){this.$class.THEME_STYLE_SHEET=W.Utils.createStyleSheet("WIX_THEME_STYLES")
}this._themeStyleNodeId=this.$class.THEME_STYLE_SHEET.styleNode.get("id");
return this.$class.THEME_STYLE_SHEET
},getCssNodeId:function(){return this._themeStyleNodeId
},getDefaultFont:function(){var a=Constants.CSS.SYSTEM_FONTS["sans-serif"][0];
a=(typeOf(a)==="array")?a[0]:a;
return a
},getFontFallbacksCss:function(a){return this._systemFontsCssDefinition[a]||this._customFontsCssDefinition[a]||'"'+a+'"'
},getFontList:function(){return[].concat(this._systemFontsNames,this._customFontsNames).sort()
},getFontType:function(a){if(this._systemFontsNames.indexOf(a)!=-1){return"system"
}if(this._customFontsNames.indexOf(a)!=-1){return"custom"
}return null
},getUsedFontsUrl:function(){var d=W.Theme.getPropertiesAccordingToType("font");
var b={};
for(var c=0;
c<d.length;
++c){var a=W.Theme.getProperty(d[c]).getFontFamily();
if(this.getFontType(a)=="custom"){b[a]=a
}}return this.FONT_SERVICE_URL+this._getFontsQuery(b)
},loadFont:function(c){this._readyFonts=this._readyFonts||{};
this._loadedFonts=this._loadedFonts||{};
var a=(this._customFontsNames.indexOf(c)!=-1);
var b=(this._readyFonts[c]);
var d=(this._loadedFonts[c]);
if(!a||b||d){return
}this._loadedFonts[c]=c;
if(!this._fontLoadCallLater){this._fontLoadCallLater=W.Utils.callLater(this._loadFonts,undefined,this,50)
}},_loadFonts:function(){delete this._fontLoadCallLater;
var a=this.FONT_SERVICE_URL+this._getFontsQuery(this._loadedFonts);
for(var b in this._loadedFonts){this._readyFonts[b]=b;
delete this._loadedFonts[b]
}this._addFontsLoaderCssTag(a)
},_getFontsQuery:function(b){fontQuery="";
for(var a in b){fontQuery+=a.split(" ").join("+");
fontQuery+=":n,b,i,bi|"
}return fontQuery
},_addFontsLoaderCssTag:function(c){var b=document.createElement("link");
b.rel="stylesheet";
b.type="text/css";
b.href=c;
var a=document.getElementsByTagName("link")[0];
a.parentNode.insertBefore(b,a)
},_addHelveticaToWixSites:function(){if(window.rendererModel&&rendererModel.documentType==="WixSite"){Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Italic"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Thin"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Medium"]);
this._addFontsLoaderCssTag(window.serviceTopology.publicStaticsUrl+"/css/Helvetica/fontFace.css")
}},clone:function(){return this.parent()
},isReady:function(){return true
}}});
W.Classes.newClass({name:"mobile.core.managers.ResourceManager",imports:["mobile.core.managers.serverfacade.WixRESTClient"],Class:{Extends:"mobile.core.managers.BaseManager",initialize:function(){this._restClient=new this.imports.WixRESTClient();
this.bundles={};
this._runningRequests={};
this.local=W.Config.getLanguage();
this._isReady=true;
this._initializeExtra()
},_initializeExtra:function(){},clone:function(){var a=this.parent();
a.bundles=Object.clone(this.bundles);
a.local=this.local;
a._currentBundle=this._currentBundle;
return a
},isReady:function(){return(this._isReady===true)
},setCurrentBundle:function(a){this._currentBundle=a
},get:function(c,d,b){var a=this.bundles[c];
if(!a){LOG.reportError(wixErrors.RESOURCE_MANAGER_BUNDLE_NOT_FOUND,"mobile.editor.managers.ResourceManager","get",[c,d]);
return"bundle wasn't loaded yet: [ "+c+" ] when requesting [ "+d+" ]"
}if(!a.hasOwnProperty(d)){return b?b:("localized item not found: [ "+d+"] in bundle: [ "+c+" ] ")
}else{return a[d]
}},replacePlaceholders:function(b,c){if(typeof c!=="string"){return""
}var a=this.bundles[b];
if(!a){LOG.reportError(wixErrors.RESOURCE_MANAGER_BUNDLE_NOT_FOUND,"mobile.editor.managers.ResourceManager","replacePlaceholders",[b,c])
}c=c.replace(/\[.+?\]/g,function(d,h,f){var e=d.substring(1,d.length-1);
var g=a[e];
return(g!==undefined)?g:d
});
return c
},exist:function(b,c){var a=this.bundles[b];
return(a&&a.hasOwnProperty(c))
},bundleExist:function(a){return this.bundles[a]
},getCur:function(b,a){return this.get(this._currentBundle,b,a)
},set:function(b,a){this.bundles[b]=a
},loadResourceBundle:function(a,c){if(this.bundles[a]){if(typeof(c)==="function"){c(this.bundles[a])
}return
}var b=false;
if(!this._runningRequests[a]){b=true;
this._runningRequests[a]={pendingCallbacks:[]}
}if(typeof(c)==="function"){this._runningRequests[a].pendingCallbacks.push(c)
}if(b){this._loadResourceForFirstTime(a)
}},_loadResourceForFirstTime:function(b){var a=W.Config.getResourcesStaticUrl();
a+=b+"/"+this.local+".js";
var c=this;
this._restClient.jsonp(a,null,{onComplete:function(d){c.set(b,d);
c._runningRequests[b].pendingCallbacks.forEach(function(e){e(d)
});
delete c._runningRequests[b]
},onRequest:function(d){c._runningRequests[b].mooCallback=d
}})
},loadResourceBundles:function(a,d){var c=0;
for(var b=0;
b<a.length;
b++){this.loadResourceBundle(a[b],function(){c++;
if(c==a.length){d()
}})
}}}});
Constants.PropertyEvents={PROPERTY_CHANGED:"propertyChanged"};
W.Classes.newClass({name:"mobile.core.managers.data.ComponentDataManager",Class:{Extends:"mobile.core.managers.data.DataManager",initialize:function(){this._PropertiesItem=W.Classes.get("mobile.core.managers.data.PropertiesItem");
this.parent()
},addDataItem:function(d,c,b){var a=this.createDataItem(c,b);
a._data.id=d;
this.dataMap[d]=a;
this._runCallbacks(d,a);
this.markDirtyObject(a);
return a
},createDataItem:function(a,c){var b=a.type;
var d=this.dataTypesSchemaMap[b];
if(d){return new this._PropertiesItem(d,a,this,c)
}else{return new this._DataItemBase(a,this)
}}}});
Constants.ViewManager={VIEW_MODE_SITE:"site",VIEW_MODE_EDITOR:"editor",VIEW_MODE_PREVIEW:"preview"};
W.Classes.newClass({name:"mobile.core.managers.ViewManagerBase",Class:{Extends:Events,Binds:["_onTransitionFinished","_onEditModeChanged","_onHashChange"],initialize:function(){this._isReady=true;
this._isSiteReady=false;
this._pages=null;
this._pagesData=null;
this._mainPageData=null;
this._siteStructureData=null;
this._currentPageId=null;
this._isFullScreen=null;
this._fullScreenCallbacks=[];
this._requiredConfigParams=["staticMediaUrl","staticThemeUrl","scriptsRoot","emailServer","htmlComponentEchoUrl"];
this._scrollLock=false;
this._isPageScrollToTopEnabled=true;
this._stopAnimation=null;
this._loadedExtJS={};
this._pendingExtJS=[];
this._onSiteReady=this._onSiteReady.bind(this);
this._loadNextPage=this._loadNextPage.bind(this);
this._loadScript=this._loadScript.bind(this);
this._onScriptLoaded=this._onScriptLoaded.bind(this);
var a=W.Utils.getQueryParam("isEdited");
if(a=="true"){this.setPreviewMode(true)
}this.addEvent("pageTransitionEnded",this._onTransitionFinished)
},setPreviewMode:function(a){this._isPreview=a;
if(a&&document&&document.body){$(document.body).addClass("prevMode")
}},setStopAnimation:function(a){this._stopAnimation=a
},getNewUniquePageId:function(a){var b;
do{b=W.Utils.getUniqueId(a+"Page")
}while(this._pages[b]!==undefined);
return b
},isScrollLock:function(){return this._scrollLock
},setLinkTipFunc:function(a){this._linkTipFunc=a
},getLinkTipFunc:function(){return this._linkTipFunc
},getPreviewMode:function(){return !!this._isPreview
},setSite:function(c,b,d){if(!c){LOG.reportError(wixErrors.VM_INVALID_SITE_NODE,this.className,"setSite","")
}if(!b){LOG.reportError(wixErrors.VM_INVALID_SITE_DATA,this.className,"setSite","")
}this._siteNode=c;
this._siteStructureData=b;
this.indexPages("#SITE_PAGES");
this._siteNode.addEvent(Constants.ComponentEvents.WIXIFIED,function(){b.addComponentWithInterest(this.getLogic())
});
if(!W.Editor){this._wixifySiteLazily(c,d)
}else{this._wixifyEntireSite(c)
}var a=this._siteNode.getProperty("comp");
if(a&&a.contains("components.SiteStructure")){this._siteNode.wixify()
}},_getUrlSearchParameters:function(){return window.location.search
},_wixifyEntireSite:function(a){var c=a.getElements("[comp]");
if(a.get("comp")){c.push(a)
}var b=new Async.Bulk(c,null,{timeout:20000,completeEvent:Constants.ComponentEvents.READY,completeCallback:function(){c.removeClass("initHidden");
this.updatePagesData();
for(var d in this._pages){this._pages[d].getLogic().setAsWixified()
}this._onSiteReady()
}.bind(this)});
c.wixify()
},_getAllComponentsButPageContents:function(b){var a=b.getElements("#SITE_PAGES> div[comp]").combine([b.getElement("#SITE_HEADER")]).combine(b.getElements("#SITE_HEADER div[comp]")).combine(b.getElements("#SITE_FOOTER")).combine(b.getElements("#SITE_FOOTER div[comp]"));
if(b.get("comp")){a.push(b)
}return a
},_wixifySiteLazily:function(a,d){var c=this._getAllComponentsButPageContents(a);
var b=new Async.Bulk(c,null,{completeEvent:Constants.ComponentEvents.READY,completeCallback:function(){c.removeClass("initHidden");
this.updatePagesData();
var f=[];
if(d===false){for(var e in this._pages){f.push(this._pages[e].getLogic())
}}else{var j=this._getPageDataFromHash(W.Utils.hash.getHash());
f.push(this._pages[j.get("id")].getLogic())
}var h=new Async.Bulk(f,null,{completeEvent:"contentWixified",completeCallback:function(){this._onSiteReady()
}.bind(this)});
for(var g=0;
g<f.length;
++g){f[g].wixifyContent()
}}.bind(this)});
c.wixify()
},_onSiteReady:function(){this.setPreviewMode(this._isPreview);
this._isReady=true;
this._isSiteReady=true;
window.scrollTo(0,1);
W.Utils.hash.addEvent("change",this._onHashChange);
W.Utils.hash.fireHashChangeEvent();
this._loadNextPage();
this._reportBIEvents();
if(window.viewMode=="editor"&&window.location.hash=="#save=1"){window.location.hash="";
W.Commands.executeCommand("WEditorCommands.SaveSuccessDialog")
}},_reportBIEvents:function(){switch(window.viewMode){case"preview":LOG.reportEvent(wixEvents.PREVIEW_READY);
break;
case"site":LOG.reportEvent(wixEvents.SITE_READY);
break
}},getViewMode:function(){return window.viewMode
},_loadNextPage:function(){},setViewerConfig:function(a){},createElement:function(a,b){return new Element(a,b)
},clone:function(){return new this.$class()
},isReady:function(){return this._isReady
},isSiteReady:function(){return this._isSiteReady
},_onHashChange:function(c){c=c||{};
if(this.isSiteReady()){var a=c.newHash;
var b=c.isIdChanged;
if(!W.Data.isDataAvailable("#"+a)){this._changePageFromHash(a)
}else{W.Data.getDataByQuery("#"+a,function(d){this._setDataObjectFromHash(d,a,b)
}.bind(this));
if(c.isForSureAfterChange){LOG.reportPageEvent(window.location.href)
}}}},_setDataObjectFromHash:function(c,b,a){if(a&&c.getType&&c.getType()==="Page"&&b){this._changePageFromHash(b)
}},_changePageFromHash:function(a){var c=this._getPageDataFromHash(a);
if(c===null){return
}var b=c.get("id");
if(b==this._currentPageId){return
}if(b){this._pageTransition(b)
}},_getPageDataFromHash:function(d){d=d||W.Utils.hash.getHash();
var e=this._mainPageData;
for(var b in this._pagesData){var c=this._pagesData[b];
var a=c.getMeta("isHidden")&&!this._isPreview;
if(c.get("id")==d&&!a){e=c;
break
}}return e
},_pageTransition:function(c){var e=this.getCurrentPageNode();
var d=this._siteNode.getElement("#"+c);
if(d){W.Utils.clearCallLater(this._setVisiblePageCallId);
this._currentPageId=c;
if(this._isFullScreen){this.exitFullScreenMode()
}if(e){e.getLogic().collapse()
}else{for(var b in this._pages){var a=this._pages[b];
if(a!=d){a.getLogic().collapse()
}}}d.getLogic().uncollapse();
this._setVisiblePageCallId=W.Utils.callLater(function(){d.getLogic().wixifyContent(function(){if(W.Editor){W.Editor.setKeysEnabled(true)
}this.fireEvent("pageTransitionEnded");
W.Utils.callLater(function(){})
}.bind(this))
}.bind(this));
if(W.Editor){W.Editor.setKeysEnabled(false)
}this.fireEvent("pageTransitionStarted")
}},getScrollTop:function(){return document.body.scrollTop
},getPagesData:function(){return this._pagesData
},_scrollToTopOnPageChange:function(){if(this._isPageScrollToTopEnabled){if(this._isPreview){this._siteNode.setStyle("top","0px");
$(document.body).setStyle("background-position","0px 0px")
}else{$(document.body).scrollTo(0,0)
}}},goToPage:function(a){if(this._scrollLock){return
}if(this._stopAnimation!==null){this._stopAnimation.stop()
}this._scrollToTopOnPageChange();
var b=this._pagesData[a];
if(!b){return
}if(this._currentPageId==a){return
}this._pageTransition(a)
},_onTransitionFinished:function(){this._setUrlHashToPage(this._currentPageId)
},_setUrlHashToPage:function(a){var b=this._pagesData[a];
if(b){W.Utils.hash.setHash(a,b.get("pageUriSEO"))
}},goToHomePage:function(){this.goToPage(this._mainPageData.get("id"))
},isHomePage:function(a){a=a||this._currentPageId;
if(this._isSiteReady){return(a==this._mainPageData.get("id"))
}return true
},getCurrentPageId:function(){return this._currentPageId
},getCurrentPageNode:function(){var a=null;
if(this._currentPageId&&this._siteNode){a=this._siteNode.getElement("#"+this._currentPageId)
}return a
},indexPages:function(j){var a=this._siteNode.getElement(j);
if(!a){return W.Utils.callLater(this.indexPages,[j],this,10)
}var c={};
var b=[];
a.getElements("[comp=mobile.core.components.Page]").each(function(k){var i=k.get("id")||W.Utils.getUniqueId("page");
c[i]=k;
k.addClass("sitePage");
var l=k.get("dataQuery");
if(l!=this._siteStructureData.get("mainPage")){b.push(l)
}}.bind(this));
var d=this._siteStructureData.getData().pages;
if(!d){d=[]
}for(var e=0;
e<d.length;
++e){var g=d[e];
var f=b.indexOf(g);
if(f!=-1){b.splice(f,1);
b.splice(e,0,g)
}}var h=W.Data.isDataChange();
this._siteStructureData.set("pages",b);
h&&W.Data.flagDataChange();
this._pages=c
},loadExternalScript:function(d,b,a){var c=this;
if(d in this._loadedExtJS){b();
return"ALREADY_LOADED"
}else{if(d in this._pendingExtJS){this._pendingExtJS[d].push(b);
return"PENDING_LOAD"
}else{this._pendingExtJS[d]=[b];
this._loadScript(d,a);
return"FIRST_LOAD"
}}},_loadScript:function(d,a){var b=document.createElement("script");
b.type="text/javascript";
b.async=false;
if(b.readyState){b.onreadystatechange=function(){if(b.readyState==="loaded"||b.readyState==="complete"){b.onreadystatechange=null;
this._onScriptLoaded(d)
}}.bind(this)
}else{b.onload=function(){this._onScriptLoaded(d)
}.bind(this)
}b.src=d;
var c=document.getElementsByTagName("script")[0];
c.parentNode.insertBefore(b,c)
},_onScriptLoaded:function(b){this._loadedExtJS[b]=true;
var c=this._pendingExtJS[b];
for(var a=0;
a<c.length;
a++){c[a]()
}delete this._pendingExtJS[b]
},_getSiteViewMode:function(){var a=window.viewMode;
if(a=="preview"&&window.top===window){return"site"
}return a
},isPublicMode:function(){return(this._getSiteViewMode()=="site")
},updatePagesData:function(){this._pagesData={};
for(var b in this._pages){var a=this._pages[b].getLogic().getDataItem();
this._pagesData[a.get("id")]=a;
if(this._siteStructureData.get("mainPage")=="#"+a.get("id")){this._mainPageData=a
}}},getPages:function(){return this._pages
},getSiteNode:function(){return this._siteNode
},_onEditModeChanged:function(a){this._editorMode=a
},getEditorMode:function(){return this._editorMode
}}});
Constants.ViewEvents={ORIENTATION_CHANGE:"orientationchange"};
W.Classes.newClass({name:"mobile.core.managers.ViewManager",Class:{Extends:"mobile.core.managers.ViewManagerBase",_calculateNewTop:function(d,f,a,e){var b=Math.max((f-d)/2,0);
var c=Math.min(b-a,0);
return Math.max(c,f-e)
},scrollToElement:function(d){var b=d.getPosition(this._siteNode).y;
var e=d.getHeight();
var f=this._siteNode.getHeight();
var g=window.getHeight();
var c=this._calculateNewTop(e,g,b,f);
var a=new Fx.Tween(this._siteNode,{duration:250,property:"top"});
a.start(this._siteNode.getStyle("top"),c)
},scrollToTop:function(){this._siteNode.setStyle("top",0)
},setPreviewMode:function(a){this.parent(a);
if(a){this._addPreviewDragToScroll()
}},isIE:function(){return navigator.userAgent.toLowerCase().indexOf("msie")!=-1
},_addPreviewDragToScroll:function(){$(document.body).addEvent(Constants.CoreEvents.MOUSE_WHEEL,function(h){h.preventDefault()
});
$$("html").setStyle("overflow","hidden");
var d=this._siteNode;
d.setStyles({position:"absolute",overflow:"visible"});
var a,c;
var f=0;
var b=0;
var g=function(l){var h=document.getSize();
var j=l.page.x;
var i=l.page.y;
if(j<5||j>h.x-5||i<5||i>h.y-5){document.removeEvent(Constants.CoreEvents.MOUSE_MOVE,g);
e()
}else{var k=d.scrollHeight-document.getSize().y;
b=a-i;
var m=f-b;
d.setStyle("top",m+"px");
$(document.body).setStyle("background-position","0px "+m+"px")
}l.preventDefault();
return false
};
var e=function(){d.setStyle("overflow","scroll");
var n=d.scrollHeight-document.getSize().y;
d.setStyle("overflow","visible");
var j=(new Date().getTime())-c;
var p=b/j;
var i=f-b;
var o=i-(p*200);
var m="sine:out";
var k=500;
if(o>0){o=0;
m="bounce:out";
k=700
}else{if((0-o)>n){o=0-n;
m="bounce:out"
}}var h=new Fx.Tween(d,{duration:500,transition:m,property:"top",onComplete:function(){this.setStopAnimation(null)
}.bind(this)});
this.setStopAnimation(h);
var l=h.set;
h.set=function(q){$(document.body).setStyle("background-position","0px "+q[0].value+"px");
l.call(h,q)
};
h.start(i,o);
f=0;
b=0
}.bind(this);
document.addEvents({mousedown:function(h){document.addEvent(Constants.CoreEvents.MOUSE_MOVE,g);
f=d.getPosition().y;
a=h.page.y;
c=new Date().getTime();
h.preventDefault();
return false
}.bind(this),mouseup:function(h){if(Math.abs(a-h.page.y)>2){this._scrollLock=true;
W.Utils.callLater(function(){this._scrollLock=false
}.bind(this));
e()
}document.removeEvent(Constants.CoreEvents.MOUSE_MOVE,g)
}.bind(this)})
},getScrollY:function(){if(typeof(window.pageYOffset)=="number"){return window.pageYOffset
}else{if(document.body.scrollTop){return document.body.scrollTop
}else{if(document.documentElement&&document.documentElement.scrollTop){return document.documentElement.scrollTop
}else{return 0
}}}},enterFullScreenMode:function(c){var b=$("brand-ad");
if(b){b.collapse()
}if(typeof c=="function"){this._fullScreenCallbacks.push(c)
}this._siteNode.collapse();
var a=$(document.body);
this._originalBodyOverflow=a.getStyle("overflow");
a.setStyle("overflow","hidden");
this._fullScreenContainer=new Element("div",{"class":"full-screen-container"});
this._fullScreenContainer.insertInto(a);
this._isFullScreen=true;
return this._fullScreenContainer
},exitFullScreenMode:function(){if(this._isFullScreen){var a=$("brand-ad");
if(a){a.uncollapse()
}$(document.body).setStyle("overflow",this._originalBodyOverflow);
$(this._siteNode).setStyle("top",0);
this._siteNode.uncollapse();
this._fullScreenContainer.empty();
this._fullScreenContainer.destroy();
while(this._fullScreenCallbacks.length>0){this._fullScreenCallbacks.pop()()
}this._isFullScreen=false
}},addOrientationEvent:function(a){if(!this.listenToOreintation){this.listenToOreintation=true;
this._oldScreenSize={};
window.addEvent(Constants.ViewEvents.ORIENTATION_CHANGE,this._startResChangeCheck.bind(this))
}this.addEvent(Constants.ViewEvents.ORIENTATION_CHANGE,a)
},removeOrientationEvent:function(a){this.removeEvent(Constants.ViewEvents.ORIENTATION_CHANGE,a)
},_startResChangeCheck:function(){this._checkResChangeInterval=setInterval(this._checkResChange.bind(this),100)
},_stopResChangeCheck:function(){if(this._checkResChangeInterval){clearInterval(this._checkResChangeInterval)
}},_checkResChange:function(){this._screenSize=this._getDocument().getSize();
if(this._isWindowResized()){this._fireOrientationChange()
}this._oldScreenSize=this._screenSize
},_isWindowResized:function(){return this._screenSize.x!=this._oldScreenSize.x||this._screenSize.y!=this._oldScreenSize.y
},_fireOrientationChange:function(){if(window.scrollTo){window.scrollTo(0,0)
}this._stopResChangeCheck();
this.fireEvent(Constants.ViewEvents.ORIENTATION_CHANGE,this._screenSize)
},_getDocument:function(){return document
}}});
W.Classes.newClass({name:"mobile.core.managers.ConfigurationManager",Class:{Extends:"mobile.core.managers.BaseManager",_getEditorModel:function(){return window.editorModel
},getEditorModelProperty:function(a){var b=this._getEditorModel();
return b&&b[a]
},getRendererModelProperty:function(a){return window.rendererModel&&window.rendererModel[a]
},getServiceTopologyProperty:function(a){return window.serviceTopology&&window.serviceTopology[a]
},getCoreThemesUrl:function(a){var b;
if(a==="html-client-core"){b="mobile"
}return window.serviceTopology&&window.serviceTopology.scriptsLocationMap&&window.serviceTopology.scriptsLocationMap[a]+"/images/"+(b||a)+"/core/themes"
},getHelpServerUrl:function(){var a=this.getServiceTopologyProperty("helpServer")||"http://help.wixpress.com/support/main/html5";
if(window.wixEditorLangauge&&window.wixEditorLangauge!=="en"){a=a.replace("www",window.wixEditorLangauge)
}return a
},setServiceTopologyProperty:function(b,a){window.serviceTopology[b]=a
},getUserPublicUrl:function(){return this.getEditorModelProperty("publicUrl")
},getUserDomainListUrl:function(){var a=this.getServiceTopologyProperty("premiumServerUrl");
return a+"/wix/api/domainConsole"
},getSiteId:function(){return window.siteId
},getMetaSiteId:function(){return this.getEditorModelProperty("metaSiteId")||this.getRendererModelProperty("metaSiteId")
},isMetaSiteTemplate:function(){return this.getEditorModelProperty("metaSiteTemplate")||false
},siteNeverSavedBefore:function(){return this.getEditorModelProperty("firstSave")
},setMetaSiteId:function(a){window.editorModel.metaSiteId=a
},userHasFacebookSite:function(){return this._userHasAppType(Constants.WEditManager.SITE_TYPE_FACEBOOK)
},userHasMobileSite:function(){return this._userHasAppType(Constants.WEditManager.SITE_TYPE_MOBILE)
},userHasWebSite:function(){return this._userHasAppType(Constants.WEditManager.SITE_TYPE_WEB)
},_userHasAppType:function(c){var b=this.getEditorModelProperty("serviceMappings");
if(!b){return false
}for(var a in b){if(b[a].applicationType==c){return true
}}return false
},isPremiumUser:function(){var a=this.getEditorModelProperty("metaSiteData");
if(!a||!a.premiumFeatures){return false
}return(a.premiumFeatures.length>0)
},getCreateMobileSiteLink:function(){var d=this.getServiceTopologyProperty("createMobileUrl");
var a=this.getEditorModelProperty("metaSiteData").siteName;
var c=this.getMetaSiteId();
var b=d+a+"?flashSiteId="+c;
return b
},getCreateFacebookSiteLink:function(){return this._getCreateWysiwygSiteLink(Constants.WEditManager.SITE_TYPE_FACEBOOK)
},getCreateWebsiteLink:function(){return this._getCreateWysiwygSiteLink(Constants.WEditManager.SITE_TYPE_WEB)
},_getCreateWysiwygSiteLink:function(b){var a=(b==Constants.WEditManager.SITE_TYPE_WEB)?this.getServiceTopologyProperty("createWebsiteUrl"):this.getServiceTopologyProperty("createFacebookUrl");
var d=this.getMetaSiteId();
var c=a+"?metasite="+d;
return c
},isInDebugMode:function(){return window.debugMode!=="nodebug"
},isFacebookSite:function(){var a=this.getApplicationType();
return a&&a.toLowerCase()==="htmlfacebook"
},getDebugMode:function(){return window.debugMode
},getApplicationType:function(){return window.rendererModel&&window.rendererModel.applicationType||window.siteHeader&&window.siteHeader.applicationType
},getDocumentType:function(){return window.siteHeader&&window.siteHeader.documentType
},getMediaStaticUrl:function(a){var b=this.getServiceTopologyProperty("staticMediaUrl")+"/";
if(/[^.]+$/.exec(a)[0]=="ico"){b=b.replace("media","ficons")
}return b
},getResourcesStaticUrl:function(){var a=this.getServiceTopologyProperty("resourcesRoot");
return a||this.getServiceTopologyProperty("scriptsRoot")+"/resources/wysiwyg/bundles/"
},getLanguage:function(){return"en-us"
},isReady:function(){return true
},clone:function(){return this.parent()
},createPackage:function(){}}});
W.Classes.newClass({name:"mobile.core.managers.LinkTypesManager",Class:{Extends:"mobile.core.managers.BaseManager",langFlag:false,_allTypes:{FACEBOOK:{target:"http://www.facebook.com/wix",text:"Facebook",linkType:["EXTERNAL_LINKS","NETWORKS"],protocol:"http://",tip:"navigate to"},LINKEDIN:{target:"http://www.linkedin.com/wix",text:"LinkedIn",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},TWITTER:{target:"http://www.twitter.com/wix",text:"Twitter",linkType:["EXTERNAL_LINKS","NETWORKS"],protocol:"http://",tip:"navigate to"},CALL:{target:"212.000.0000",text:"Call Me",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"tel:",tip:"call"},SMS:{target:"212.000.0000",text:"Text Me",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"sms:",tip:"text"},EMAIL:{target:"feedback@wix.com",text:"Email",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"mailto:",tip:"send an email to"},MAP:{target:"wix offices new york",text:"Address",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"http://maps.google.com/maps?f=q&source=s_q&hl=en&q=",tip:"open map for address "},BLOGGER:{target:"http://www.blogger.com/wix",text:"Blogger",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},YOUTUBE:{target:"http://www.youtube.com/wix",text:"Youtube",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},FREE_LINK:{target:"http://www.wix.com",text:"Any link",linkType:["CONTACT","EXTERNAL_LINKS","NETWORKS"],protocol:"http://",tip:"navigate to"},FLICKR:{target:"http://www.flickr.com/wix",text:"Flickr",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},SKYPE:{target:"http://www.skype.com/wix",text:"Skype",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},MYSPACE:{target:"http://www.myspace.com/wix",text:"MySpace",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},VIMEO:{target:"http://www.vimeo.com/wix",text:"Vimeo",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"},DELICIOUS:{target:"http://www.delicious.com/wix",text:"Delicious",linkType:["NETWORKS"],protocol:"http://",tip:"navigate to"}},getLinkTypesByMeta:function(e){var d;
if(this.langFlag===false){for(d in this._allTypes){this._allTypes[d].text=W.Resources.get("EDITOR_LANGUAGE",d+"_TITLE")
}this.langFlag=true
}var b=[];
var a={};
var c=true;
for(d in this._allTypes){b=this._allTypes[d]["linkType"];
if(b.indexOf(e)>=0){a[d]=this._allTypes[d];
c=false
}}if(c==true){LOG.reportError(wixErrors.LT_LINK_UNKNOWN,"LinkTypesManager","getLinkTypesByMeta",e+"")
}return a
},getNewLink:function(a){if(!this._allTypes[a]){LOG.reportError(wixErrors.LT_INVALID_LINK_TYPE,"LinkTypesManager","getNewLink",a+"")
}var b=Object.clone(this._allTypes[a]);
b.metaData={isPreset:true};
b.linkType=a;
b.type="Link";
delete b.tip;
delete b.protocol;
return b
},getLinkIcon:function(a){return a.toLowerCase()+".png"
},gotoLink:function(b){if(W.Viewer.isScrollLock()){return
}var a=b.get("linkType");
var d=b.get("target");
if(!W.Viewer.getPreviewMode()){var g=!this._skipForceFlash(d.toLowerCase())&&this._matchCurrentUrl(d.toLowerCase());
if(g){this.setForceFlashCookie()
}var c=(d.toLowerCase().indexOf("https://")===0);
if(c){d=d.replace("https://","")
}else{if(d.toLowerCase().indexOf("http://")===0){d=d.replace("http://","")
}}var f=this._allTypes[a]["protocol"];
if(f=="http://"&&c){f="https://"
}var e=f+d;
this._changeLocation(e)
}else{if(W.Viewer.getLinkTipFunc()){W.Viewer.getLinkTipFunc()(b,this)
}}},_changeLocation:function(a){document.location.href=a
},showLinkTip:function(b){var a=b.get("linkType");
var c=this._allTypes[a]["tip"]+" "+b.get("target");
W.Preview.showPreviewTip("Link will",c)
},isReady:function(){return true
},clone:function(){return this.parent()
},stripUrl:function(b){var a=b.replace(/(\w+:\/\/)*([\w\-_]+\.)*([\w\-_]+\.[\w\-_]+).*/,"$3");
var d={com:true,org:true,net:true,edu:true,gov:true,mil:true,info:true,co:true,ac:true};
var c=a.split(".");
var e=c[0];
if(!d[e]){return a
}return b.replace(/(\w+:\/\/)*([\w\-_]+\.)*([\w\-_]+\.[\w\-_]+\.[\w\-_]+).*/,"$3")
},setForceFlashCookie:function(){var a=new Date();
a.setTime(a.getTime());
var c=20;
var b=new Date(a.getTime()+(c*1000*60));
document.cookie="forceFlashSite=true;path="+window.location.pathname+";domain=."+this.stripUrl(window.location.hostname)+";expires="+b.toGMTString()
},_skipForceFlash:function(a){return window.location.href.toLowerCase()==a
},_matchCurrentUrl:function(a){return this.stripUrl(window.location.href.toLowerCase())==this.stripUrl(a)
}}});
W.Classes.newClass({name:"mobile.core.managers.HtmlScriptsLoader",Class:{Extends:"mobile.core.managers.BaseManager",_nonIndexedScriptFiles:[],_scriptFiles:[],_isReady:false,_loadProgress:0,Binds:["_getIndexJson","_onIndexSuccess","_onIndexError","_onIndexFailure"],initialize:function(){this._scriptLoader=new W.ClassManager.ScriptLoader();
this._scriptLoader.setBodyAsScriptsAnchor();
if(!this._isInTestMode()){this._start()
}else{this._isReady=true
}},isReady:function(){if(!this._isInDebugMode()&&!this._isInTestMode()){return this._loadProgress==this._scriptFiles.length
}else{return this._isReady
}},clone:function(){return this
},notifyScriptLoad:function(){this._loadProgress++
},_isInDebugMode:function(){return(window.debugMode!=="nodebug")
},_start:function(){W.Managers.addEvent(W.Managers.DEPLOYMENT_COMPLETED_EVENT,function(){if(!this.isReady()){if(this._isInDebugMode()){this._getIndexJson()
}else{this._loadMinifiedScripts()
}}}.bind(this))
},_isInDebugMode:function(){return(W.Config.isInDebugMode())
},_isInTestMode:function(){return(window.debugMode=="unit_test")
},_getIndexJson:function(){var a=this._getScriptRoot()+"/index.json";
var b=null;
if(XMLHttpRequest){b=new XMLHttpRequest();
b.open("GET",a,true)
}else{if(XDomainRequest){b=new XDomainRequest();
b.open("get",a);
b.setRequestHeader=function(c,d){}
}}b.onabort=function(c){this._onIndexFailure("request aborted")
}.bind(this);
b.ontimeout=function(c){this._onIndexFailure("request timeout")
}.bind(this);
b.onerror=function(c){this._onIndexFailure("request error")
}.bind(this);
b.onload=function(){var c={};
try{c=JSON.parse(b.responseText)
}catch(d){this._onIndexError(b)
}this._onIndexSuccess(c)
}.bind(this);
b.send()
},_onIndexSuccess:function(a){this._loadIndexScriptSets(a.fileSets)
},_onIndexError:function(a){LOG.reportError(wixErrors.HTML_SCRIPTS_LOADER_INVALID_INDEX,this.className,"_getIndexJson",a)
},_onIndexFailure:function(a){LOG.reportError(wixErrors.HTML_SCRIPTS_LOADER_UNABLE_TO_LOAD_INDEX,this.className,"_getIndexJson",a.statusText);
this._loadMinifiedScripts()
},_loadMinifiedScripts:function(){this._scriptLoader.loadMissingScripts(this._getFullUrls(this._scriptFiles))
},_loadIndexScriptSets:function(a){for(var b=0;
b<this._scriptFiles.length;
b++){var d=this._scriptFiles[b];
var c=a.filter(function(e){return e.minifiedFile==d
})[0];
if(c){this._loadScriptSet(c.minifiedFile,c.sourceFiles)
}else{this._loadScriptSet(d)
}}this._isReady=true
},_getScriptRoot:function(a){return serviceTopology.scriptsRoot
},_getFullUrls:function(c){var a=[];
for(var b=0;
b<c.length;
b++){a[b]=this._getScriptRoot(c[b])+"/"+c[b]
}return a
},_loadScriptSet:function(b,a){a=this._nonIndexedScriptFiles.contains(b)?[b]:(a||[b]);
this._scriptLoader.loadMissingScripts(this._getFullUrls(a))
}}});