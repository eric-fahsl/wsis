W.Components.newComponent({name:"mobile.core.components.BaseList",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onItemReady","_onDataItemsReady","_onChildAutoSized","_onChildAutoSizedAnimation"],initialize:function(c,a,b){this.parent(c,a,b);
this._itemClassName=(b&&b.itemClassName)||this._itemClassName;
this._itemsNodes=[]
},_renderItems:function(b,a){b=b||[];
if(b.length===0){this.getItemsContainer().empty();
this._onAllItemsReady()
}else{if(a){this._onDataItemsReady(null,b)
}else{this._data.getDataManager().getDataByQueryList(b,function(c){this._onDataItemsReady(b,c)
}.bind(this))
}}},_createHiddenItems:function(){return true
},_createItem:function(a,i,h,d){var e=this._skin.itemSkinClassName;
var g=this.getItemClassName();
if(!e){LOG.reportError(wixErrors.NO_SKIN,this.className,"_createItem","");
return new Element("b")
}if(!g){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"_createItem","");
return new Element("b")
}var f=W.Utils.getUniqueId(Constants.components.BASE_LIST_ITEM_PREFIX);
var b=new Element("div",{id:f});
var c=this;
this._getParamsToPassToItem(a,function(j){var k=a;
if(!this.injects().Data.isDataItem(a)){k=null
}this.injects().Components.createComponent(g,e,k,j,function(){i(b,true,a,d)
},undefined,undefined,b)
}.bind(this));
return b
},getSkinElementByIndex:function(a){var b=this.getItemsContainer().getChildren();
return b[a]
},_getParamsToPassToItem:function(a,b){b(undefined)
},_onItemReady:function(b,a,c){},_onAllItemsReady:function(){},getItemClassName:function(){return this._itemClassName
},getItemsContainer:function(){return this._view
},_onChildAutoSizedAnimation:function(){this.fireEvent("autoSizedAnimation")
},_onChildAutoSized:function(){this.fireEvent("autoSized")
},_onDataItemsReady:function(j,c){var h=this._itemsNodes||[];
this._itemsNodes=[];
this.getItemsContainer().empty();
var e=[];
var k=0;
var g=function(q,m,i,p){if(q){var o=q.getLogic();
this.fireEvent("itemReady",[o,o.getDataItem(),m]);
o.addEvent("autoSizedAnimation",this._onChildAutoSizedAnimation);
o.addEvent("autoSized",this._onChildAutoSized);
this._onItemReady(o,m,i)
}else{}if(++k>=p){var n=this._itemsNodes.clean();
if(n.length>1){n[0].addClass("firstItem");
n[n.length-1].addClass("lastItem")
}this._itemsNodes=n;
this._onAllItemsReady()
}}.bind(this);
var b=this.getItemsContainer();
var l=function(o,n,p){if((!this._createHiddenItems())&&o.getMeta("isHidden")){g(null,false,o,p);
return
}var q=undefined;
var i=this.injects().Data;
for(var m=0;
m<h.length;
++m){var r=h[m];
if(r&&r.getLogic){if(o===r.getLogic().getDataItem()){q=r;
h.splice(m,1);
break
}}}if(q){g(q,false,o,p)
}else{q=this._createItem(o,g,n,p)
}this._itemsNodes[n]=q;
q.removeClass("firstItem").removeClass("lastItem");
q.insertInto(b)
}.bind(this);
var f,d,a;
if(j){for(d=0,f=j.length;
d<f;
++d){a=c[j[d]];
l(a,d,f)
}}else{for(d=0,f=c.length;
d<f;
++d){a=c[d];
l(a,d,f)
}}if(e.length>1){e[0].addClass("firstItem");
e[e.length-1].addClass("lastItem")
}},_disposeItems:function(a){if(!a){return
}for(var b=a.length-1;
b>=0;
--b){var d=a[b];
var c=d.getLogic&&d.getLogic();
if(c){this._disposeItem(c);
c.dispose()
}}},_disposeItem:function(){}}});
Constants.repeaterStates={INITIATE:"init",LOADING:"loading",READY:"ready"};
W.Components.newComponent({name:"mobile.core.components.BaseRepeater",Class:{Extends:"mobile.core.components.base.BaseComponent",_elementPool:[],_usedElementPool:[],_stillLoading:false,_onDataChange:function(){this._allRepeatersReady=false;
this.parent()
},_setSkinPartElements:function(a){this._allRepeatersReady=false;
this.parent(a)
},_prepareForRender:function(){if(!this._data||this._data.length===0){return true
}if(this._allRepeatersReady===false){this._repeaterDefinitions=this._getRepeaterDefinitions();
this._startRepeaterCreations();
return false
}return this._allRepeatersReady
},_getRepeaterDefinitions:function(){var b=[];
for(var a in this._skinPartsSchema){if(this._skinPartsSchema[a].repeater&&this._skinPartsSchema[a].autoCreate!==false){var c=this.getSkinPartDefinition(a);
if(c.hookMethod&&typeOf(this[c.hookMethod])=="function"){c=this[c.hookMethod](c)
}b.push(c)
}}return b
},_startRepeaterCreations:function(){if(this._stillLoading){return
}this._usedElementPool=[];
this._beforeRepeatersCreation();
this._repeatersDataOld=this._repeatersData;
this._repeatersData={};
this._stillLoading=true;
for(var c=0;
c<this._repeaterDefinitions.length;
++c){var b=this._repeaterDefinitions[c];
var a={};
this._repeatersData[b.id]=a;
a.definition=b;
a.pendingItems=[];
a.readyItems=[];
a.readyItemsLogic=[];
a.state=Constants.repeaterStates.INITIATE;
this._loadRepeater(a)
}this._checkIfRepeatersReady()
},_checkIfRepeatersReady:function(){for(var a in this._repeatersData){var b=this._repeatersData[a];
if(b.state!=Constants.repeaterStates.READY){return false
}}return true
},_loadRepeater:function(e){if(e.definition.autoCreate!==false){var c=function(h,g){this._onLoadRepeaterReady(h,g,e)
}.bind(this);
var a=this._getRepeaterContainer(e);
if(a){a.empty()
}var f=this._getRepeaterDataList(e.definition);
var b;
f=this._processDataRefs(f);
e.itemsAmount=f.length;
if(f.length>0){for(var d=0;
d<f.length;
++d){b=Object.clone(e.definition);
b.dataQuery=this._getDataQueryField(e.definition,f[d]);
this._createRepeaterItem(b,e,a,c)
}}else{this._disposeOldRepeaters();
this._onRepeaterReady(e);
this._stillLoading=false;
this._allRepeatersReady=true;
this._renderIfReady()
}}else{e.state=Constants.repeaterStates.READY
}},_getDataQueryField:function(b,a){if(b.repeaterDataQueryField){return a.get(b.repeaterDataQueryField)
}return a
},_onLoadRepeaterReady:function(c,b,e){var d=!b;
var g=c.getViewNode();
var f=e.pendingItems.indexOf(g);
var a=c.getDataItem();
e.pendingItems.splice(f,1);
e.readyItems.push(g);
e.readyItemsLogic.push(c);
if(e.definition.hideHidden&&a.getMeta("isHidden")){g.collapse()
}this._onRepeaterItemReady(e,c,a,d);
if(e.readyItems.length==e.itemsAmount){e.state=Constants.repeaterStates.READY;
if(this._checkIfRepeatersReady()){this._disposeOldRepeaters();
this._onRepeaterReady(e);
this._stillLoading=false;
this._allRepeatersReady=true;
this._renderIfReady()
}}},_disposeOldRepeaters:function(){var a=[];
this._elementPool.forEach(function(b){if(this._usedElementPool.contains(b)){a.push(b)
}else{b.getLogic().dispose()
}}.bind(this));
this._elementPool=a
},_processDataRefs:function(a){return a
},_createRepeaterItem:function(l,i,a,f){var d=this._getOldRepeaterItemMatchingDefinition(i.definition.id,l);
if(!d){var c=new Element("div");
this._elementPool.push(c);
this._usedElementPool.push(c);
c.repeaterDefinition=l;
i.pendingItems.push(c);
if(a){c.insertInto(a)
}this._createComponentbyDefinition(l,c,f)
}else{if(a&&l.moveOldItemsToContainer!==false){d.insertInto(a)
}this._usedElementPool.push(d);
var j=d.getLogic();
var k=j.getSkin();
var g=false;
var h,b;
if(l.styleGroup&&this._style){h=(l.styleGroup=="inherit")?this._style:this._style.getStyleByGroupName(l.styleGroup);
b=k.getStyle();
g=(h!==b)
}if(g){var e=function(){j.removeEvent(Constants.ComponentEvents.READY_FOR_RENDER,e);
f(j,true)
};
j.addEvent(Constants.ComponentEvents.READY_FOR_RENDER,e);
k.applyStyle(h)
}else{f(j,true)
}}},_getOldRepeaterItemMatchingDefinition:function(a,c){if(this._repeatersDataOld){var d=this._repeatersDataOld[a].readyItems;
for(var e=0;
e<d.length;
++e){var b=d[e].repeaterDefinition;
if(b.skin==c.skin&&b.dataQuery===c.dataQuery){return d.splice(e,1)[0]
}}}return null
},_getRepeaterContainer:function(a){var b=a.definition.container;
if(b&&this._skinParts[b]){return this._skinParts[b]
}return null
},_getRepeaterDataList:function(a){if(a.dataRefList){return a.dataRefList
}if(a.dataRefField){var b=[];
if(a.dataRefField=="*"){}else{b=this._data.get(a.dataRefField)
}return b
}if(a.inlineDataField){return this._data.get(a.inlineDataField)
}},dispose:function(){this._elementPool.forEach(function(a){a.getLogic().dispose()
});
this._elementPool=[];
this.parent()
},_beforeRepeatersCreation:function(){},_onRepeaterItemReady:function(d,c,a,b){},_onRepeaterReady:function(a){}}});
W.Components.newComponent({name:"mobile.core.components.Button",skinParts:{icon:{type:"htmlElement",optional:"true"},label:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["up","over","selected","pressed"],_triggers:["click"],Binds:["_onClick","_onOver","_onOut","_onMouseDown","_onMouseUp","render"],_canFocus:true,initialize:function(c,b,a){this.parent(c,b,a);
a=a||{};
this.setParameters({label:a.label||b.getAttribute("label"),toggleMode:a.toggleMode||false,disabled:a.disabled||false,iconSrc:a.iconSrc||"",command:a.command||"",commandParameter:a.commandParameter||""})
},_onDataChange:function(a){if(a.getType()=="Button"){this.setParameters({label:a.get("label"),toggleMode:a.get("toggleMode"),disabled:a.get("disabled"),iconSrc:a.get("iconSrc"),command:a.get("command"),commandParameter:a.get("commandParameter")})
}this.parent()
},render:function(){this._skinParts.label.set("html",this._label||"");
if(this._skinParts.icon){if(this._iconSrc){this._skinParts.icon.setStyle("background","url("+this._iconSrc+") no-repeat 50% 50%");
this._skinParts.icon.uncollapse()
}else{this._skinParts.icon.setStyle("background","");
this._skinParts.icon.collapse()
}}},_onEnabled:function(){var a=this._skinParts.view;
a.addEvent(Constants.CoreEvents.CLICK,this._onClick);
a.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
a.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},_onDisabled:function(){var a=this._skinParts.view;
a.removeEvent(Constants.CoreEvents.CLICK,this._onClick);
a.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
a.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},setLabel:function(a){this._label=a;
this._renderIfReady()
},setIcon:function(a){this._iconSrc=a;
this._renderIfReady()
},setTextContent:function(a){this.setLabel(a)
},setToggleMode:function(a){this._toggleMode=a
},setDisabled:function(a){this._disabled=!!a;
this._renderIfReady()
},setParameters:function(a){a=a||{};
this._label=a.label||this._label;
this._toggleMode=a.toggleMode||this._toggleMode;
this._disabled=a.disabled||this._disabled;
this._iconSrc=a.iconSrc||this._iconSrc;
var b=a.commandParameter||this._commandParameter;
if(a.command){this.setCommand(a.command,b)
}this._renderIfReady()
},getLabel:function(){return this._label
},toggleSelected:function(b){var a=false;
if(typeof b!=="undefined"){a=b
}else{if(!this.getState().contains("selected")){a=true
}}(a)?this.setState("selected"):this.removeState("selected")
},_onClick:function(b){if(this.isEnabled()){if(!this._command){b=b||{};
b.target=this.getViewNode();
this.fireEvent(Constants.CoreEvents.CLICK,b)
}if(this._toggleMode){var a=(!this.getState().contains("selected"))?"selected":"over";
this.setState(a)
}}},_onOver:function(a){if(this.isEnabled()&&!this.getState().contains("selected")){this.fireEvent("over",a);
this.setState("over")
}},_onOut:function(a){if(this.isEnabled()&&!this.getState().contains("selected")){this.fireEvent("up",a);
this.setState("up")
}},_onMouseDown:function(){if(this.isEnabled()&&!this.getState().contains("selected")){this.setState("pressed")
}},_onMouseUp:function(){this.removeState("pressed")
},getAcceptableDataTypes:function(){return["","Button"]
}}});
W.Components.newComponent({name:"mobile.core.components.ContactList",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_onItemReady:function(c,b,d){if(b){var a=c.getDataItem();
c.addEvent("click",function(){this._onButtonClick(a)
}.bind(this))
}},_onButtonClick:function(a){this.injects().LinkTypes.gotoLink(a)
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_getParamsToPassToItem:function(a,b){b({listSubType:"CONTACT"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["LinkList"]
}}});
W.Components.newComponent({name:"mobile.core.components.Container",skinParts:{inlineContent:{type:"htmlElement"}},Class:{EDITOR_META_DATA:{general:{settings:true,design:true}},Extends:"mobile.core.components.base.BaseComponent",Z_INDEX_CHANGE_TYPES:{BACK:"BACK",FORWARD:"FORWARD",TOP:"TOP",BOTTOM:"BOTTOM"},initialize:function(c,a,b){this.parent(c,a,b);
this.setMaxH(8000)
},getInlineContentContainer:function(){if(this._skinParts.inlineContent){return this._skinParts.inlineContent
}return this._view
},getChildren:function(){return this.getInlineContentContainer().getChildren()
},addChild:function(a){a.getViewNode().insertInto(this.getInlineContentContainer());
this.moveChild(a,this.Z_INDEX_CHANGE_TYPES.TOP)
},removeChild:function(b){var a=b.getViewNode?b.getViewNode():b;
this.getInlineContentContainer().removeChild(a)
},canMoveForward:function(c){var a=this.getChildren();
var b=a.indexOf(c.getViewNode());
if(b==-1){return false
}return b<a.length-1
},canMoveBack:function(b){var a=this.getChildren().indexOf(b.getViewNode());
if(a==-1){return false
}return a>0
},moveChild:function(h,a){var d=this.getChildren();
var b=h.getViewNode();
var f=this.getViewNode();
var g=d.indexOf(b);
var c=g;
switch(a){case this.Z_INDEX_CHANGE_TYPES.BACK:c=g-1;
break;
case this.Z_INDEX_CHANGE_TYPES.FORWARD:c=g+1;
break;
case this.Z_INDEX_CHANGE_TYPES.BOTTOM:c=0;
break;
case this.Z_INDEX_CHANGE_TYPES.TOP:c=d.length-1;
break
}W.Utils.setChildIndex(this.getInlineContentContainer(),g,c);
var e=this.injects().Commands.getCommand("WViewerCommands.ComponentZIndexChanged");
if(e){e.execute(h)
}},hasChildren:function(){return true
},isContainer:function(){return true
},getChildComponents:function(){return this.getInlineContentContainer().getChildren("[comp]")
},getDescendantComponents:function(){return this.getDescendantComponentsRecurse(this,[])
},getDescendantComponentsRecurse:function(d,a){var c=d.getChildComponents();
for(var b=0;
b<c.length;
b++){a.push(c[b]);
if(c[b].getLogic&&c[b].getLogic().getChildComponents){this.getDescendantComponentsRecurse(c[b].getLogic(),a)
}}return a
},dispose:function(){var b=this.getChildren();
for(var a=0;
a<b.length;
a++){if(b[a].getLogic){b[a].getLogic().dispose()
}}this.parent()
}}});
W.Components.newComponent({name:"mobile.core.components.ExternalLinksList",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_onItemReady:function(c,b,d){if(b){var a=c.getDataItem();
c.addEvent("click",function(){this._onButtonClick(a)
}.bind(this));
c.setListSubtype(this._data.get("subType"))
}},_onButtonClick:function(a){this.injects().LinkTypes.gotoLink(a)
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_getParamsToPassToItem:function(a,b){b({listSubType:"EXTERNAL_LINKS"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["LinkList"]
}}});
W.Components.newComponent({name:"mobile.core.components.FacebookComment",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{facebook:{type:"htmlElement"}},propertiesSchema:"WFacebookCommentProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onResizeComponent"],initialize:function(b,a){this.parent(b,a)
},render:function(){this._addFacebookScript(document,"script","facebook-jssdk")
},_onComponentPropertyChange:function(b,a){this._rebuildFbCommentElement()
},_rebuildFbCommentElement:function(){this._skinParts.facebook.empty();
var b={"class":"fb-comments","data-href":document.URL,"data-num-posts":this.getComponentProperty("numPosts"),width:this.getComponentProperty("width"),colorscheme:this.getComponentProperty("colorscheme")};
var a=new Element("fb-root",b);
this._skinParts.facebook.adopt(a);
if(window.FB!==undefined){FB.XFBML.parse((this._skinParts.facebook).get(0))
}},_addFacebookScript:function(a,b,c){this.injects().Viewer.loadExternalScript("//connect.facebook.net/en_US/all.js#xfbml=1",function(){this._rebuildFbCommentElement()
}.bind(this))
}}});
W.Components.newComponent({name:"mobile.core.components.FacebookLike",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{facebook:{type:"htmlElement"}},propertiesSchema:{layout:{type:"string","enum":["standard","button_count","box_count"],"default":"standard",description:"the layout of the button"},send:{type:"boolean","default":"false",description:"enable/disable the send button"},show_faces:{type:"boolean","default":"false",description:"show the faces of your friends that liked this item"},width:{type:"string","default":"225",description:"the width of the Like button"},action:{type:"string","enum":["like","recommend"],"default":"like",description:" the verb to display on the button. Options: *like*, *recommend*"},font:{type:"string","enum":["arial","lucida grande","segoe ui","tahoma","trebuchet ms","verdana"],"default":"tahoma",description:"the font to display in the button"},colorscheme:{type:"string","enum":["light","dark"],"default":"light",description:"the color scheme for the like button"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(b,a){this.parent(b,a)
},render:function(){var a=new Iframe();
a.innerHTML='<iframe name="IFrame_gzgu1msw" width="200" height="200" id="IFrame_gzgu1msw" src="http://htmlcomponentservice.appspot.com/get_draft?id=00897b_989caa15e140d9d9f9576d40d24b4d69.html">';
if(this._iframe){a.replaces(this._iframe)
}else{this._view.adopt(a)
}this._iframe=a
}}});
W.Components.newComponent({name:"mobile.core.components.GooglePlusOne",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{googlePlus:{type:"htmlElement"}},propertiesSchema:{size:{type:"string","enum":["small","medium","standard","tall"],"default":"standard",description:"The button size to render"},annotation:{type:"string","enum":["none","bubble","inline"],"default":"inline",description:"The annotation to display next to the button."},width:{type:"string","default":"",description:"If annotation is set to *inline*, the width in pixels to use for the button and its inline annotation. If omitted, a button and its inline annotation use 450px."}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(b,a){this.parent(b,a)
},render:function(){this._runGooglePlusOneScript()
},_onComponentPropertyChange:function(b,a){this._rebuildGooglePlusElement()
},_rebuildGooglePlusElement:function(){this._skinParts.googlePlus.empty();
var b={"class":"googlePlusOne",href:"",size:this.getComponentProperty("size"),annotation:this.getComponentProperty("annotation"),width:this.getComponentProperty("width")};
var a=new Element("g\\:plusone",b);
this._skinParts.googlePlus.adopt(a);
if(window.gapi!==undefined){gapi.plusone.go()
}},_runGooglePlusOneScript:function(a,b,c){this.injects().Viewer.loadExternalScript("//apis.google.com/js/plusone.js",function(){this._rebuildGooglePlusElement()
}.bind(this))
}}});
W.Components.newComponent({name:"mobile.core.components.Header",imports:["mobile.core.components.Image"],skinParts:{title:{type:"htmlElement",autoBindData:"title"},image:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onImageDataUpdate"],_states:["showImage","hideImage"],render:function(){document.title=this._data.get("title");
this.setCollapsed(this._data.getMeta("isHidden"));
var a=this._data.get("imageSize");
switch(a){case"small":this._skinParts.image.set("class","smallHeaderImage");
break;
case"large":this._skinParts.image.set("class","largeHeaderImage");
break;
case"medium":this._skinParts.image.set("class","mediumHeaderImage");
break
}},isReady:function(){return !!this._isImageReady&&this.parent()
},_onDataChange:function(){if(!this._imageSkinContainer){var a=this._data.get("image");
if(a){this.injects().Data.getDataByQuery(a,function(b){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",a,{cropMode:"full",align:"center",valign:"middle"},undefined,function(c){this._isImageReady=true;
this._imageData=b;
this._imageData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onImageDataUpdate);
this._onImageDataUpdate()
}.bind(this));
this._imageSkinContainer.insertInto(this._skinParts.image)
}.bind(this))
}}else{if(this._imageSkinContainer.getLogic){this._imageSkinContainer.getLogic().refresh()
}}this.parent()
},_onImageDataUpdate:function(){if(this._imageData&&!this._imageData.getMeta("isHidden")){this._imageSkinContainer.uncollapse();
this.setState("showImage")
}else{this._imageSkinContainer.collapse();
this.setState("hideImage")
}},getAcceptableDataTypes:function(){return["Header"]
}}});
W.Components.newComponent({name:"mobile.core.components.HomeButton",skinParts:{text:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(d,a,c){this.parent(d,a,c);
this._allowClick=false;
var b=this.injects().Viewer;
b.addEvent("pageTransitionStarted",this._onNavigationPrepPage.bind(this));
b.addEvent("pageTransitionEnded",this._onNavigation.bind(this))
},render:function(){this._skinParts.text.set("html",this._data.get("text"));
this._onNavigationPrepPage();
this._onNavigation()
},_onAllSkinPartsReady:function(a){a.view.addEvent("click",this._onButtonClick.bind(this))
},_onButtonClick:function(a){if(this._allowClick){this.injects().Viewer.goToHomePage()
}},_onNavigationPrepPage:function(){this._allowClick=false;
if(this.injects().Viewer.isHomePage()){this._skinParts.view.collapse()
}else{this._skinParts.view.uncollapse()
}},_onNavigation:function(){this._allowClick=true
},getAcceptableDataTypes:function(){return["Text"]
}}});
W.Components.newComponent({name:"mobile.core.components.Image",imports:["mobile.core.components.base.BaseComponent","mobile.core.components.image.ImageDimensions","mobile.core.components.image.ImageUrl"],skinParts:{image:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onImageLoaded","_onOrientationChange"],_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],_states:["loading","loaded"],Static:{unitOptions:{EM:"em",PX:"px",PERCENT:"%"}},initialize:function(c,a,b){this.parent(c,a,b);
this.lockRefresh();
this._imageDimensions=new this.imports.ImageDimensions();
this._imageUrl=new this.imports.ImageUrl();
this._setParametersToDefaults();
this._initializeParametersFromArgs(b);
this._requestExactSize=this.injects().Viewer.getPreviewMode()!==true;
this.injects().Viewer.addOrientationEvent(this._onOrientationChange)
},_setParametersToDefaults:function(){this._sizeOfComponentInPx={x:0,y:0};
this._units={x:this.unitOptions.PERCENT,y:this.unitOptions.PERCENT};
this._sizeOfComponentInUnits={x:100,y:100};
this._uri=""
},_initializeParametersFromArgs:function(a){a=a||{};
this.setCropMode(a.cropMode);
this.setAlign(a.align,a.valign);
this._passedUnit=this._isValueInObject(this.unitOptions,a.unit)?a.unit:null;
this.setSize(a.width,a.height);
this._renderDelay=a.renderDelay||1;
this._useWebUrl=a.useWebUrl||false
},_onOrientationChange:function(){setTimeout(this.refresh.bind(this,true),50)
},render:function(){this.unLockRefresh();
if(this._renderDelay===0){this.refresh(true)
}else{this.injects().Utils.callLater(this.refresh,[true],this,this._renderDelay)
}},_needsRender:function(){var a=this._data&&this._data.get("uri")&&this._uri!==this._data.get("uri");
var b=this._getComponentSizeInPx();
return(a||this._sizeOfComponentInPx.x!=b.x||this._sizeOfComponentInPx.y!=b.y||this._isPropInvalid("size")||this._isPropInvalid("cropMode"))
},_onAllSkinPartsReady:function(){this._skinParts.image.setStyle("position","absolute");
this._skinParts.view.setStyles({position:"relative",overflow:"hidden"})
},lockRefresh:function(){this._isLock=true
},unLockRefresh:function(){this._isLock=false
},refresh:function(a){if(a||this._needsRender()){if(this._renderDelay===0){this._onRefresh(a)
}else{this.injects().Utils.callLater(this._onRefresh,[a],this,this._renderDelay)
}}},_onRefresh:function(e){if(this._isLock&&!e){return
}if(!this._data){return
}this._skinParts.image.set("alt",this._data.get("alt"));
var d=this._getImageDimensionsAndSetCompSize(e);
var c=this._validateImageDimensions(d);
if(c){var b={isSameImage:null,isSameImageWithBiggerPyramidSize:null};
var a=this._getImageFullUrl(d.imageRequestSize,b);
this.fireEvent("loading",{url:a,imgWidth:d.imageObjectSize.x,imgHeight:d.imageObjectSize.y,requestSize:this._pyramidRequestSize,imgX:d.imagePosition.x,imgY:d.imagePosition.y});
this._skinParts.image.setStyles({width:d.imageObjectSize.x+"px",height:d.imageObjectSize.y+"px",top:d.imagePosition.y+"px",left:d.imagePosition.x+"px"});
if(a!=this._skinParts.image.get("src")){if(!b.isSameImage||b.isSameImageWithBiggerPyramidSize){this.setState("loading")
}this._skinParts.image.addEvent("load",this._onImageLoaded);
this._skinParts.image.removeEvents("error");
this._skinParts.image.addEvent("error",this._onImageError.bind(this,a));
this._skinParts.image.set("src",a)
}else{this._moveImageToBackground()
}}else{this.injects().Utils.callLater(this._renderIfReady,[],this,50)
}this._validate()
},_validateImageDimensions:function(c){if(!c||!c.imageRequestSize){return false
}var b=c.imageRequestSize;
var a=(b.x===0||b.y===0);
if(a){this._isLastImageRequestZero=true
}else{if(this._isLastImageRequestZero){LOG.reportError(wixErrors.IMG_VALID_SIZE_AFTER_ZERO,this.$className,"_validateImageDimensions",this._data.get("uri"))
}this._isLastImageRequestZero=false
}return !a
},_getImageDimensionsAndSetCompSize:function(e){var d=null;
var c=parseInt(this._data.get("width"),10);
var a=parseInt(this._data.get("height"),10);
if(!c&&!a){c=a=128
}if(e||(this._isPropInvalid("size"))){var b=this._getComponentSizeInUnits();
this._skinParts.view.setStyles({width:b.x,height:b.y})
}if(e||this._isPropInvalid("size")||(this._isPropInvalid("cropMode"))){this._sizeOfComponentInPx=this._getComponentSizeInPx();
d=this._imageDimensions.getDimensionsForContainerSize({x:c,y:a},this._sizeOfComponentInPx)
}return d
},_getImageFullUrl:function(d,f){var e=this._uri;
this._uri=this._data.get("uri");
f.isSameImage=e===this._uri;
var c=this._uri;
var b=(this._uri.indexOf("http")===0);
if(!this._useWebUrl&&!b){if(this._requestExactSize){c=this._imageUrl.getImageUrlExactSize(d,this._uri)
}else{var a=this._imageUrl.getImageUrlFromPyramid(d,this._uri,f.isSameImage,this._pyramidRequestSize);
c=a.url;
f.isSameImageWithBiggerPyramidSize=f.isSameImage&&a.pyramidRequestSize>this._pyramidRequestSize;
this._pyramidRequestSize=a.pyramidRequestSize
}}return c
},_onImageLoaded:function(){var a=window.Browser.ie7?7000:1;
this.injects().Utils.callLater(this._validateResultImageSize,[],this,a);
this.setState("loaded");
this._moveImageToBackground();
this._renderIfReady()
},_validateResultImageSize:function(){this._renderIfReady()
},_moveImageToBackground:function(){var b=this._skinParts.image;
if(this._sizeOfComponentInPx.x!==0&&this._sizeOfComponentInPx.y!==0){if(Modernizr.backgroundsize){var a=this.injects().Utils.getCSSBrowserFeature("backgroundSize");
var c={};
c["background-image"]="url('"+b.get("src")+"')";
c[a]=b.getStyle("width")+" "+b.getStyle("height");
c["background-position"]=parseInt(b.getStyle("left"),10)+"px "+parseInt(b.getStyle("top"),10)+"px";
c["background-repeat"]="no-repeat";
this._skinParts.view.setStyles(c);
b.setStyles({visibility:"hidden"})
}}},_onImageError:function(a){LOG.reportError(wixErrors.IMAGE_LOAD_ERROR,"Image","refresh",a);
this._renderIfReady()
},_getComponentSizeInUnits:function(){return{x:this._sizeOfComponentInUnits.x+this._units.x,y:this._sizeOfComponentInUnits.y+this._units.y}
},_getComponentSizeInPx:function(){if(this._skinParts===null){return
}return(this._units.x!==this.unitOptions.PX||this._units.y!==this.unitOptions.PX)?this._skinParts.view.getSize():{x:Number(this._sizeOfComponentInUnits.x),y:Number(this._sizeOfComponentInUnits.y)}
},_invalidProps:{},_invalidate:function(b){switch(typeOf(b)){case"string":this._invalidProps[b]="invalid";
break;
case"array":for(var a=0;
a<b.length;
++a){this._invalidProps[b[a]]="invalid"
}break
}},_validate:function(b){switch(typeOf(b)){case"string":delete this._invalidProps[b];
break;
case"array":for(var a=0;
a<b.length;
++a){delete this._invalidProps[b[a]]
}break;
default:this._invalidProps={};
break
}},_isPropInvalid:function(a){return Boolean(this._invalidProps[a])
},setCropMode:function(a){if(this._imageDimensions.setCropMode(a)){this._invalidate("cropMode");
this._renderIfReady()
}},setAlign:function(c,b){var a=false;
if(this._imageDimensions.setHorizontalAlign(c)){a=true
}if(this._imageDimensions.setVerticalAlign(b)){a=true
}if(a){this._invalidate("align");
this._renderIfReady()
}},setSize:function(b,a,c){var d=false;
this._passedUnit=c||this._passedUnit;
if(b){d=(this._passedUnit&&this._passedUnit!==this._units.x)||this._sizeOfComponentInUnits.x!==parseInt(b,10);
this._units.x=this._passedUnit||this._units.x;
this._sizeOfComponentInUnits.x=parseInt(b,10)
}if(a){d=d||(this._passedUnit&&this._passedUnit!==this._units.y)||this._sizeOfComponentInUnits.y!==parseInt(a,10);
this._units.y=this._passedUnit||this._units.y;
this._sizeOfComponentInUnits.y=parseInt(a,10)
}if(d){this._invalidate("size");
this._renderIfReady()
}},_isValueInObject:function(a,c){for(var b in a){if(a[b]===c){return true
}}return false
},getAcceptableDataTypes:function(){return["Image",""]
}}});
W.Components.newComponent({name:"mobile.core.components.MenuButton",skinParts:{label:{type:"htmlElement"},icon:{type:"htmlElement",optional:true},description:{type:"htmlElement",optional:true},bullet:{type:"htmlElement",optional:true}},Class:{Extends:"mobile.core.components.base.BaseComponent",_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],Binds:["_buttonClick","_onMouseOver","_onMouseOut","_setImages","_onThemePropChange"],_states:["selected","idle","up","over","down","disable"],_selected:false,_dropdownOpen:false,_menu:null,_transitionValue:null,dropdownMode:false,children:[],initialize:function(c,b,a){this.parent(c,b,a);
this._listSubType="NONE";
if(a&&a.listSubType){this.setListSubtype(a.listSubType)
}this.injects().Theme.addEvent("propertyChange",this._onThemePropChange)
},createSubButton:function(a,b,d){var c=this;
a(b,null,function(e){c.children.push(e);
d(e)
})
},setMenu:function(a){this._menu=a
},getMinimalWidth:function(){return Math.max(this.getOffsetWidth(),this._skinParts.label.offsetWidth)
},fillWidthByPadding:function(a){this.setPadding(0);
var b=(a-this.getOffsetWidth());
this.setPadding(b)
},getPads:function(){return{left:parseInt(this._skinParts.bg.getStyle("padding-left"),10),right:parseInt(this._skinParts.bg.getStyle("padding-right"),10)}
},disableTransition:function(){this._transitionValue=this.getViewNode().getStyle("-webkit-transition-duration");
this.getViewNode().setStyle("-webkit-transition-duration","0s")
},enableTransition:function(){if(this._transitionValue!=null){this.getViewNode().setStyle("-webkit-transition-duration",this._transitionValue)
}},setPadding:function(b){var c=b/2;
var a;
if(c-(Math.floor(c))===0){a=c
}else{c=Math.floor(c);
a=c+1
}switch(this._menu.getComponentProperty("alignText")){case"center":this._skinParts.bg.setStyle("padding-left",c+"px");
this._skinParts.bg.setStyle("padding-right",a+"px");
break;
case"right":this._skinParts.bg.setStyle("padding-left",b+"px");
this._skinParts.bg.setStyle("padding-right","0px");
break;
case"left":this._skinParts.bg.setStyle("padding-left","0px");
this._skinParts.bg.setStyle("padding-right",b+"px");
break
}},getMinimalDropdownWidth:function(){var b=0;
var a=this.getViewNode().getElements(".dropSizeTarget");
if(a&&a.length>0){a.forEach(function(d,c){b+=d.offsetWidth
})
}else{b=this.getViewNode().offsetWidth
}return b
},isHidden:function(){var a=false;
if(this._data.get("hidePage")==true){a=true
}return a
},compareRefID:function(a){if(!this._data){return false
}return this._data.get("id")===a.substr(1)
},alignText:function(){var a=this.getPads();
this.setPadding(a.left+a.right)
},getOffsetWidth:function(){return this.getViewNode().offsetWidth
},getOffsetLeft:function(){return this.getViewNode().offsetLeft
},_onThemePropChange:function(a){this._setImages(a)
},_onDataChange:function(a){this._updateButtonView();
this.fireEvent("dataChanged");
return this.parent(a)
},render:function(){this._updateButtonView()
},setSelected:function(a){this._selected=a;
if(this._selected){this.setState("selected")
}else{this.removeState("selected");
if(this._dropdownOpen){this.setState("over")
}}},setDropdownOpen:function(a){this._dropdownOpen=a;
if(!this._selected){if(this._dropdownOpen){this.setState("over")
}else{this.removeState("over")
}}},_updateButtonView:function(){if(!this._data||!this._skinParts){return
}var a=(this._data.getType()=="Page")?"title":"text";
var d=this._data.get(a);
this._skinParts.label.set("html",this._getNonEmptyText(d));
var c=this._skinParts.description;
if(c){var b=this._data.get("target");
c.set("html",this._getNonEmptyText(b))
}this._setImages()
},getID:function(){if(this._data){return this._data.get("id")
}return""
},_getNonEmptyText:function(a){a=a.trim().replace(/ /g,"&nbsp;");
return a||"&nbsp;"
},_onAllSkinPartsReady:function(b){this.injects().Theme.addEvent(Constants.ComponentEvents.PROPERTY_CHANGE,this._setImages);
var a=b.hitArea||b.view;
a.addEvent(Constants.CoreEvents.CLICK,this._buttonClick);
a.addEvent("mouseenter",this._onMouseOver);
a.addEvent("mouseleave",this._onMouseOut)
},_setImages:function(f){var b;
var d=this._listSubType+"_DIRECTORY";
if(f&&f.name!=d){return
}var a=this.injects().Theme.getProperty(d);
if(this._data.getType()=="Link"){this._skinParts.icon.uncollapse();
if(this._listSubType=="PAGES"){b=a+this._data.get("icon")
}else{b=a+this.injects().LinkTypes.getLinkIcon(this._data.get("linkType"))
}this._skinParts.icon.set("src",b)
}else{if(this._skinParts.icon){var c=this._data.get("icon");
if(c){b=a+this._data.get("icon");
this._skinParts.icon.set("src",b)
}else{this._skinParts.icon.setStyle("display","none")
}}}},getWidthOnLayout:function(){return this.getViewNode().offsetWidth+parseInt(this.getViewNode().getStyle("margin-left"),10)+parseInt(this.getViewNode().getStyle("margin-right"),10)
},setLabel:function(a){this._skinParts.label.set("html",this._getNonEmptyText(a))
},setListSubtype:function(a){this._listSubType=a
},_buttonClick:function(){this.fireEvent("click")
},_onMouseOver:function(a){if(this.dropdownMode){if(!this._selected){this.setState("over")
}}this.fireEvent("over")
},_onMouseOut:function(a){if(this.dropdownMode){if(!this._selected&&!this._dropdownOpen){this.removeState("over")
}}this.fireEvent("out")
},getAcceptableDataTypes:function(){return["Link","Page",""]
}}});
W.Components.newComponent({name:"mobile.core.components.NetworkList",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],image:[{itemsContainer:"htmlElement"}],Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_onItemReady:function(c,b,d){if(b){var a=c.getDataItem();
c.addEvent("click",function(){this._onButtonClick(a)
}.bind(this))
}},_onButtonClick:function(a){this.injects().LinkTypes.gotoLink(a)
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_getParamsToPassToItem:function(a,b){b({listSubType:"NETWORKS"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["LinkList"]
}}});
W.Components.newComponent({name:"mobile.core.components.Page",skinParts:{},Class:{Extends:"mobile.core.components.Container",Static:{MAX_HEIGHT:60000,MIN_HEIGHT:500},initialize:function(c,a,b){this.parent(c,a,b);
this._isContentWixified=false;
this._isContentWixifyStarted=false;
this._wixifyCBList=[];
this._contentReady=false;
this.setMaxH(this.MAX_HEIGHT);
this.setMinH(this.MIN_HEIGHT);
a.collapse()
},listenForContentRendered:function(){var d=this._view.getElements("[comp]");
var c=[];
for(var b=0;
b<d.length;
b++){if(!d[b].getLogic||d[b].getLogic().isRendered()!==true){c.push(d[b])
}}if(c.length===0){this._setContentRendered()
}else{var a=new Async.Bulk(c,null,{completeEvent:Constants.ComponentEvents.RENDER,completeCallback:function(){this._setContentRendered()
}.bind(this)})
}},getAcceptableDataTypes:function(){return["Page"]
},wixifyContent:function(a){if(a){this._wixifyCBList.push(a)
}if(!this._isContentWixified){if(this._isContentWixifyStarted){return
}this._isContentWixifyStarted=true;
var c=this._view.getElements("[comp]");
if(c.length===0){this._setWixified();
this.listenForContentRendered();
return
}var b=new Async.Bulk(c,null,{completeEvent:"wixified",completeCallback:function(){this._setWixified()
}.bind(this)});
this.listenForContentRendered();
c.wixify()
}else{this._setWixified()
}},render:function(){if(W.Layout&&W.Layout.getComponentMinResizeHeight){var a=W.Layout.getComponentMinResizeHeight(this);
this.setHeight(a)
}},isContentWixify:function(){return this._isContentWixified
},_setWixified:function(){if(!this._isContentWixified){this._view.getElements(".initHidden").removeClass("initHidden");
this._view.removeClass("initHidden");
this._isContentWixified=true
}this.fireEvent("contentWixified",this);
for(var a=0;
a<this._wixifyCBList.length;
++a){this._wixifyCBList[a]()
}this._wixifyCBList=[];
if(this.injects().Layout){this.injects().Layout.attachSavedAnchors(this._view)
}},_setContentRendered:function(){this._contentReady=true;
this._findAndEnforceInvalidatedAnchors(this);
this.render();
this.fireEvent("pageContentReady")
},_findAndEnforceInvalidatedAnchors:function(d){if(!d.getChildComponents){return
}var b=d.getChildComponents();
var c=[];
for(var a=0;
a<b.length;
a++){this._findAndEnforceInvalidatedAnchors(b[a].getLogic());
if(b[a].getLogic().isAnchorsInvalidated&&b[a].getLogic().isAnchorsInvalidated()){c.push(b[a].getLogic())
}}if(W.Layout&&W.Layout.enforceAnchors){W.Layout.enforceAnchors(c)
}},setAsWixified:function(){this._setWixified()
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.NEVER},from:false}
},isSelectable:function(){return false
},isContentReady:function(){return this._contentReady
},getInlineContentContainer:function(){if(this._skinParts.inlineContent){return this._skinParts.inlineContent
}return this._view
},getThirdPartyApplicationComponent:function(){var a=this._view.getElement("[comp*='TPASection']");
return a.getLogic()
},isThirdPartyApplicationPage:function(){if(this._data.get("tpaApplicationId")){return true
}}}});
W.Components.newComponent({name:"mobile.core.components.PageTitle",skinParts:{view:{type:"htmlElement",autoBindData:"title"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_render:function(){this._skinParts.view.setCollapsed(this.getDataItem().get("hideTitle"))
},getAcceptableDataTypes:function(){return["Page"]
}}});
var IMAGE_SIZES=["small","medium","large"];
W.Components.newComponent({name:"mobile.core.components.Photo",traits:["mobile.core.components.traits.SizeMeasurement"],skinParts:{img:{type:"mobile.core.components.Image",dataRefField:"*",argObject:{}},photoFullScreen:{type:"mobile.core.components.PhotoFullScreen",dataRefField:"*"}},propertiesSchemaName:"PhotoProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",_states:IMAGE_SIZES,Binds:["_enterFullScreenMode","_exitFullScreenMode"],initialize:function(c,a,b,e){this.parent(c,a,b,e);
this._scrollPos={x:0,y:0};
var d=this.getComponentProperty("imageSize");
if(d){this.setState(d)
}},_onAllSkinPartsReady:function(){this._skinParts.view.addEvent("click",this._enterFullScreenMode)
},_onDataChange:function(b,a,c){if(a!="imageSize"){return
}this.setState(c);
this._skinParts.img.refresh(true)
},_saveScrollPosition:function(){this._scrollPos.x=document.body.scrollLeft;
this._scrollPos.y=document.body.scrollTop
},_enterFullScreenMode:function(){if(this.injects().Viewer.isScrollLock()){return
}this._saveScrollPosition();
this._fullScreenContainer=this.injects().Viewer.enterFullScreenMode(this._exitFullScreenMode);
this._skinParts.photoFullScreen.getViewNode().insertInto(this._fullScreenContainer);
this._skinParts.photoFullScreen.showImage()
},_exitFullScreenMode:function(){this._skinParts.photoFullScreen.exitFullScreen();
window.scrollTo(this._scrollPos.x,this._scrollPos.y)
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.core.components.PhotoFullScreen",traits:["mobile.core.components.traits.TouchSupport"],skinParts:{exitButton:{type:"htmlElement"},infoButton:{type:"htmlElement"},title:{type:"htmlElement"},description:{type:"htmlElement"},controls:{type:"htmlElement"},img:{type:"mobile.core.components.Image",dataRefField:"*",argObject:{cropMode:"full"}}},states:[],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_dragStartHandler","_setCloseButton","_updateScreenSize","_onInfoButtonClick"],_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],initialize:function(c,a,b){this.parent(c,a,b);
this.injects().Viewer.addOrientationEvent(this._updateScreenSize);
this._setEventsType()
},render:function(){if(!this._guiCreated){this.collapse();
this._createGui()
}this._imageDataOnChange()
},_prepareForRender:function(){this._updateScreenSize();
return true
},_onAllSkinPartsReady:function(){this.injects().Theme.addEvent("propertyChange",this._setCloseButton)
},_switchFromInfoPresentationToPhotoPresentation:function(){this._skinParts.controls.collapse();
this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.exitButton.uncollapse()
},_createGui:function(){this.hideOverlayControls();
this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.infoButton.addEvent(this._eventNames.down,this._onInfoButtonClick);
this._skinParts.controls.addEvent(this._eventNames.down,function(a){this._switchFromInfoPresentationToPhotoPresentation();
a.preventDefault();
return false
}.bind(this));
this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_back.png");
this._skinParts.exitButton.addEvent(this._eventNames.down,function(c){this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.exitButton.uncollapse();
var a=c.event;
var b=(a.currentTarget)?a.currentTarget:a.srcElement;
if(!this._touchSupported||(this._touchSupported&&a.touches.length==1)){this._skinParts.infoButton.uncollapse();
this.injects().Viewer.exitFullScreenMode();
c.stop();
return false
}}.bind(this));
this._view.addEvent(this._eventNames.down,this._onInfoButtonClick);
this._guiCreated=true
},_onInfoButtonClick:function(a){if(this._isInfoButtonPressed()){this._switchFromInfoPresentationToPhotoPresentation()
}else{this._skinParts.controls.uncollapse();
this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_x_info.png");
this._skinParts.exitButton.collapse()
}a.preventDefault();
return false
},_isInfoButtonPressed:function(){return !this._skinParts.controls.hasClass(Constants.CoreClasses.HIDDEN)
},_imageDataOnChange:function(){this._skinParts.title.set("html",this._data.get("title"));
this._skinParts.description.set("html",this._data.get("description"))
},showImage:function(){this.uncollapse()
},showOverlayControls:function(){this._skinParts.controls.uncollapse();
this._fullScreenControlsHidden=false
},hideOverlayControls:function(){this._skinParts.controls.collapse();
this._fullScreenControlsHidden=true
},_dragStartHandler:function(b){var a=b.event;
if(!this._touchSupported||(this._touchSupported&&a.touches.length==1)){this._skinParts.infoButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_info.png");
this._skinParts.exitButton.uncollapse();
this.injects().Viewer.exitFullScreenMode();
b.stop();
return false
}},exitFullScreen:function(){this.isInView=false;
this._view.removeEvent(this._eventNames.move,this._dragMoveHandler);
this._view.removeEvent(this._eventNames.up,this._dragStopHandler);
this.hideOverlayControls()
},_setCloseButton:function(a){if(a.name=="THEME_DIRECTORY"){this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/ico_back.png")
}},_updateScreenSize:function(){this._skinParts.img.refresh(true)
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.core.components.PhotoGalleryFullScreen",traits:["mobile.core.components.traits.TouchSupport"],skinParts:{exitButton:{type:"htmlElement"},title:{type:"htmlElement"},description:{type:"htmlElement"},nextButton:{type:"htmlElement"},prevButton:{type:"htmlElement"},controls:{type:"htmlElement"},imagesContainer:{type:"htmlElement"}},states:[],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_dragStartHandler","_dragMoveHandler","_dragStopHandler","_setOrientationChangeEvent","_imageDataOnChange"],initialize:function(c,a,b){this.parent(c,a,b);
this._fullScreenImages=[];
this._setEventsType();
this._setCloseButton=this._setCloseButton.bind(this);
this.injects().Viewer.addOrientationEvent(this._setOrientationChangeEvent)
},render:function(){if(!this._guiCreated){this._createGui()
}this.injects().Theme.addEvent("propertyChange",this._setCloseButton)
},_imageDataOnChange:function(){this._skinParts.title.set("html",this._trackedImageData.get("title"));
this._skinParts.description.set("html",this._trackedImageData.get("description"))
},showImageAt:function(b){var a=this._imagesData.length;
if(a<1){return
}$(window).scrollTo(0,0);
if(b<0||b>=a){LOG.reportError(wixErrors.EDITOR_INDEX_OUT_OF_RANGE,"mobile.core.components.PhotoGalleryFullScreen","showImageAt",b);
b=0
}this._selectedImageIndex=b;
var c=this._imagesData[b].dataObj;
if(this._trackedImageData){this._trackedImageData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._imageDataOnChange)
}this._trackedImageData=c;
c.addEvent(Constants.DataEvents.DATA_CHANGED,this._imageDataOnChange);
this._updateDisplay();
this.hideOverlayControls();
if(this._fullScreenImages.length===0){this._createImages(b)
}else{this._updateImages(b)
}this._skinParts.title.set("html",c.get("title"));
this._skinParts.description.set("html",c.get("description"));
this._view.removeEvent(this._eventNames.down,this._IOS5Bridge);
this._view.addEvent(this._eventNames.down,this._IOS5Bridge)
},_updateDisplay:function(){var a=document.getSize();
this._screenSize=a;
this._skinParts.imagesContainer.setStyles({width:(a.x*3)+"px",left:(0-this._screenSize.x-1)+"px"})
},showOverlayControls:function(){this._skinParts.controls.uncollapse();
this._fullScreenControlsHidden=false
},hideOverlayControls:function(){this._skinParts.controls.collapse();
this._fullScreenControlsHidden=true
},_createImages:function(a){this._skinParts.imagesContainer.empty();
for(var b=0;
b<3;
b++){var c=this.injects().Components.createComponent("mobile.core.components.Image",this._skin.imageSkinClassName,this._imagesData[this._getRotatedImageIndex(a+b-1)].dataObj,{renderDelay:0,width:this._screenSize.x,height:this._screenSize.y,unit:"px",valign:"middle",align:"center",cropMode:"full"});
this._fullScreenImages[b]=c;
c.insertInto(this._skinParts.imagesContainer);
c.setPosition({x:(this._screenSize.x*b),y:0})
}},_updateImages:function(a){for(var b=0;
b<3;
b++){var c=this._fullScreenImages[b];
var d=c.getLogic();
d.setDataItem(this._imagesData[this._getRotatedImageIndex(a+b-1)].dataObj);
d.setSize(this._screenSize.x,this._screenSize.y);
c.setPosition({x:(this._screenSize.x*b),y:0})
}},_onDataChange:function(){this._imagesData=this._data.get("items").clone();
if(this._imagesData.length>0){this.injects().Data.getDataByQueryList(this._data.get("items"),function(a){for(var b=0;
b<this._imagesData.length;
b++){this._imagesData[b]={query:this._imagesData[b],dataObj:a[this._imagesData[b]]}
}this._renderIfReady()
}.bind(this))
}},_getRotatedImageIndex:function(a){if(a<0){a=this._imagesData.length+a
}else{if(a>=this._imagesData.length){a=a-this._imagesData.length
}}return a
},_createGui:function(){this._skinParts.nextButton.addEvent(this._eventNames.down,function(a){this._moveImages(1);
a.stop();
return false
}.bind(this));
this._skinParts.prevButton.addEvent(this._eventNames.down,function(a){this._moveImages(-1);
a.stop();
return false
}.bind(this));
this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/close.png");
this._skinParts.exitButton.addEvent(this._eventNames.down,function(a){if(this._trackedImageData){this._trackedImageData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._imageDataOnChange)
}this.injects().Viewer.exitFullScreenMode();
a.stop();
return false
}.bind(this));
this._IOS5Bridge=function(a){this._dragStartHandler(a)
}.bind(this);
this._view.addEvent(this._eventNames.down,this._IOS5Bridge);
this._guiCreated=true
},_setOrientationChangeEvent:function(a){this._screenSize=a;
if(this._selectedImageIndex>-1){this.showImageAt(this._selectedImageIndex)
}},_moveImages:function(c){this._fullScreenImages[1].removeEvent(this._eventNames.down,this._dragStartHandler);
var a=0-(c+1)*this._screenSize.x;
var b=new Fx.Tween(this._skinParts.imagesContainer,{fps:25,duration:300,transition:"sine:out",property:"left"});
b.addEvent("complete",function(){if(c!==0){var d=this._selectedImageIndex+c;
if(d<0){d=this._imagesData.length+d
}else{if(d>this._imagesData.length-1){d=d-this._imagesData.length
}}var e;
if(c>0){e=this._fullScreenImages.splice(0,1)[0];
this._fullScreenImages[2]=e
}else{e=this._fullScreenImages.splice(2,1)[0];
this._fullScreenImages.unshift(e)
}this.showImageAt(d)
}else{this._fullScreenImages[1].addEvent(this._eventNames.down,this._dragStartHandler)
}}.bind(this));
b.start(a)
},_dragStartHandler:function(c){var a=c.event;
var b=(a.currentTarget)?a.currentTarget:a.srcElement;
if(!this._touchSupported||(this._touchSupported&&a.touches.length==1)){this._skinParts.controls.collapse();
this._dragStartTime=new Date().getTime();
if(this._touchSupported){this._dragStartX=a.touches[0].pageX
}else{if(a.pageX){this._dragStartX=a.pageX
}else{this._dragStartX=a.clientX
}}this._containerDragStartX=this._skinParts.imagesContainer.getPosition().x;
this._dX=0;
this._dragging=true;
b.addEvent(this._eventNames.move,this._dragMoveHandler);
b.addEvent(this._eventNames.up,this._dragStopHandler);
c.preventDefault();
return false
}},_dragMoveHandler:function(b){var a=b.event;
var d;
if(this._touchSupported){d=a.touches[0].pageX
}else{if(a.pageX){d=a.pageX
}else{d=a.clientX
}}this._dX=d-this._dragStartX;
var c=this._containerDragStartX+this._dX;
this._skinParts.imagesContainer.setStyle("left",c+"px");
b.preventDefault();
return false
},_dragStopHandler:function(d){var a=d.event;
var c=(a.currentTarget)?a.currentTarget:a.srcElement;
c.removeEvent(this._eventNames.move,this._dragMoveHandler);
c.removeEvent(this._eventNames.up,this._dragStopHandler);
this._dragStopTime=new Date().getTime();
var b;
if(Math.abs(this._dX)<10){if(this._fullScreenControlsHidden){this.showOverlayControls()
}else{this.hideOverlayControls()
}}else{this._fullScreenControlsHidden=true;
if(this._dragStopTime-this._dragStartTime<1000&&Math.abs(this._dX)>30){b=(this._dX>0)?0-1:1
}else{var e=this._skinParts.imagesContainer.getPosition().x;
b=Math.round(Math.abs(e)/this._screenSize.x)-1
}this._moveImages(b)
}this._dX=this._dragStartPoint=this._divDragStartPoint=this._dragStartTime=this._dragStopTime=null;
this._dragging=false;
d.preventDefault();
return false
},exitFullScreen:function(){this._view.removeEvent(this._eventNames.move,this._dragMoveHandler);
this._view.removeEvent(this._eventNames.up,this._dragStopHandler);
this.hideOverlayControls()
},_setCloseButton:function(a){if(a.name=="THEME_DIRECTORY"){this._skinParts.exitButton.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"dialog/close.png")
}},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"mobile.core.components.PhotoGalleryGrid",imports:["mobile.core.components.Image"],traits:["mobile.core.components.traits.TouchSupport"],skinParts:{imagesContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",_states:["grid","fullScreen"],initialize:function(c,b,a){this.parent(c,b,a);
this.isFullScreen=false;
this._firstRun=true;
this._loadedEreas=0;
this._requiredAreasSum=3;
this._fullScreenViewReady=false;
this._loadedImagesSum=0;
this._setEventsType()
},_prepareForRender:function(){if(!this._fullScreenViewReady){this._createFullScreenView();
return(!!this._fullScreenView)
}return this.parent()
},_onItemReady:function(b,a,c){b.getViewNode().addEvent("click",function(){this._enterFullScreenMode(this._itemsNodes.indexOf(b.getViewNode()))
}.bind(this))
},getSkinElementByIndex:function(a){var b=this._skinParts.imagesContainer.getChildren();
return b[a]
},_createFullScreenView:function(){this._fullScreenView=this.injects().Components.createComponent("mobile.core.components.PhotoGalleryFullScreen",this._skin.fullScreenViewSkinClassName,this._data,{},function(){this._fullScreenViewReady=true;
this._renderIfReady()
}.bind(this))
},_enterFullScreenMode:function(a){if(this._fullScreenViewReady&&!this.isFullScreen){this._fullScreenContainer=this.injects().Viewer.enterFullScreenMode(this._exitFullScreenMode.bind(this));
this._fullScreenView.insertInto(this._fullScreenContainer);
this._fullScreenView.getLogic().showImageAt(a);
this.isFullScreen=true
}},_exitFullScreenMode:function(){this._fullScreenView.getLogic().exitFullScreen();
this.isFullScreen=false;
var c=this._skinParts.imagesContainer.getChildren();
for(var a=0;
a<c.length;
++a){var b=c[a];
if(b.getLogic){b.getLogic().refresh(true)
}}},getItemClassName:function(){return"mobile.core.components.Image"
},getItemsContainer:function(){return this._skinParts.imagesContainer
},_getParamsToPassToItem:function(a,b){b({width:5.2,height:5.4,unit:"em",cropMode:"fill"})
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"mobile.core.components.RichText",imports:["mobile.core.components.base.BaseComponent"],skinParts:{richTextContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",render:function(){var b=this._data.get("text");
this._skinParts.richTextContainer.set("html",b);
var a=$(this._skinParts.richTextContainer).getElements("a");
this._sanitizeLinks(a);
this._disableLinks(a)
},getAcceptableDataTypes:function(){return["Text","RichText"]
}}});
var NO_IMAGE_STATE="noImage";
var IMAGE_ON_RIGHT_STATE="imageOnRight";
var IMAGE_ON_LEFT_STATE="imageOnLeft";
W.Components.newComponent({name:"mobile.core.components.RichTextImage",skinParts:{image:{type:"htmlElement"},text:{type:"htmlElement"}},states:[NO_IMAGE_STATE,IMAGE_ON_RIGHT_STATE,IMAGE_ON_LEFT_STATE],Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,a,b){this.parent(c,a,b);
this.setState(NO_IMAGE_STATE);
this.imageDataQuery=undefined
},render:function(){var c=this._data.get("imagePosition");
this.setState(c);
var a=this._data.get("text");
if(a!=this.textDataQuery){this.injects().Data.getDataByQuery(a,function(e){e.addEvent(Constants.DataEvents.DATA_CHANGED,this._onTextDataChange.bind(this,e));
this._onTextDataChange(e)
}.bind(this));
this.textDataQuery=a
}var d=this._data.get("image");
var b=this.injects().Components;
if(d!=this.imageDataQuery){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",d,{width:6,height:6,cropMode:"leftCenter"},function(f){var e=f._data;
e.addEvent(Constants.DataEvents.DATA_CHANGED,this._onImageDataChange.bind(this,e))
}.bind(this));
this._skinParts.image.empty();
this._imageSkinContainer.insertInto(this._skinParts.image);
this.imageDataQuery=d
}},_onTextDataChange:function(c){var b=c.get("text");
this._skinParts.text.set("html",b);
var a=$(this._skinParts.text).getElements("a");
this._disableLinks(a)
},_onImageDataChange:function(a){},getAcceptableDataTypes:function(){return["RichTextImage"]
}}});
W.Components.newComponent({name:"mobile.core.components.ServiceItem",skinParts:{icon:{type:"htmlElement"},label:{type:"htmlElement"},readMore:{type:"htmlElement"},description:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_toggleOpen","_onImageReady"],_states:["uncut","cutClosed","cutOpened"],initialize:function(c,b,a){this.parent(c,b,a);
this._opened=false;
this._uncut=true;
this.imageDataQuery=undefined
},render:function(){this._skinParts.label.set("html",this._data.get("title"));
var c=this._data.get("description");
c=c.replace(/\n/g,"<br/>");
this._skinParts.description.set("html",c);
var a=$(this._skinParts.description).getElements("a");
this._sanitizeLinks(a);
this._disableLinks(a);
this._skinParts.readMore.set("html","Read More");
this._testOpenState();
this._view.addEvent("click",this._toggleOpen);
var b=this._data.get("image");
if(b!=this.imageDataQuery){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",b,{width:6,height:6,unit:"em",align:"center",valign:"top",cropMode:"fill"},this._onImageReady);
this._skinParts.icon.empty();
this._imageSkinContainer.insertInto(this._skinParts.icon);
this.imageDataQuery=b
}},_testOpenState:function(){var a=this._skinParts.allText.getSize();
var b=parseInt(this.injects().Utils.getComputedStyle(this._skinParts.description).fontSize,10);
if(a.y>b*6.5){this._opened=!this._opened;
this._uncut=false;
this._toggleOpen()
}else{this._uncut=true;
this.setState("uncut")
}},_toggleOpen:function(){if(this._uncut||W.Viewer.isScrollLock()){return
}if(this._opened){this._skinParts.readMore.set("html","Read More");
this.setState("cutClosed")
}else{this._skinParts.readMore.set("html","Close");
this.setState("cutOpened")
}this.fireEvent("autoSizedAnimation");
this._opened=!this._opened
},_onAutoSizedAnimtion:function(){},_onImageReady:function(a){a._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onImageDataChange.bind(this,a._data));
this._onImageDataChange(a._data)
},_onImageDataChange:function(a){if(a.getMeta("isHidden")){this._skinParts.icon.collapse();
this._skinParts.view.removeClass("showImage");
this._skinParts.view.addClass("hideImage")
}else{this._skinParts.icon.uncollapse();
this._skinParts.view.addClass("showImage");
this._skinParts.view.removeClass("hideImage")
}},getAcceptableDataTypes:function(){return["Service"]
}}});
W.Components.newComponent({name:"mobile.core.components.ServiceList",skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",getItemClassName:function(){return"mobile.core.components.ServiceItem"
},_getParamsToPassToItem:function(a,b){b(undefined)
},_createHiddenItems:function(){return false
},getAcceptableDataTypes:function(){return["ServiceList"]
}}});
W.Components.newComponent({name:"mobile.core.components.SimpleBaseList",Class:{Extends:"mobile.core.components.BaseList",initialize:function(c,b,a){this.parent(c,b,a);
this._allItemsLoaded=false;
this._isLoadingItems=false
},getAcceptableDataTypes:function(){return["PropertyList"]
},getItemsContainer:function(){return this._skinParts.itemsContainer||this._view
},_prepareForRender:function(){if(this._allItemsLoaded){return true
}if(this._isLoadingItems){return false
}this._isLoadingItems=true;
var a=this._getItemsData();
this._renderItems(a);
return this._allItemsLoaded
},_onDataChange:function(){this._allItemsLoaded=false;
this._isLoadingItems=false;
this.parent()
},_getItemsData:function(){if(this._data){return this._data.get("items")
}},_onAllItemsReady:function(){this._isLoadingItems=false;
this._allItemsLoaded=true;
this._renderIfReady()
}}});
W.Components.newComponent({name:"mobile.core.components.SimpleButton",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{label:{type:"htmlElement"},hitArea:{type:"htmlElement"}},states:["up","over","down","disable"],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_buttonClick"],render:function(){var a=(this._data.getType()=="Page")?"title":"text";
this._skinParts.label.set("html",this._data.get(a))
},_onAllSkinPartsReady:function(a){a.hitArea.addEvent("click",this._buttonClick)
},_buttonClick:function(){this.fireEvent("click")
},getAcceptableDataTypes:function(){return["Button","Link","Page"]
}}});
W.Components.newComponent({name:"mobile.core.components.SiteMenu",imports:["mobile.core.components.BaseList","mobile.core.components.SimpleButton"],skinParts:{},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onButtonClick"],_getItemsData:function(){if(this._data){return this._data.get("pages")
}},_onItemReady:function(c,b,d){if(b){var a=c.getDataItem();
c.addEvent("click",function(){this._onButtonClick(a)
}.bind(this))
}},_onButtonClick:function(a){this.injects().Viewer.goToPage(a.get("id"))
},getItemClassName:function(){return"mobile.core.components.MenuButton"
},_createHiddenItems:function(){return false
},_getParamsToPassToItem:function(a,b){b({listSubType:"PAGES"})
},getAcceptableDataTypes:function(){return["Document"]
}}});
(function(){var c="BG_USES_CUSTOM_IMAGE";
var b="BG_USES_THEME_IMAGE";
var a="BG_USES_CUSTOM_COLOR";
W.Components.newComponent({name:"mobile.core.components.SiteStructure",Class:{Extends:"mobile.core.components.Container",Binds:["changeBGImage"],_bgSizes:[{w:204,h:309},{w:320,h:452},{w:320,h:646},{w:320,h:800},{w:400,h:591},{w:480,h:480},{w:533,h:239},{w:683,h:334},{w:768,h:896},{w:1024,h:640}],initialize:function(f,d,e){this.parent(f,d,e);
window.onorientationchange&&window.addEvent("orientationchange",this.changeBGImage);
window.addEvent("resize",this.changeBGImage);
W.Theme.addEvent("propertyChange",this.changeBGImage);
this.changeBGImage({type:"init"})
},render:function(){this.sitePagesNode=this._view.getElement("#SITE_PAGES");
if(!this.sitePagesNode){LOG.reportError(wixErrors.SITE_STRUCTURE_NO_SITE_PAGES,"mobile.core.components.SiteStructure","render")
}var e=this.injects().Theme.getProperty("padding1");
e=e.split(" ");
var d="0";
switch(e.length){case 1:d="0 "+e[0];
break;
case 2:case 3:d="0 "+e[1];
break;
case 4:d="0 "+e[1]+" 0 "+e[3];
break
}this.sitePagesNode.setStyle("margin",d)
},_getReformattedBgColor:function(){var d=this.injects().Theme.getProperty("bgSize").split(",");
return{width:d[0],height:d[1]}
},changeBGImage:function(n){var m=this.injects().Utils.getWindowSize();
var f=this._getBestFit(m,this._bgSizes);
var i,d=this.injects().Theme.getProperty("bgType");
switch(d){case b:i=this.injects().Theme.getProperty("BG_DIRECTORY")+"bg_"+f.w+"x"+f.h+".jpg";
$(document.body).setStyle("background",'url("'+i+'") repeat');
break;
case c:var e=this.injects().Config.getServiceTopologyProperty("staticMediaUrl")+"/";
var l=this.injects().Theme.getProperty("bgId");
var k=this._getReformattedBgColor();
var o=k.width;
var g=k.height;
if(o>100){o=f.w;
var j=k.width/k.height;
g=Math.round(o/j)
}var h=e+l+"_crp_0_0_"+k.width+"_"+k.height+"_"+o+"_"+g+"_crp";
$(document.body).setStyle("background",'url("'+h+'") repeat');
break;
default:$(document.body).setStyle("background","")
}i=this.injects().Theme.getProperty("siteBgColor");
$(document.body).setStyle("background-color",i.getHex(false))
},_getWantedBgSize:function(){var p,l,k;
var h=this._getReformattedBgColor();
var n=h.width;
var g=h.height;
var e=this._view.clientWidth;
var m=this._view.clientHeight;
var j=g/n;
var o=m/e;
if(j<o){l=m;
p=l/j
}else{p=e;
l=p*j
}var d=(p>l)?l:p;
for(var f=0;
f<this._bgSizes.length;
f++){if(this._bgSizes[f]>=d){k=this._bgSizes[f];
break
}}return k
},_getBestFit:function(h,g){var f=g[0];
for(var j=1;
j<g.length;
++j){var e=g[j];
var d=e.w-h.width;
var k=f.w-h.width;
if(d>=0){if(k<0){f=g[j]
}else{f=(d<k)?g[j]:f
}}else{if(k<0){f=(d>k)?g[j]:f
}}}return f
}}})
})();
W.Components.newComponent({name:"mobile.core.components.TwitterFollow",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{twitter:{type:"htmlElement"}},propertiesSchema:{showCount:{type:"string","enum":["true","false"],"default":"true",description:"Followers count display"},button:{type:"string","enum":["blue","gray"],"default":"blue",description:"Button color"},textColor:{type:"string","default":"",description:"HEX color code for the text color"},linkColor:{type:"string","default":"",description:"HEX color code for the Username link color"},width:{type:"string","default":"",description:"width of the Follow Button"},align:{type:"string","default":"",description:"alignment of the Follow Button"},dataLang:{type:"string","enum":["en","fr","de","it","es","ko","ja"],"default":"en",description:"The language for the Tweet Button"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(b,a){this.parent(b,a)
},render:function(){this._runTwitterScript();
this._rebuildTwitterElement()
},_onComponentPropertyChange:function(b,a){this._rebuildTwitterElement()
},_rebuildTwitterElement:function(){this._skinParts.twitter.empty();
var b=this._data.get("accountToFollow").replace("@","");
if(!b){b="wix"
}var c={"class":"twitter-follow-button",href:"https://twitter.com/"+b,"data-show-count":this.getComponentProperty("showCount"),"data-button":this.getComponentProperty("button"),"data-text-color":this.getComponentProperty("textColor"),"data-link-color":this.getComponentProperty("linkColor"),"data-lang":this.getComponentProperty("dataLang"),"data-width":this.getComponentProperty("width"),"data-align":this.getComponentProperty("align")};
var a=new Element("a",c);
this._skinParts.twitter.adopt(a);
if(window.twttr!==undefined){twttr.widgets.load()
}},getAcceptableDataTypes:function(){return["TwitterFollow"]
},_runTwitterScript:function(){this.injects().Viewer.loadExternalScript("//platform.twitter.com/widgets.js")
}}});
W.Components.newComponent({name:"mobile.core.components.TwitterTweet",imports:["mobile.core.components.base.BaseComponent"],injects:[],skinParts:{twitter:{type:"htmlElement"}},propertiesSchema:{dataCount:{type:"string","enum":["none","horizontal","vertical"],"default":"horizontal",description:"Count box position"},dataLang:{type:"string","enum":["en","fr","de","it","es","ko","ja"],"default":"en",description:"The language for the Tweet Button"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(b,a){this.parent(b,a)
},render:function(){this._runTwitterScript()
},_onComponentPropertyChange:function(b,a){this._rebuildTwitterElement()
},_rebuildTwitterElement:function(){this._skinParts.twitter.empty();
var b={"class":"twitter-share-button",href:"https://twitter.com/share","data-count":this.getComponentProperty("dataCount"),"data-lang":this.getComponentProperty("dataLang"),"data-url":"","data-via":"","data-text":this._data.get("defaultText"),"data-related":this._data.get("accountToFollow"),"data-counturl":""};
var a=new Element("a",b);
a.set("text","Tweet");
this._skinParts.twitter.adopt(a);
if(window.twttr!==undefined){twttr.widgets.load()
}},getAcceptableDataTypes:function(){return["TwitterTweet"]
},_runTwitterScript:function(){this.injects().Viewer.loadExternalScript("//platform.twitter.com/widgets.js",function(){this._rebuildTwitterElement()
}.bind(this))
}}});
W.Classes.newClass({name:"mobile.core.components.image.ImageDimensions",Class:{Static:{settingOptions:{crop:{FILL:"fill",FULL:"full",STRETCH:"stretch"},align:{LEFT:"left",CENTER:"center",RIGHT:"right"},v_align:{TOP:"top",MIDDLE:"middle",BOTTOM:"bottom"}}},initialize:function(){this._imageSettings={crop:this.settingOptions.crop.FILL,align:this.settingOptions.align.CENTER,v_align:this.settingOptions.v_align.MIDDLE}
},getDimensionsForContainerSize:function(d,e){var c=this._getImageRequestSize(d,e);
var b=this._getImageObjectSize(c,e);
var a=this._getImageLeftPosition(b.x,e.x);
var f=this._getImageTopPosition(b.y,e.y);
return{imageRequestSize:c,imageObjectSize:b,imageVisibleSize:{x:Math.min(e.x,c.x),y:Math.min(e.y,c.y)},imagePosition:{x:a,y:f}}
},_getImageRequestSize:function(d,f){var b=d.x/d.y;
var c=f.x/f.y;
var a,e;
switch(this._imageSettings.crop){case this.settingOptions.crop.FILL:case this.settingOptions.crop.STRETCH:if(b>c){e=f.y;
a=e*b
}else{a=f.x;
e=a/b
}break;
case this.settingOptions.crop.FULL:if(b<c){e=f.y;
a=e*b
}else{a=f.x;
e=a/b
}break
}return{x:Math.ceil(a),y:Math.ceil(e)}
},_getImageObjectSize:function(b,c){var a=b;
if(this._imageSettings.crop===this.settingOptions.crop.STRETCH){a=c
}return a
},_getImageLeftPosition:function(b,c){var a;
switch(this._imageSettings.align){case this.settingOptions.align.LEFT:a=0;
break;
case this.settingOptions.align.CENTER:a=(c/2)-(b/2);
break;
case this.settingOptions.align.RIGHT:a=c-b;
break
}return Math.ceil(a)
},_getImageTopPosition:function(a,b){var c;
switch(this._imageSettings.v_align){case this.settingOptions.v_align.TOP:c=0;
break;
case this.settingOptions.v_align.MIDDLE:c=(b/2)-(a/2);
break;
case this.settingOptions.v_align.BOTTOM:c=b-a;
break
}return Math.ceil(c)
},getCropMode:function(){return this._imageSettings.crop
},getHorizontalAlign:function(){return this._imageSettings.align
},getVerticalAlign:function(){return this._imageSettings.v_align
},setCropMode:function(a){return this._setSettingsProperty(this.settingOptions.crop,"crop",a)
},setHorizontalAlign:function(a){return this._setSettingsProperty(this.settingOptions.align,"align",a)
},setVerticalAlign:function(a){return this._setSettingsProperty(this.settingOptions.v_align,"v_align",a)
},_setSettingsProperty:function(c,a,b){if(this._imageSettings[a]===b||!this._isValueInObject(c,b)){return false
}this._imageSettings[a]=b;
return true
},_isValueInObject:function(a,c){for(var b in a){if(a[b]===c){return true
}}return false
}}});
W.Classes.newClass({name:"mobile.core.components.image.ImageUrl",Class:{getImageUrlExactSize:function(a,d){var b=this.injects().Config.getMediaStaticUrl(d)+d;
var c=this._getFileExtension(b);
return b+"_srz_"+parseInt(a.x,10)+"_"+parseInt(a.y,10)+"_85_22_0.50_1.20_0.00_"+c+"_srz"
},getImageUrlFromPyramid:function(b,g,a,f){var e=this.injects().Config.getMediaStaticUrl(g)+g;
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
W.Classes.newTrait({name:"mobile.core.components.traits.InputFieldEvents",trait:{_bindInputToDataField:function(c,f,e,b){this._boundFields=this._boundFields||[];
this._inputEventHandlersMap=this._inputEventHandlersMap||{};
if(this._boundFields.indexOf(c)==-1){var d=this;
var a=function(k){var h=window.debugMode=="unit_test"&&!k.code;
if(h||!W.Utils.isInputKey(k.code)){return
}var j=d._inputEventHandlersMap[f];
if(j._skinNextInputChange){j._skinNextInputChange=false;
return
}var i=d._data;
var l=d.injects().Utils.convertToHtmlText(c.get("value"));
if(i.get(f)==l){return
}var m=c.get("text")||c.value||"";
if(b!==undefined&&m.length>b){c.set("value",i.get(f));
return
}i.set(f,l);
if(e){i.setMeta("isPreset",false)
}};
if(this._inputEventHandlersMap[f]){var g=this._inputEventHandlersMap[f];
this._stopListeningToInput(g.inputElement,g.changeEventHandler)
}this._inputEventHandlersMap[f]={inputElement:c,eventHandler:a};
this._boundFields.push(c);
this._selectPresetFieldContent(c,f);
this._listenToInput(c,a)
}},_skinNextInputChange:function(a){this._inputEventHandlersMap[a]._skinNextInputChange=true
},_selectPresetFieldContent:function(a){a.addEvent("click",function(b){if(this._data.getMeta("isPreset")){if(!a.get("isSelected")){a.set("isSelected","true");
a.select()
}}}.bind(this));
a.addEvent("blur",function(){a.set("isSelected","")
})
},_listenToInput:function(b,a){b.addEvent("keyup",a);
b.addEvent("cut",a);
b.addEvent("paste",a);
b.addEvent("change",a);
b.addEvent("click",a)
},_stopListeningToInput:function(b,a){b.removeEvent("keyup",a);
b.removeEvent("cut",a);
b.removeEvent("paste",a);
b.removeEvent("change",a);
b.removeEvent("click",a)
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.LinkableComponent",trait:{Binds:["_linkify","renderLinks","_showNavigationDisabledTooltip","_linkableComponentEditModeChanged"],Static:{linkType:{SMS:"SMS",CALL:"CALL",SKYPE:"SKYPE",MAP:"MAP",EMAIL:"EMAIL",FACEBOOK:"FACEBOOK",FLICKR:"FLICKR",BLOGGER:"BLOGGER",MYSPACE:"MYSPACE",LINKEDIN:"LINKEDIN",TWITTER:"TWITTER",TUMBLR:"TUMBLR",YOUTUBE:"YOUTUBE",VIMEO:"VIMEO",PAGE:"PAGE",FREE_LINK:"FREE_LINK",TEXT:"TEXT",DELICIOUS:"DELICIOUS",WEBSITE:"WEBSITE",DOCUMENT:"DOCUMENT",LOGIN:"LOGIN",ADMIN_LOGIN:"ADMIN_LOGIN"},linkTarget:{SAME_WINDOW:"_self",NEW_WINDOW:"_blank"}},initialize:function(){var a=this.render.bind(this);
this.render=function(){a();
this.renderLinks();
if(W.Viewer.getEditorMode()=="PREVIEW"){this._linkableComponentEditModeChanged("PREVIEW")
}};
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._linkableComponentEditModeChanged)
},renderLinks:function(){var c=this.getDataItem();
var a=c.get("href");
var e=c.get("target");
if(e=="same"||e=="self"){e="_self";
c.set("target","_self")
}var b=c.get("linkType");
var d=this._skinParts.link;
this._linkify(b,d,a,e);
if(this._NO_LINK_PROPAGATION){this._disableLinkClickPropagation(d)
}},_disableLinkClickPropagation:function(a){a.addEvent("click",function(b){b.stopPropagation()
})
},_linkify:function(b,c,a,d){if(!c){return
}if(a&&a!==""){c.set("href",a);
c.setStyle("cursor","pointer");
this._setTarget(c,d);
if(this.hasState("noLink","linkableComponent")){this.removeState("noLink","linkableComponent")
}}else{c.setStyle("cursor","default");
c.erase("href");
c.erase("target");
if(this.hasState("noLink","linkableComponent")){this.setState("noLink","linkableComponent")
}}this._handleSpecialCases(b,c)
},_handleSpecialCases:function(a,b){b.removeEvents("click");
switch(a){case this.linkType.LOGIN:b.addEvent("click",function(){if(window.animateForm){var g=this.getDataItem();
var d=g.get("text");
if(d){d=JSON.parse(d);
var i=d.postLoginUrl;
var f=d.postSignupUrl;
var e=d.type;
var h="HTML";
var c=window.userApi?window.userApi.isSessionValid():false;
if(!c){window.animateForm["callOnContent"]([f,i,e,h])
}else{if(i){window.location.href=i
}}}}}.bind(this));
break;
case this.linkType.ADMIN_LOGIN:b.setStyle("cursor","pointer");
b.addEvent("click",function(){this.injects().Commands.executeCommand("WViewerCommands.AdminLogin.Open")
}.bind(this));
break
}},_setTarget:function(a,b){a.set("target",b)
},_linkableComponentEditModeChanged:function(c){if(this._isDisposed===true){return
}var d;
var f=false;
var a=false;
var e=this.getDataItem();
var b=e.get("linkType");
var g=e.get("target");
if(g==this.linkTarget.SAME_WINDOW&&b==this.linkType.WEBSITE){f=true
}if(b==this.linkType.EMAIL){a=true
}d=this._skinParts.link;
if(c=="PREVIEW"){if(f){this._bindPageLeaveWarningToLink(d)
}else{if(a){this._bindMailtoLinks();
this.renderLinks()
}}}else{d.removeEvents("click");
this.renderLinks()
}},_bindMailtoLinks:function(){node=this._skinParts.link;
node.addEvent("click",this._temporaryDisableNavigationWarning)
},_temporaryDisableNavigationWarning:function(a){window.enableNavigationConfirmation=false;
setTimeout(function(){window.enableNavigationConfirmation=true
},50)
},_bindPageLeaveWarningToLink:function(a){a.erase("href");
a.erase("target");
a.addEvent("click",function(b){b.preventDefault();
this._showNavigationDisabledTooltip()
}.bind(this))
},_showNavigationDisabledTooltip:function(){var a={component:this};
this.injects().Commands.executeCommand("linkableComponent.navigateSameWindow",a,this)
}}});
var UNIT_EM="em",UNIT_PX="px",UNIT_PERCENT="%";
W.Classes.newTrait({name:"mobile.core.components.traits.SizeMeasurement",trait:{_initSizeMeasurement:function(a){a=a||{};
this._setSize(a.width,a.height);
this._setUnit(a.unit)
},_getTargetWidth:function(){var a="100%";
if(!isNaN(this._width)){a=Number(this._width)+this._unit
}return a
},_getTargetHeight:function(){var a="100%";
if(!isNaN(this._height)){a=Number(this._height)+this._unit
}return a
},_setRequestedSize:function(){this._view.setStyles({width:this._getTargetWidth(),height:this._getTargetHeight()})
},_getMeasureSize:function(){this._setRequestedSize();
return(this._unit!=UNIT_PX)?this._skinParts.view.getSize():{x:Number(this._width),y:Number(this._height)}
},_setSize:function(b,a){b=(b)?Number(b):this._width;
a=(a)?Number(a):this._height;
if(b!=this._width||a!=this._height){this._width=b;
this._height=a;
return true
}return false
},_setUnit:function(a){a=this.isValidUnit(a)?a:this._unit||UNIT_PERCENT;
if(a!=this._unit){this._unit=a;
return true
}return false
},isValidUnit:function(a){return a==UNIT_EM||a==UNIT_PX||a==UNIT_PERCENT
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.SwipeSupport",trait:{Binds:["_onTouchDown","_onTouchMove","_onTouchUp"],_swipeMovementSpeedProp:"_movementSpeed",_swipeOrientation:"horizontal",_swipeEmulate:false,_swipeLastPos:[],_swipeActive:false,_swipeFrameCount:0,_touchSupported:false,initialize:function(){this._touchSupported="ontouchend" in document||this._swipeEmulate;
if(this._touchSupported){this.addEvent(Constants.ComponentEvents.READY,this._onComponentReady);
this._view.addEvent(!this._swipeEmulate?"touchstart":"mousedown",this._onTouchDown,true);
this._Tween=this.injects().Utils.Tween
}},_onComponentReady:function(){this._skinParts.swipeLeftHitArea.setStyle("display","none");
this._skinParts.swipeRightHitArea.setStyle("display","none")
},_onTouchDown:function(a){this._view.addEvent(!this._swipeEmulate?"touchmove":"mousemove",this._onTouchMove,true);
this._view.addEvent(!this._swipeEmulate?"touchend":"mouseup",this._onTouchUp,true);
this._swipeLastPos=[{x:a.client.x,y:a.client.y,time:new Date().getTime()}];
this._swipeActive=true;
this._swipeFrameCount=0;
this._enableMovement(true)
},_setSwipeMovementSpeed:function(a){this[this._swipeMovementSpeedProp]=a
},_addLastPos:function(a){this._swipeLastPos.unshift(a);
if(this._swipeLastPos.length>5){this._swipeLastPos.pop()
}},_onTouchMove:function(b){b.preventDefault();
var a={x:b.client.x,y:b.client.y,time:new Date().getTime()};
var c=this._getSwipeDistance(a,this._swipeLastPos[0]);
this._shiftOffset-=c;
this._Tween.to(this,1,{_shiftOffset:this._shiftOffset-c,ease:"strong_easeInOut"});
this._addLastPos(a)
},_onTouchUp:function(b){var a={x:b.client.x,y:b.client.y,time:new Date().getTime()};
a=this._swipeLastPos[0];
this._view.removeEvent(!this._swipeEmulate?"touchend":"mouseup",this._onTouchUp,true);
this._view.removeEvent(!this._swipeEmulate?"touchmove":"mousemove",this._onTouchMove,true);
var c=this._calculateSwipeSpeed(this._swipeLastPos[this._swipeLastPos.length-1],a);
this._Tween.killTweensOf(this);
this._setSwipeMovementSpeed(-c*20);
var d={ease:"linear",onComplete:function(){this._enableMovement(false)
}.bind(this)};
d[this._swipeMovementSpeedProp]=0;
this._Tween.to(this,1,d)
},_getSwipeDistance:function(b,a){if(this._swipeOrientation=="horizontal"){return a.x-b.x
}else{if(this._swipeOrientation=="vertical"){return a.y-b.y
}}},_calculateSwipeSpeed:function(b,a){return this._getSwipeDistance(b,a)/(a.time-b.time)
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.TouchRollOverSupport",trait:{Binds:["_onComponentTouchStart","_onStageTouchStart","_onRender","_onComponentReady"],initialize:function(){this._touchSupported="ontouchend" in document||this._swipeEmulate;
if(this._touchSupported){this._states.touchRollOverSupport=["touchRollOver","touchRollOut"];
this.addEvent(Constants.ComponentEvents.READY,this._onComponentReady);
this.addEvent(Constants.ComponentEvents.RENDER,this._onRender)
}},_onComponentReady:function(){this.setState("touchRollOut")
},_onRender:function(){this._view.addEvent("touchstart",this._onComponentTouchStart);
document.addEvent("touchstart",this._onStageTouchStart)
},_onComponentTouchStart:function(a){if(this.getState().indexOf("touchRollOut")!==-1){a.preventDefault();
a.stopPropagation();
this.setState("touchRollOver")
}},_onStageTouchStart:function(a){if(this.getState().indexOf("touchRollOver")!==-1){if(a.target.getParents().indexOf(this._view)===-1&&a.target!==this._view){this.setState("touchRollOut")
}}},dispose:function(){document.removeEvent("touchstart",this._onStageTouchStart);
this.parent()
}}});
W.Classes.newTrait({name:"mobile.core.components.traits.TouchSupport",trait:{_setEventsType:function(){this._touchSupported="ontouchend" in document;
if(this._touchSupported){this._eventNames={down:"touchstart",up:"touchend",move:"touchmove"}
}else{this._eventNames={down:"mousedown",up:"mouseup",move:"mousemove"}
}}}});
W.HtmlScriptsLoader.notifyScriptLoad();