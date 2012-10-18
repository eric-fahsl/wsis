W.Theme.registerDataTypeSchema("TopLevelStyle",{skin:"string",style:"object"});
W.Data.registerDataTypeSchema("Document",{renderModifiers:"object",name:"string",mainPage:"ref",pages:"refList"});
W.Data.registerDataTypeSchema("Page",{title:"string",hideTitle:"boolean",icon:"string",windowTitle:"string",descriptionSEO:"string",metaKeywordsSEO:"string",pageTitleSEO:"string",pageUriSEO:"string",hidePage:"boolean",underConstruction:"boolean",tpaApplicationId:"number"});
W.Data.registerDataTypeSchema("Header",{title:"string",imageSize:{type:"string","default":"medium"},image:"ref"});
W.Data.registerDataTypeSchema("ServiceList",{serviceType:"string",items:"refList"});
W.Data.registerDataTypeSchema("LinkList",{items:"refList",subType:"string"});
W.Data.registerDataTypeSchema("Link",{linkType:{type:"string","default":"FREE_LINK"},href:"string",text:"string",target:"string",icon:"string"});
W.Data.registerDataTypeSchema("TextLink",{linkType:{type:"string","default":"FREE_LINK"},href:"string",text:"string",target:"string",icon:"string"});
W.Data.registerDataTypeSchema("Image",{"extends":"Link",title:"string",uri:"string",description:"string",height:"number",width:"number",borderSize:"string",alt:"string"});
W.Data.registerDataTypeSchema("Service",{title:"string",description:"string",image:"ref"});
W.Data.registerDataTypeSchema("Text",{text:{type:"string","default":"asdf"}});
W.Data.registerDataTypeSchema("RichText",{text:"string",defaultStyle:"string"});
W.Data.registerDataTypeSchema("RichTextImage",{text:"ref",image:"ref"});
W.Theme.registerDataTypeSchema("Theme",{properties:"object"});
W.Theme.registerDataTypeSchema("FlatTheme",{THEME_DIRECTORY:{type:"themeUrl","default":"base"},BG_DIRECTORY:{type:"themeUrl","default":"base"},CONTACT_DIRECTORY:{type:"themeUrl","default":"base"},NETWORKS_DIRECTORY:{type:"themeUrl","default":"base"},EXTERNAL_LINKS_DIRECTORY:{type:"themeUrl","default":"base"},PAGES_DIRECTORY:{type:"themeUrl","default":"base"},WEB_THEME_DIRECTORY:{type:"webThemeUrl","default":"base"},font:{type:"font-family","default":"Arial,sans-serif"},bgId:{type:"imageId","default":"BG_USES_THEME_IMAGE"},bgSize:{type:"size","default":","},bgType:{type:"bgMode","default":"BG_USES_THEME_IMAGE"},siteBgColor:{type:"color","default":"0,0,0,1"},headerTextColor:{type:"color","default":"255,255,255,1"},headerBgColor:{type:"color","default":"0,0,0,0"},textColor:{type:"color","default":"255,255,255,1"},areaBgColor:{type:"color","default":"130,81,13,1"},iconBgColor:{type:"color","default":"255,255,255,1"},borderColor:{type:"color","default":"255,255,255,1"},fontHeader:{type:"font","default":"normal normal bold 2.4em/1.0em [font] {headerTextColor}"},fontTitle:{type:"font","default":"italic normal bold 2.0em/2.0em [font] {siteBgColor}"},fontSubTitle:{type:"font","default":"normal normal bold 1.2em/1.4em [font] {siteBgColor}"},fontButton:{type:"font","default":"normal normal bold 1.4em/2.2em [font] {areaBgColor}"},fontText:{type:"font","default":"normal normal normal 1.1em/1.1em [font] {siteBgColor}"},fontSmallText:{type:"font","default":"normal normal normal 0.5em/0.7em [font] {siteBgColor}"},borderContainer:{type:"border","default":"0.15em solid [borderColor]"},borderThumb:{type:"border","default":"0.15em solid [borderColor]"},borderButton:{type:"border","default":"0.15em solid [borderColor]"},borderIcon:{type:"border","default":"0.15em solid [borderColor]"},radiusContainer:{type:"radius","default":"0.6em 0.6em 0.6em 0.6em"},radiusThumb:{type:"radius","default":"0.6em 0.6em 0.6em 0.6em"},radiusButton:{type:"radius","default":"0.6em 0.6em 0.6em 0.6em"},radiusIcon:{type:"radius","default":"0.6em 0.0em 0.0em 0.6em"},padding1:{type:"padding","default":"1em 1em 1em 1em"},padding2:{type:"padding","default":"0.0em 0.5em 0.0em 0.5em"},padding3:{type:"padding","default":"1.0em 0.0em 1.0em 0.0em"},iconSize:{type:"number","default":"3.2"},bulletSize:{type:"number","default":"1.5"},headerSpacing:{type:"number","default":"0em"},componentSpacing:{type:"number","default":"0.45em"},itemSpacing:{type:"number","default":"0.75em"},thumbSpacing:{type:"number","default":"0.23em"},iconSpacing:{type:"number","default":"0.75em"}});
W.Theme.registerDataTypeSchema("WFlatTheme",{THEME_DIRECTORY:{type:"themeUrl","default":"base"},BG_DIRECTORY:{type:"themeUrl","default":"base"},CONTACT_DIRECTORY:{type:"themeUrl","default":"base"},NETWORKS_DIRECTORY:{type:"themeUrl","default":"base"},EXTERNAL_LINKS_DIRECTORY:{type:"themeUrl","default":"base"},PAGES_DIRECTORY:{type:"themeUrl","default":"base"},WEB_THEME_DIRECTORY:{type:"webThemeUrl","default":"base"},BASE_THEME_DIRECTORY:{type:"webThemeUrl","default":"base"},siteBg:{type:"background","default":"none 0 0 center center auto repeat no-repeat fixed {color_2}"},color:{type:"array",itemType:"color",defaultItems:["#000000","#000000","#FFFFFF","#FF0000","#00FF00","#0000FF","#333333","#666666","#999999","#AAAAAA","#DCDCDC","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF","#FFFFFF"]},font:{type:"array",itemType:"font",defaultItems:["normal normal normal 24px/1.2em Arial {color_5}","normal normal bold 16px/1.1em Arial {color_5}","italic normal bold 18px/1.1em Lobster {color_5}","normal normal bold 22px/1.1em Arial {color_5}","normal normal bold 20px/1.1em Arial {color_5}","normal normal normal 18px/1.3em Arial {color_5}","normal normal normal 16px/1.2em Arial {color_6}","normal normal normal 14px/1.3em Arial {color_6}","normal normal normal 12px/1.3em Arial {color_6}","normal normal normal 10px/1.3em Arial {color_6}","normal normal normal 8px/1.3em Arial {color_6}"]},border:{type:"array",itemType:"border",defaultItems:["0.15em solid [color_0]","0.15em solid [color_0]","0.15em solid [color_0]"]},padding1:{type:"padding","default":"0 0 0 0"},padding2:{type:"padding","default":"0.0em 0.5em 0.0em 0.5em"},padding3:{type:"padding","default":"1.0em 0.0em 1.0em 0.0em"},iconSize:{type:"number","default":"3.2"},bulletSize:{type:"number","default":"1.5"},headerSpacing:{type:"number","default":"0em"},componentSpacing:{type:"number","default":"0.45em"},itemSpacing:{type:"number","default":"0.75em"},thumbSpacing:{type:"number","default":"0.23em"},iconSpacing:{type:"number","default":"0.75em"}});
W.Data.registerDataTypeSchema("ImageList",{items:"refList"});
W.Data.registerDataTypeSchema("TwitterTweet",{defaultText:"string",accountToFollow:"string"});
W.Data.registerDataTypeSchema("TwitterFollow",{accountToFollow:{type:"string","default":"wix"}});
W.Data.registerDataTypeSchema("Button",{label:"resourceKey",toggleMode:"boolean",disabled:"boolean",iconSrc:"string",command:"string",commandParameter:"string",action:"string"});
W.Data.registerDataTypeSchema("MediaItem",{componentType:"string",dateCreated:"string",description:"",fileName:"string",fileSize:"number",height:"number",width:"number",iconURL:"string",mediaType:"string",mimeType:"string",originalFileName:"string",sourceURL:null,tags:null,title:"",version:null});
W.Data.registerDataTypeClass({name:"mobile.core.datatypes.NavigationTreeDataClass",type:"Menu",Class:{Extends:"mobile.core.managers.data.DataItemBase",initialize:function(d,a){var c=d.items;
var b=[];
if(c){this._convertRawItemsToMenuItems(c,b)
}d.items=b;
this.parent(d,a)
},_convertRawItemsToMenuItems:function(c,a){for(var e=0;
e<c.length;
e++){var f=c[e];
var b={refId:f.refId,items:[],type:"MenuItem"};
var d=W.Data.createDataItem(b);
a.push(d);
if(f.items&&f.items.length>0){this._convertRawItemsToMenuItems(f.items,d.get("items"))
}}},getItems:function(){if(!this._data.items){this._data.items=[]
}return this._data.items
},getAllItems:function(){var b=this.getItems();
var a=[];
return this._collectInternalItems(b,a)
},getSubItems:function(c){var b=c.get("items");
var a=[];
return this._collectInternalItems(b,a)
},_collectInternalItems:function(b,a){for(var c=0;
c<b.length;
c++){var d=b[c];
a.push(d);
this._collectInternalItems(d.get("items"),a)
}return a
},getItemByRefId:function(b){var a=this.getItems();
return this._getItemFromItemsByRefId(a,b)
},_getItemFromItemsByRefId:function(c,e){for(var d=0;
d<c.length;
d++){var b=c[d];
if(b.get("refId")==e){return b
}else{if(b.get("items")&&b.get("items").length>0){var a=this._getItemFromItemsByRefId(b.get("items"),e);
if(a){return a
}}}}},addItem:function(b,c,a){if(c){this._addSubItem(b,c,a)
}else{if(typeof a==="number"){this.getItems().splice(a,0,b)
}else{this.getItems().push(b)
}}},_addSubItem:function(d,e,c){var a=this.getItemByRefId(e);
var b=a.get("items");
if(typeof c==="number"){b.splice(c,0,d)
}else{b.push(d)
}},_createNavigationItem:function(b){var a={refId:b,items:[],type:"MenuItem"};
return W.Data.createDataItem(a)
},createAndAddNavigationItem:function(e,d,b){var c=this._createNavigationItem(e);
var a=this.getItemByRefId(d);
this.addItem(c,d,b);
this.fireDataChangeEvent({cause:"CREATED_AND_ADDED",parentItem:a,item:c})
},deleteNavigationItem:function(h){var f=this.getItemByRefId(h);
var c=this.getItemParent(f,this);
var e=c.get("items");
var b=f.get("items");
var d=e.indexOf(f);
if(b){var g=0;
while(b.length>0){var a=b[0];
this._moveItem(a,c,d+g);
g++
}}e.erase(f);
this.fireDataChangeEvent({cause:"DELETE",item:f})
},getItemLevel:function(f,b,g){var c;
if(!b){c=this.getItems()
}else{c=b.get("items")
}if(!g){g=0
}for(var d=0;
d<c.length;
d++){var a=c[d];
if(a==f){return g
}else{if(a.get("items")&&a.get("items").length>0){var e=this.getItemLevel(f,a,g+1);
if(typeof e==="number"){return e
}}}}},moveItemToParentAtIndex:function(a,b,c){this._moveItem(a,b,c);
this.fireDataChangeEvent({cause:"MOVE",parentItem:b,item:a,newIndex:c})
},_moveItem:function(a,b,d){var f=b?b.get("refId"):null;
var c=this.getItemParent(a,this);
var e=c.get("items");
e.erase(a);
this.addItem(a,f,d)
},getItemParent:function(e,f){f=f||this;
var c=f.get("items");
for(var d=0;
d<c.length;
d++){var b=c[d];
if(b==e){return f
}else{if(b.get("items")&&b.get("items").length>0){var a=this.getItemParent(e,b);
if(a){return a
}}}}},isSubItemByRefId:function(c){var b=this.getItemByRefId(c);
var a=this.getItemParent(b);
if(a==this){return false
}return true
},getItemParentByRedId:function(b){var a=this.getItemByRefId(b);
return this.getItemParent(a)
},fireDataChangeEvent:function(a){this._dataManager.markDirtyObject(this);
this._dataManager.flagDataChange();
this.fireEvent(Constants.DataEvents.DATA_CHANGED,a)
},cloneData:function(){var a={};
var b=[];
a.type=this._dataType;
a.metaData=this._data.metaData;
a.id="MAIN_MENU";
this.cloneItems(this.getItems(),b);
a.items=b;
return a
},cloneItems:function(c,a){for(var d=0;
d<c.length;
d++){var e=c[d];
var b=this.cloneSingleItem(e);
a.push(b);
if(e.get("items")&&e.get("items").length>0){this.cloneItems(e.get("items"),b.items)
}}},cloneSingleItem:function(a){return{refId:a.get("refId"),items:[]}
}}});
W.Data.registerDataTypeSchema("MenuItem",{text:"string",refId:"ref",items:"list"});
W.ComponentData.registerDataTypeSchema("PhotoProperties",{imageSize:{type:"string","enum":["small","medium","large"],"default":"medium",description:"size of the image in runtime"}});
W.HtmlScriptsLoader.notifyScriptLoad();