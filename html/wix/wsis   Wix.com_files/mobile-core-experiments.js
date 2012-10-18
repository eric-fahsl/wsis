W.Experiments.registerExperimentComponent("MasterPage","New",{name:"experiments.mobile.core.components.PageMasterPageNew",skinParts:{},Class:{Extends:"mobile.core.components.Page",render:function(){var a=this.injects().Viewer._siteStructureData.get("renderModifiers");
var c=true;
if(a&&a.pageAutoShrink&&a.pageAutoShrink==false){c=false
}if(c&&W.Layout&&W.Layout.getComponentMinResizeHeight){var b=W.Layout.getComponentMinResizeHeight(this);
this.setHeight(b)
}}}});
W.Experiments.registerNewExperimentClass("Photo","New",{name:"mobile.core.components.image.ImageDimensionsNew",imports:["mobile.core.components.image.ImageSettings"],Class:{initialize:function(){this.ImageSettings=this.imports.ImageSettings
},getDimensionsForExactSize:function(a,b){return this._getImageDimensions(a,b,true)
},getDimensionsForPyramid:function(a,b){return this._getImageDimensions(a,b,false)
},_getImageDimensions:function(b,g,a){var e=g.x/g.y;
var f=this._getContainerSize(b,e);
var c=this._getWholeImageSize(b,e,f,a);
var d=this._getImagePosition(c,f,b);
return{containerSize:f,imageSize:c,imagePosition:d}
},_getContainerSize:function(b,d){var c=b.getCropMode();
var a=Object.clone(b.getSize());
if(c===this.ImageSettings.CropModes.FIT_WIDTH){a.y=this._getHeightByWidth(a.x,d)
}else{if(c===this.ImageSettings.CropModes.FIT_HEIGHT){a.x=this._getWidthByHeight(a.y,d)
}}return a
},_getWholeImageSize:function(b,f,g,a){var c=g.x/g.y;
var e=Object.clone(g);
var d=b.getCropMode();
if(d===this.ImageSettings.CropModes.CONTAINS){if(c>f){e.x=this._getWidthByHeight(g.y,f)
}else{e.y=this._getHeightByWidth(g.x,f)
}}else{if(d===this.ImageSettings.CropModes.STRETCH||(!a&&d===this.ImageSettings.CropModes.COVER)){if(c>f){e.y=this._getHeightByWidth(g.x,f)
}else{e.x=this._getWidthByHeight(g.y,f)
}}}return e
},_getImagePosition:function(c,d,b){if(b.getCropMode()==this.ImageSettings.CropModes.STRETCH){return{x:0,y:0}
}var a={};
a.y=Math.ceil((d.y-c.y)/2);
a.x=Math.ceil((d.x-c.x)/2);
return a
},_getHeightByWidth:function(a,b){return Math.ceil(a/b)
},_getWidthByHeight:function(a,b){return Math.ceil(a*b)
}}});
W.Experiments.registerNewExperimentComponent("Photo","New",{name:"mobile.core.components.ImageNew",imports:["mobile.core.components.image.ImageDimensionsNew","mobile.core.components.image.ImageUrlNew","mobile.core.components.image.ImageSettings"],skinParts:{image:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,a,b){this.parent(c,a,b);
this._useWebUrl=b.useWebUrl||false;
this._settings=b.settings;
this._requestExactSize=typeof(b.requestExactSize)=="boolean"?b.requestExactSize:this.injects().Viewer.getPreviewMode()!==true;
this._imageDimensions=new this.imports.ImageDimensionsNew();
this._imageSrcBuilder=new this.imports.ImageUrlNew();
this._imageUrl;
this._isSameImage=false;
this.injects().Viewer&&this.injects().Viewer.addOrientationEvent(this._onOrientationChange)
},_onOrientationChange:function(){setTimeout(this._renderIfReady.bind(this),50)
},setSettings:function(a){if(!a){return
}this._settings=a;
this._renderIfReady()
},_onDataChange:function(a,c,b){this._isSameImage=this._imageUrl===a.get("uri");
this._imageUrl=a.get("uri");
this.parent(a,c,b)
},_prepareForRender:function(){if(!this._settings||!this._imageUrl){return true
}this._refreshImage();
return true
},_refreshImage:function(){this._skinParts.image.set("alt",this._data.get("alt"));
this._handleImageLoadingError();
var c=this._getImageDimensions();
this._setContainerSize(c.containerSize);
var b=this._imageUrl;
if(!this._useWebUrl&&this._imageUrl.indexOf("http")!==0){b=this._getImageSrc(c.imageSize,!this._isSameImage)
}this._isSameImage=true;
this._setImageSrc(b);
var a=this._settings.getCropMode()==this._settings.CropModes.STRETCH?c.containerSize:c.imageSize;
this._setImagePositionAndSize(c.imagePosition,a)
},_getImageDimensions:function(){var a=this._getOriginalSizeFromData();
var b;
if(this._requestExactSize){b=this._imageDimensions.getDimensionsForExactSize(this._settings,a)
}else{b=this._imageDimensions.getDimensionsForPyramid(this._settings,a)
}return b
},_getImageSrc:function(d,c){var b;
if(this._requestExactSize){b=this._imageSrcBuilder.getImageUrlExactSize(d,this._imageUrl,this._getOriginalSizeFromData())
}else{var a=c?this._imageSrcBuilder.getImageUrlFromPyramidFirstTime(d,this._imageUrl):this._imageSrcBuilder.getImageUrlFromPyramidForSameImage(d,this._imageUrl,this._pyramidRequestSize);
b=a.url;
this._pyramidRequestSize=a.pyramidRequestSize
}return b
},_getOriginalSizeFromData:function(){var a={};
a.x=parseInt(this._data.get("width"),10);
a.y=parseInt(this._data.get("height"),10);
if(!a.x&&!a.y){a.x=a.y=128
}return a
},_setContainerSize:function(a){if(!this.injects().Utils.isEquivalent(this._containerSize,a)){this.getViewNode().setStyles({width:a.x+"px",height:a.y+"px"});
this._containerSize=a
}},getSize:function(){return this._containerSize
},_setImageSrc:function(a){if(this._imgSrc!=a){this._skinParts.image.set("src",a);
this._imgSrc=a
}},_setImagePositionAndSize:function(b,a){this._skinParts.image.setStyles({"margin-top":b.y+"px","margin-left":b.x+"px",width:a.x+"px",height:a.y+"px"})
},_handleImageLoadingError:function(){this._skinParts.image.removeEvents("error");
this._skinParts.image.addEvent("error",function(){LOG.reportError(wixErrors.IMAGE_LOAD_ERROR,"ImageNew","refresh",this._imageUrl);
this._renderIfReady()
}.bind(this))
},getAcceptableDataTypes:function(){return["Image",""]
}}});
W.Experiments.registerNewExperimentClass("Photo","New",{name:"mobile.core.components.image.ImageSettings",Class:{Static:{CropModes:{COVER:"fill",CONTAINS:"full",FIT_WIDTH:"fitWidth",FIT_HEIGHT:"fitHeight",STRETCH:"stretch"}},initialize:function(a,c,b){return this.setSettings(a,c,b)
},setSettings:function(a,c,b){if(!this._validateSettings(a,c,b)){return null
}this._cropMode=a;
this._containerWidth=c;
this._containerHeight=b;
return this
},getCropMode:function(){return this._cropMode
},getSize:function(){return{x:this._containerWidth,y:this._containerHeight}
},setCropMode:function(a){if(this._validateSettings(a,this._containerWidth,this._containerHeight)){this._cropMode=a
}else{}},setSize:function(b,a){if(this._validateSettings(this._cropMode,b,a)){this._containerWidth=b;
this._containerHeight=a
}else{}},setContainerHeight:function(a){if(this._validateSettings(this._cropMode,this._containerWidth,a)){this._containerHeight=a
}else{}},setContainerWidth:function(a){if(this._validateSettings(this._cropMode,a,this._containerHeight)){this._containerWidth=a
}else{}},_validateSettings:function(a,c,b){switch(a){case this.CropModes.FIT_WIDTH:return this._isValidNumber(c);
case this.CropModes.FIT_HEIGHT:return this._isValidNumber(b);
case this.CropModes.COVER:case this.CropModes.CONTAINS:case this.CropModes.STRETCH:return this._isValidNumber(b)&&this._isValidNumber(c);
default:return false
}},_isValidNumber:function(a){return a&&typeof(a)=="number"&&!isNaN(a)&&a>0
},_getErrorDescString:function(c,b,a){return"_cropMode: "+c+" width: "+b+" height: "+a
}}});
W.Experiments.registerNewExperimentClass("Photo","New",{name:"mobile.core.components.image.ImageUrlNew",Class:{getImageUrlExactSize:function(a,e,g){var b=this.injects().Config.getMediaStaticUrl(e)+e;
var d=this._getFileExtension(b);
var f=[b];
f.push("srz");
var c=this._getRequestSizeSmallerThanOriginal(a,g);
f.push(parseInt(c.x,10));
f.push(parseInt(c.y,10));
f.push("75_22_0.50_1.20_0.00");
f.push(d);
f.push("srz");
return f.join("_")
},getImageUrlFromPyramidFirstTime:function(a,b){return this._getUrlForPyramid(a,b)
},getImageUrlFromPyramidForSameImage:function(a,c,b){return this._getUrlForPyramid(a,c,true,b)
},_getRequestSizeSmallerThanOriginal:function(a,d){var e=d.x/a.x;
var b=d.y/a.y;
if(e>=1&&b>=1){return a
}var c={};
if(e<b){c.x=d.x;
c.y=d.x*(a.y/a.x)
}else{c.y=d.y;
c.x=d.y*(a.x/a.y)
}return c
},_getUrlForPyramid:function(b,g,a,f){var e=this.injects().Config.getMediaStaticUrl(g)+g;
var d=(b.y>b.x)?b.y:b.x;
var c=this._getPyramidSize(d,a,f);
e=e+"_"+c;
return{url:e,pyramidRequestSize:c}
},_getPyramidSize:function(f,b,d){var c=[128,256,400,512,650,850,1024];
var a=c[c.length-1];
for(var e=0;
e<c.length;
++e){if(c[e]>=f){a=c[e];
break
}}if(b){a=Math.max(a,d)||a
}return a
},_getFileExtension:function(a){var b=/[.]([^.]+)$/.exec(a);
return(b&&/[.]([^.]+)$/.exec(a)[1])||""
}}});
W.Experiments.registerExperimentDataSchema("PageSecurity","New","Page",{title:"string",hideTitle:"boolean",icon:"string",windowTitle:"string",descriptionSEO:"string",metaKeywordsSEO:"string",pageTitleSEO:"string",pageUriSEO:"string",hidePage:"boolean",underConstruction:"boolean",tpaApplicationId:"number",pageSecurity:{type:"object","default":{requireLogin:false,passwordDigest:""}}});
W.Experiments.registerExperimentManager("NewComps","New",{name:"experiments.mobile.core.managers.ConfigurationManagerEcomNew",Class:{Extends:"mobile.core.managers.ConfigurationManager",getCurrentOrigin:function(){var a="http://"+window.location.host;
return a
},getMetaSiteData:function(){return this.getEditorModelProperty("metaSiteData")
},getPremiumFeatures:function(){var b=this.getRendererModelProperty("premiumFeatures");
if(!b){var a=this.getMetaSiteData();
b=a&&a.premiumFeatures
}return b
}}});
W.Experiments.registerExperimentManager("Staff","Wix",{name:"experiments.core.managers.CssManagerStaff",Class:{Extends:"mobile.core.managers.CssManager",_configureSystemFonts:function(){Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Italic"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Thin"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Medium"]);
this._systemFontsCssDefinition={};
this._systemFontsNames=[];
this._addFontsLoaderCssTag(window.serviceTopology.publicStaticsUrl+"/css/Helvetica/fontFace.css");
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
}}}}});
W.Experiments.registerExperimentManager("StyleRefactor","New",{name:"experiments.mobile.core.managers.ThemeManagerStyleRefactor",imports:["mobile.core.managers.style.SkinParamMapper"],Class:{Extends:"mobile.core.managers.ThemeManager",getStyle:function(b,d,a){if(this._styleCache[b]){W.Utils.callLater(d,[this._styleCache[b]])
}else{this._styleQueue.add(b,d);
if(this._styleQueue.getQueue(b).length>1){return
}var c=function(e){this._styleCache[b]=e;
this._styleQueue.getQueue(b).forEach(function(f){f(e)
});
this._styleQueue.removeKey(b)
}.bind(this);
if(this.isStyleAvailable(b)){this.getDataByQuery("#"+b,function(e){var f=e.get("style");
W.Skins.getSkin(e.get("skin"),function(h){var g=new this.SkinParamMapperClass(e,e.get("style"),h);
c(g)
}.bind(this))
}.bind(this))
}else{this.createStyle(b,"",a,c)
}}},createStyle:function(b,d,a,f){if(this._styleCache[b]){LOG.reportError(wixErrors.STYLE_ALREADY_EXISTS,"ThemeManager","createStyle",b)()
}var e=Object.clone(this.INIT_STYLE_RAW_DATA);
e.skin=a;
var c=this.addDataItem(b,e);
W.Skins.getSkin(c.get("skin"),function(i){var g=new this.SkinParamMapperClass(c,c.get("style"),i);
var h=g.getId();
this._styleCache[h]=g;
f(g)
}.bind(this))
},initialize:function(a){this.parent();
this.SkinParamMapperClass=this.imports.SkinParamMapper;
this._placeHoldersMap={};
this._isReady=false;
this._styleQueue=new W.Queue();
this._styleCache={};
this._isOperating=false;
if(a){this._onDataReady(a)
}}}});
W.Experiments.registerExperimentClass("Zoom","New",{name:"experiments.mobile.core.managers.data.DataManagerZoom",Class:{Extends:"mobile.core.managers.data.DataManager",getDataItem:function(a,b){if(typeof(a)=="string"){this.injects().Data.getDataByQuery(a,b)
}else{b(a)
}},getDataItemsList:function(b,a){if(b.length>0&&typeof(b[0])=="string"){}else{}},getDataItemsByType:function(b){var a=Object.values(this.dataMap);
return Object.filter(a,function(c){return c.getType()==b
})
}}});
W.Experiments.registerExperimentClass("Photo","New",{name:"experiments.mobile.core.managers.skin.SkinParserPhoto",Class:{Extends:"mobile.core.managers.skin.SkinParser",_processSkinParams:function(g,a){for(var d=0;
d<g.length;
++d){var f=g[d];
if(f.defaultParam){f.defaultParam=this._getParamById(g,f.defaultParam);
if(!f.defaultParam){LOG.reportError(wixErrors.SKIN_PARAM_REF_NOT_FOUND,a,"_processSkinParams/defaultParam",f.id)();
delete f.defaultParam;
f.defaultValue=""
}}if(f.sumParams){var c=[];
for(var b=0;
b<f.sumParams.length;
++b){var e=this._getParamById(g,f.sumParams[b]);
if(e){c.push(e)
}else{LOG.reportError(wixErrors.SKIN_PARAM_REF_NOT_FOUND,a,"_processSkinParams/sumParams",f.sumParams[b])()
}}f.sumParams=c
}}return g
},_getParamById:function(c,b){for(var a=0;
a<c.length;
++a){if(c[a].id===b){return c[a]
}}return null
}}});
W.Experiments.registerExperimentClass("Photo","New",{name:"experiments.mobile.core.managers.skin.SkinRendererPhoto",Class:{Extends:"mobile.core.managers.skin.SkinRenderer",_getParamValue:function(g,a){var b=null;
if(g.defaultParam){var e=g.defaultParam;
return this._applyParamMutators(this._getParamValue(e,a),g)
}if(a&&a.get(g.id)){var h=a.getPropertySource(g.id);
b=a.get(g.id);
if(h=="theme"){b=this.injects().Theme.getProperty(b)
}b=this._castToType(b,g);
b=this._addExtraToParamByType(g,b,a);
return this._applyParamMutators(b,g)
}if(g.defaultTheme){var f=g.defaultTheme;
var j=W.Theme.getProperty(f);
j=this._castToType(j,g);
return this._applyParamMutators(j,g)
}if(g.sumParams){var d=g.sumParams;
if(d&&typeOf(d)=="array"&&d.length>0){var k=this._getParamValue(d[0],a);
if(k.add&&typeof k.add==="function"){for(var c=1;
c<d.length;
c++){k.add(this._getParamValue(d[c],a))
}}return this._applyParamMutators(k,g)
}}if(g.defaultValue){b=this._castToType(g.defaultValue,g);
return this._applyParamMutators(b,g)
}return null
}}});
W.Experiments.registerExperimentClass("StyleRefactor","New",{name:"experiments.mobile.core.managers.skin.SkinRendererStyleRefactor",Class:{Extends:"mobile.core.managers.skin.SkinRenderer",_getParamValue:function(b,c){var f=null;
if(b.defaultParam){var g=b.defaultParam;
return this._applyParamMutators(this._getParamValue(g,c),b)
}if(c&&c.getProperty(b.id)){var a=c.getPropertySource(b.id);
f=c.getProperty(b.id);
if(a=="theme"){f=this.injects().Theme.getProperty(f)
}f=this._castToType(f,b);
f=this._addExtraToParamByType(b,f,c);
return this._applyParamMutators(f,b)
}if(b.defaultTheme){var e=b.defaultTheme;
var d=W.Theme.getProperty(e);
d=this._castToType(d,b);
return this._applyParamMutators(d,b)
}if(b.defaultValue){f=this._castToType(b.defaultValue,b);
return this._applyParamMutators(f,b)
}return null
}}});