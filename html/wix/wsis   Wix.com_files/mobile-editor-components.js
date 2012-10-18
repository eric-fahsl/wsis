W.Components.newComponent({name:"mobile.editor.components.CategorySelector",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],skinParts:{categoryInputsContainer:{type:"htmlElement"},otherInput:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_otherCategorySelected","_onOtherInputChange","_categorySelected"],initialize:function(c,a,b){this.parent(c,a,b);
this._selectedCategory=null;
this._selectedCategoryIndex=null
},render:function(){var f=this.injects().Resources;
var a=this._skinParts.categoryInputsContainer;
var b=this.getAllCategories();
var d="";
for(var c=0;
c<b.length;
c++){var e=f.get("EDITOR_LANGUAGE",b[c]);
d=d+'<li><label><input rel="'+c+'" type="radio" name="category" value="'+b[c]+'" />'+e+"</label></li>"
}a.innerHTML=d;
this._skinParts.otherRadioInput.value=f.get("EDITOR_LANGUAGE","OTHER")
},getAllCategories:function(){return["PHOTOGRAPHY","FOODNDRINK","ECOMMERCE","CONSULTING","BUSINESS","FASHION","PERSONAL","LIFESTYLE","VCARD","DESIGNNART"]
},getSelectedCategoryName:function(){return this._selectedCategory
},getSelectedCategoryIndex:function(){return this._selectedCategoryIndex
},_onAllSkinPartsReady:function(){this._skinParts.otherRadioInput.addEvent("click",this._otherCategorySelected);
var a=this._skinParts.otherInput;
a.setStyle("visibility","hidden");
a.addEvent("keyup",this._onOtherInputChange);
a.addEvent("cut",this._onOtherInputChange);
a.addEvent("paste",this._onOtherInputChange);
a.addEvent("change",this._onOtherInputChange);
this._skinParts.categoryInputsContainer.addEvent("click",this._categorySelected)
},_otherCategorySelected:function(a){this._skinParts.otherInput.setStyle("visibility","visible");
this._selectedCategory=this._skinParts.otherInput.get("value");
this._validateCategory()
},_categorySelected:function(b){if(b.target.get("tag")!="input"){return
}var a=b.target.get("value");
this._skinParts.otherInput.setStyle("visibility","hidden");
this._selectedCategory=a;
this._selectedCategoryIndex=b.target.get("rel");
this._validateCategory()
},_onOtherInputChange:function(a){this._selectedCategory=a.target.get("value");
this._selectedCategoryIndex=a.target.get("rel");
this._validateCategory()
},_validateCategory:function(){if(this._selectedCategory!==null&&this._selectedCategory!==""){this.fireEvent("validation",true)
}else{this.fireEvent("validation",false)
}},_selectedIndex:function(a){var b=this.getAllCategories();
for(var c=0;
c<b.length;
c++){if(b[c]==this._selectedCategory){return c
}}}}});
W.Components.newComponent({name:"mobile.editor.components.ColorButton",skinParts:{},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["openColorPicker","_onPickerFetched","_onColorPickerChange","_onColorPickerClose"],initialize:function(c,b,a){this.parent(c,b,a);
this._isAlphaEnabled=true;
this._isHexEnabled=false;
this.setColor("#000000")
},render:function(){this.setHexDisplay(this._isHexEnabled)
},_onAllSkinPartsReady:function(a){this._skinParts.view.addEvent("click",this.openColorPicker)
},setColor:function(a){this._color=new W.Color(a);
if(this._skinParts){if(this._skinParts.bg){this._skinParts.bg.setStyles({"background-color":this._color.getHex()});
if(!window.Browser.ie){this._skinParts.bg.setStyle("opacity",this._color.getAlpha())
}else{this._skinParts.bg.setStyle("filter","alpha(opacity="+this._color.getAlpha()*100+")")
}}var b=this._color.getInvertColor()
}},setSize:function(b,a){if(b){this._view.setStyle("width",b)
}if(a){this._view.setStyle("height",a)
}},enableAlpha:function(a){this._isAlphaEnabled=a;
if(!a&&this._color){this._color.setAlpha(1);
this.setColor(this._color)
}},setHexDisplay:function(a){this._isHexEnabled=a
},openColorPicker:function(a){this._initColor=new W.Color(this._color);
this.injects().Editor.getColorPicker(this._onPickerFetched,{color:this._color,allowAlpha:this._isAlphaEnabled,event:a});
this.fireEvent("click")
},_onPickerFetched:function(a){this._colorPicker=a;
this._onColorPickerChange({color:new W.Color(this._color)});
this._colorPicker.addEvent("change",this._onColorPickerChange);
this._colorPicker.addEvent("close",this._onColorPickerClose)
},_onColorPickerChange:function(a){this.setColor(a.color);
this.fireEvent("change",{color:a.color,cause:"temp"})
},_onColorPickerClose:function(c){var a=(c.cause!="ok"&&c.cause!="blur");
var d=a?this._initColor:c.color;
var b=a?"cancel":"select";
this.setColor(d);
this.fireEvent("change",{color:d,cause:b})
},getColor:function(){return this._color
}}});
W.Components.newComponent({name:"mobile.editor.components.ColorPicker",skinParts:{header:{type:"htmlElement",autoBindDictionary:"SELECT_COLOR_DIALOG_TITLE"},xButton:{type:"htmlElement",command:"this._closeCommand",commandParameter:"cancel"},okBtn:{type:"mobile.editor.components.EditorButton",command:"this._closeCommand",commandParameter:"ok",autoBindDictionary:"SELECT_COLOR"},cancelBtn:{type:"mobile.editor.components.EditorButton",command:"this._closeCommand",commandParameter:"cancel",autoBindDictionary:"CANCEL_BUTTON"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_recalculateByBoxAndSlider","_onBlur","_onHexChanged"],initialize:function(b,a){this.parent(b,a);
this._color=new W.Color("#FF0000");
this._colorFullSL=this._createFullSLColor(this._color);
this._isAlphaEnabled=true;
this._view.addClass("z-colorpicker");
this._closeCommand=this.injects().Commands.createCommand("cp")
},render:function(){this._skinParts.cancelBtn.setLabel(this.injects().Resources.get("EDITOR_LANGUAGE","CANCEL_BUTTON"));
this._skinParts.okBtn.setLabel(this.injects().Resources.get("EDITOR_LANGUAGE","OK_BUTTON"));
var a=this.injects().Theme;
var c=this.injects().Resources;
var b=this._skinParts;
b.SOverlay.set("src",a.getProperty("THEME_DIRECTORY")+"colorPicker/s_overlay.png");
b.LOverlay.set("src",a.getProperty("THEME_DIRECTORY")+"colorPicker/l_overlay.png");
b.hueBg.set("src",a.getProperty("THEME_DIRECTORY")+"colorPicker/hue.png");
b.cancelBtn.setState("grayed","status");
this._measureGUI();
this.setOriginalColor(this._color);
this._setFunctionality();
this._syncToColor();
this.setPosition(0,0);
this.close()
},getColor:function(){return new W.Color(this._color)
},setColor:function(b,a){this._color=new W.Color(b);
this._colorFullSL=this._createFullSLColor(b);
if(a){this.setOriginalColor(this._color)
}this._syncToColor("newColor")
},getOriginalColor:function(){return new W.Color(this._colorOrigin)
},setOriginalColor:function(a){this._colorOrigin=new W.Color(a);
var b=(this._colorOrigin.getAlpha()===0)?0.01:this._colorOrigin.getAlpha();
this._setBgColor(this._skinParts.originColor,this._colorOrigin.getHex(false),b,true)
},setPosition:function(a,b){if(a){this._view.setStyle("left",a)
}if(b){this._view.setStyle("top",b)
}},enableAlpha:function(a){this._isAlphaEnabled=a;
if(!a&&this._color){this._color.setAlpha(1);
this._syncToColor("alphaToggle");
this._skinParts.alphaController.hide()
}else{this._skinParts.alphaController.show()
}},open:function(){this.uncollapse();
$(document.body).addEvent("click",this._onBlur);
this._closeCommand.registerListener(this,this._onClose)
},close:function(a){this.collapse();
$(document.body).removeEvent("click",this._onBlur);
this.fireEvent("close",{cause:a,color:this._color});
this._closeCommand.dispose()
},_onBlur:function(){this.close("blur")
},_onHexChanged:function(){var a=this._skinParts.HexInput.value;
if(a===this._color.getHex()){return
}this._color.setHex(a);
this._colorFullSL.setHex(a);
this._syncToColor("HexInput")
},_syncToColor:function(c){var a,d,b=(c=="alphaInput"||c=="newColor");
if(!this._isAlphaEnabled){this._color.setAlpha(1)
}this._setBgColor(this._skinParts.SLBoxSolidColor,this._colorFullSL.getHex(false),this._color.getAlpha(),b);
if(c!="HSPointer"||c=="newColor"){a=((this._color.getSaturation()/100)*this._slSize.x)-+this._slPointerHalfSize;
d=(this._slSize.y-((this._color.getLuminous()/100)*this._slSize.y))-this._slPointerHalfSize;
this._skinParts.HSPointer.setStyles({left:a,top:d})
}if(c!="hueBar"||c=="newColor"){d=(this._colorFullSL.getHue()/360)*(this._hueSliderHeight-this._hueSliderBarHeight);
this._skinParts.hueBar.setStyle("top",d)
}if(c!="alphaInput"){this._skinParts.alphaInput.value=Math.round(this._color.getAlpha()*100)
}if(c!="HInput"){this._skinParts.HInput.value=Math.round(this._color.getHue())
}if(c!="SInput"){this._skinParts.SInput.value=Math.round(this._color.getSaturation())
}if(c!="LInput"){this._skinParts.LInput.value=Math.round(this._color.getLuminous())
}if(c!="HexInput"){this._skinParts.HexInput.value=this._color.getHex().substr(1)
}this._setBgColor(this._skinParts.currentColor,this._color.getHex(false),this._color.getAlpha(),b);
this.fireEvent("change",{color:this._color})
},_setBgColor:function(b,a,c,d){b.setStyle("background-color",a);
if(d){if(!window.Browser.ie){b.setStyle("opacity",c)
}else{b.setStyle("filter","alpha(opacity="+c*100+")")
}}},_measureGUI:function(){this._slPointerHalfSize=this._skinParts.HSPointer.getSize().x/2;
this._slSize=this._skinParts.SLBox.getSize();
this._hueSliderHeight=this._skinParts.hueSlider.getSize().y;
this._hueSliderBarHeight=this._skinParts.hueBar.getSize().y
},_setFunctionality:function(){var b,a;
this._headerDrag=new Drag.Move(this._skinParts.view,{snap:0,handle:this._skinParts.dragArea});
this._skinParts.view.addEvent("click",function(d){d.stop()
});
this._skinParts.HexInput.addEvent("keyup",this._onHexChanged);
this._skinParts.HexInput.addEvent("paste",this._onHexChanged);
this._slPointerDrag=new Drag.Move(this._skinParts.HSPointer,{limit:{x:[(0-this._slPointerHalfSize),(this._slSize.x-this._slPointerHalfSize)],y:[(0-this._slPointerHalfSize),(this._slSize.y-this._slPointerHalfSize)]},onDrag:this._recalculateByBoxAndSlider,snap:0});
this._skinParts.SLBox.addEvent("mousedown",function(d){d=new Event(d);
this._skinParts.HSPointer.setStyles({top:d.page.y-this._skinParts.SLBox.getTop()-this._slPointerHalfSize,left:d.page.x-this._skinParts.SLBox.getLeft()-this._slPointerHalfSize});
this._slPointerDrag.start(d);
this._recalculateByBoxAndSlider()
}.bind(this));
var c=this._skinParts.hueBar.getStyle("left").toInt();
c=(isNaN(c))?0:c;
this._hueSliderDrag=new Drag.Move(this._skinParts.hueBar,{limit:{x:[c,c],y:[0,(this._hueSliderHeight-this._hueSliderBarHeight)]},onDrag:this._recalculateByBoxAndSlider,snap:0});
this._skinParts.hueSlider.addEvent("mousedown",function(d){d=new Event(d);
this._skinParts.hueBar.setStyle("top",(d.page.y-this._skinParts.hueSlider.getTop()));
this._hueSliderDrag.start(d);
this._recalculateByBoxAndSlider()
}.bind(this));
this._setInputFunctionality(this._skinParts.alphaInput,0,100,100,function(d){this._color.setAlpha(d/100);
this._syncToColor("alphaInput")
}.bind(this));
this._setInputFunctionality(this._skinParts.HInput,0,359,359,function(d){if(d===this._color.getHue()){return
}this._color.setHue(d);
this._colorFullSL.setHue(d);
this._syncToColor("HInput")
}.bind(this));
this._setInputFunctionality(this._skinParts.SInput,0,100,100,function(d){if(d===this._color.getSaturation()){return
}this._color.setSaturation(d);
this._syncToColor("SInput")
}.bind(this));
this._setInputFunctionality(this._skinParts.LInput,0,100,100,function(d){if(d===this._color.getLuminous()){return
}this._color.setLuminous(d);
this._syncToColor("LInput")
}.bind(this));
this._skinParts.originColor.addEvent("click",function(){this.setColor(this._colorOrigin)
}.bind(this));
this._skinParts.originColor.setStyle("cursor","pointer")
},_setInputFunctionality:function(c,d,a,b,f){var e=function(i){i.stop();
var g,h=c.value.toInt();
h=Math.round(Number((isNaN(h))?b:h));
if(i.type==Element.Events.mousewheel.base){h+=(i.wheel!=-1)?1:-1
}g=Math.min(h,a);
g=Math.max(g,d);
if(g!=h||i.type==Element.Events.mousewheel.base){c.value=g
}f(g)
}.bind(this);
c.addEvents({keyup:e,mousewheel:e})
},_recalculateByBoxAndSlider:function(d){this._headerDrag.stop();
var c=((this._skinParts.HSPointer.getStyle("left").toInt()+this._slPointerHalfSize)/this._slSize.x)*100;
var a=100-(((this._skinParts.HSPointer.getStyle("top").toInt()+this._slPointerHalfSize)/this._slSize.y)*100);
var b=((this._skinParts.hueBar.getStyle("top").toInt())/(this._hueSliderHeight-this._hueSliderBarHeight))*360;
this._color.setHsl([b,c,a]);
this._colorFullSL.setHue(b);
this._syncToColor()
},_createFullSLColor:function(b){var a=new W.Color(b);
a.setSaturation(100);
a.setLuminous(100);
return a
},_onClose:function(a){this.close(a)
}}});
W.Components.newComponent({name:"mobile.editor.components.CongratsController",imports:["mobile.editor.components.EditorButton"],skinParts:{header:{type:"htmlElement",autoBindDictionary:"FINISH_DIALOG_HEADER"},subHeader:{type:"htmlElement",autoBindDictionary:"SUB_DIALOG_HEADER"},addressLabel:{type:"htmlElement",autoBindDictionary:"MOBILE_SITE_ADDRESS"},mobileAddress:{type:"htmlElement"},qrCode:{type:"htmlElement"},qrCorrelatingUrl:{type:"htmlElement"},templateSiteIdCnt:{type:"htmlElement"},templateSiteId:{type:"htmlElement"},sendButtonLabel:{type:"htmlElement",autoBindDictionary:"SEND_ADDRESS"},myAccountLabelPart1:{type:"htmlElement",autoBindDictionary:"MY_ACCOUNT_PART_1"},myAccountLink:{type:"htmlElement",autoBindDictionary:"MY_ACCOUNT_LINK"},myAccountLabelPart2:{type:"htmlElement",autoBindDictionary:"MY_ACCOUNT_PART_2"},sendButtonStatusLabel:{type:"htmlElement"},sendButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"SEND_BUTTON"},backButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"BACK_BUTTON",command:"EditorCommands.GoToEditPage",commandParameter:wixEvents.BACK_TO_EDIT_FROM_CONGRATS}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_sendButtonClick"],render:function(){var a=window.siteHeader;
var c=this.injects().Resources;
this._skinParts.sendButtonStatusLabel.hide();
var b=this.injects().Editor.isStandalone();
if(b){this._skinParts.myAccountLink.set("href","http://mobile.wix.com/my-account")
}else{this._skinParts.myAccountLink.set("href","http://www.wix.com/create/my-account")
}},_onAllSkinPartsReady:function(a){a.sendButton.addEvent("buttonClick",this._sendButtonClick);
this.injects().Viewer.addEvent("pageTransitionEnded",this._editorNavigationHandler.bind(this))
},_editorNavigationHandler:function(){if(this.injects().Viewer.getCurrentPageId()=="congrats_page"){this._siteUrl="http://m.wix.com/"+siteHeader.username+"/"+siteHeader.siteName;
this._skinParts.mobileAddress.set("href",this._siteUrl);
this._skinParts.mobileAddress.set("html",this._siteUrl);
if(window.debugMode=="debug"||window.debugMode=="theme"){this._createQRCode()
}if(window.debugMode=="theme"){var a=siteHeader.id;
this._skinParts.templateSiteId.set("value",a);
this._skinParts.templateSiteId.set("readonly","readonly");
this._skinParts.templateSiteIdCnt.uncollapse()
}else{this._skinParts.templateSiteIdCnt.collapse();
this._skinParts.qrCode.collapse();
this._skinParts.qrCorrelatingUrl.collapse()
}}},_createQRCode:function(){var c=window.location.search;
this._skinParts.templateSiteIdCnt.collapse();
var a="";
if(c.indexOf("ip=")!=-1){var b=c.substr(c.indexOf("ip=")+3);
if(b.indexOf("&")!=-1){b=b.substr(0,b.indexOf("&"))
}a="http://"+b+"/services/wix-html-public/doc"
}else{a=window.location.origin;
if(a.indexOf("http://dev")!=-1){this._skinParts.qrCode.collapse();
this._skinParts.qrCorrelatingUrl.collapse();
return
}a=a.substr(a.indexOf("."));
a="http://m"+a
}var e="http://qrcode.kaywa.com/img.php?s=6&d=";
var d=a+"/"+siteHeader.username+"/"+siteHeader.siteName;
this._skinParts.qrCorrelatingUrl.set("href",d);
this._skinParts.qrCorrelatingUrl.set("html",d);
this._skinParts.qrCode.set("src",e+d)
},_sendButtonClick:function(){var a=this.injects().Resources;
this.injects().ServerFacade.sendAddressToMail(siteHeader.id,function(){this._skinParts.sendButtonStatusLabel.set("html",a.get("EDITOR_LANGUAGE","SEND_SUCCESS"));
this._skinParts.sendButtonStatusLabel.show();
this._skinParts.sendButton.hide();
this.injects().Utils.callLater(this._returnSendButton,[],this,5000)
}.bind(this),function(){this._skinParts.sendButtonStatusLabel.set("html",a.get("EDITOR_LANGUAGE","SEND_ERROR"));
this.injects().Utils.callLater(this._returnSendButton,[],this,5000)
}.bind(this));
this._skinParts.sendButtonStatusLabel.show();
this._skinParts.sendButton.hide();
this._skinParts.sendButtonStatusLabel.set("html",a.get("EDITOR_LANGUAGE","SENDING"));
LOG.reportEvent(wixEvents.EMAIL_SEND)
},_returnSendButton:function(){this._skinParts.sendButtonStatusLabel.hide();
this._skinParts.sendButton.show()
},getAcceptableDataTypes:function(){return["","Document"]
}}});
W.Components.newComponent({name:"mobile.editor.components.DataPanelActionBar",skinParts:{addBtn:{type:"mobile.core.components.Button",autoBindDictionary:"ADD_COMPONENT"},dataBtn:{type:"mobile.core.components.Button",autoBindDictionary:"EDIT_DATA_MODE"},compBtn:{type:"mobile.core.components.Button",autoBindDictionary:"EDIT_COMPONENT_MODE"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["comp","data"],Binds:["_setMode","_openAddButtonDialog","_onComponentSelected"],initialize:function(c,b,a){this.parent(c,b,a);
this.setState("data")
},_onAllSkinPartsReady:function(){this._skinParts.addBtn.addEvent("click",this._openAddButtonDialog);
this._skinParts.compBtn.addEvent("click",function(){this._setMode("comp")
}.bind(this));
this._skinParts.dataBtn.addEvent("click",function(){this._setMode("data")
}.bind(this));
this._onStateChange(this.getState())
},_onStateChange:function(a){if(this._skinParts){if(a=="comp"){this._skinParts.compBtn.setState("selected");
this._skinParts.dataBtn.setState("up")
}else{this._skinParts.compBtn.setState("up");
this._skinParts.dataBtn.setState("selected")
}}},_openAddButtonDialog:function(){this.injects().EditorDialogs.openAddComponentDialog(this._onComponentSelected)
},_setMode:function(a){this.fireEvent("modeToggle",a)
},_onComponentSelected:function(a){this.injects().Editor.addComponentToCurrentPage(a)
}}});
W.Components.newComponent({name:"mobile.editor.components.DataPanelsContainer",skinParts:{},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{editMode:["comp","data"],arrange:["arrangeOn","arrangeOff"]},Binds:["focusItem","moveItem","exitCompMode","setMode","deleteItem"],initialize:function(c,a,b){this.parent(c,a,b);
this._pagePanelsMap={};
this._currentPageNode=null;
this._currentState="data";
this.parent(c,a)
},openPanel:function(){this.uncollapse()
},closePanel:function(){this.collapse()
},pageExists:function(a){return(this._pagePanelsMap[a]!==undefined)
},addComponentsToPage:function(d,a){var b=this._pagePanelsMap[d];
var g=true;
for(var e=0;
e<a.length;
e++){var h=a[e];
var c=h.getDataItem()!==undefined?h.getDataItem().getType():null;
var f=this.injects().Editor.getDataPanel(c,h.className);
if(f){if(!b.getChildren().length&&d!="HeaderDataPanelContainer"){var k=this.injects().Components.createComponent("mobile.editor.components.DataPanelActionBar","mobile.editor.skins.DataPanelActionBarSkin",null,null,function(j){j.addEvent("modeToggle",this.setMode);
this._updateCompPositionStatus()
}.bind(this),function(l){var m=l._view;
var j=m.getStyle("height");
var n=j&&j[0]&&(j[0].toInt()+m.getPosition().y);
if(n!=200){}n=270;
this._visiblePoint=n
}.bind(this),null);
var i=new Element("div");
i.className="headerSectionContainer sectionContainer z-header";
b.appendChild(i);
if(h.className==="mobile.core.components.PageTitle"){this._createPanel(f,h,i,g);
i.getFirst().addClass("first");
b.addClass("hasHeaderContainer")
}if(h.className!=="mobile.core.components.Header"){k.insertInto(i)
}if(h.className!=="mobile.core.components.PageTitle"){this._createPanel(f,h,b,g)
}this._updateCompPositionStatus()
}else{this._createPanel(f,h,b,g);
this._updateCompPositionStatus()
}g=false
}}},setPanels:function(a,b){this._currentState="data";
if(this._currentPageNode){this._currentPageNode.collapse()
}if(this._pagePanelsMap[a]){this._currentPageNode=this._pagePanelsMap[a]
}else{this._pagePanelsMap[a]=this._addPageContainer(a);
this.addComponentsToPage(a,b)
}this._currentPageNode.uncollapse();
this.setState(this._currentState,"editMode")
},exitCompMode:function(){this.setState("data","editMode")
},setMode:function(a){this.setState((a=="comp")?"comp":"data","editMode")
},deleteItem:function(d){LOG.reportEvent(wixEvents.REMOVE_COMPONENT);
var c=d.panelNode;
var a=c.getParent();
var h=a.getChildren();
var g=h.indexOf(c);
var f=d.compNode;
c.destroy();
f.destroy();
this.fireEvent("deleteCompItem");
this.injects().Preview.flagPreviewDataChange();
this._updateCompPositionStatus();
var e=h.length;
if(g==(e-1)&&e>2){var b=h[h.length-2];
if(b&&b.getLogic){b.getLogic().focus()
}}},moveItem:function(c){LOG.reportEvent(wixEvents.REORDER_COMPONENT);
var f=(c.dir=="up")?-1:1;
var h=c.panelNode;
var a=c.compNode;
var d=h.getParent();
var e=d.getChildren();
var j=e.indexOf(h);
var i=j+f;
var g=e[i];
var b=function(m,n,l){m.insertInto(d)
};
if(i>0&&this._isComponentPanel(g)&&this._isComponentPanel(h)){e[j]=g;
e[i]=h;
e.forEach(b);
d=a.getParent();
e=d.getChildren();
var k=g.getLogic().getComponent().getViewNode();
j=e.indexOf(a);
i=e.indexOf(k);
e[j]=k;
e[i]=a;
e.forEach(b)
}this._updateCompPositionStatus();
this.injects().Preview.flagPreviewDataChange()
},focusItem:function(b,d){d=d||this._currentPageNode;
var a=d.getChildren();
for(var c=0;
c<a.length;
++c){var e=a[c];
if(e.hasClass("sectionContainer")){this.focusItem(b,e)
}if(this._isComponentPanel(e)){if(b.panelNode===e){e.getLogic().setState("focus","selected");
if(e.getPosition().y-this.injects().Viewer.getScrollTop()<this._visiblePoint){window.scrollTo(0,e.getPosition().y-this._visiblePoint-100)
}}else{e.getLogic().setState("blur","selected")
}}}},_onStateChange:function(a){this._setEditMode(a)
},_setEditMode:function(f,d){this._currentState=(f=="data"||f=="comp")?f:"data";
d=d||this._currentPageNode;
if(this._currentState=="comp"&&tinyMCE.selectedInstance){tinyMCE.selectedInstance.remove()
}var b=d.getChildren();
for(var c=0;
c<b.length;
++c){var e=b[c];
if(e.hasClass("sectionContainer")){this._setEditMode(f,e)
}if(this._isComponentPanel(e)){e.getLogic().setEditState(f)
}else{if(e.getLogic&&e.get("comp")=="mobile.editor.components.DataPanelActionBar"){e.getLogic().setState(f)
}}}var a=(f=="comp");
d.toggleClass("compMode",a)
},_addPageContainer:function(a){var b=new Element("div",{id:a});
this._currentPageNode=b;
this._pagePanelsMap[a]=b;
b.insertInto(this._view);
return b
},_createPanel:function(c,a,b,d){var f={previewComponent:a,dataPanelLogic:c.logic,dataPanelSkin:c.skin,initEditMode:this._currentState,disableComponentEditState:(b.getChildren().length===0&&a.className=="mobile.core.components.PageTitle"),disableDelete:(a.className=="mobile.core.components.SiteMenu")};
var e=this.injects().Components.createComponent("mobile.editor.components.editpanels.DataPanelWrapper","mobile.editor.skins.editpanels.DataPanelWrapperSkin",null,f,null,function(g){g.addEvent("move",this.moveItem);
g.addEvent("exitCompMode",this.exitCompMode);
g.addEvent("deleteComponent",this.deleteItem);
g.addEvent("focusItem",this.focusItem);
if(d){if(g.getState().indexOf("data")!=-1){g.getDataPanel().focus()
}else{g.focus()
}}}.bind(this));
e.insertInto(b)
},_updateCompPositionStatus:function(){if(this._currentPageNode){var b=this._currentPageNode.getChildren();
var d,a;
for(var c=1;
c<b.length;
++c){var e=b[c];
if(e.get("comp")=="mobile.editor.components.editpanels.DataPanelWrapper"){e.removeClass("first").removeClass("middle").removeClass("last");
if(!d){e.addClass("first");
d=e
}else{e.addClass("middle")
}a=e
}}if(a){a.addClass("last").removeClass("middle")
}}},_isComponentPanel:function(a){return Boolean(a&&a.getLogic&&a.getLogic().isDataPanelWrapper&&a.getLogic().isDataPanelWrapper())
}}});
W.Components.newComponent({name:"mobile.editor.components.DataPanelsNavigation",skinParts:{nextButton:{type:"mobile.editor.components.EditorButton",command:"SitePageControl.next"},prevButton:{type:"mobile.editor.components.EditorButton",command:"SitePageControl.prev"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_onAllSkinPartsReady:function(b){var a=this._skinParts.prevButton;
a.setState("grayed");
a.setLabel("Previous page");
this._skinParts.nextButton.setLabel("Next page")
},openPanel:function(){this.uncollapse()
},closePanel:function(){this.collapse()
}}});
W.Components.newComponent({name:"mobile.editor.components.EditAnalytics",skinParts:{title:{type:"htmlElement"},description:{type:"htmlElement"},stats_paragraph_a:{type:"htmlElement"},stats_paragraph_b:{type:"htmlElement"},stats_paragraph_c:{type:"htmlElement"},faq:{type:"htmlElement"},faqToggle:{type:"htmlElement"},faqContent:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_renderTriggers:[Constants.DisplayEvents.DISPLAY_CHANGED],Binds:["_noDataRender"],_states:["freeUser","premiumUser","nullDocumentData","toggleFaq"],initialize:function(c,b,a){this.parent(c,b,a)
},_addPremiumUrl:function(a){siteHeader.creationSource.toLowerCase()=="web"?a.targetUrl="https://premium.wix.com/wix/api/packagePicker?wsess=510b780f-2ef4-4156-be03-e04a9615cd36":a.targetUrl="https://premium.wix.com/wix/api/packagePickerMobile?wsess=3693206d-09f0-46d3-9dd6-65c487a21336";
a.targetWindow="_blank";
return a
},_onAllSkinPartsReady:function(){this._skinParts.faq.addEvent("click",this._toggleFaq);
this.setTitleAndDescription();
this.setFooter()
},render:function(){this.injects().ServerFacade.getPremiumFlag(function(a){if(a===null){this.setState("nullDocumentData")
}else{if(!a){this.setState("freeUser")
}else{if(a){this.setState("premiumUser")
}}}this.setExposition()
}.bind(this));
W._validateJsonp=setTimeout(this._noDataRender,500)
},_noDataRender:function(){this.setState("nullDocumentData");
this.setExposition()
},setTitleAndDescription:function(){this._skinParts.title.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","google_analytics_title"));
this._skinParts.description.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","google_analytics_description"))
},setExposition:function(){this._skinParts.stats_paragraph_a.set("html",this._getLangByState("stats_paragraph_a"));
this._skinParts.stats_paragraph_b.set("html",this._getLangByState("stats_paragraph_b"));
if(this.getState()=="nullDocumentData"){this._skinParts.stats_paragraph_c.set("html",this._getLangByState("stats_paragraph_c"))
}},setFooter:function(){this._skinParts.faq.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","googleAnalyticsFAQ"));
this._skinParts.faqContent.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","googleAnalyticsFAQ_content"))
},_getLangByState:function(a){return this.injects().Resources.get("EDITOR_LANGUAGE",a+"_"+this.getState())
},_toggleFaq:function(){var a=this.getParent().getLogic()._skinParts.faqToggle;
a.isCollapsed()?a.uncollapse():a.collapse()
}}});
W.Components.newComponent({name:"mobile.editor.components.EditDesignBackground",skinParts:{bgActionContainer:{type:"htmlElement"},mediaBg:{type:"htmlElement",autoBindDictionary:"mediaBg"},bgColor:{type:"htmlElement",autoBindDictionary:"bgColor"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onBgColorSelect","_colorPickerReady","_previewThemePropChange","_bgColorOpen","_bgImgOpen"],initialize:function(c,b,a){this.parent(c,b,a);
this._bgColorItem=""
},render:function(){this._skinParts.mediaBg.addEvent("click",this._bgImgOpen);
this._skinParts.bgColor.addEvent("click",this._bgColorOpen)
},_previewThemePropChange:function(a){if(a.name=="siteBgColor"&&this._skinParts&&this._skinParts.bgColor){this._skinParts.bgColor.setStyle("background-color",a.newVal.toString());
this._bgColorItem=a.newVal
}},_onBgColorCreate:function(a){this._bgColorItem=this.injects().Preview.getPreviewThemeProperty("siteBgColor");
a.setStyle("background-color",this._bgColorItem.getHex())
},_onBgImgCreate:function(a){},_bgImgOpen:function(a){a.preventDefault(a);
this._saveStatus();
W.EditorDialogs.openMediaDialog(this._onImgSelect,false,"Photos",["UserMedia","Backgrounds"])
},_bgColorOpen:function(a){a.preventDefault(a);
this._saveStatus();
this.injects().Editor.getColorPicker(this._colorPickerReady,{color:this._bgColorItem,event:a})
},_saveStatus:function(){this._initBgType=this.injects().Preview.getPreviewThemeRawProperty("bgType");
this._initBgColor=this.injects().Preview.getPreviewThemeRawProperty("siteBgColor");
this._initBgId=this.injects().Preview.getPreviewThemeRawProperty("bgId");
this._initBgDir=this.injects().Preview.getPreviewThemeRawProperty("BG_DIRECTORY")
},_resetStatus:function(){this.injects().Preview.setPreviewThemeProperty("bgType",this._initBgType);
this.injects().Preview.setPreviewThemeProperty("siteBgColor",this._initBgColor);
this.injects().Preview.setPreviewThemeProperty("bgId",this._initBgId);
this.injects().Preview.setPreviewThemeProperty("BG_DIRECTORY",this._initBgDir)
},_colorPickerReady:function(a){this.picker=a;
this._onBgColorSelect({color:new W.Color(this._bgColorItem)});
a.addEvent("change",this._onBgColorSelect);
a.addEvent("close",this._onBgColorClose.bind(this))
},_onBgColorSelect:function(a){a=a.color.getHex();
this.injects().Preview.setPreviewThemeProperty("bgType","BG_USES_CUSTOM_COLOR");
this._skinParts.bgColor.setStyle("background-color",a);
this.injects().Preview.setPreviewThemeProperty("siteBgColor",a)
},_onBgColorClose:function(a){if(a.cause!="ok"){this._skinParts.bgColor.setStyle("background-color",this._bgColorItem);
this._resetStatus()
}if(a.cause=="ok"){this._bgColorItem=a.color
}},_onImgSelect:function(a){this.injects().Preview.getPreviewManagers().Theme.setProperty("bgType","BG_USES_CUSTOM_IMAGE");
this.injects().Preview.setPreviewThemeProperty("bgSize",a.width+","+a.height);
this.injects().Preview.setPreviewThemeProperty("bgId",a.uri)
},setSiteLoaded:function(){this._bgColorItem=this.injects().Preview.getPreviewThemeProperty("siteBgColor");
this._onBgImgCreate(this._skinParts.mediaBg);
this._onBgColorCreate(this._skinParts.bgColor);
this.injects().Preview.addEventForPreviewThemePropertyChange(this._previewThemePropChange)
}}});
W.Components.newComponent({name:"mobile.editor.components.EditDesignColor",skinParts:{title:{type:"htmlElement",autoBindDictionary:"editDesignColorSubTitle"},resetBtn:{type:"htmlElement",autoBindDictionary:"RESET"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_resetColors"],initialize:function(c,b,a){this.parent(c,b,a);
this._promptBeforeResetColors=true
},_onAllSkinPartsReady:function(){this._skinParts.resetBtn.addEvent("click",this._resetColors)
},setSiteLoaded:function(){this._skinParts.colors.empty();
this._itemsArray=[];
this._itemsAmount=0;
var a=this._data.get("properties");
for(var b in a){this._itemsAmount++;
this._addColorItem(b,a[b].allowAlpha)
}},_addColorItem:function(c,a){var b=this.injects().Components.createComponent("mobile.editor.components.internal.EditDesignColorItem","mobile.editor.skins.internal.EditDesignColorItemSkin",undefined,{colorProp:c,allowAlpha:a},undefined,function(d){this._colorItemReady(d)
}.bind(this));
b.insertInto(this._skinParts.colors)
},_colorItemReady:function(a){this._itemsArray.push(a);
if(this._itemsArray.length==this._itemsAmount){this._renderIfReady()
}},_resetColors:function(){if(this._promptBeforeResetColors){var a=this.injects();
var b=a.Resources;
a.EditorDialogs.openPromptDialog(b.get("EDITOR_LANGUAGE","RESET_COLORS_DIALOG_TITLE"),b.get("EDITOR_LANGUAGE","RESET_COLORS_DIALOG_TEXT"),b.get("EDITOR_LANGUAGE","RESET_COLORS_DIALOG_DETAILS"),a.EditorDialogs.DialogButtonSet.YES_NO,function(c){if(c.result==this.injects().EditorDialogs.DialogButtons.YES){this._doResetColors()
}}.bind(this))
}else{this._doResetColors()
}},_doResetColors:function(){var b=this._data.get("properties");
for(var a=0;
a<this._itemsArray.length;
++a){this._itemsArray[a].resetColor()
}},getAcceptableDataTypes:function(){return["ColorPropList"]
}}});
W.Components.newComponent({name:"mobile.editor.components.EditDesignPanel",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],skinParts:{title:{type:"htmlElement",autoBindDictionary:"editDesignTitle"},categories:{type:"htmlElement"},doneButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"DONE_BUTTON",command:"EditorCommands.OpenEditPanel",commandParameter:"data"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onCategoryClick"],initialize:function(c,b,a){this.parent(c,b,a);
this._categoryItemsNodes=[];
this._categoryItems=[];
this.closePanel()
},render:function(){if(this._data.get("properties").length==1){this._categoryItems[0].open()
}},openPanel:function(){this.uncollapse()
},closePanel:function(){this.collapse()
},setSiteLoaded:function(){for(var a=0;
a<this._categoryItemsNodes.length;
++a){var b=this._categoryItemsNodes[a];
if(b.getLogic){b.getLogic().setSiteLoaded()
}}},_prepareForRender:function(){var c=this._data.get("properties")||[];
var a=c.length;
if(a<1){return true
}if(this._categoryItems.length>=a){return true
}if(this._categoryItemsNodes.length>a){return false
}for(var b=0;
b<c.length;
++b){this.addSection(c[b])
}if(debugMode=="theme"){this._addThemeEditorSection()
}return this._categoryItems.length>=c.length
},_onAllSkinPartsReady:function(a){this.closePanel()
},_onSectionReady:function(a){a.addEvent("click",this._onCategoryClick);
this._categoryItems.push(a);
if(this._categoryItems.length==this._data.get("properties").length){this._renderIfReady()
}},addSection:function(b){if(!this._skin._itemSkin){LOG.reportError(wixErrors.EDITOR_NO_SKIN,"mobile.editor.components.EditDesignPanel","addSection")
}var a=W.Components.createComponent("mobile.editor.components.EditDesignPanelItem",this._skin._itemSkin,undefined,b,undefined,function(c){this._onSectionReady(c)
}.bind(this));
a.insertInto(this._skinParts.categories);
this._categoryItemsNodes.push(a)
},_onCategoryClick:function(c){for(var b=0;
b<this._categoryItems.length;
++b){var a=this._categoryItems[b];
if(a!=c){a.close()
}else{if(c.getState()=="open"){a.close()
}else{a.open()
}}}},getAcceptableDataTypes:function(){return["PropertyList"]
},_addThemeEditorSection:function(){var b={comp:"mobile.editor.components.EditThemeManagerPanel",skin:"mobile.editor.skins.ThemePanelSkin",dataQuery:"#DESIGN_COLORS",name:"Theme"};
var a=W.Components.createComponent("mobile.editor.components.EditDesignPanelItem",this._skin._itemSkin,undefined,b,undefined,function(c){c.addEvent("click",this._onCategoryClick);
this._categoryItems.push(c)
}.bind(this));
a.insertInto(this._skinParts.categories);
this._categoryItemsNodes.push(a)
}}});
W.Components.newComponent({name:"mobile.editor.components.EditDesignPanelItem",skinParts:{icon:{type:"htmlElement"},title:{type:"htmlElement"},desc:{type:"htmlElement"},openClose:{type:"htmlElement"},content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onClick","_onInnerCompReady"],_states:["open","close"],initialize:function(c,b,a){this.parent(c,b,a);
this._initAttr=a;
if(a&&a.comp&&a.skin){this._isInnerCompReady=false;
this._contentCompNode=this.injects().Components.createComponent(a.comp,a.skin,a.dataQuery,undefined,undefined,this._onInnerCompReady)
}else{this._contentCompNode=new Element("span");
this._isInnerCompReady=true
}},render:function(){if(!this._state){this.close()
}this._skinParts.title.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","editDesign"+this._initAttr.name+"Title"));
this._skinParts.desc.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","editDesign"+this._initAttr.name+"Desc"));
this._skinParts.icon.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"appearance/app_"+this._initAttr.name.toLowerCase()+"_icon.png")
},_prepareForRender:function(){var a=this._contentCompNode;
if(a&&(a.parentNode!=this._skinParts.content)){a.insertInto(this._skinParts.content)
}return this._isInnerCompReady
},_onAllSkinPartsReady:function(){this._skinParts.header.addEvent(Constants.CoreEvents.CLICK,this._onClick)
},open:function(){this.setState("open");
this._skinParts.openClose.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","close"));
if(this._contentCompNode){this._contentCompNode.uncollapse()
}},close:function(){this.setState("close");
this._skinParts.openClose.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","open"));
if(this._contentCompNode){this._contentCompNode.collapse()
}},setSiteLoaded:function(){if(this._contentCompNode&&this._contentCompNode.getLogic){this._contentCompNode.getLogic().setSiteLoaded()
}},_onClick:function(){this.fireEvent(Constants.CoreEvents.CLICK,this)
},_onInnerCompReady:function(a){this._isInnerCompReady=true;
this._renderIfReady()
}}});
W.Components.newComponent({name:"mobile.editor.components.EditDesignTemplate",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],skinParts:{resetBtn:{type:"htmlElement",autoBindDictionary:"RESET"},templateGal:{type:"mobile.editor.components.TemplateGallery",dataQuery:"#TemplateSelectorData",argObject:{numToShow:5,thumbnailWidth:80,thumbnailHeight:102,pos:400}}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_templateSelected","_resetThemeOverrides"],initialize:function(c,b,a){this.parent(c,b,a);
this.injects().Editor.addEvent("save",this.updateCurrentOverrides.bind(this));
this._promptBeforeResetOverrides=false
},_onAllSkinPartsReady:function(){this._skinParts.resetBtn.addEvent("click",this._resetThemeOverrides);
this._skinParts.templateGal.addEvent("templateSelected",this._templateSelected)
},setSiteLoaded:function(){this.injects().Preview.addEventForPreviewThemePropertyChange(this._previewThemePropChange);
this._currentOverrides=Object.clone(W.Preview.getPreviewThemeOverrides());
this._loadedThemes={}
},updateCurrentOverrides:function(){this._currentOverrides=Object.clone(W.Preview.getPreviewThemeOverrides())
},_resetThemeOverrides:function(){if(this._promptBeforeResetOverrides){this.injects().EditorDialogs.openPromptDialog(this.injects().Resources.get("EDITOR_LANGUAGE","RESET_THEME_OVERRIDES_DIALOG_TITLE"),this.injects().Resources.get("EDITOR_LANGUAGE","RESET_THEME_OVERRIDES_DIALOG_TEXT"),this.injects().Resources.get("EDITOR_LANGUAGE","RESET_THEME_OVERRIDES_DIALOG_DETAILS"),this.injects().EditorDialogs.DialogButtonSet.YES_NO,function(a){if(a.result==this.injects().EditorDialogs.DialogButtons.YES){this._skinParts.templateGal.clearSelection();
W.Preview.clearPreviewThemeOverrides();
for(var b in this._currentOverrides){this.injects().Preview.setPreviewThemeProperty(b,this._currentOverrides[b].value)
}}}.bind(this))
}},_templateSelected:function(d){if(this._loadedThemes[d.templateId]){W.Preview.clearPreviewThemeOverrides();
var c=this.injects().Preview;
var a=this._loadedThemes[d.templateId];
for(var b in a){c.setPreviewThemeProperty(b,a[b].value)
}return
}W.ServerFacade.getThemeDataJson(d.templateId,function(f){W.Preview.clearPreviewThemeOverrides();
var g=this.injects().Preview;
for(var e in f.properties){g.setPreviewThemeProperty(e,f.properties[e].value);
if(!this._loadedThemes[d.templateId]){this._loadedThemes[d.templateId]=f.properties
}}if(!this._promptBeforeResetOverrides){this._promptBeforeResetOverrides=true
}}.bind(this),this.onThemeDataLoadFailure.bind(this))
},onThemeDataLoadFailure:function(){var a=this.injects().Resources;
this.injects().EditorDialogs.openErrorDialog(a.get("EDITOR_LANGUAGE","ERROR_GET_THEME_OVERRIDES_DIALOG_TITLE"),a.get("EDITOR_LANGUAGE","ERROR_GET_THEME_OVERRIDES_DIALOG_TEXT"),null,function(){}.bind(this))
}}});
W.Components.newComponent({name:"mobile.editor.components.EditHeaderPanel",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],skinParts:{doneButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"DONE_BUTTON"},title:{type:"htmlElement",autoBindDictionary:"editHeaderTitle"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["closePanel"],initialize:function(c,b,a){this.parent(c,b,a);
this.closePanel();
this.inited=false;
this._dataPanel=null;
this._isDataPanelReady=false
},_prepareForRender:function(){if(!this._dataPanel){this._dataPanel=this.injects().Components.createComponent("mobile.editor.components.DataPanelsContainer","mobile.core.skins.InlineSkin",undefined,{},this._onPanelReady.bind(this))
}return this._isDataPanelReady
},openPanel:function(){this.uncollapse();
if(!this.inited){var a=this.injects().Preview.getPreviewHeaderComponents();
this._dataPanel.getLogic().setPanels("HeaderDataPanelContainer",a);
this.inited=true
}},closePanel:function(){this.collapse()
},_onPanelReady:function(){this._isDataPanelReady=true;
this._dataPanel.insertInto(this._skinParts.content);
this._renderIfReady()
},_onAllSkinPartsReady:function(){var a=this._skinParts.doneButton;
a.addEvent("buttonClick",function(){this._reportEditorFlowEvent("editPanelClose",this)
}.bind(this))
}}});
W.Components.newComponent({name:"mobile.editor.components.EditSettingsPanel",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],skinParts:{title:{type:"htmlElement",autoBindDictionary:"user_settings_title"},categories:{type:"htmlElement"},doneButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"DONE_BUTTON",command:"EditorCommands.OpenEditPanel",commandParameter:"data"}},Class:{Extends:"mobile.editor.components.EditDesignPanel",Binds:["_onCategoryClick"],initialize:function(c,b,a){this.parent(c,b,a);
this._categoryItemsNodes=[];
this._categoryItems=[];
this.closePanel()
},render:function(){if(this._data.get("properties").length==1){this._categoryItems[0].open()
}},openPanel:function(){this.uncollapse()
},closePanel:function(){this.collapse()
},setSiteLoaded:function(){for(var a=0;
a<this._categoryItemsNodes.length;
++a){var b=this._categoryItemsNodes[a];
if(b.getLogic){b.getLogic().setSiteLoaded()
}}},_prepareForRender:function(){var c=this._data.get("properties")||[];
var a=c.length;
if(a<1){return true
}if(this._categoryItems.length>=a){return true
}if(this._categoryItemsNodes.length>a){return false
}for(var b=0;
b<c.length;
++b){this.addSection(c[b])
}return this._categoryItems.length>=c.length
},_onAllSkinPartsReady:function(a){this.closePanel()
},_onSectionReady:function(a){a.addEvent("click",this._onCategoryClick);
this._categoryItems.push(a);
if(this._categoryItems.length==this._data.get("properties").length){this._renderIfReady()
}},addSection:function(b){if(!this._skin._itemSkin){LOG.reportError(wixErrors.EDITOR_NO_SKIN,"mobile.editor.components.EditSettingsPanel","addSection")
}var a=W.Components.createComponent("mobile.editor.components.EditSettingsPanelItem",this._skin._itemSkin,undefined,b,undefined,function(c){this._onSectionReady(c)
}.bind(this));
a.insertInto(this._skinParts.categories);
this._categoryItemsNodes.push(a)
},_onCategoryClick:function(c){for(var b=0;
b<this._categoryItems.length;
++b){var a=this._categoryItems[b];
if(a!=c){a.close()
}else{if(c.getState()=="open"){a.close()
}else{a.open()
}}}},getAcceptableDataTypes:function(){return["PropertyList"]
}}});
W.Components.newComponent({name:"mobile.editor.components.EditSettingsPanelItem",skinParts:{icon:{type:"htmlElement"},title:{type:"htmlElement"},desc:{type:"htmlElement"},openClose:{type:"htmlElement"},content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onClick","_onInnerCompReady"],_states:["open","close"],initialize:function(c,b,a){this.parent(c,b,a);
this._initAttr=a;
if(a&&a.comp&&a.skin){this._isInnerCompReady=false;
this._contentCompNode=this.injects().Components.createComponent(a.comp,a.skin,a.dataQuery,undefined,undefined,this._onInnerCompReady)
}else{this._contentCompNode=new Element("span");
this._isInnerCompReady=true
}},render:function(){if(!this._state){this.close()
}this._skinParts.title.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","editDesign"+this._initAttr.name+"Title"));
this._skinParts.desc.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","editDesign"+this._initAttr.name+"Desc"));
this._skinParts.icon.set("src",this.injects().Theme.getProperty("THEME_DIRECTORY")+"appearance/app_"+this._initAttr.name.toLowerCase()+"_icon.png")
},_prepareForRender:function(){var a=this._contentCompNode;
if(a&&(a.parentNode!=this._skinParts.content)){a.insertInto(this._skinParts.content)
}return this._isInnerCompReady
},_onAllSkinPartsReady:function(){this._skinParts.header.addEvent(Constants.CoreEvents.CLICK,this._onClick)
},open:function(){this.setState("open");
this._skinParts.openClose.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","close"));
if(this._contentCompNode){this._contentCompNode.uncollapse()
}},close:function(){this.setState("close");
this._skinParts.openClose.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","open"));
if(this._contentCompNode){this._contentCompNode.collapse()
}},setSiteLoaded:function(){if(this._contentCompNode&&this._contentCompNode.getLogic){this._contentCompNode.getLogic().setSiteLoaded()
}},_onClick:function(){this.fireEvent(Constants.CoreEvents.CLICK,this)
},_onInnerCompReady:function(a){this._isInnerCompReady=true;
this._renderIfReady()
}}});
W.Components.newComponent({name:"mobile.editor.components.EditThemeManagerPanel",skinParts:{title:{type:"htmlElement",autoBindDictionary:"editThemeSubTitle"},properties:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(b,a,c){this.parent(b,a);
this.skinId=c
},_onAllSkinPartsReady:function(){this._skinParts.title.addEvent("click",function(){this.togglePanel()
}.bind(this))
},togglePanel:function(){this._skinParts.properties.toggleCollapsed();
this._skinParts.title.toggleClass("selected")
},setSiteLoaded:function(){this.injects().Preview.getPreviewManagers().Config.setServiceTopologyProperty("staticThemeUrl","http://studio.wix.com/studio/themes");
this._themeMgr=this.injects().Preview.getPreviewManagers().Theme;
this._skinParts.properties.empty();
this._createTemplateName();
this._allProps=this._themeMgr.getProperties();
this._itemsArray=[];
this._itemsAmount=0;
for(var a in this._allProps){this._itemsAmount++;
this._createPropItem(a,this._allProps[a].type,false)
}},_createTemplateName:function(){var a=new Element("div",{styles:{position:"relative","margin-bottom":"5px"}});
a.setProperty("propId","templateName");
var b=new Element("label").set("html","New Template Name").set("title","New Template Name");
b.insertInto(a);
var c=new Element("input",{styles:{width:"69%",height:"40px",position:"absolute",top:"0",right:"0"}});
c.addEvent("keyup",this._setTemplateName.bind(this,c));
c.insertInto(b);
a.insertInto(this._skinParts.properties)
},_setTemplateName:function(c,e){if(e.key!="enter"||c.value===""){return
}this._templateName=c.value;
var d=this.injects().Preview.getPreviewManagers().Config.getServiceTopologyProperty("staticThemeUrl");
var f=d+"/"+this._templateName;
for(var h in this._allProps){if(this._allProps[h].type=="themeUrl"){var b=this._themeMgr.getProperty(h);
var g=b.replace(d+"/","");
g=g.substring(g.indexOf("/"));
var a=this._templateName+g;
this._themeMgr.setProperty(h,a)
}}},_createPropItem:function(b,d){var c={font:"","font-family":"",padding:"",radius:"",border:"",number:""};
if(d=="color"){this._addColorItem(b)
}else{if(d in c){if(d=="number"){if(b=="iconSize"||b=="bulletSize"){d="size"
}else{d="spacing"
}}var a=this.injects().Components.createComponent("mobile.editor.components.internal.EditDesignStudioItem","mobile.editor.skins.internal.EditDesignStudioItemSkin",undefined,{valueProp:b,mode:d},undefined,function(e){this._colorItemReady(e)
}.bind(this));
a.insertInto(this._skinParts.properties)
}}},_addColorItem:function(d){var c=this._data.get("properties");
var a=false;
if(c[d]){a=c[d].allowAlpha
}var b=this.injects().Components.createComponent("mobile.editor.components.internal.EditDesignColorItem","mobile.editor.skins.internal.EditDesignColorItemSkin",undefined,{colorProp:d,allowAlpha:a},undefined,function(e){this._colorItemReady(e)
}.bind(this));
b.insertInto(this._skinParts.properties)
},_colorItemReady:function(a){this._itemsArray.push(a);
if(this._itemsArray.length==this._itemsAmount){this._renderIfReady()
}},getAcceptableDataTypes:function(){return["ColorPropList"]
}}});
W.Components.newComponent({name:"mobile.editor.components.EditorButton",injects:["Viewer"],skinParts:{caption:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onButtonClick","_onMouseDown","_onMouseUp","_onMouseOver","_onMouseOut"],_states:{status:["grayed"],mouse:["pressed","over"]},_triggers:["click"],_canFocus:true,initialize:function(c,b,a){this.parent(c,b,a);
a=a||{};
this._label=a.label||b.getAttribute("label")||"";
var d=a.state;
this._initialState=a.initialState;
if(d=="disabled"){this.disable()
}else{if(d!="enabled"){this._tempState=d
}}if(a.targetUrl){this._linkable=true;
this._targetUrl=a.targetUrl;
this._targetWindow=a.targetWindow
}},render:function(){if(!this.getState()&&this._tempState){this.setState(this._tempState)
}this._skinParts.caption.set("html",this._label);
if(this._linkable){this._skinParts.caption.set("href",this._targetUrl);
this._skinParts.caption.setAttribute("target",this._targetWindow)
}},_onAllSkinPartsReady:function(){if(this._initialState=="grayed"){this.setState("grayed","status")
}this._view.addEvent("click",this._onButtonClick);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut)
},setLabel:function(a){this._label=a||"";
this._tryRender(true)
},getLabel:function(){return this._skinParts.caption.get("html")
},setTextContent:function(a){this.setLabel(a)
},_onButtonClick:function(){if(this.isEnabled()){this._view.fireEvent("buttonClick");
this.fireEvent("buttonClick")
}},_onMouseDown:function(){if(this.isEnabled()){this.setState("pressed","mouse")
}},_onMouseUp:function(){this.removeState("pressed","mouse")
},_onMouseOver:function(){if(this.isEnabled()){this.setState("over","mouse")
}},_onMouseOut:function(a){this.removeState("pressed","mouse");
this.removeState("over","mouse")
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"mobile.editor.components.EditorNavigationController",injects:["Viewer"],skinParts:{page1:{type:"htmlElement"},page2:{type:"htmlElement"},page3:{type:"htmlElement"},page4:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",setCurrentPage:function(a){for(var c=0;
c<4;
++c){var b=this._skinParts["page"+(c+1)];
if(b){if(c<a){b.removeClass("unused").removeClass("current").addClass("done")
}else{if(c==a){b.removeClass("unused").removeClass("done").addClass("current")
}else{b.removeClass("done").removeClass("current").addClass("unused")
}}}}},_onAllSkinPartsReady:function(){for(var a in this._skinParts){var b=this._skinParts[a];
if(""===b.id){b.id="editpage__"+a
}}},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"mobile.editor.components.EditorPreview",injects:["Viewer"],skinParts:{previewContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{readyState:["ready","loading"]},initialize:function(c,a,b){this.parent(c,a,b);
this.setState("ready","readyState")
},render:function(){this.injects().Preview.getIFrame().insertInto(this._skinParts.previewContainer)
}}});
W.Components.newComponent({name:"mobile.editor.components.EditorProgressBar",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],imports:["mobile.editor.components.EditorButton"],skinParts:{progressBar:{type:"htmlElement"},progressUnit:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",render:function(){this._skinParts.message.set("html","")
},setPercent:function(a){this._skinParts.progressUnit.setStyle("width",a+"%")
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"mobile.editor.components.FancyItem",skinParts:{arrowsDiv:{type:"htmlElement"},removeDiv:{type:"htmlElement"},hideButton:{type:"htmlElement"},upButton:{type:"htmlElement"},downButton:{type:"htmlElement"},contentDiv:{type:"htmlElement"},deleteButton:{type:"htmlElement"},fancyContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_markElementAsSelected"],_states:["idle","selected"],initialize:function(c,a,b){this.parent(c,a,b);
a.collapse()
},createGui:function(a,b){this._view.uncollapse();
this.options=a;
this._dataPanel=a.dataPanel;
if(b){if(instanceOf(b,Array)){b.forEach(function(c){c.insertInto(this._skinParts.contentDiv)
}.bind(this))
}else{b.insertInto(this._skinParts.contentDiv)
}}W.Utils.show(this._skinParts.arrowsDiv);
W.Utils.show(this._skinParts.removeDiv);
W.Utils.hide(this._skinParts.deleteButton);
W.Utils.hide(this._skinParts.hideButton);
if(this.options.showHideToggleHandler){W.Utils.show(this._skinParts.hideButton);
this.setHidden(this.options.isHidden)
}if(this.options.deleteHandler){W.Utils.show(this._skinParts.deleteButton)
}if(this.options.upClickHandler&&this.options.downClickHandler){this._skinParts.arrowsDiv.uncollapse("inline")
}else{this._skinParts.arrowsDiv.collapse()
}this._view.removeEvent("click");
this.bindEventsHandlers()
},bindEventsHandlers:function(){this._view.addEvent("click",this._markElementAsSelected);
if(this._view.addEventListener){this._view.addEventListener("focus",this._markElementAsSelected,true)
}else{this._view.attachEvent("onfocusin",this._markElementAsSelected)
}this._skinParts.upButton.addEvent("click",this.options.upClickHandler);
this._skinParts.downButton.addEvent("click",this.options.downClickHandler);
this._skinParts.deleteButton.addEvent("click",this.options.deleteHandler);
this._skinParts.hideButton.addEvent("click",function(){var a=this.toggleHidden(this.options.isHidden);
this.options.showHideToggleHandler(a)
}.bind(this))
},setHidden:function(a){if(a){this._skinParts.hideButton.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","show"));
this.options.isHidden=true;
return this.options.isHidden
}else{this._skinParts.hideButton.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","hide"));
this.options.isHidden=false;
return this.options.isHidden
}},toggleHidden:function(){return this.setHidden(!this.options.isHidden)
},_markElementAsSelected:function(a){$$("[skinPart='fancyContainer']").removeClass("selected");
this._skinParts.fancyContainer.addClass("selected");
if(this._dataPanel&&this._dataPanel.highlightPreviewElement){this._dataPanel.highlightPreviewElement(a.target)
}},render:function(){this.setState("idle")
},hide:function(){this._view.collapse()
}}});
W.Components.newComponent({name:"mobile.editor.components.ImageButton",skinParts:{label:{type:"htmlElement",autoBindData:"title"},image:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["up","over","selected"],Binds:["_onClick","_onOver","_onOut","_onDblClick"],_triggers:["click"],_canFocus:true,initialize:function(c,b,a){this.parent(c,b,a);
this._attr=a;
this._toggleMode=(a&&a.toggleMode)||false
},render:function(){var a=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",this._data,this._attr,null,function(b){var c=this._skinParts.image.getSize().x;
this._skinParts.image.setStyle("height",c+"px");
b.refresh()
}.bind(this));
a.insertInto(this._skinParts.image);
this._skinParts.label.set("html",this._data.get("title"))
},_onAllSkinPartsReady:function(a){a.view.addEvent("click",this._onClick);
a.view.addEvent("dblclick",this._onDblClick);
a.view.addEvent("mouseover",this._onOver);
a.view.addEvent("mouseout",this._onOut)
},_onClick:function(){if(this.isEnabled()){if(!this._command){this.fireEvent("click",this)
}if(this._toggleMode){var a=(this.getState()!="selected")?"selected":"over";
this.setState(a)
}}},_onDblClick:function(){if(this.isEnabled()){this.fireEvent("dblclick",this)
}},_onOver:function(){if(this.isEnabled()&&this.getState()!="selected"){this.fireEvent("over");
this.setState("over")
}},_onOut:function(){if(this.isEnabled()&&this.getState()!="selected"){this.fireEvent("up");
this.setState("up")
}},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.editor.components.PageControllerSimple",skinParts:{prevBtn:{type:"htmlElement"},positionDisplay:{type:"htmlElement"},position:{type:"htmlElement"},amount:{type:"htmlElement"},nextBtn:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["enabled","disabled"],Binds:["next","prev","setIndexFromEvent"],initialize:function(c,b,a){this.parent(c,b,a);
this._currentIndex=this._amount=0
},render:function(){this._skin.renderCssIfNeeded();
this._updatePositionDisplay()
},_onAllSkinPartsReady:function(a){a.prevBtn.addEvent("click",this.prev);
a.nextBtn.addEvent("click",this.next);
a.position.addEvent("change",this.setIndexFromEvent)
},setAmount:function(a){a=Math.round(Number(a));
if(this._currentIndex>a-1){this.setIndex(a-1)
}this._amount=a;
this._updatePositionDisplay()
},getAmount:function(){return this._amount
},setIndex:function(a){if(a==this._currentIndex||this._amount===0){return
}if(a!==this._currentIndex){a=Math.round(Number(a));
a=Math.min(a,this._amount-1);
a=Math.max(a,0);
this._currentIndex=a;
this._updatePositionDisplay();
this.fireEvent("change",this._currentIndex)
}else{this._updatePositionDisplay()
}},getIndex:function(){return this._currentIndex
},setIndexFromEvent:function(b){b=b||{};
var a=b.target&&b.target.value;
if(isNaN(a)){a=this._currentIndex+1
}else{if(a>=this._amount){a=this._amount
}else{if(a<0){a=1
}}}this.setIndex(a-1)
},next:function(b){var a=1;
if(b&&b.alt){a=10
}if(this._skinParts.nextBtn.get("state")=="enable"){this.setIndex(this._currentIndex+a)
}},prev:function(b){var a=1;
if(b&&b.alt){a=10
}if(this._skinParts.prevBtn.get("state")=="enable"){this.setIndex(this._currentIndex-a)
}},_updatePositionDisplay:function(){if(this._skinParts){this._skinParts.amount.set("html","/&nbsp;"+this._amount);
this._skinParts.position.value=(this._currentIndex+1);
this._skinParts.prevBtn.set("state",(this._currentIndex>0)?"enable":"disable");
this._skinParts.nextBtn.set("state",(this._currentIndex<this._amount-1)?"enable":"disable")
}}}});
W.Components.newComponent({name:"mobile.editor.components.PublishController",skinParts:{backButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"BACK_BUTTON",command:"EditorCommands.GoToEditPage"},nextButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"PUBLISH",command:"SitePageControl.next"},title:{type:"htmlElement",autoBindDictionary:"FINISH_HEADLINE"},subtitle:{type:"htmlElement",autoBindDictionary:"SITE_READY"},sayNothingTitle:{type:"htmlElement",autoBindDictionary:"FINISH_INSTRUCTIONS"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_onAllSkinPartsReady:function(a){a.backButton.setState("grayed")
},getAcceptableDataTypes:function(){return["","Document"]
}}});
W.Components.newComponent({name:"mobile.editor.components.SiteNameSelector",traits:["mobile.core.components.traits.InputFieldEvents"],imports:["mobile.editor.components.EditorButton"],skinParts:{titleInput:{type:"htmlElement"},urlPanel:{type:"htmlElement"},urlLabel:{type:"htmlElement"},urlBox:{type:"htmlElement"},siteNameLabel:{type:"htmlElement"},siteNameLink:{type:"htmlElement"},siteNameLinkDone:{type:"htmlElement"},siteNameInput:{type:"htmlElement"},siteNameErrorLabel:{type:"htmlElement"},loadAnimation:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_titleOnFocus","_titleOnBlur","_titleChange","_siteNameLinkClick","_siteNameLinkClickDone","_siteNameInputChange","_validateSiteName","_validateGeneratedSiteName","_sendSiteNameValidationRequest","_urlOnBlur","_standaloneModeNavigationEventHandler"],initialize:function(c,a,b){this.parent(c,a,b);
this._siteName="";
this._baseSiteUrl="m.wix.com/"+window.siteHeader.username+"/";
this._checkNameCounter=0
},setTemplateMode:function(a){this._isTemplate=a
},render:function(){if(!this._data){return
}this._presetTitle=this._data.get("title");
this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
if(this._isTemplate){var a=this.injects().Utils.convertFromHtmlText(this._data.get("title"));
this._lastTitle=a;
this._skinParts.titleInput.value=a
}this._bindInputToDataField(this._skinParts.titleInput,"title",true,100);
this._skinParts.titleInput.addEvent("focus",this._titleOnFocus);
this._skinParts.titleInput.addEvent("blur",this._titleOnBlur);
if(this.injects().Editor.isStandalone()){this._skinParts.urlPanel.uncollapse();
this._skinParts.siteNameLink.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","change_url"));
this._skinParts.siteNameLinkDone.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","change_url_done"));
this._siteName=this._trimSiteName(this._sanitizeSiteName(this._data.get("title")));
this._skinParts.urlLabel.set("text",this._baseSiteUrl);
this._skinParts.siteNameLabel.set("text",this._siteName);
this._skinParts.siteNameInput.addEvent("blur",this._urlOnBlur);
this._listenToInput(this._skinParts.titleInput,this._titleChange);
this._skinParts.siteNameLink.addEvent("click",this._siteNameLinkClick);
this._skinParts.siteNameLinkDone.addEvent("click",this._siteNameLinkClickDone);
this._validateGeneratedSiteName();
this.injects().Viewer.addEvent("pageTransitionEnded",this._standaloneModeNavigationEventHandler)
}},_standaloneModeNavigationEventHandler:function(){if(this.injects().Viewer.getCurrentPageId()=="naming_page"){this._validationRequestInterval=setInterval(this._sendSiteNameValidationRequest,500)
}else{if(this._validationRequestInterval){clearInterval(this._validationRequestInterval);
this._validationRequestInterval=null
}}},_sanitizeSiteName:function(a){if(a.length!==0){var b=a.toLowerCase();
return b.replace(/([^\s\w\d_-])/g,"").replace(/\s+/g,"-")
}else{return a
}},_trimSiteName:function(a){if(a.length!==0){return a.replace(/(^[\s_-]+)|([\s_-]+$)/g,"")
}else{return a
}},_urlOnBlur:function(){var a=this._trimSiteName(this._skinParts.siteNameInput.get("value"));
this._skinParts.siteNameInput.set("value",a);
this._siteName=a
},_titleOnFocus:function(){if(this._data.getMeta("isPreset")){this._skinParts.titleInput.value=""
}},_titleOnBlur:function(){if(this._data.getMeta("isPreset")){var a=this.injects().Utils.convertFromHtmlText(this._data.get("title"));
this._skinParts.titleInput.value=a
}else{if(this._data.get("title").length===0){this._skinParts.titleInput.value=this._presetTitle;
this._data.set("title",this._presetTitle,true);
this._data.setMeta("isPreset",true,true);
this._titleChange()
}}},_titleChange:function(){var a=this._skinParts.titleInput.get("value");
var b;
if(a!=this._lastTitle){if(a.length!==0){this._siteName=this._trimSiteName(this._sanitizeSiteName(a));
this._skinParts.urlLabel.set("text",this._baseSiteUrl);
this._skinParts.siteNameLabel.set("text",this._siteName);
if(this._siteName.length>0){this._validateGeneratedSiteName()
}else{b=this.injects().Resources.get("EDITOR_LANGUAGE","illegal_chars_in_site_name_error");
this._skinParts.siteNameErrorLabel.set("text",b);
this._skinParts.siteNameErrorLabel.uncollapse();
this._setSiteNameValidity(false)
}}else{b=this.injects().Resources.get("EDITOR_LANGUAGE","empty_title_error");
this._skinParts.siteNameErrorLabel.set("text",b);
this._skinParts.siteNameErrorLabel.uncollapse();
this._skinParts.siteNameLabel.set("text","");
this._setSiteNameValidity(false)
}}this._lastTitle=a
},_siteNameInputChange:function(d){var a=this._skinParts.siteNameInput.get("value");
if(a.length!==0){if(this._siteName!=a){var e=this._skinParts.siteNameInput.getCaretPosition();
var c=this._sanitizeSiteName(a.substr(0,e));
var b=this._sanitizeSiteName(a.substr(e));
this._siteName=c+b;
this._skinParts.siteNameInput.set("value",this._siteName);
this._skinParts.siteNameInput.setCaretPosition(c.length);
this._validateSiteName()
}}else{this._invalidateEmptySiteName()
}},_invalidateEmptySiteName:function(){var b=this.injects().Resources.get("EDITOR_LANGUAGE","empty_site_name_error");
var a=this._skinParts.siteNameErrorLabel;
a.set("text",b);
a.uncollapse();
this._setSiteNameValidity(false)
},_siteNameLinkClick:function(){this._stopListeningToInput(this._skinParts.titleInput,this._titleChange);
this._skinParts.urlLabel.set("text",this._baseSiteUrl);
this._skinParts.siteNameLabel.collapse();
this._skinParts.siteNameInput.set("value",this._siteName);
this._listenToInput(this._skinParts.siteNameInput,this._siteNameInputChange);
this._skinParts.siteNameInput.uncollapse();
this._lastSentSiteName="";
this._skinParts.urlBox.addClass("edit-mode");
this._skinParts.siteNameLink.removeEvent("click",this._siteNameLinkClick);
this._skinParts.siteNameLink.collapse();
this._skinParts.siteNameLinkDone.addEvent("click",this._siteNameLinkClickDone)
},_siteNameLinkClickDone:function(){if(this._siteNameIsValid){this._skinParts.urlBox.removeClass("edit-mode");
this._skinParts.siteNameInput.collapse();
this._skinParts.siteNameLink.uncollapse();
this._skinParts.siteNameLabel.uncollapse();
this._skinParts.siteNameLabel.set("text",this._siteName);
this._skinParts.siteNameErrorLabel.collapse();
this._skinParts.siteNameLink.addEvent("click",this._siteNameLinkClick)
}},_sendSiteNameValidationRequest:function(){if(this._pendingValidationRequest&&this._pendingValidationRequest.siteName.length!==0){this.injects().ServerFacade.sendSiteNameValidationRequest(this._pendingValidationRequest.siteName,this._pendingValidationRequest.onComplete);
this._lastSentSiteName=this._pendingValidationRequest.siteName;
this._pendingValidationRequest=null
}},_validateSiteName:function(){this._skinParts.loadAnimation.addClass("processing");
this._setSiteNameValidity(false);
this._pendingValidationRequest={siteName:this._siteName,onComplete:function(a){if(this._siteName==this._lastSentSiteName){if(this._validateServerNameResponse(a,"_validateSiteName")){this._skinParts.loadAnimation.removeClass("processing");
if(a.nameExists){var b=this.injects().Resources.get("EDITOR_LANGUAGE","site_name_already_exists_error");
this._skinParts.siteNameErrorLabel.set("text",b);
this._skinParts.siteNameErrorLabel.uncollapse()
}else{this._skinParts.siteNameErrorLabel.collapse();
this._skinParts.siteNameErrorLabel.set("text","");
this._setSiteNameValidity(true);
this._skinParts.loadAnimation.removeClass("processing")
}}}}.bind(this)}
},_validateGeneratedSiteName:function(){this._skinParts.loadAnimation.addClass("processing");
this._setSiteNameValidity(false);
this._pendingValidationRequest={siteName:this._siteName,onComplete:function(a){if(this._siteName==this._lastSentSiteName){if(this._validateServerNameResponse(a,"_validateGeneratedSiteName")){this._setSiteNameValidity(true);
this._skinParts.siteNameErrorLabel.collapse();
this._skinParts.siteNameErrorLabel.set("text","");
this._skinParts.loadAnimation.removeClass("processing");
if(a.nameExists){this._siteName=a.suggestedName;
this._skinParts.urlLabel.set("text",this._baseSiteUrl);
this._skinParts.siteNameLabel.set("text",this._siteName)
}}else{}}}.bind(this)}
},_validateServerNameResponse:function(b,d){if(b&&b.suggestedName){this._checkNameCounter=0;
return true
}else{if(this._checkNameCounter<3){var a=(b&&b.errorDescription.errorDescription)||"";
var c;
if(this._checkNameCounter++<2){c=wixErrors.SERVER_NAME_VALIDATION_FAILED;
this[d]()
}else{c=wixErrors.SERVER_NAME_VALIDATION_DEAD;
this.injects().EditorDialogs.openErrorDialog(this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_FATAL_ERROR_TITLE"),this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_FATAL_ERROR_DESC"),null,function(){}.bind(this))
}LOG.reportError(c,"SiteNameSelector","_validateServerNameResponse",a)
}return false
}},getSiteName:function(){return this._siteName
},getTitle:function(){return this._siteTitle
},getAcceptableDataTypes:function(){return["","Header"]
},_setSiteNameValidity:function(a){this._siteTitle=this._data.get("title");
this.fireEvent("validation",a);
if(a){this._skinParts.siteNameLinkDone.removeClass("invalid-sitename")
}else{this._skinParts.siteNameLinkDone.addClass("invalid-sitename")
}this._siteNameIsValid=a
}}});
W.Components.newComponent({name:"mobile.editor.components.SiteNamingPageControl",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],skinParts:{siteNameSelector:{type:"mobile.editor.components.SiteNameSelector"},categorySelector:{type:"mobile.editor.components.CategorySelector"},nextButton:{type:"mobile.editor.components.EditorButton",autoBindDictionary:"NEXT_STEP_BUTTON"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_setCategoryValid","_setNameValid","_nextButtonClick"],initialize:function(c,a,b){this.parent(c,a,b);
this._nameIsValid=false;
this._categoryIsValid=false;
this._siteLoaded=false
},render:function(){this._determineNextButtonState()
},_onAllSkinPartsReady:function(){this._skinParts.nextButton.addEvent("buttonClick",this._nextButtonClick);
this._skinParts.categorySelector.addEvent("validation",this._setCategoryValid);
this._skinParts.siteNameSelector.addEvent("validation",this._setNameValid)
},_nextButtonClick:function(){this._reportEditorFlowEvent("gotoNextPage");
this._skinParts.nextButton.disable();
if(this._selectedCategoryLogic){var b=this._selectedCategoryLogic.getSelectedCategoryName();
var a=this._selectedCategoryLogic.getSelectedCategoryIndex();
LOG.reportEvent(wixEvents.EDITOR_FLOW_CATEGORY_CHOSEN,{i1:a,c1:b,label:b})
}else{LOG.reportError(wixErrors.SITE_NAME_NO_SELECTED_CATEGORY,"SiteNamingPageControl","_nextButtonClick")()
}},_setCategoryValid:function(a){this._categoryIsValid=a;
this._determineNextButtonState()
},_setNameValid:function(a){this._nameIsValid=a;
this._determineNextButtonState()
},_determineNextButtonState:function(){var a=this.injects().Editor.isStandalone();
if((this._categoryIsValid&&!a&&this._siteLoaded)||(this._categoryIsValid&&this._nameIsValid&&a)){this._skinParts.nextButton.enable()
}else{this._skinParts.nextButton.disable()
}},setSiteLoaded:function(a){this._siteLoaded=a;
this._determineNextButtonState()
},setCategoryReference:function(a){this._selectedCategoryLogic=a
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"mobile.editor.components.SitePageController",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],imports:["mobile.editor.components.EditorButton"],skinParts:{container:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onSitePageChanged","_onSiteLoaded"],_currentPageId:null,initialize:function(d,b,a){this.parent(d,b,a);
var e=this.injects().Editor;
var f=this.injects().Commands;
this._nextCommand=f.registerCommandAndListener("SitePageControl.next",this,this._onNext,null);
this._prevCommand=f.registerCommandAndListener("SitePageControl.prev",this,this._onPrev,null);
e.addEvent(Constants.EditorEvents.SITE_LOADED,this._onSiteLoaded);
e.addEvent(Constants.EditorEvents.SITE_PAGE_CHANGED,this._onSitePageChanged)
},_onAllSkinPartsReady:function(b){var a=this.injects().Editor.getSiteStructure();
if(a){this.setDataItem(a)
}},_getItemsData:function(){if(this._data){return Array.concat(this._data.get("mainPage"),this._data.get("pages"))
}},_onItemReady:function(e,b,a){var c=a&&a.get("id");
e.setCommand("EditorCommands.gotoSitePage",c);
var d=this._currentPageId;
if(d&&c==d){e.setState("selected")
}else{e.setState("up")
}},_onAllItemsReady:function(){this.parent();
if(!this._currentPageId&&this._itemsNodes.length){this._itemsNodes[0].getLogic().executeCommand()
}else{this._recalcNavigationCommands()
}},getCurrentPage:function(){return this._currentPageId
},_onSitePageChanged:function(d){var c=this._itemsNodes;
if(c){for(var f=0,b=c.length;
f<b;
++f){var g=c[f];
if(!g||!g.getLogic){continue
}var e=g.getLogic();
var a=e.getDataItem();
if(a&&(a.get("id")==d)){e.setState("selected")
}else{e.setState("up")
}}}this._currentPageId=d;
this._recalcNavigationCommands()
},_onNext:function(){var a=this.getPageIndex(this._currentPageId);
if(a<0){a=0
}if(this._itemsNodes){if(a<this._itemsNodes.length-1){this._itemsNodes[a+1].getLogic().executeCommand()
}else{var b=this.injects().Commands.getCommand("EditorCommands.GotoNextPage");
if(b){b.execute(null,this)
}}}},_onPrev:function(){var a=this.getPageIndex(this._currentPageId);
if(a>0){this._itemsNodes[a-1].getLogic().executeCommand()
}},getTotalPages:function(){return(this._itemsNodes)?this._itemsNodes.length:0
},getCurrentPageIndex:function(){return this.getPageIndex(this._currentPageId)
},getPageIndex:function(d){var c=this._itemsNodes;
if(c){for(var f=0,b=c.length;
f<b;
++f){var g=c[f];
if(g&&g.getLogic){var e=g.getLogic();
var a=e.getDataItem();
if(a&&(a.get("id")==d)){return f
}}}}return -1
},_getDataManager:function(){return this.injects().Preview.getPreviewManagers().Data
},getItemsContainer:function(){return this._skinParts.container
},getItemClassName:function(){return"mobile.editor.components.SitePageControllerBtn"
},_onSiteLoaded:function(a){this.setDataItem(a)
},_onDataChange:function(){this._itemsNodes=[];
this.parent()
},_recalcNavigationCommands:function(){var b=this.getTotalPages();
var a=this.getCurrentPageIndex();
if(a>0){this._prevCommand.enable()
}else{this._prevCommand.disable()
}if(a<b){this._nextCommand.enable()
}else{this._nextCommand.disable()
}},getAcceptableDataTypes:function(){return["","Document"]
}}});
W.Components.newComponent({name:"mobile.editor.components.SitePageControllerBtn",skinParts:{label:{type:"htmlElement",autoBindData:"title",dictionaryFallback:"empty_title_text"}},Class:{Extends:"mobile.core.components.Button",_states:["up","over","selected","down","pressed"],_triggers:["click"],render:function(){this.parent();
if(this._data.getMeta("isHidden")){this._skinParts.label.addClass("hiddenPage")
}else{this._skinParts.label.removeClass("hiddenPage")
}},getAcceptableDataTypes:function(){return["Page"]
}}});
W.Components.newComponent({name:"mobile.editor.components.StudioButton",skinParts:{clickToEdit:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a);
this._openStudioPicker=this._openStudioPicker.bind(this);
this._onStudioFetched=this._onStudioFetched.bind(this);
this._onStudioPickerChange=this._onStudioPickerChange.bind(this);
this._onStudioPickerClose=this._onStudioPickerClose.bind(this);
this.setValue("")
},_onAllSkinPartsReady:function(){this._skinParts.view.addEvent("click",this._openStudioPicker)
},setValue:function(a){this._value=a;
if(this._skinParts){if(this._skinParts.valueInput){this._skinParts.valueInput.set("value",a);
this._skinParts.valueInput.set("readonly","readonly")
}this._skinParts.clickToEdit.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","CLICK_TO_EDIT"))
}},setSize:function(b,a){if(b){this._view.setStyle("width",b)
}if(a){this._view.setStyle("height",a)
}},setPropertyType:function(a){this._propertyType=a
},_openStudioPicker:function(a){this._initValue=this._value;
this.injects().Editor.getStudioPicker(this._onStudioFetched,{value:this._value,mode:this._propertyType});
this.fireEvent("click")
},_onStudioFetched:function(a){this._studioPicker=a;
this._onStudioPickerChange({value:this._value});
this._studioPicker.addEvent("change",this._onStudioPickerChange);
this._studioPicker.addEvent("close",this._onStudioPickerClose)
},_onStudioPickerChange:function(a){this.fireEvent("change",{value:a.value,cause:"temp"});
this.setValue(a.value)
},_onStudioPickerClose:function(c){var b=(c.cause!="ok")?this._initValue:c.value;
var a=(c.cause!="ok")?"cancel":"select";
this.setValue(b);
this.fireEvent("change",{value:b,cause:a})
}}});
W.Components.newComponent({name:"mobile.editor.components.StudioPicker",skinParts:{header:{type:"htmlElement"},xButton:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(b,a){this.parent(b,a);
this._updateFontValue=this._updateFontValue.bind(this);
this._value="";
this._onBlur=this._onBlur.bind(this);
this._view.setStyle("z-index","10000")
},render:function(){var a=this.injects().Resources;
this._skinParts.header.set("html",a.get("EDITOR_LANGUAGE","SELECT_TEMPLATE_PROPERTY_DIALOG_TITLE"))
},_onAllSkinPartsReady:function(){var b=this.injects().Resources;
var a=this.injects().Components;
this._okBtn=a.createComponent("mobile.editor.components.EditorButton","mobile.editor.skins.EditorButtonBlueSkin",{},{label:b.get("EDITOR_LANGUAGE","SELECT_COLOR"),state:"enabled"});
this._cancelBtn=a.createComponent("mobile.editor.components.EditorButton","mobile.editor.skins.EditorButtonBlueSkin",{},{label:b.get("EDITOR_LANGUAGE","CANCEL_BUTTON"),state:"grayed"});
this._okBtn.insertInto(this._skinParts.okBtn);
this._cancelBtn.insertInto(this._skinParts.cancelBtn);
this._setFunctionality()
},_parseValue:function(){switch(this._mode){case"font":this._parseFont();
this._skinParts.fontCombo.set("disabled","disabled");
break;
case"font-family":this._font=this._value;
this._skinParts.fontCombo.set("value",this._font);
break;
case"radius":case"padding":this._parseRadiusAndPadding();
break;
case"border":this._parseBorder();
break;
case"size":this._numberSize=this._value;
this._skinParts.numberInput.set("value",this._numberSize);
break;
case"spacing":this._numberSize=this._value.substring(0,this._value.indexOf("em"));
this._skinParts.numberInput.set("value",this._numberSize);
break;
default:break
}},_parseFont:function(){this._bold=false;
this._underline=false;
this._italic=false;
this._font="";
this._fontSize1="";
this._fontSize2="";
var c=this._value.split(" ");
this._font=c[c.length-1];
for(var a=0;
a<c.length-1;
a++){switch(c[a]){case"bold":this._bold=true;
break;
case"underline":this._underline=true;
break;
case"italic":this._italic=true;
break;
default:if(c[a].indexOf("em")>-1){var b=c[a].split("/");
this._fontSize1=b[0].substring(0,b[0].indexOf("em"));
this._fontSize2=b[1].substring(0,b[1].indexOf("em"))
}}}this._skinParts.boldCheckbox.set("checked",this._bold);
this._skinParts.underlineCheckbox.set("checked",this._underline);
this._skinParts.italicCheckbox.set("checked",this._italic);
this._skinParts.fontCombo.set("value",this._font);
this._skinParts.fontSize1Input.set("value",this._fontSize1);
this._skinParts.fontSize2Input.set("value",this._fontSize2)
},_parseRadiusAndPadding:function(){var a=this._value.split(" ");
this._widthSize1=a[0].substring(0,a[0].indexOf("em"));
this._widthSize2=a[1].substring(0,a[1].indexOf("em"));
this._widthSize3=a[2].substring(0,a[2].indexOf("em"));
this._widthSize4=a[3].substring(0,a[3].indexOf("em"));
this._skinParts.width1Input.set("value",this._widthSize1);
this._skinParts.width2Input.set("value",this._widthSize2);
this._skinParts.width3Input.set("value",this._widthSize3);
this._skinParts.width4Input.set("value",this._widthSize4)
},_parseBorder:function(){var a=this._value.split(" ");
this._borderWidth=a[0].substring(0,a[0].indexOf("em"))||"";
this._borderType=a[1]||"";
this._borderColor=a[2]||"";
this._skinParts.borderWidthInput.set("value",this._borderWidth);
this._skinParts.borderTypeCombo.set("value",this._borderType);
var b=this.injects().Components.createComponent("mobile.editor.components.ColorButton","mobile.editor.skins.ColorButtonSkin",undefined,{},undefined,function(c){this._borderColorButton=c;
this._borderColorButton.setSize("100%","100%");
this._borderColorButton.setColor(this._borderColor);
this._borderColorButton.enableAlpha(false);
this._borderColorButton.setHexDisplay(true);
this._borderColorButton.addEvent("change",function(d){this._updateBorderValue(d.color)
}.bind(this))
}.bind(this));
b.insertInto(this._skinParts.borderColorButton)
},getValue:function(){return this._value
},setPosition:function(a,b){if(a){this._view.setStyle("left",a)
}if(b){this._view.setStyle("top",b)
}},setValue:function(b,a){this._value=b;
if(a){this.setOriginalValue(this._value)
}this._parseValue()
},setMode:function(a){this._mode=a;
this._skinParts.fontSelector.collapse();
this._skinParts.paddingAndRadiusSelector.collapse();
this._skinParts.numberSelecotr.collapse();
this._skinParts.borderSelector.collapse();
switch(this._mode){case"font":this._skinParts.fontSelector.uncollapse();
break;
case"font-family":this._skinParts.fontSelector.uncollapse();
this._skinParts.styleCheckboxes.collapse();
this._skinParts.fontSizes.collapse();
break;
case"radius":this._skinParts.paddingAndRadiusLabel.set("html","Radius");
this._skinParts.paddingAndRadiusSelector.uncollapse();
break;
case"padding":this._skinParts.paddingAndRadiusLabel.set("html","Padding");
this._skinParts.paddingAndRadiusSelector.uncollapse();
break;
case"border":this._skinParts.borderSelector.uncollapse();
break;
case"size":case"spacing":this._skinParts.numberSelecotr.uncollapse();
this._skinParts.borderSelector.setStyle("display","none");
if(this._mode=="spacing"){this._skinParts.numberPropertyLabel.set("html","Spacing");
this._skinParts.spacingEm.set("html","em")
}else{this._skinParts.numberPropertyLabel.set("html","Size")
}break
}},getOriginalValue:function(){return new this._originalValue()
},setOriginalValue:function(a){this._originalValue=a
},open:function(){this.uncollapse()
},close:function(a){this.collapse();
$(document.body).removeEvent("click",this._onBlur);
this.fireEvent("close",{cause:a,value:this._value})
},_onBlur:function(){this.close("blur")
},_measureGUI:function(){this._slPointerHalfSize=this._skinParts.HSPointer.getSize().x/2;
this._slSize=this._skinParts.SLBox.getSize();
this._heuSliderHeight=this._skinParts.hueSlider.getSize().y;
this._heuSliderBarHeight=this._skinParts.hueBar.getSize().y
},_setFunctionality:function(){var b,a;
this._headerDrag=new Drag.Move(this._skinParts.view,{snap:0,handle:this._skinParts.dragArea});
this._skinParts.okBtn.addEvent("click",function(){this.close("ok")
}.bind(this));
this._skinParts.cancelBtn.addEvent("click",function(){this.close("cancel")
}.bind(this));
this._skinParts.xButton.addEvent("click",function(){this.close("cancel")
}.bind(this));
this._skinParts.boldCheckbox.addEvent("click",function(){this._updateFontValue()
}.bind(this));
this._skinParts.underlineCheckbox.addEvent("click",function(){this._updateFontValue()
}.bind(this));
this._skinParts.italicCheckbox.addEvent("click",function(){this._updateFontValue()
}.bind(this));
this._skinParts.fontCombo.addEvent("change",function(){this._updateFontValue()
}.bind(this));
this._skinParts.fontSize1Input.addEvent("change",function(){this._updateFontValue()
}.bind(this));
this._skinParts.fontSize2Input.addEvent("change",function(){this._updateFontValue()
}.bind(this));
this._skinParts.width1Input.addEvent("change",function(){this._updatePaddingRadiusValue()
}.bind(this));
this._skinParts.width2Input.addEvent("change",function(){this._updatePaddingRadiusValue()
}.bind(this));
this._skinParts.width3Input.addEvent("change",function(){this._updatePaddingRadiusValue()
}.bind(this));
this._skinParts.width4Input.addEvent("change",function(){this._updatePaddingRadiusValue()
}.bind(this));
this._skinParts.borderTypeCombo.addEvent("change",function(){this._updateBorderValue()
}.bind(this));
this._skinParts.borderWidthInput.addEvent("change",function(){this._updateBorderValue()
}.bind(this));
this._skinParts.numberInput.addEvent("change",function(){this._updatesSizeAndSpacingValue()
}.bind(this))
},_updateBorderValue:function(){this._borderColor="[borderColor]";
this._borderType=this._skinParts.borderTypeCombo.value;
this._borderWidth=this._skinParts.borderWidthInput.value;
this._value=this._borderWidth+"em "+this._borderType+" "+this._borderColor;
this.fireEvent("change",{value:this._value})
},_updateFontValue:function(){this._value="";
if(this._mode=="font"){if(this._skinParts.boldCheckbox.checked){this._bold=true;
this._value+="bold "
}if(this._skinParts.italicCheckbox.checked){this._italic=true;
this._value+="italic "
}if(this._skinParts.underlineCheckbox.checked){this._underline=true;
this._value+="underline "
}this._fontSize1=this._skinParts.fontSize1Input.value;
this._fontSize2=this._skinParts.fontSize2Input.value;
this._value+=this._fontSize1+"em/"+this._fontSize2+"em ";
this._font="[font]"
}else{this._font=this._skinParts.fontCombo.value
}this._value+=this._font;
this.fireEvent("change",{value:this._value})
},_updatePaddingRadiusValue:function(){this._widthSize1=this._skinParts.width1Input.value;
this._widthSize2=this._skinParts.width2Input.value;
this._widthSize3=this._skinParts.width3Input.value;
this._widthSize4=this._skinParts.width4Input.value;
this._value=this._widthSize1+"em "+this._widthSize2+"em "+this._widthSize3+"em "+this._widthSize4+"em";
this.fireEvent("change",{value:this._value})
},_updatesSizeAndSpacingValue:function(){this._numberSize=this._skinParts.numberInput.value;
this._value=this._numberSize;
if(this._mode=="spacing"){this._value+="em"
}this.fireEvent("change",{value:this._value})
}}});
W.Components.newComponent({name:"mobile.editor.components.TemplateGallery",skinParts:{galleryContent:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,a,b){this.parent(c,a,b);
this._numToShow=(b&&b.numToShow)||3;
this._thumbnailWidth=(b&&b.thumbnailWidth)||165;
this._pos=(b&&b.pos)||500;
this._args=b||{};
this._animating=undefined;
this._currentIndex=0;
this._animationDuration="400ms";
this._templateDivs=[];
var d=this;
this._templateListener=function(e){d._buttonClick(this)
}
},render:function(){this._allTemplates=this._data.getData().templates;
this._skinParts.galleryContent.empty();
this._templateDivs=[];
this._renderTemplates(0,true);
this._animateDivs(this._pos*-1)
},_onAllSkinPartsReady:function(a){a.prevButton.addEvent("click",this._prevTemplates.bind(this));
a.nextButton.addEvent("click",this._nextTemplates.bind(this))
},_renderTemplates:function(j,c){var l=Math.min(this._numToShow,this._allTemplates.length);
for(var b=j;
b<l+j;
b++){var h=b;
if(h>=this._allTemplates.length){h=h-this._allTemplates.length
}var e;
if(c){e=this._pos+(this._thumbnailWidth*(b-j))
}else{e=(this._pos*-1)+(this._thumbnailWidth*(b-j))
}var d=new Element("div",{"class":"siteTemplate",id:this._allTemplates[h].id,styles:{left:(e)+"px"}});
if(c){this._templateDivs.push(d)
}else{this._templateDivs.unshift(d)
}var k=new Element("span",{"class":"templateWrap",templateId:this._allTemplates[h].templateId}).insertInto(d);
var f=this._args;
if(f.thumbnailWidth&&f.thumbnailHeight){this._templateDirectory="templates/"+f.thumbnailWidth+"x"+f.thumbnailHeight+"/"
}else{this._templateDirectory="templates/"
}var a=new Element("a",{html:this._allTemplates[h].name,styles:{background:"url("+W.Theme.getProperty("THEME_DIRECTORY")+this._templateDirectory+this._allTemplates[h].previewSource+") no-repeat center"}}).insertInto(k);
var g=this.injects().Components;
if(!c&&this._skinParts.galleryContent.getChildren().length){d.insertInto(this._skinParts.galleryContent.getChildren()[b-j],"before")
}else{d.insertInto(this._skinParts.galleryContent)
}d.addEvent("click",this._templateListener)
}},_nextTemplates:function(a){if(this._animating){return
}this._currentIndex+=this._numToShow;
if(this._currentIndex>=this._allTemplates.length){this._currentIndex=this._currentIndex-this._allTemplates.length
}this._renderTemplates(this._currentIndex,true);
this._animating="left";
this._animateDivs(this._pos*-1)
},_prevTemplates:function(a){if(this._animating){return
}this._currentIndex-=this._numToShow;
if(this._currentIndex<0){this._currentIndex=this._allTemplates.length+this._currentIndex
}this._renderTemplates(this._currentIndex,false);
this._animating="right";
this._animateDivs(this._pos)
},_animateDivs:function(d){for(var a=0;
a<this._templateDivs.length;
a++){var c=parseInt(this._templateDivs[a].getStyle("left"),10);
var b=new Fx.Tween(this._templateDivs[a],{duration:this._animationDuration,link:"cancel",property:"left"});
b.start(c,c+d)
}setTimeout(this._clearOldTemplates.bind(this),this._pos)
},_clearOldTemplates:function(b){var a;
if(this._templateDivs.length<this._numToShow+1){this._animating=undefined;
return
}if(this._animating=="left"){for(a=0;
a<this._numToShow;
a++){this._templateDivs.shift().removeFromDOM()
}}else{for(a=0;
a<this._numToShow;
a++){this._templateDivs.pop().removeFromDOM()
}}this._animating=undefined
},_buttonClick:function(a){if(!this.activeTemplate){this.activeTemplate=undefined
}this.clearSelection();
var b=a.getChildren()[0];
b.addClass("selected");
if(this._currentTemplate!=a.get("id")){this.fireEvent("templateSelected",{data:a.get("id"),templateId:b.get("templateid")});
this._currentTemplate=a.get("id")
}},clearSelection:function(){this._skinParts.galleryContent.getElements(".siteTemplate span").removeClass("selected");
this.activeTemplate=undefined;
this._currentTemplate=undefined
},getAcceptableDataTypes:function(){return["TemplateList"]
}}});
W.Components.newComponent({name:"mobile.editor.components.TemplateSelector",traits:["mobile.editor.components.traits.EditorFlowDispatcher"],imports:["mobile.editor.components.EditorButton"],skinParts:{templateHeader:{type:"htmlElement",autoBindDictionary:"CHOOSE_TEMPLATE_DIALOG_HEADER"},nextButton:{type:"mobile.editor.components.EditorButton",command:"TemplateSelector.SelectTemplate",autoBindDictionary:"NEXT_STEP_BUTTON"},templateGal:{type:"mobile.editor.components.TemplateGallery",dataQuery:"#TemplateSelectorData"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a);
this._templateSelected=this._templateSelected.bind(this);
this._command=W.Commands.registerCommandAndListener("TemplateSelector.SelectTemplate",this,this._onTemplateSelected)
},_onAllSkinPartsReady:function(){this._command.disable();
this._skinParts.templateGal.addEvent("templateSelected",this._templateSelected)
},_onTemplateSelected:function(){LOG.reportEvent(wixEvents.EDITOR_FLOW_TEMPLATE_CHOSEN,{g1:this.selectedTemplate.templateId,label:this.selectedTemplate.templateId});
this._command.disable();
this._reportEditorFlowEvent("gotoNextPage")
},_nextButtonClick:function(a){LOG.reportEvent(wixEvents.EDITOR_FLOW_TEMPLATE_CHOSEN,{g1:this.selectedTemplate.templateId,label:this.selectedTemplate.templateId});
this._skinParts.nextButton.disable();
this._reportEditorFlowEvent("gotoNextPage")
},_getTemplates:function(){return this._data.getData().templates
},_templateSelected:function(a){this.selectedTemplate=this._getTemplates().getByField("id",a.data);
this.setTemplateLoaded(false);
this._reportEditorFlowEvent("loadTemplate",this.selectedTemplate.templateId)
},setTemplateLoaded:function(a){if(a){this._command.enable()
}else{this._command.disable()
}},getAcceptableDataTypes:function(){return["TemplateList"]
}}});
W.Components.newComponent({name:"mobile.editor.components.ThemePanel",skinParts:{title:{type:"htmlElement"},properties:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(b,a,c){this.parent(b,a);
this.skinId=c
},render:function(){this._skinParts.title.set("html",this.skinId);
this._themeMgr=this.injects().Preview.getPreviewManagers().Theme;
this.injects().Preview.getPreviewManagers().Skins.getSkin(this.skinId,function(b){var c=b.prototype._params;
for(var a=0;
a<c.length;
a++){var d=c[a];
if(d.id=="THEME_DIRECTORY"){if(this.skinId!="mobile.core.skins.HeaderSkin"){continue
}else{this._createPropItem(d,true);
continue
}}this._createPropItem(d)
}}.bind(this))
},_onAllSkinPartsReady:function(a){a.title.addEvent("click",function(){this.togglePanel()
}.bind(this))
},togglePanel:function(){this._skinParts.properties.toggleCollapsed();
this._skinParts.title.toggleClass("selected")
},_createPropItem:function(e,a){var d=new Element("div");
d.setProperty("propId",e.id);
d.setProperty("propType",e.type);
var b=new Element("label").set("html",e.name).set("title",e.defaultTheme);
b.insertInto(d);
var c=new Element("input");
c.set("value",this._themeMgr.getProperty(e.id));
if(!a){c.addEvent("keyup",this._themePropChanged.bind(this,d));
c.addEvent("focus",this._propFocus.bind(this,d));
c.addEvent("blur",this._propFocus.bind(this,d))
}else{c.addEvent("keyup",this._refreshPropChanged.bind(this,d))
}c.insertInto(b);
d.insertInto(this._skinParts.properties)
},_propFocus:function(b,a){b.toggleClass("focused")
},_propBlur:function(b,a){},_refreshPropChanged:function(d,a){if(a.key!="enter"){return
}this._themePropChanged(d,a);
var c=d.getElement("input").get("value");
this._themeMgr.setProperty("BG_DIRECTORY",c);
this._themeMgr.setProperty("CONTACT_DIRECTORY",c+"/contact");
this._themeMgr.setProperty("NETWORKS_DIRECTORY",c+"/network");
this._themeMgr.setProperty("EXTERNAL_LINKS_DIRECTORY",c+"/external");
this._themeMgr.setProperty("PAGES_DIRECTORY",c+"/pages");
var b=W.Editor._siteId;
W.ServerFacade.saveDocument(b,W.Preview.getPreviewSite(),function(){W.Utils.debugTrace("document was save successfully");
W.Preview.clearPreviewDataChange();
this._lastSaveTime=new Date().getTime();
W.Editor.loadSite(b)
},function(f){W.Utils.errorPopup(W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_TITLE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_THEME"),f)
})
},_themePropChanged:function(d,b){if(b.key!="enter"){return
}var a=d.getProperty("propId");
var c=d.getElement("input").get("value");
this._themeMgr.setProperty(a,c)
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"mobile.editor.components.UploadButton",skinParts:{flashContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["up","over","down","disable"],initialize:function(c,a,b){this.parent(c,a,b);
this._flashLocation=W.Config.getServiceTopologyProperty("scriptsRoot")+"/flash/MediaUploader.swf"
},render:function(){var a={};
var c={};
c.quality="high";
c.bgcolor="#FAFAFA";
c.allowscriptaccess="always";
c.allowfullscreen="true";
c.wMode="window";
c.scale="noScale";
c.flashVars="serverRoot="+this.injects().Config.getServiceTopologyProperty("mediaServerRoot");
var b={};
b.id="UploadBTN";
b.name="UploadBTN";
b.align="middle";
this._flashObjID=W.Utils.getUniqueId("UploadBTNFlashCont");
this._skinParts.flashContainer.setProperty("id",this._flashObjID);
this._flashObj=swfobject.embedSWF(this._flashLocation,this._flashObjID,141,30,"10.0.0","playerProductInstall.swf",a,c,b)
},setUploadFileType:function(a){this._message="setFileType";
this._content=a;
setTimeout(this._doCallFlash.bind(this),1)
},_doCallFlash:function(){var a=this._getFlashObj("UploadBTN");
if(a&&a.sendToFlash){a.sendToFlash(this._message,this._content)
}else{setTimeout(this._doCallFlash.bind(this),1)
}},_getFlashObj:function(b){var a=navigator.appName.indexOf("Microsoft")!=-1;
return(a)?window[b]:document[b]
}}});
W.Components.newComponent({name:"mobile.editor.components.UploadProgressItem",imports:["mobile.core.components.base.BaseComponent"],skinParts:{progressBarInner:{type:"htmlElement"},progressBar:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["up","over","down","disable"],initialize:function(c,a,b){this.parent(c,a,b)
},updateData:function(a){this._skinParts.title.empty();
this._skinParts.title.appendText(a.name);
this._skinParts.progressBarInner.setStyle("width",Math.round(200*a.loaded/a.size))
}}});
W.Components.newComponent({name:"com.wix.mobile.editor.components.UploadProgressViewer",imports:["mobile.core.components.base.BaseComponent"],skinParts:{container:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["wait","progress","error","complete"],initialize:function(c,a,b){this.parent(c,a,b);
this.items=[]
},_onAllSkinPartsReady:function(a){this.setState("wait");
this.injects().UserMedia.addEvent("UploadProgressUpdate",this._onUploadProgress.bind(this));
this.injects().UserMedia.addEvent("UploadError",this._onUploadError.bind(this));
this.injects().UserMedia.addEvent("UploadComplete",this._onUploadComplete.bind(this))
},_onUploadError:function(a){LOG.reportError(wixErrors.UPLOAD_FAIL,this.className,"createStyleSheet","event"+a+"")
},_onUploadProgress:function(c){this.setState("progress");
var a=c.message;
W.Utils.debugTrace(this.items.length+" "+a.length);
for(var b=0;
b<a.length;
b++){if(b<this.items.length){this.items[b].getLogic().updateData(a[b])
}else{this.items[b]=W.Components.createComponent("mobile.editor.components.UploadProgressItem","mobile.editor.skins.UploadItemSkin","#moshe");
this.items[b].insertInto(this._skinParts.container)
}}},_onUploadComplete:function(a){this.setState("complete")
},buttonClick:function(){this.fireEvent("click")
}}});
W.Components.newComponent({name:"mobile.editor.components.dialogs.AddComponentDialog",skinParts:{content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onItemClick","_onItemDoubleClick"],initialize:function(c,b,a){this.parent(c,b);
this._dialogWindow=a.dialogWindow;
this._isComponentListReady=false;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing.bind(this));
this._componentTypes=[{name:this.injects().Resources.get("EDITOR_LANGUAGE","mobile.core.components.RichText"),icon:"text.png",component:{comp:"mobile.core.components.RichText",skin:"mobile.core.skins.RichTextSkin",data:{type:"RichText",text:"<p>Enter your text here</p>"}}},{name:this.injects().Resources.get("EDITOR_LANGUAGE","mobile.core.components.ServiceList"),icon:"service.png",component:{comp:"mobile.core.components.ServiceList",skin:"mobile.core.skins.ServiceListSkin",data:{type:"ServiceList",serviceType:"general"},dataRefs:{items:{isList:true,items:[{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_1"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_1")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_1"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_2"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_2")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_2"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_3"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_3")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_3"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}}]}}}},{name:this.injects().Resources.get("EDITOR_LANGUAGE","mobile.core.components.ContactList"),icon:"contact.png",component:{comp:"mobile.core.components.ContactList",skin:"mobile.core.skins.ContactListSkin",data:{type:"LinkList",subType:"CONTACT"},dataRefs:{items:{isList:true,items:[{data:{type:"Link",linkType:"CALL",text:"Call me",target:"212.000.0000"}},{data:{type:"Link",linkType:"SMS",text:"Send message",target:"212.000.0000"}},{data:{type:"Link",linkType:"MAP",text:"Find me",target:"10 West 18th Street, NY, NY"}}]}}}},{name:this.injects().Resources.get("EDITOR_LANGUAGE","mobile.core.components.NetworkList"),icon:"links.png",dataItemsRefField:"items",component:{comp:"mobile.core.components.NetworkList",skin:"mobile.core.skins.NetworkListSkin",data:{type:"LinkList",subType:"NETWORKS",items:[]},dataRefs:{items:{isList:true,items:[{data:{type:"Link",linkType:"FACEBOOK",text:"Facebook",target:"http://www.facebook.com/wix"}},{data:{type:"Link",linkType:"TWITTER",text:"Twitter",target:"http://www.twitter.com/wix"}},{data:{type:"Link",linkType:"MYSPACE",text:"Myspace",target:"http://www.myspace.com/wix"}}]}}}},{name:this.injects().Resources.get("EDITOR_LANGUAGE","mobile.core.components.PhotoGalleryGrid"),icon:"gallery.png",component:{comp:"mobile.core.components.PhotoGalleryGrid",skin:"mobile.core.skins.PhotoGalleryGridDefaultSkin",data:{type:"ImageList"},dataRefs:{items:{isList:true,items:[{data:{type:"Image",title:"robe slippers",uri:"3212653e959a6d968b59c6636ffbdfcf.wix_mp",description:"Some description here",width:2799,height:4296}},{data:{type:"Image",title:"spaniel",uri:"07b7c05c4c3cae426c348878c420e02f.wix_mp",description:"Some description here",width:1000,height:729}},{data:{type:"Image",title:"strawberies",uri:"ae3036720e0d57993aa11883e90a045b.wix_mp",description:"Some description here",width:1024,height:683}},{data:{type:"Image",title:"strech",uri:"a84f1530ca91bb12d978e78a71805cd9.wix_mp",description:"Some description here",width:1024,height:672}},{data:{type:"Image",title:"swim",uri:"b1e2678064bd5b154fa0dd9d2550a710.wix_mp",description:"Some description here",width:1000,height:662}},{data:{type:"Image",title:"tomato soup",uri:"119fc73a54f6abfe8c137dc43cceb917.wix_mp",description:"Some description here",width:512,height:768}},{data:{type:"Image",title:"vet",uri:"78de94c7aaf5fcdbc544de4927ce99b0.wix_mp",description:"Some description here",width:695,height:1000}},{data:{type:"Image",title:"yoga teachers",uri:"ac59be6e363ac6d5f0eff484de8cab3d.wix_mp",description:"Some description here",width:1024,height:683}},{data:{type:"Image",title:"white flowers",uri:"46b5a7f4a57a1aa718e99541196ecb26.wix_mp",description:"Some description here",width:2912,height:4368}}]}}}},{name:this.injects().Resources.get("EDITOR_LANGUAGE","mobile.core.components.Photo"),icon:"photo.png",component:{comp:"mobile.core.components.Photo",skin:"mobile.core.skins.PhotoSkin",data:{type:"Image",uri:"a84f1530ca91bb12d978e78a71805cd9.wix_mp",title:"",description:"",width:1024,height:672,metaData:{isPreset:false}}}}]
},setDialogOptions:function(a){this._callBack=a;
this._clearSelection();
this._view.fireEvent("dialogOptionsSet",this)
},_prepareForRender:function(){if(this._isComponentListReady){return true
}this._dialogWindow.setDialogOptions({width:500,title:this.injects().Resources.get("EDITOR_LANGUAGE","ADD_COMPONENT_DIALOG_HEADER"),buttonSet:W.EditorDialogs.DialogButtonSet.OK_CANCEL},function(){this._refreshLinkList(function(){this._renderIfReady()
}.bind(this))
}.bind(this));
return this._isComponentListReady
},_refreshLinkList:function(b){this._skinParts.content.empty();
this._dataItemMap={};
for(var a=0;
a<this._componentTypes.length;
a++){this._componentTypes[a].isReady=false;
this._createItem(this._componentTypes[a],function(c){c.isReady=true;
this._checkComponentListReady(b)
}.bind(this))
}},_checkComponentListReady:function(b){this._isComponentListReady=true;
for(var a=0;
a<this._componentTypes.length;
a++){if(!this._componentTypes[a].isReady){this._isComponentListReady=false;
break
}}if(this._isComponentListReady){if(b){b()
}}},_createItem:function(e,c){var d={type:"Image",title:e.name,uri:this.injects().Theme.getProperty("THEME_DIRECTORY")+"add_component/"+e.icon,description:"",height:"100",width:"100",borderSize:""};
var b=this.injects().Data.createDataItem(d);
var a=this.injects().Components.createComponent("mobile.editor.components.ImageButton","mobile.editor.skins.ImageButtonSkin",b,{useWebUrl:true},function(){c(e)
}.bind(this),function(f){f.addEvent("click",this._onItemClick);
f.addEvent("dblclick",this._onItemDoubleClick);
this._dataItemMap[a.get("id")]=e.component
}.bind(this));
a.setStyles({width:"100px",height:"130px","margin-bottom":"10px","float":"left"});
a.insertInto(this._skinParts.content)
},_onDialogClosing:function(a){if(a.result=="OK"){this._reportSelectedComponent()
}},_reportSelectedComponent:function(){if(this._callBack){var a=this._dataItemMap[this._selectedItem.getViewNode().get("id")];
this._callBack(a)
}},_onItemClick:function(b){var a=(this._selectedItem==b);
this._clearSelection();
if(!a){this._selectedItem=b;
b.setState("selected")
}if(this._selectedItem){this._dialogWindow.enableButton(this.injects().EditorDialogs.DialogButtons.OK)
}},_onItemDoubleClick:function(a){this._clearSelection();
this._onItemClick(a);
this._reportSelectedComponent();
this._dialogWindow.closeDialog()
},_clearSelection:function(){if(this._selectedItem){this._selectedItem.setState("up");
this._selectedItem=null
}this._dialogWindow.disableButton(this.injects().EditorDialogs.DialogButtons.OK)
}}});
W.Components.newComponent({name:"mobile.editor.components.dialogs.AddLinkDialog",skinParts:{content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._dialogOptionsSet=false;
var d=this;
this._linkListener=function(e){if(e.type=="click"){d._onItemClick(this)
}else{d._onDoubleClick(this)
}};
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing.bind(this))
},setDialogOptions:function(b,a){this._callBack=b;
this._clearSelection();
if(this._filter!=a){this._linkList=W.LinkTypes.getLinkTypesByMeta(a);
this._filter=a;
this._refreshLinkList(function(){this._view.fireEvent("dialogOptionsSet",this)
}.bind(this))
}else{this._view.fireEvent("dialogOptionsSet",this)
}},_prepareForRender:function(){if(this._dialogOptionsSet){return true
}this._dialogWindow.setDialogOptions({title:this.injects().Resources.get("EDITOR_LANGUAGE","ADD_LINK_DIALOG_HEADER"),buttonSet:W.EditorDialogs.DialogButtonSet.OK_CANCEL},function(){this._dialogOptionsSet=true;
this._renderIfReady()
}.bind(this));
return this._dialogOptionsSet
},_refreshLinkList:function(b){if(!this._skinParts||!this._skinParts.content||!this._linkList||!this._filter){return
}this._skinParts.content.empty();
var c=this._linkList.length;
this._linkCreationList={};
var a;
for(a in this._linkList){this._linkCreationList[a]={isReady:false}
}for(a in this._linkList){this._createItem(a,function(d){this._linkCreationList[d].isReady=true;
this._checkLinkListReady(b)
}.bind(this))
}},_checkLinkListReady:function(c){var b=true;
for(var a in this._linkCreationList){if(!this._linkCreationList[a].isReady){b=false;
break
}}if(b){if(c){c()
}}},_createItem:function(a,e){var b={type:"Link",linkType:a,text:this._linkList[a].text,target:""};
var d=this.injects().Data.createDataItem(b);
var c=this.injects().Components.createComponent("mobile.core.components.MenuButton","mobile.editor.skins.dialogs.AddLinkItem",d,{listSubType:this._filter},function(){c.insertInto(this._skinParts.content);
e(a)
}.bind(this));
c.addEvent("click",this._linkListener);
c.addEvent("dblclick",this._linkListener)
},_onDialogClosing:function(a){if(a.result=="OK"){this._reportSelectedLink()
}},_reportSelectedLink:function(){if(this._callBack){var a=this.injects().LinkTypes.getNewLink(this._selectedItem._data.get("linkType"));
this._callBack(a)
}},_onItemClick:function(b){var a=(this._selectedItem==b.getLogic());
this._clearSelection();
if(!a){this._selectedItem=b.getLogic();
b.getLogic().setState("selected")
}if(this._selectedItem){this._dialogWindow.enableButton(this.injects().EditorDialogs.DialogButtons.OK)
}},_onDoubleClick:function(a){this._clearSelection();
this._onItemClick(a);
this._reportSelectedLink();
this._dialogWindow.closeDialog()
},_clearSelection:function(){if(this._selectedItem){this._selectedItem.setState("idle");
this._selectedItem=null
}this._dialogWindow.disableButton(this.injects().EditorDialogs.DialogButtons.OK)
}}});
W.Components.newComponent({name:"mobile.editor.components.dialogs.AddPageDialog",skinParts:{content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b);
this._dialogWindow=a.dialogWindow;
this._dialogOptionsSet=false;
var d=this;
this._linkListener=function(e){if(e.type=="click"){d._onItemClick(this)
}else{d._onItemDoubleClick(this)
}};
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing.bind(this));
this._pageTypes=[{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_GALLERY"),icon:"add_link.png",menuButtonIcon:"gallery.png",previewPic:"gallery.jpg",componentList:[{comp:"mobile.core.components.PhotoGalleryGrid",skin:"mobile.core.skins.PhotoGalleryGridDefaultSkin",data:{type:"ImageList"},dataRefs:{items:{isList:true,items:[{data:{type:"Image",title:"robe slippers",uri:"3212653e959a6d968b59c6636ffbdfcf.wix_mp",description:"Some description here",width:2799,height:4296}},{data:{type:"Image",title:"spaniel",uri:"07b7c05c4c3cae426c348878c420e02f.wix_mp",description:"Some description here",width:1000,height:729}},{data:{type:"Image",title:"strawberies",uri:"ae3036720e0d57993aa11883e90a045b.wix_mp",description:"Some description here",width:1024,height:683}},{data:{type:"Image",title:"strech",uri:"a84f1530ca91bb12d978e78a71805cd9.wix_mp",description:"Some description here",width:1024,height:672}},{data:{type:"Image",title:"swim",uri:"b1e2678064bd5b154fa0dd9d2550a710.wix_mp",description:"Some description here",width:1000,height:662}},{data:{type:"Image",title:"tomato soup",uri:"119fc73a54f6abfe8c137dc43cceb917.wix_mp",description:"Some description here",width:512,height:768}},{data:{type:"Image",title:"vet",uri:"78de94c7aaf5fcdbc544de4927ce99b0.wix_mp",description:"Some description here",width:695,height:1000}},{data:{type:"Image",title:"yoga teachers",uri:"ac59be6e363ac6d5f0eff484de8cab3d.wix_mp",description:"Some description here",width:1024,height:683}},{data:{type:"Image",title:"white flowers",uri:"46b5a7f4a57a1aa718e99541196ecb26.wix_mp",description:"Some description here",width:2912,height:4368}}]}}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_ABOUT"),icon:"add_link.png",previewPic:"about.jpg",menuButtonIcon:"about.png",componentList:[{comp:"mobile.core.components.RichText",skin:"mobile.core.skins.RichTextSkin",data:{type:"RichText",text:"<p>Enter your text here</p>"}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_SERVICES"),icon:"add_link.png",menuButtonIcon:"services.png",previewPic:"services.jpg",componentList:[{comp:"mobile.core.components.ServiceList",skin:"mobile.core.skins.ServiceListSkin",data:{type:"ServiceList",serviceType:"general"},dataRefs:{items:{isList:true,items:[{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_1"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_1")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_1"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_2"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_2")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_2"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_3"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_3")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_3"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}}]}}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_EVENTS"),icon:"add_link.png",menuButtonIcon:"event.png",previewPic:"events.jpg",componentList:[{comp:"mobile.core.components.ServiceList",skin:"mobile.core.skins.ServiceListSkin",data:{type:"ServiceList",serviceType:"events"},dataRefs:{items:{isList:true,items:[{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_TITLE_1"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_DESCRIPTION_1")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_IMAGE_ID_1"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_TITLE_2"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_DESCRIPTION_2")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_IMAGE_ID_2"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_TITLE_3"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_DESCRIPTION_3")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_IMAGE_ID_3"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}}]}}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_COLLECTION"),icon:"add_link.png",menuButtonIcon:"collection.png",previewPic:"collection.jpg",componentList:[{comp:"mobile.core.components.ServiceList",skin:"mobile.core.skins.ServiceListSkin",data:{type:"ServiceList",serviceType:"collection"},dataRefs:{items:{isList:true,items:[{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_TITLE_1"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_DESCRIPTION_1")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_IMAGE_ID_1"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_TITLE_2"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_DESCRIPTION_2")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_IMAGE_ID_2"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_TITLE_3"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_DESCRIPTION_3")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_IMAGE_ID_3"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}}]}}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_RESTAURANT"),icon:"add_link.png",menuButtonIcon:"restaurant.png",previewPic:"restaurant.jpg",componentList:[{comp:"mobile.core.components.ServiceList",skin:"mobile.core.skins.ServiceListSkin",data:{type:"ServiceList",serviceType:"restaurant"},dataRefs:{items:{isList:true,items:[{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_TITLE_1"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_DESCRIPTION_1")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_IMAGE_ID_1"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_TITLE_2"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_DESCRIPTION_2")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_IMAGE_ID_2"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}},{data:{type:"Service",title:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_TITLE_3"),description:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_DESCRIPTION_3")},dataRefs:{image:{data:{type:"Image",uri:this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_IMAGE_ID_3"),title:"",description:"",width:"93",height:"128",metaData:{isPreset:false}}}}}]}}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_CONTACT"),icon:"add_link.png",previewPic:"contact.jpg",menuButtonIcon:"contact.png",componentList:[{comp:"mobile.core.components.ContactList",skin:"mobile.core.skins.ContactListSkin",data:{type:"LinkList",subType:"CONTACT"},dataRefs:{items:{isList:true,items:[{data:{type:"Link",linkType:"CALL",text:"Call me",target:"212.000.0000"}},{data:{type:"Link",linkType:"SMS",text:"Send message",target:"212.000.0000"}},{data:{type:"Link",linkType:"MAP",text:"Find me",target:"10 West 18th Street, NY, NY"}}]}}}]},{name:this.injects().Resources.get("EDITOR_LANGUAGE","PAGE_TITLE_NETWORK"),icon:"add_link.png",previewPic:"network.jpg",menuButtonIcon:"networks.png",dataItemsRefField:"items",componentList:[{comp:"mobile.core.components.NetworkList",skin:"mobile.core.skins.NetworkListSkin",data:{type:"LinkList",subType:"NETWORKS",items:[]},dataRefs:{items:{isList:true,items:[{data:{type:"Link",linkType:"FACEBOOK",text:"Facebook",target:"http://www.facebook.com/wix"}},{data:{type:"Link",linkType:"TWITTER",text:"Twitter",target:"http://www.twitter.com/wix"}},{data:{type:"Link",linkType:"MYSPACE",text:"Myspace",target:"http://www.myspace.com/wix"}}]}}}]}]
},setDialogOptions:function(a){this._callBack=a;
this._clearSelection();
this._view.fireEvent("dialogOptionsSet",this)
},_refreshLinkList:function(b){if(!this._skinParts||!this._skinParts.content){return
}this._skinParts.content.empty();
for(var a=0;
a<this._pageTypes.length;
a++){this._pageTypes[a].isReady=false;
this._createItem(this._pageTypes[a],function(c){c.isReady=true;
this._checkPageListReady(b)
}.bind(this))
}},_checkPageListReady:function(c){var a=true;
for(var b=0;
b<this._pageTypes.length;
b++){if(!this._pageTypes[b].isReady){a=false;
break
}}if(a){if(c){c()
}}},_createItem:function(b,e){var a={type:"Link",linkType:"FREE_LINK",text:b.name,icon:b.icon,target:"",additionalObj:b};
var d=this.injects().Data.createDataItem(a);
var c=this.injects().Components.createComponent("mobile.core.components.MenuButton","mobile.editor.skins.dialogs.AddLinkItem",d,{listSubType:"PAGES"},e(b));
c.setStyles({width:"100%","margin-bottom":"8px"});
c.addEvent("click",this._linkListener);
c.addEvent("dblclick",this._linkListener);
c.insertInto(this._skinParts.content)
},_onDialogClosing:function(a){if(a.result=="OK"){this._reportSelectedLink()
}},_reportSelectedLink:function(){if(this._callBack){var a=this._selectedItem._data.get("additionalObj");
this._callBack(a)
}},_onItemClick:function(b){var a=(this._selectedItem==b.getLogic());
this._clearSelection();
if(!a){this._selectedItem=b.getLogic();
b.getLogic().setState("selected")
}if(this._selectedItem){this._dialogWindow.enableButton(this.injects().EditorDialogs.DialogButtons.OK);
this._skinParts.preview.set("src",this._getPreviewRoot()+this._selectedItem._data.get("additionalObj").previewPic)
}},_onItemDoubleClick:function(a){this._clearSelection();
this._onItemClick(a);
this._reportSelectedLink();
this._dialogWindow.closeDialog()
},_clearSelection:function(){if(this._selectedItem){this._selectedItem.setState("idle");
this._selectedItem=null
}this._dialogWindow.disableButton(this.injects().EditorDialogs.DialogButtons.OK);
this._skinParts.preview.set("src",this._getPreviewRoot()+"unselected.jpg")
},_getPreviewRoot:function(){return this.injects().Theme.getProperty("THEME_DIRECTORY")+"addPage/"
},_prepareForRender:function(){if(this._dialogOptionsSet){return true
}this._dialogWindow.setDialogOptions({width:500,title:this.injects().Resources.get("EDITOR_LANGUAGE","ADD_PAGE_DIALOG_HEADER"),buttonSet:W.EditorDialogs.DialogButtonSet.OK_CANCEL},function(){this._refreshLinkList(function(){this._dialogOptionsSet=true;
this._renderIfReady()
}.bind(this))
}.bind(this));
return this._dialogOptionsSet
}}});
Constants.DialogWindow={CLICK_OUTSIDE:"ClickOutside",POSITIONS:{DYNAMIC:"dynamic",CENTER:"center",TOP:"top",SIDE:"side",ORIGIN:{x:92,y:65},OFFSET:{x:20,y:20}},TYPES:{MODAL:"modal",SEMI_MODAL:"semiModal",NON_MODAL:"nonModal"},DEFAULT:{WIDTH:480,MIN_HEIGHT:150,MAX_HEIGHT:650,TOP:10,HEIGHT_OFFSET:70,BOUNDARY_OFFSET:20}};
W.Components.newComponent({name:"mobile.editor.components.dialogs.DialogWindow",skinParts:{blockLayer:{type:"htmlElement"},innerDialog:{type:"htmlElement"},dialogBox:{type:"htmlElement"},dialogToolbar:{type:"htmlElement"},dialogTitle:{type:"htmlElement"},dialogSubTitle:{type:"htmlElement",optional:true},dialogIcon:{type:"htmlElement",optional:true},helplet:{type:"htmlElement"},dialogDescription:{type:"htmlElement"},buttonContainer:{type:"htmlElement"},tabs:{type:"htmlElement"},okContainer:{type:"htmlElement"},cancelContainer:{type:"htmlElement"},xButton:{type:"htmlElement"},dragArea:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{windowType:[Constants.DialogWindow.TYPES.MODAL,Constants.DialogWindow.TYPES.SEMI_MODAL,Constants.DialogWindow.TYPES.NON_MODAL],helpLocation:["normalHelpLocation","topHelpLocation"]},_renderTriggers:[Constants.DisplayEvents.ADDED_TO_DOM,Constants.DisplayEvents.DISPLAYED,Constants.DisplayEvents.DISPLAY_CHANGED],Binds:["closeDialog","_innerDialogReady","_onButtonReady","_closeOnOutsideClick","_blockMouseEventsOnDialog","_unBlockMouseEventsOnDialog","_setDialogHeightRelativeToWindowHeight","_tabChanged"],Static:{DRAG_OFFSET:40},initialize:function(c,b,a){this.parent(c,b,a);
this._currentTabNode=null;
this._clearButtons();
this._heightCalcTimerCounter=0;
this._heightCalcTimerCounterMax=4
},setDialog:function(c,d,b,a){b=b||{};
b.dialogWindow=this;
b.callback=b.callback||function(){};
this._componentView=W.Components.createComponent(c,d,a,b,undefined,this._innerDialogReady);
this.addEvent("onDialogClosing",b.callback)
},setMaxMinHeight:function(a,b){this._maxHeight=a||this._maxHeight||Constants.DialogWindow.DEFAULT.MAX_HEIGHT;
this._minHeight=b||this._minHeight||Constants.DialogWindow.DEFAULT.MIN_HEIGHT;
this._skinParts.innerDialog.setStyle("max-height",this._maxHeight+"px");
this._skinParts.innerDialog.setStyle("min-height",this._minHeight+"px")
},setWidth:function(a){this._width=a||Constants.DialogWindow.DEFAULT.WIDTH;
this._skinParts.dialogBox.setStyle("width",this._width+"px")
},setTitle:function(a){this._skinParts.dialogTitle.set("html",a||"")
},setSubTitle:function(a){this._skinParts.dialogSubTitle&&this._skinParts.dialogSubTitle.set("html",a||"")
},setIcon:function(a){this._skinParts.dialogIcon&&this._skinParts.dialogIcon.setStyle("background-image","url("+a+")"||"")
},_setOptions:function(a){this._left=a.left||this._left||0;
this._top=a.top||this._top||0;
this._height=a.height||this._height||"auto";
this._minHeight=a.minHeight||this._minHeight||0;
this._maxHeight=a.maxHeight||this._maxHeight||0;
this._width=a.width||this._width||"auto";
this._allowDrag=a.allowDrag||this._allowDrag||false;
this._position=a.position||this._position||Constants.DialogWindow.POSITIONS.CENTER;
this._level=a.level||this._level||0
},setPositionByType:function(a,c,b,d){switch(a){case Constants.DialogWindow.POSITIONS.TOP:this._setPositionToTop();
break;
case Constants.DialogWindow.POSITIONS.SIDE:this._setPositionToScreenSides(b,d);
break;
case Constants.DialogWindow.POSITIONS.DYNAMIC:this._setPosition(c,b);
break;
case Constants.DialogWindow.POSITIONS.CENTER:default:this._setPositionToCenter()
}},_setPosition:function(b,a){this._top=isNaN(b)?0:b;
this._left=isNaN(a)?0:a;
this._skinParts.dialogBox.setStyles({top:this._top+"px",left:this._left+"px"})
},_setPositionToScreenSides:function(e,a){e=e||0;
a=a||0;
var i=Constants.DialogWindow.POSITIONS.ORIGIN;
var f=Constants.DialogWindow.POSITIONS.OFFSET;
var b=this.injects().Utils.getWindowSize().width;
var g=this._skinParts.dialogBox.getSize().x;
var d=(e>b/2);
var h=i.y;
var c=i.x+(a*f.x);
if(d){c=b-g-c
}this._setPosition(h,c)
},_setPositionToCenter:function(c){var a=this.injects().Utils.getWindowSize();
var e=(this._height==="auto")?this._skinParts.innerDialog.scrollHeight:this._height;
var f=this._minHeight||0;
var d=this._skinParts.dialogBox.getSize();
d.y=Math.max(e,f,d.y);
var b=Constants.DialogWindow.DEFAULT.TOP;
if(!isNaN(c)){b=c
}else{if(a.height>d.y){b=(a.height/2)-(d.y/2)
}}var g=(a.width/2)-(d.x/2);
this._setPosition(b,g)
},_setPositionToTop:function(){this._setPositionToCenter(0)
},setDescription:function(b){this._skinParts.dialogDescription.setCollapsed(!b);
if(this._skinParts.helplet){var a=b?-10:0;
this._skinParts.helplet.setStyle("margin-top",a);
this._skinParts.helplet.setStyle("display","inline-block")
}this._skinParts.dialogDescription.set("html",b)
},setHelpLink:function(a){if(!this._skinParts.helplet||this._helpletLinkWasAlreadySet){return
}this._helpletLinkWasAlreadySet=true;
this._helplet=a;
if(a){if(this.injects().Resources.exist("EDITOR_LANGUAGE",a)){this._label=this.injects().Resources.get("EDITOR_LANGUAGE",a)
}else{if(a.indexOf("ADVANCED_STYLING")===0){this._label=this.injects().Resources.get("EDITOR_LANGUAGE","ADVANCED_STYLING_LEARN_MORE")
}else{this._label=this.injects().Resources.get("EDITOR_LANGUAGE","HELPLET_LEARN_MORE")
}}}this._skinParts.helplet.set("html",this._label);
this._skinParts.helplet.setCollapsed(!a);
this._skinParts.helplet.addEvent("click",function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog",this._helplet)
}.bind(this))
},setDialogOptions:function(a,b){a=a||{};
if(a.eventData){LOG.reportError("Someone called DialogWindow with deprecated param eventData, please use top and left instead","mobile.editor.components.dialogs.DialogWindow","setDialogOptions")
}this._optionsReadyCallback=b;
this._setOptions(a);
this._modalMode=(a.nonModal&&Constants.DialogWindow.TYPES.NON_MODAL)||(a.semiModal&&Constants.DialogWindow.TYPES.SEMI_MODAL)||Constants.DialogWindow.TYPES.MODAL;
this.setTitle(a.title);
this.setDescription(a.description);
this.setHelpLink(a.helplet,true);
this.setWidth(this._width);
this.setMaxMinHeight(this._maxHeight,this._minHeight);
this._setDialogHeightRelativeToWindowHeight();
this._enableDrag(a.allowDrag);
if(!Browser.safari){this._setupButtons(a.buttonSet||W.EditorDialogs.DialogButtonSet.OK)
}else{setTimeout(function(){this._setupButtons(a.buttonSet||W.EditorDialogs.DialogButtonSet.OK)
}.bind(this),120)
}this.setState(this._modalMode);
this._skinParts.blockLayer.addEvent(Constants.CoreEvents.CLICK,this._closeOnOutsideClick);
this._skinParts.dialogToolbar.setCollapsed(!a.showToolbar);
this._skinParts.tabs.setCollapsed(!a.tabs);
this._checkDialogOptionsSet()
},_closeOnOutsideClick:function(a){if(this._modalMode==Constants.DialogWindow.TYPES.SEMI_MODAL){this.fireEvent("onDialogClosing",{result:Constants.DialogWindow.CLICK_OUTSIDE});
this.closeDialog();
this.injects().EditorDialogs.passClickToNextDialog(a.page.x,a.page.y)
}},_measureDialogDetailsHeight:function(){var a=this._dialogDetailsHeight||this._skinParts.dialogDescription.getSize().y+this._skinParts.dialogTitle.getSize().y+this._skinParts.helplet.getSize().y+this._skinParts.dialogToolbar.getSize().y+this._skinParts.buttonContainer.getSize().y;
return a
},_measureInnerDialogHeight:function(){return(this._height==="auto")?this._skinParts.innerDialog.scrollHeight:this._height
},_setDialogHeightRelativeToWindowHeight:function(a){this._currentInnerDialogHeight=this._measureInnerDialogHeight();
this._dialogDetailsHeight=this._measureDialogDetailsHeight();
this._repositionIfOutOfBounds();
if(this._measureAgainLater()){return
}this._calculatedHeight=window.getSize().y-this._dialogDetailsHeight-Constants.DialogWindow.DEFAULT.HEIGHT_OFFSET;
if(this._calculatedHeight<this._currentInnerDialogHeight){this._skinParts.innerDialog.setStyle("height",this._calculatedHeight)
}else{this._skinParts.innerDialog.setStyle("height",this._height)
}this._fitDialogToWindowBoundaries()
},_repositionIfOutOfBounds:function(){if(this._position!==Constants.DialogWindow.POSITIONS.DYNAMIC){return
}var e=this._skinParts.dialogBox.getSize();
var a=e.y;
var b=e.x;
var f=window.getSize();
var d=this._top;
var c=this._left;
if(this._top+a>f.y){d=f.y-a-Constants.DialogWindow.DEFAULT.BOUNDARY_OFFSET
}if(this._left+b>f.x){c=f.x-b-Constants.DialogWindow.DEFAULT.BOUNDARY_OFFSET
}if(d!=this._top||c!=this.left){this._setPosition(d,c)
}},_measureAgainLater:function(){if(this._heightCalcTimerCounter<this._heightCalcTimerCounterMax){this._heightCalcTimerCounter++;
this._heightCalcTimer=setTimeout(this._setDialogHeightRelativeToWindowHeight,300);
return true
}this._heightCalcTimerCounter=0
},_fitDialogToWindowBoundaries:function(){if(this._position===Constants.DialogWindow.POSITIONS.CENTER||this._position===Constants.DialogWindow.POSITIONS.TOP){if(!this._allowDrag){this.setPositionByType(this._position)
}}},_enableDrag:function(b){if(!b){return
}this._skinParts.dragArea.uncollapse();
var c=window.getSize();
var a={x:[10,c.x-this.DRAG_OFFSET],y:[this.DRAG_OFFSET,c.y-this.DRAG_OFFSET]};
this._drag=new Drag.Move(this._skinParts.dialogBox,{snap:0,handle:this._skinParts.dragArea,onStart:this._blockMouseEventsOnDialog,onComplete:this._unBlockMouseEventsOnDialog,limit:a})
},_blockMouseEventsOnDialog:function(){this._skinParts.dragArea.setStyles({height:"100%",width:"100%"})
},_unBlockMouseEventsOnDialog:function(){this._skinParts.dragArea.setStyles({height:null,width:null})
},_checkDialogOptionsSet:function(){var b=true;
if(this._buttonsMap){b=false;
var a=0;
for(var c in this._buttonsMap){if(this._buttonsMap[c].buttonWixified){a++
}}if(a==this._buttons.length){b=true
}}if(b){if(this._optionsReadyCallback){this._optionsReadyCallback()
}}},_addButton:function(f,e,a,b){var d="mobile.editor.skins.EditorButtonBlueSkin";
if(a=="red"){d="mobile.editor.skins.EditorButtonRedSkin"
}var c=this.injects().Components.createComponent("mobile.editor.components.EditorButton",d,null,{label:this.injects().Resources.get("EDITOR_LANGUAGE",f+"_BUTTON"),state:(e)?"enabled":"disabled",initialState:a},null,this._onButtonReady);
c.addEvent("buttonClick",this._onButtonClicked.bind(this,f));
this._buttons.push(c);
c.insertInto(b);
this._buttonsMap[f]=c;
this._buttonPreReadyIsEnable[f]=e
},_onButtonReady:function(a){a.getViewNode().buttonWixified=true;
this._checkDialogOptionsSet()
},_clearButtons:function(){if(this._buttons){this._buttons.forEach(function(a){a.dispose()
})
}this._buttons=[];
this._buttonsMap={};
this._buttonPreReadyIsEnable={}
},_setupButtons:function(b){this._clearButtons();
this._skinParts.okContainer.empty();
this._skinParts.cancelContainer.empty();
var a=0;
if(!b.length){this._skinParts.buttonContainer.collapse()
}else{b.forEach(function(c){if(c==W.EditorDialogs.DialogButtons.OK||c==W.EditorDialogs.DialogButtons.YES||c==W.EditorDialogs.DialogButtons.DONE){this._addButton(c,true,null,this._skinParts.okContainer)
}if(c==W.EditorDialogs.DialogButtons.DELETE){this._addButton(c,true,"red",this._skinParts.okContainer)
}else{if(c==W.EditorDialogs.DialogButtons.CANCEL||c==W.EditorDialogs.DialogButtons.NO){this._addButton(c,true,"grayed",this._skinParts.cancelContainer)
}}}.bind(this))
}},triggerConfirmButton:function(a){if(!!this._buttonsMap[W.EditorDialogs.DialogButtons.OK]){this._onButtonClicked(W.EditorDialogs.DialogButtons.OK);
return true
}else{if(!!this._buttonsMap[W.EditorDialogs.DialogButtons.YES]){this._onButtonClicked(W.EditorDialogs.DialogButtons.YES);
return true
}else{if(!!this._buttonsMap[W.EditorDialogs.DialogButtons.DELETE]){this._onButtonClicked(W.EditorDialogs.DialogButtons.DELETE);
return true
}}}return false
},triggerCancelButton:function(){if(!!this._buttonsMap[W.EditorDialogs.DialogButtons.CANCEL]){this._onButtonClicked(W.EditorDialogs.DialogButtons.CANCEL);
return true
}else{if(!!this._buttonsMap[W.EditorDialogs.DialogButtons.NO]!==null){this._onButtonClicked(W.EditorDialogs.DialogButtons.NO);
return true
}}return false
},forceTriggerCancelButton:function(){this._onButtonClicked(W.EditorDialogs.DialogButtons.CANCEL)
},_onButtonClicked:function(b){var a=this._buttonsMap[b];
if(!a||(a&&a.getLogic&&a.getLogic().isEnabled())){this.fireEvent("onDialogClosing",{result:b});
this.closeDialog()
}},endDialog:function(a){this._onButtonClicked(a)
},_innerDialogReady:function(){this._componentView.insertInto(this._skinParts.innerDialog);
this._view.fireEvent("innerDialogReady")
},getInnerDialog:function(){return this._componentView
},openDialog:function(a){a=a||{};
var b=W.Editor.getDialogLayer();
if(b&&this._view){this._view.insertInto(b)
}this._setOptions(a);
this.setPositionByType(this._position,this._top,this._left,this._level);
window.addEvent(Constants.CoreEvents.RESIZE,this._setDialogHeightRelativeToWindowHeight)
},closeDialog:function(){var a=$$("body");
a.removeEvent("keyup",this._onKeyUp);
window.removeEvent(Constants.CoreEvents.RESIZE,this._setDialogHeightRelativeToWindowHeight);
this._view.removeFromDOM();
this.injects().Utils.forceBrowserRepaint();
this._view.fireEvent("dialogClosed")
},_onAllSkinPartsReady:function(){this._skinParts.xButton.addEvent(Constants.CoreEvents.CLICK,this._onButtonClicked.bind(this,W.EditorDialogs.DialogButtons.CANCEL));
this._skinParts.tabs.addEvent(Constants.CoreEvents.CLICK,this._tabChanged)
},addToolbarControl:function(a){a.insertInto(this._skinParts.dialogToolbar);
a.addClass("controlBtn")
},_tabChanged:function(d,f){if(!d||!d.target||d.target==this._skinParts.tabs||(d.target==this._currentTabNode&&!f)){return
}var c=d.target;
var b=this._skinParts.tabs.childNodes;
for(var a=0;
a<b.length;
a++){if(b[a]!=c){b[a].removeClass("selectedTab")
}else{b[a].addClass("selectedTab")
}}this._currentTabNode=d.target;
this.fireEvent("tabChanged",c.get("rel"))
},switchToTabIndex:function(a){this._tabChanged({target:new Element(this._skinParts.tabs.getChildren()[a])})
},clearTabs:function(){this._skinParts.tabs.empty()
},addTab:function(b,a,c){var d=new Element("div",{"class":"tab",rel:a,skinPart:c}).insertInto(this._skinParts.tabs);
d.set("html",b)
},setButtonState:function(a,b){var c=this._buttonsMap[a];
if(c&&c.getLogic){c.getLogic().setState(b)
}else{this._buttonPreReadyIsEnable[a]=false
}},enableButton:function(a){var b=this._buttonsMap[a];
if(b&&b.getLogic){b.getLogic().enable()
}else{this._buttonPreReadyIsEnable[a]=false
}},disableButton:function(a){var b=this._buttonsMap[a];
if(b&&b.getLogic){b.getLogic().disable()
}else{this._buttonPreReadyIsEnable[a]=false
}},getModalMode:function(){return this._modalMode
},getDialogBoxCoordinates:function(){return this._skinParts.dialogBox.getCoordinates()
}}});
W.Components.newComponent({name:"mobile.editor.components.dialogs.ErrorDialog",skinParts:{error:{type:"htmlElement"},details:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing.bind(this))
},setDialogOptions:function(e,c,a,d,f,b){this._callBack=d;
this._content=c;
this._details=a;
f=f||{};
if(!f.title){f.title=e
}if(!f.description){f.description=b
}if(!f.buttonSet){f.buttonSet=W.EditorDialogs.DialogButtonSet.OK
}this._dialogWindow.setDialogOptions(f);
this._refreshView();
this._view.fireEvent("dialogOptionsSet",this)
},_refreshView:function(){if(!this._skinParts||!this._skinParts.error){return
}this._skinParts.error.set("html",this._content);
if(this._details){this._skinParts.details.set("html",this._details)
}else{this._skinParts.details.set("html","")
}},_onDialogClosing:function(a){if(this._callBack){this._callBack({result:a.result})
}},render:function(){this._refreshView()
}}});
W.Components.newComponent({name:"mobile.editor.components.dialogs.MediaDialog",skinParts:{content:{type:"htmlElement"},pageController:{type:"mobile.editor.components.PageControllerSimple"},progressOuter:{type:"htmlElement"},progressInner:{type:"htmlElement"},errorContent:{type:"htmlElement"},uploadBTN:{type:"mobile.editor.components.UploadButton"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_userMediaUpdate","_onOK","_onUploadProgress","_onUploadError","_onValidationError","_changePageIndex"],_states:{dialog:["normal","blockUser"],tabs:["hasTabs"]},initialize:function(d,b,a){this.parent(d,b,a);
this._dialogWindow=a&&a.dialogWindow;
this._dialogOptionsSet=false;
this._galleryConfigurations={backgrounds:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_PHOTOS"),skinpart:"yourPicsTab",listID:"user_photos",allowDelete:true},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_BACKGROUNDS"),skinpart:"wixBgTab",listID:"backgrounds"},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_PATTERNS"),skinpart:"wixPatternsTab",listID:"backgroundPatterns"},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_TEXTURES"),skinpart:"wixTexturesTab",listID:"backgroundTextures"}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_IMAGE"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_IMAGES"),extensions:"*.jpg;*.gif;*.png;*.jpeg",macExtensions:"*.jpg;*.gif;*.png;*.jpeg",wixType:"media",compType:"photo",mediaS:"media"},onUpdateIndex:0},photos:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_PHOTOS"),skinpart:"wixPicsTab",listID:"user_photos",allowDelete:true},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_PHOTOS"),skinpart:"yourPicsTab",listID:"photos"}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_IMAGE"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_IMAGES"),extensions:"*.jpg;*.gif;*.png;*.jpeg",macExtensions:"*.jpg;*.gif;*.png;*.jpeg",wixType:"media",compType:"photo",mediaS:"media"},onUpdateIndex:0},clipart:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_CLIPART"),skinpart:"yourPicsTab",listID:"clipart"},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_PHOTOS"),skinpart:"wixPicsTab",listID:"user_photos",allowDelete:true}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_IMAGE"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_IMAGES"),extensions:"*.jpg;*.gif;*.png;*.jpeg",macExtensions:"*.jpg;*.gif;*.png;*.jpeg",wixType:"media",compType:"photo",mediaS:"media"},onUpdateIndex:1},icons:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_ICONS"),skinpart:"wixIconsTab",listID:"icons"},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_PHOTOS"),skinpart:"wixPicsTab",listID:"user_photos",allowDelete:true}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_ICON"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_IMAGES"),extensions:"*.jpg;*.gif;*.png;*.jpeg",macExtensions:"*.jpg;*.gif;*.png;*.jpeg",wixType:"media",compType:"photo",mediaS:"picture"},onUpdateIndex:1},social_icons:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_SOCIAL_ICONS"),skinpart:"wixSocialIconsTab",listID:"social_icons"},{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_PHOTOS"),skinpart:"wixPicsTab",listID:"user_photos",allowDelete:true}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_ICON"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_IMAGES"),extensions:"*.jpg;*.gif;*.png;*.jpeg",macExtensions:"*.jpg;*.gif;*.png;*.jpeg",wixType:"media",compType:"photo",mediaS:"media"},onUpdateIndex:1},favicon:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_CLIPART"),skinpart:"yourPicsTab",listID:"user_favicons",allowDelete:true}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_ICON"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_IMAGES"),extensions:"*.jpg;*.gif;*.png;*.jpeg",macExtensions:"*.jpg;*.gif;*.png;*.jpeg",wixType:"site_icon",compType:"ficons",mediaS:"ficons"},onUpdateIndex:0},documents:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_DOCS"),skinpart:"wixPicsTab",listID:"user_docs",allowDelete:true}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_GENERAL"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_DOCS"),extensions:"*.doc;*.docx;*.pdf;*.xls;*.xlsx;*.ppt;*.pptx;*.odf;*.odt;",macExtensions:"*.doc;*.docx;*.pdf;*.xls;*.xlsx;*.ppt;*.pptx;*.odf;*.odt;",wixType:"document",compType:"document",mediaS:"ugd"},onUpdateIndex:0},swf:{tabs:[{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_SWF"),skinpart:"wixSwfTab",listID:"user_swf",allowDelete:true}],uploadFileType:{label:this.injects().Resources.get("EDITOR_LANGUAGE","UPLOAD_SWF"),description:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_SWFS"),extensions:"*.swf;",macExtensions:"*.swf",wixType:"swf",compType:"picture",mediaS:"media"},onUpdateIndex:0}};
this._galleryConfigurations.SlideShowGallery=this._galleryConfigurations.photos;
this._galleryConfigurations.MatrixGallery=this._galleryConfigurations.photos;
this._galleryConfigurations.SliderGallery=this._galleryConfigurations.photos;
this._tabNamesMap={UserMedia:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_PHOTOS"),skinpart:"yourPicsTab"},Photos:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_PHOTOS"),skinpart:"wixPicsTab"},Backgrounds:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_BACKGROUNDS"),skinpart:"wixBgTab"},Patterns:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_PATTERNS"),skinpart:"wixBgPatternTab"},Icons:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_ICONS"),skinpart:"wixIconsTab"},"Social Icons":{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_SOCIAL_ICONS"),skinpart:"wixSocialIconsTab"},ClipArt:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_CLIPART"),skinpart:"wixClipArtTab"},SWF:{caption:this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TAB_USER_SWF"),skinpart:"wixSwfTab"}};
this._multipleSelection=true;
this._currentSelection=[];
var e=this;
this._imageListener=function(f){if(f.type=="click"){e._onImageClick(this)
}else{if(f.type=="deleteItemClicked"){e._onDeleteClicked(this)
}else{e._onDoubleClick(this)
}}};
var c=this.injects().UserMedia;
c.addEvent("mediaUpdated",this._userMediaUpdate);
c.addEvent("UploadProgressUpdate",this._onUploadProgress);
c.addEvent("UploadError",this._onUploadError);
c.addEvent("validationError",this._onValidationError)
},_prepareForRender:function(){if(this._dialogOptionsSet){return true
}this._dialogOptionsSet=true;
this._dialogWindow.addToolbarControl(this._skinParts.uploadBTN.getViewNode());
this._skinParts.errorContent.hide();
this._skinParts.pageController.addEvent("change",this._changePageIndex);
this._dialogWindow.addEvent("tabChanged",this._onTabSwitch.bind(this));
this._dialogWindow.addEvent("onDialogClosing",this._onClosing.bind(this));
this._renderIfReady();
return this._dialogOptionsSet
},render:function(){if(this._currentImageList){this._populateContent(this._currentImageList,0)
}},setDialogOptions:function(e,a,d){this._callBack=d;
this._multipleSelection=e;
this._clearSelection();
this._currentConfig=this._galleryConfigurations[a];
if(!this._currentConfig){LOG.reportError(wixErrors.MEDIA_GALLERY_MISSING_CONFIG,"MediaDialog","setDialogOptions",a);
return
}this._dialogWindow.setTitle(this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_TITLE_"+a.toUpperCase()));
this._dialogWindow.setDescription(this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_DIALOG_DESCRIPTION_"+a.toUpperCase()));
this._skinParts.uploadBTN.setUploadFileType(this._currentConfig.uploadFileType);
if(this._updateOnOpen){this._updateOnOpen=false;
this.injects().UserMedia.updateMedia()
}this._dialogWindow.clearTabs();
if(this._currentConfig.tabs.length>1){var c=this._currentConfig.tabs;
for(var b=0;
b<c.length;
b++){this._dialogWindow.addTab(c[b].caption,b,c[b].skinpart)
}this._dialogWindow.switchToTabIndex(0);
this.setState("hasTabs","tabs")
}else{this._onTabSwitch(0);
this.getParentComponent()._skinParts.tabs.collapse()
}this._view.fireEvent("dialogOptionsSet",this)
},_getDataClone:function(b){var a=b.getLogic().getDataItem()._data;
return this.injects().UserMedia.convertToClientData(a)
},_onUploadProgress:function(d){var f=d.message;
var e=0;
var c=0;
for(var a=0;
a<f.length;
a++){c+=f[a].size;
e+=f[a].loaded
}var b=Math.round(e/c*100);
this._skinParts.progressOuter.setStyle("visibility","visible");
this._skinParts.progressInner.setStyle("width",b+"%");
this.setState("blockUser","dialog")
},_onUploadError:function(a){var b=a.text||a||"error";
b=b.replace("<","");
b=b.replace(">","");
this._skinParts.progressOuter.setStyle("visibility","hidden");
this.setState("normal","dialog");
LOG.reportError(wixErrors.UPLOAD_FAIL,this.className,"_onUploadError",b+"");
this._showError(this.injects().Resources.get("EDITOR_LANGUAGE","ERROR_UPLOADING_FILE"),b)
},_onValidationError:function(d){var a="",c="";
for(var b=0;
b<d.message.length;
b++){if(d.message[b].error=="InvalidFileSize"){a+=d.message[b].fileName+" "+this.injects().Resources.get("EDITOR_LANGUAGE","too_large")
}else{if(d.message[b].error=="InvalidFileName"){c=W.Utils.convertToHtmlText(d.message[b].fileName);
a+=c+" "+this.injects().Resources.get("EDITOR_LANGUAGE","invalid_chars")
}}}this._showError(this.injects().Resources.get("EDITOR_LANGUAGE","files_rejected"),a)
},_showError:function(e,c){var a='<span style="font-size:16px;color:#dd6666">'+e+"</span>";
a+=c;
this._skinParts.errorContent.set("html",a);
this._skinParts.errorContent.show();
if(!this._errorTween){this._errorTween=new Fx.Tween(this._skinParts.errorContent,{duration:"200ms",link:"cancel",property:"opacity"})
}this._errorTween.start(0,1);
var d=this._errorTween;
var b=this._skinParts.errorContent;
b.addEvent("click",function(){b.hide();
b.removeEvent("click")
});
setTimeout(function(){d.start(1,0)
},5000);
setTimeout(function(){b.hide();
b.removeEvent("click")
},5200)
},_onClosing:function(a){if(a.result=="OK"){this._onOK()
}else{this._closeDialog()
}},_onOK:function(c){var b;
if(this._multipleSelection){b=[];
for(var a=0;
a<this._currentSelection.length;
a++){b.push(this._getDataClone(this._currentSelection[a]))
}}else{if(this._currentSelection[0]){b=this._getDataClone(this._currentSelection[0])
}}this._callBack(b);
this._closeDialog()
},_closeDialog:function(a){this.injects().Utils.clearCallLater(this._updatePageTimeout);
this._skinParts.progressOuter.setStyle("visibility","hidden");
this.setState("normal","dialog")
},_userMediaUpdate:function(){this._clearSelection();
this._skinParts.progressOuter.setStyle("visibility","hidden");
this.setState("normal","dialog");
this._onTabSwitch(this._currentConfig.onUpdateIndex);
if(this._currentConfig.tabs.length>1){this._dialogWindow.switchToTabIndex(this._currentConfig.onUpdateIndex)
}},_onTabSwitch:function(b){var a=parseInt(b,10);
this._currentTab=this._currentConfig.tabs[a];
this._currentPageIndex=-1;
this.injects().UserMedia.getWixMedia(this._currentTab.listID,function(c){this._currentImageList=c;
if(this._componentReady){this._populateContent(this._currentImageList,0)
}}.bind(this))
},_itemsPerPage:8,_populateContent:function(a,b){if(this._currentPageIndex!=b){this._currentPageIndex=b;
var l=Math.ceil(a.length/this._itemsPerPage);
b=Math.min(b,l-1);
b=Math.max(b,0);
var e=b*this._itemsPerPage;
var f=e+this._itemsPerPage;
f=(f>a.length)?a.length:f;
this._skinParts.content.empty();
if(l<2){this._skinParts.pageController.getViewNode().hide()
}else{this._skinParts.pageController.getViewNode().show();
this._skinParts.pageController.getSkin().renderCssIfNeeded()
}if(this._skinParts.pageController.getAmount()!=l){this._skinParts.pageController.setAmount(l)
}if(this._skinParts.pageController.getIndex()!=b){this._skinParts.pageController.setIndex(b)
}var h=this.injects().Components;
var k=[];
this._currentSelection.forEach(function(i){k.push(i.getLogic().getDataItem().get("fileName"))
});
if(a.length>0){for(var d=e;
d<f;
++d){var c=a[d];
c.title=c.title||"";
c.description=c.description||"";
var m=this.injects().Data.createDataItem(c);
var g=this.injects().Components.createComponent("mobile.editor.components.dialogs.MediaDialogItem","mobile.editor.skins.dialogs.MediaDialogItemSkin",m,{align:"center",cropMode:"full",unit:"em",width:6.5,height:6.5,valign:"middle",allowDelete:this._currentTab.allowDelete},function(o){var i;
var n=o.getDataItem().get("fileName");
if((i=k.indexOf(n))!=-1){this._currentSelection[i]=o.getViewNode();
o.setState("selected","selection")
}}.bind(this));
g.addClass("galImage");
g.addEvent("click",this._imageListener);
g.addEvent("dblclick",this._imageListener);
g.addEvent("deleteItemClicked",this._imageListener);
g.insertInto(this._skinParts.content)
}}else{var j=new Element("div",{styles:{"text-align":"center","font-size":"18px","margin-top":"82px"}});
j.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","MEDIA_GALLERY_EMPTY_TEXT"));
j.insertInto(this._skinParts.content)
}}},_changePageIndex:function(b,a){if(this._currentImageList){this.injects().Utils.clearCallLater(this._updatePageTimeout);
if(a){this._populateContent(this._currentImageList,b)
}else{this._updatePageTimeout=this.injects().Utils.callLater(this._changePageIndex,[b,true],this,1000);
this._skinParts.content.empty()
}}},_onImageClick:function(b){var a=this._currentSelection.indexOf(b);
if(a>-1){this._currentSelection.splice(a,1);
b.getLogic().setState("unselected","selection")
}else{if(!this._multipleSelection){this._clearSelection()
}this._currentSelection.push(b);
b.getLogic().setState("selected","selection")
}if(this._currentSelection.length>0){this._dialogWindow.enableButton(this.injects().EditorDialogs.DialogButtons.OK)
}else{this._dialogWindow.disableButton(this.injects().EditorDialogs.DialogButtons.OK)
}},_onDoubleClick:function(a){this._clearSelection();
this._onImageClick(a);
this._onOK();
this._dialogWindow.closeDialog()
},_onDeleteClicked:function(a){if(a.getLogic().getDataItem()._data.uri){this.injects().Editor.deleteMedia(a.getLogic().getDataItem()._data.uri)
}else{this.injects().Editor.deleteMedia(a.getLogic().getDataItem()._data.fileName)
}},_clearSelection:function(){while(this._currentSelection.length){this._currentSelection.pop().getLogic().setState("unselected","selection")
}this._dialogWindow.disableButton(this.injects().EditorDialogs.DialogButtons.OK)
}}});
(function(){W.Components.newComponent({name:"mobile.editor.components.dialogs.MediaDialogItem",skinParts:{image:{type:"htmlElement"},trashButton:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onDeleteClicked","_onImageLoaded"],_states:{progress:["loading","loaded"],selection:["selected","unselected"]},initialize:function(c,a,b){this.parent(c,a,b);
this._allowDelete=b.allowDelete
},_onAllSkinPartsReady:function(){this.setState("loading","progress");
this._skinParts.image.addEvent("load",this._onImageLoaded);
if(this._allowDelete){this._skinParts.trashButton.addEvent("click",this._onDeleteClicked)
}else{this._skinParts.trashButton.collapse()
}},_onDeleteClicked:function(a){a.stopPropagation();
this.getViewNode().fireEvent("deleteItemClicked",{type:"deleteItemClicked"})
},_onImageLoaded:function(){this.setState("loaded","progress");
var b=this._skinParts.image.getSize();
var a=b.y/b.x;
if(b.y>b.x){this._skinParts.image.setStyles({height:95,width:95/a})
}else{this._skinParts.image.setStyles({height:95*a,width:95,"margin-top":(95-95*a)/2})
}},render:function(){var b,d;
var e=this._data.get("originalFileName")||"";
var c=this._data.get("title")||"";
if(this._data.get("type")=="Image"){b=this.injects().Config.getServiceTopologyProperty("staticMediaUrl")+"/"+this._data.get("uri")+"_128";
d=c.capitalize()
}else{if(this._data.get("mediaType")=="swf"){b=this.injects().Theme.getProperty("THEME_DIRECTORY")+"flash_swf_icon.png"
}else{b=this.injects().Config.getServiceTopologyProperty("staticMediaUrl").replace("media","")+"/"+this._data.get("iconURL")
}var a=e.replace(/\.+[a-zA-Z]+$/g,"");
d=(c||a).capitalize()
}if(b){this._skinParts.image.set("src",b)
}this._skinParts.label.set("text",d)
},getAcceptableDataTypes:function(){return["MediaItem","Image"]
}}})
})();
W.Components.newComponent({name:"mobile.editor.components.dialogs.MessageDialog",skinParts:{text:{type:"htmlElement"},details:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing.bind(this))
},setDialogOptions:function(b,a,c,d){this._callBack=c;
this._content=b;
this._details=a;
this._dialogWindow.setDialogOptions(d,function(){this._refreshView();
this._view.fireEvent("dialogOptionsSet",this)
}.bind(this))
},_refreshView:function(){if(!this._skinParts||!this._skinParts.text){return
}this._skinParts.text.set("text",this._content);
if(this._details){this._skinParts.details.set("text",this._details)
}else{this._skinParts.details.collapse()
}},_onDialogClosing:function(a){if(this._callBack){this._callBack({result:a.result})
}},render:function(){this._refreshView()
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.BaseListDataPanel",imports:["mobile.editor.components.FancyItem"],skinParts:{itemsContainer:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"mobile.core.components.BaseList",Binds:["_onPreviewItemReady"],initialize:function(c,a,b){this.parent(c,a,b);
this._isDataRendered=false;
this._dataForRender=null
},_renderData:function(a){this._itemsLogicName=a.itemsLogicName;
this._enableHide=a.enableHide;
this._enableDelete=a.enableDelete;
this._itemsDataFieldName=a.itemsDataFieldName;
if(this._previewComponent){this._previewComponent.addEvent("itemReady",this._onPreviewItemReady)
}if(!this._skin.itemSkinClassName){this._skin.itemSkinClassName=this._skin.itemSkinName
}this._renderItems(this._data.get(a.itemsDataFieldName))
},_prepareForRender:function(){if(this._isDataRendered||!this._data){return true
}if(this._dataForRender){return false
}var a=this._getRenderData();
if(a){this._dataForRender=a;
this._renderData(a);
return false
}else{this._isDataRendered=true
}return this._isDataRendered
},getFocusNode:function(){var a=this.parent();
if(a!=this._skinParts.view||this._itemsNodes.length===0){return a
}var b=this._itemsNodes[0];
if(!b.getLogic){return a
}return b.getLogic().getFocusNode()
},_getParamsToPassToItem:function(a,b){this._getPreviewPartComponent(a,function(c){b({previewComponent:c})
})
},_getPreviewPartComponent:function(a,e){var d;
if(this._previewComponent&&this._previewComponent.getSkinElementByIndex){var c=this._data.get(this._itemsDataFieldName);
var b=c.indexOfByPredicate(function(f){return f=="#"+a.get("id")
});
d=this._previewComponent.getSkinElementByIndex(b)
}if(d){if(d.getLogic){this.injects().Utils.callLater(e,[d.getLogic()])
}else{d.addEvent(Constants.ComponentEvents.READY,function(){e(d.getLogic())
})
}}else{this.injects().Utils.callLater(e,[])
}},_onItemReady:function(c,b,a){if(b){c.getViewNode().addClass("DataPanelItem");
var e=(this._enableDelete)?this._onItemDelete.bind(this,c):undefined;
var d=(this._enableHide)?this._onItemHide.bind(this,c):undefined;
c.fancify({upCallback:this._onItemMoveUp.bind(this,c),downCallback:this._onItemMoveDown.bind(this,c),deleteCallback:e,isHiddenCallback:d,initialIsHidden:a.getMeta("isHidden")})
}},_onAllItemsReady:function(){this._isDataRendered=true;
this._dataForRender=null;
this._renderIfReady()
},_onPreviewItemReady:function(e,b,a){if(this._itemsNodes){for(var d=0;
d<this._itemsNodes.length;
++d){var f=this._itemsNodes[d];
var c=f.getLogic&&f.getLogic();
if(c&&c.getDataItem()===b){c.setPreviewComponent(e);
return
}}}},getItemClassName:function(){return this._itemsLogicName
},getItemsContainer:function(){return this._skinParts.itemsContainer
},_onItemDelete:function(a){if(!this._editorInstance){if(tinyMCE.selectedInstance){this._selectedInstanceId=tinyMCE.selectedInstance.id;
tinyMCE.selectedInstance.remove()
}}this._isDataRendered=false;
var b=this._itemsNodes.indexOf(a.getViewNode());
this._data.get(this._itemsDataFieldName).splice(b,1);
this.fireEvent("itemDeleted");
this._data.fireDataChangeEvent();
setTimeout(function(){$$("#"+this._selectedInstanceId).getParent().getParent().fireEvent("focus")
}.bind(this),20)
},_onItemHide:function(b,a){b.getDataItem().setMeta("isHidden",a,true);
this._skipRender=true;
this._data.fireDataChangeEvent();
this._skipRender=false;
b.getDataItem().setMeta("isHidden",a,true)
},_onItemMoveUp:function(a){this._moveItem(a.getViewNode(),false)
},_onItemMoveDown:function(a){this._moveItem(a.getViewNode(),true)
},_moveItem:function(f,a){var c=this._itemsNodes.indexOf(f);
if(c!=-1){this._isDataRendered=false;
var e=this._data.get(this._itemsDataFieldName);
var d=(a)?1:-1;
var b=c+d;
e.moveItem(c,b);
this._data.fireDataChangeEvent()
}},_onDataChange:function(){this._isDataRendered=false;
this._dataForRender=null;
this.parent()
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.DataPanelWrapper",skinParts:{dataPanelContainer:{type:"htmlElement"},compEdit:{type:"htmlElement"},upBtn:{type:"htmlElement"},downBtn:{type:"htmlElement"},deleteBtn:{type:"htmlElement"},title:{type:"htmlElement"},text:{type:"htmlElement"},exitModeBtn:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{mode:["data","comp"],selected:["focus","blur"]},Binds:["_onDataPanelReady","_onFocus","_moveUp","_moveDown","_exitCompMode","_deleteComponent"],_canFocus:true,initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._args=b;
this._comp=b.previewComponent;
this._isComponentEditModeEnable=true;
this._isDeleteDisabled=false;
this._dataPanelNode=null;
this._dataPanel=null;
this.setEditState(b.initEditMode);
if(b.disableComponentEditState){this.disableComponentEditState()
}this._setDeleteMode(false);
this._isDeleteDisabled=b.disableDelete||false;
if(this._isDeleteDisabled){this._view.addClass("deleteDisabled")
}this._view.addEvent("click",this._onFocus);
if(document.addEventListener){this._view.addEventListener("focus",this._onFocus,true)
}else{this._view.attachEvent("onfocusin",this._onFocus,true)
}},_onFocus:function(a){this.setState("focus","selected");
this.fireEvent("focusItem",{panelNode:this._view,compNode:this._comp.getViewNode()});
if(this.getState().indexOf("comp")!=-1){this._dataPanel.highlightPreviewElement(this._comp.getViewNode(),"highlightAnimationOpacity")
}},focus:function(){this._view.focus();
window.scrollTo(0,this._view.getPosition().y)
},render:function(){this._setText()
},_onAllSkinPartsReady:function(){this._bindEvents()
},_bindEvents:function(){this._skinParts.upBtn.addEvent("click",this._moveUp);
this._skinParts.downBtn.addEvent("click",this._moveDown);
this._skinParts.exitModeBtn.addEvent("click",this._exitCompMode);
this._skinParts.deleteBtn.addEvent("click",function(){this._deleteComponent(false)
}.bind(this))
},_prepareForRender:function(){if(!this._dataPanelNode){this._dataPanelNode=this.injects().Components.createComponent(this._args.dataPanelLogic,this._args.dataPanelSkin,this._comp.getDataItem(),{previewComponent:this._comp},null,this._onDataPanelReady,"dataPanelOf_"+this._comp.getComponentId());
this._dataPanelNode.insertInto(this._skinParts.dataPanelContainer)
}return(this._dataPanel!==null)
},_onDataPanelReady:function(a){this._dataPanel=a;
this._renderIfReady()
},getDataPanel:function(){return this._dataPanel
},_setText:function(){var a=this.injects().Resources.get("EDITOR_LANGUAGE","COMP_EDIT_DELETE_TEXT");
if(this._isDeleteDisabled){a=this.injects().Resources.get("EDITOR_LANGUAGE","COMP_EDIT_TEXT")
}this._skinParts.title.set("html",this.injects().Resources.get("EDITOR_LANGUAGE",this._comp.getComponentType()));
this._skinParts.text.set("html",a)
},_setDeleteMode:function(a){if(!this._isDeleteDisabled){if(a){this._view.removeClass("moveMode");
this._view.addClass("deleteMode")
}else{this._view.removeClass("deleteMode");
this._view.addClass("moveMode")
}}},setEditState:function(a){a=(a=="data"||a=="comp")?a:"data";
if(!this._isComponentEditModeEnable){a="data"
}this.setState(a,"mode")
},disableComponentEditState:function(){this._isComponentEditModeEnable=false;
if(this.getState()=="comp"){this.setEditState("data")
}},getComponent:function(){return this._comp
},isDataPanelWrapper:function(){return true
},_moveUp:function(){this.fireEvent("move",{panelNode:this._view,compNode:this._comp.getViewNode(),dir:"up"})
},_moveDown:function(){this.fireEvent("move",{panelNode:this._view,compNode:this._comp.getViewNode(),dir:"down"})
},_exitCompMode:function(){this.fireEvent("exitCompMode")
},_deleteComponent:function(a){if(!this._isDeleteDisabled){if(a){this.fireEvent("deleteComponent",{panelNode:this._view,compNode:this._comp.getViewNode()})
}else{this._setDeleteMode(true);
this._setText();
this.injects().EditorDialogs.openPromptDialog(this.injects().Resources.get("EDITOR_LANGUAGE","DELETE_COMPONENT_DIALOG_TITLE"),this.injects().Resources.get("EDITOR_LANGUAGE","DELETE_COMPONENT_DIALOG_TEXT"),"",this.injects().EditorDialogs.DialogButtonSet.YES_NO,function(b){if(b.result==this.injects().EditorDialogs.DialogButtons.YES){this._deleteComponent(true)
}else{this._setDeleteMode(false);
this._setText()
}}.bind(this))
}}}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.FacebookCommentDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{fancyContainer:{type:"mobile.editor.components.FancyItem"},inputArea:{type:"htmlElement"},icon:{type:"htmlElement"},numPostsDropDown:{type:"htmlElement"},colorschemeDropDown:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_updateNumPosts","_updateColorscheme"],initialize:function(c,a,b){this.parent(c,a);
this.previewSkinContainer=b.previewSkinContainer
},render:function(){if(!this.runOnce){this.runOnce=true;
this._skinParts.fancyContainer.createGui({dataPanel:this},[this._skinParts.icon,this._skinParts.inputArea])
}var b=this.injects().Theme.getProperty("CONTACT_DIRECTORY");
var a=b+"facebook_comment.png";
this._skinParts.icon.set("src",a);
this._addEventsToProperties();
this._setDropDownLabels()
},_setDropDownLabels:function(){for(var a=1;
a<=5;
a++){this._skinParts.numPostsDropDown.getElementById("numPostsIs"+a).set("text",this.injects().Resources.get("EDITOR_LANGUAGE","FACEBOOK_COMMENT_NUM_OF_POSTS")+a)
}this._skinParts.colorschemeDropDown.getElementById("light").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","FACEBOOK_LIKE_COLOR_SCHEME_LIGHT"));
this._skinParts.colorschemeDropDown.getElementById("dark").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","FACEBOOK_LIKE_COLOR_SCHEME_DARK"))
},_addEventsToProperties:function(){this._skinParts.numPostsDropDown.addEvent("change",this._updateNumPosts);
this._skinParts.colorschemeDropDown.addEvent("change",this._updateColorscheme)
},_updateLayout:function(){var a=this._skinParts.layoutDropDown.get("value");
this._previewComponent.setComponentProperty("layout",a)
},_updateNumPosts:function(){var a=this._skinParts.numPostsDropDown.get("value");
this._previewComponent.setComponentProperty("numPosts",a)
},_updateColorscheme:function(){var a=this._skinParts.colorschemeDropDown.get("value");
this._previewComponent.setComponentProperty("colorscheme",a)
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.FacebookLikeDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{fancyContainer:{type:"mobile.editor.components.FancyItem"},inputArea:{type:"htmlElement"},icon:{type:"htmlElement"},layoutDropDown:{type:"htmlElement"},colorschemeDropDown:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_updateLayout","_updateColorscheme"],initialize:function(c,a,b){this.parent(c,a);
this.previewSkinContainer=b.previewSkinContainer
},render:function(){if(!this.runOnce){this.runOnce=true;
this._skinParts.fancyContainer.createGui({dataPanel:this},[this._skinParts.icon,this._skinParts.inputArea])
}var b=this.injects().Theme.getProperty("CONTACT_DIRECTORY");
var a=b+"facebook_like.png";
this._skinParts.icon.set("src",a);
this._addEventsToProperties();
this._setDropDownLabels()
},_setDropDownLabels:function(){this._skinParts.layoutDropDown.getElementById("button_count").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","BUTTON_ONLY"));
this._skinParts.layoutDropDown.getElementById("box_count").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","BUTTON_WITH_COUNT"));
this._skinParts.layoutDropDown.getElementById("standard").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","BUTTON_WITH_TEXT"));
this._skinParts.colorschemeDropDown.getElementById("light").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","FACEBOOK_LIKE_COLOR_SCHEME_LIGHT"));
this._skinParts.colorschemeDropDown.getElementById("dark").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","FACEBOOK_LIKE_COLOR_SCHEME_DARK"))
},_addEventsToProperties:function(){this._skinParts.layoutDropDown.addEvent("change",this._updateLayout);
this._skinParts.colorschemeDropDown.addEvent("change",this._updateColorscheme)
},_updateLayout:function(){var a=this._skinParts.layoutDropDown.get("value");
this._previewComponent.setComponentProperty("layout",a)
},_updateColorscheme:function(){var a=this._skinParts.colorschemeDropDown.get("value");
this._previewComponent.setComponentProperty("colorscheme",a)
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.GooglePlusOneDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{fancyContainer:{type:"mobile.editor.components.FancyItem"},inputArea:{type:"htmlElement"},icon:{type:"htmlElement"},sizeDropDown:{type:"htmlElement"},annotationDropDown:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_updateSize","_updateAnnotation"],initialize:function(c,a,b){this.parent(c,a);
this.previewSkinContainer=b.previewSkinContainer
},render:function(){if(!this.runOnce){this.runOnce=true;
this._skinParts.fancyContainer.createGui({dataPanel:this},[this._skinParts.icon,this._skinParts.inputArea])
}var b=this.injects().Theme.getProperty("CONTACT_DIRECTORY");
var a=b+"plus-one-button.png";
this._skinParts.icon.set("src",a);
this._addEventsToProperties();
this._setDropDownLabels()
},_setDropDownLabels:function(){this._skinParts.annotationDropDown.getElementById("none").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","BUTTON_ONLY"));
this._skinParts.annotationDropDown.getElementById("bubble").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","BUTTON_WITH_COUNT"));
this._skinParts.annotationDropDown.getElementById("inline").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","BUTTON_WITH_TEXT"));
this._skinParts.sizeDropDown.getElementById("small").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","GOOGLE_PLUS_ONE_SIZE_SMALL"));
this._skinParts.sizeDropDown.getElementById("medium").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","GOOGLE_PLUS_ONE_SIZE_MEDIUM"));
this._skinParts.sizeDropDown.getElementById("standard").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","GOOGLE_PLUS_ONE_SIZE_STANDARD"));
this._skinParts.sizeDropDown.getElementById("tall").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","GOOGLE_PLUS_ONE_SIZE_TALL"))
},_addEventsToProperties:function(){this._skinParts.sizeDropDown.addEvent("change",this._updateSize);
this._skinParts.annotationDropDown.addEvent("change",this._updateAnnotation)
},_updateSize:function(){var a=this._skinParts.sizeDropDown.get("value");
this._previewComponent.setComponentProperty("size",a)
},_updateAnnotation:function(){var a=this._skinParts.annotationDropDown.get("value");
this._previewComponent.setComponentProperty("annotation",a)
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.HeaderDataPanel",imports:["mobile.editor.components.FancyItem"],traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{titleInput:{type:"htmlElement",highlight:"title",highlightAnimation:"highlightAnimationOpacity"},fancyContent:{type:"htmlElement"},imageDiv:{type:"htmlElement"},imageArea:{type:"htmlElement"},deletePhoto:{type:"htmlElement"},changePhoto:{type:"htmlElement"},btnSmall:{type:"htmlElement"},btnMedium:{type:"htmlElement"},btnLarge:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["showPhoto","hidePhoto","idle"],Binds:["_toggleHide","_onPartWixified","_onDelPhoto","_onChangePhoto","_onImageData","_setImageVisibility","_onInputFocus","_onInputFocusOut","_replacePicCB","_onSmallButtonClick","_onMediumButtonClick","_onLargeButtonClick"],initialize:function(c,b,a){this.parent(c,b,a);
this._allPartsWixified=false
},_onDelPhoto:function(){if(!this._imageData){return
}this._imageData.setMeta("isHidden",true);
this._imageData.fireDataChangeEvent()
},_onChangePhoto:function(){this.injects().EditorDialogs.openMediaDialog(this._replacePicCB,false,"Icons",["UserMedia","Icons"])
},_replacePicCB:function(c){var b=this._imageData.getData();
for(var a in c){b[a]=c[a]
}this._imageData.setMeta("isHidden",false);
this._imageData.fireDataChangeEvent()
},_onAllSkinPartsReady:function(b){this.setState("idle");
var a=this._skinParts.titleInput;
a.addEvent("focus",this._onInputFocus);
a.addEvent("blur",this._onInputFocusOut);
b.componentTitle.set("html","");
b.deletePhoto.addEvent("click",this._onDelPhoto);
b.changePhoto.addEvent("click",this._onChangePhoto);
b.addPhoto.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","addPic"));
b.addPhoto.addEvent("click",this._onChangePhoto);
b.btnSmall.addEvent("click",this._onSmallButtonClick);
b.btnMedium.addEvent("click",this._onMediumButtonClick);
b.btnLarge.addEvent("click",this._onLargeButtonClick);
var c=this.injects().Utils.convertFromHtmlText(this._data.get("title"));
this._skinParts.titleInput.set("value",c);
this._bindInputToDataField(this._skinParts.titleInput,"title",false,100)
},render:function(){var a=this._data.get("imageSize");
switch(a){case"small":this._skinParts.btnSmall.addClass("selected");
break;
case"large":this._skinParts.btnLarge.addClass("selected");
break;
case"medium":default:this._skinParts.btnMedium.addClass("selected");
break
}},_prepareForRender:function(){if(this._allPartsWixified&&this._imageData){return true
}var b=this.injects().Components;
if(!this._fancyShmancy){this._fancyShmancy=b.createComponent("mobile.editor.components.FancyItem","mobile.editor.skins.FancyItemSkin",undefined,{},this._onPartWixified)
}if(!this._imageData){var a=this._data.get("image");
this.injects().Preview.getPreviewManagers().Data.getDataByQuery(a,function(c){this._onImageData(c)
}.bind(this))
}return this._allPartsWixified&&this._imageData
},_onImageData:function(a){var b=null;
this._imageData=a;
this._imageData.addEvent(Constants.DataEvents.DATA_CHANGED,this._setImageVisibility);
if(!this._imageSkinContainer){this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",this._imageData,{width:100,height:100,unit:"px",align:"center",valign:"middle",cropMode:"full"},this._onPartWixified)
}else{if(this._imageSkinContainer&&this._imageSkinContainer.getLogic&&(b=this._imageSkinContainer.getLogic())){b.setDataItem(a)
}}this._setImageVisibility();
this._renderIfReady()
},_onInputFocus:function(){if(!this._data.getMeta("isPreset")){return
}this._skinParts.titleInput.set("value","")
},_onInputFocusOut:function(){if(!this._data.getMeta("isPreset")){return
}this._skinParts.titleInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","headerPresetText"))
},_setImageVisibility:function(){if(this._imageData.getMeta("isHidden")){this.setState("hidePhoto")
}else{this.setState("showPhoto")
}},_onPartWixified:function(){if(this._fancyShmancy.getLogic&&this._imageSkinContainer&&this._imageSkinContainer.getLogic){this._onAllPartWixified()
}},_onAllPartWixified:function(){this._allPartsWixified=true;
this._fancyShmancy.insertInto(this._view);
this._fancyShmancy.getLogic().createGui({dataPanel:this,showHideToggleHandler:this._toggleHide,isHidden:this._data.getMeta("isHidden")},this._skinParts.fancyContent);
this._imageSkinContainer.insertInto(this._skinParts.imageDiv);
this._renderIfReady()
},_toggleHide:function(){this._updatingFlag=true;
var a=this._data.getMeta("isHidden");
this._data.setMeta("isHidden",!a);
this._data.fireDataChangeEvent();
this._updatingFlag=false
},_onSmallButtonClick:function(){this._data.set("imageSize","small");
this._skinParts.btnSmall.addClass("selected");
this._skinParts.btnMedium.removeClass("selected");
this._skinParts.btnLarge.removeClass("selected")
},_onMediumButtonClick:function(){this._data.set("imageSize","medium");
this._skinParts.btnMedium.addClass("selected");
this._skinParts.btnSmall.removeClass("selected");
this._skinParts.btnLarge.removeClass("selected")
},_onLargeButtonClick:function(){this._data.set("imageSize","large");
this._skinParts.btnLarge.addClass("selected");
this._skinParts.btnSmall.removeClass("selected");
this._skinParts.btnMedium.removeClass("selected")
},getAcceptableDataTypes:function(){return["Header"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.ImageDataPanel",imports:["mobile.core.components.Image"],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{imageDiv:{type:"htmlElement"},imageArea:{type:"htmlElement"},image:{type:"mobile.core.components.Image",dataRefField:"*",argObject:{width:103,height:103,unit:"px",align:"center",valign:"middle",cropMode:"full"}},deletePhoto:{type:"htmlElement"},changePhoto:{type:"htmlElement"},imageSizeControls:{type:"htmlElement"},btnSmall:{type:"htmlElement"},btnMedium:{type:"htmlElement"},btnLarge:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onDelPhoto","_onChangePhoto","_replacePicCB","_onSmallButtonClick","_onMediumButtonClick","_onLargeButtonClick","render"],initialize:function(c,a,b){this.parent(c,a,b);
this._hasSizeControls=b&&b.showSizeControls;
this._hasDeleteButton=b&&b.showDeleteButton
},render:function(){if(this._hasDeleteButton){}else{this._skinParts.deletePhoto.collapse();
this._skinParts.changePhoto.addClass("withoutDeleteButton")
}if(this._hasSizeControls){if(this._previewComponent){var a=this._previewComponent.getComponentProperty("imageSize");
this._setSelectedSizeButton(a)
}this._skinParts.imageSizeControls.uncollapse()
}else{this._skinParts.imageSizeControls.collapse()
}},_onAllSkinPartsReady:function(a){if(this._hasDeleteButton){}this._skinParts.changePhoto.addEvent("click",this._onChangePhoto);
if(this._hasSizeControls){this._skinParts.btnSmall.addEvent("click",this._onSmallButtonClick);
this._skinParts.btnMedium.addEvent("click",this._onMediumButtonClick);
this._skinParts.btnLarge.addEvent("click",this._onLargeButtonClick)
}},fireShowDialogEvent:function(){this._onChangePhoto()
},_onDelPhoto:function(){},_onChangePhoto:function(a){this.injects().EditorDialogs.openMediaDialog(this._replacePicCB,false,"Photos",["UserMedia","Photos"])
},_replacePicCB:function(a){var b=this._data.getData();
b.uri=a.uri;
b.height=a.height;
b.width=a.width;
b.title=a.title;
b.description=a.description;
this._data.setMeta("isPreset",false);
this._data.fireDataChangeEvent()
},_setSelectedSizeButton:function(a){this._skinParts.btnSmall.toggleClass("selected",a=="small");
this._skinParts.btnLarge.toggleClass("selected",a=="large");
this._skinParts.btnMedium.toggleClass("selected",(a!="small")&&(a!="large"))
},_onSmallButtonClick:function(){this._setSelectedSizeButton("small");
this._previewComponent.setComponentProperty("imageSize","small")
},_onMediumButtonClick:function(){this._setSelectedSizeButton("medium");
this._previewComponent.setComponentProperty("imageSize","medium")
},_onLargeButtonClick:function(){this._setSelectedSizeButton("large");
this._previewComponent.setComponentProperty("imageSize","large")
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.ImageItemDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{titleInput:{type:"htmlElement",highlightAnimation:"highlightAnimationOpacity"},descriptionInput:{type:"htmlElement",highlightAnimation:"highlightAnimationOpacity"},fancyContainer:{type:"htmlElement"},imageHolder:{type:"htmlElement"},changePhoto:{type:"htmlElement"},view:{type:"htmlElement",highlightAnimation:"highlightAnimationOpacity"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_photoChangeHandler","_replacePicCB"],_onAllSkinPartsReady:function(){this._skinParts.changePhoto.addEvent("click",this._photoChangeHandler)
},render:function(){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
var c=this.injects().Utils.convertFromHtmlText(this._data.get("title"));
this._skinParts.titleInput.set("value",c);
this._bindInputToDataField(this._skinParts.titleInput,"title",false,100);
var a=this.injects().Utils.convertFromHtmlText(this._data.get("description"));
this._skinParts.descriptionInput.set("value",a);
this._bindInputToDataField(this._skinParts.descriptionInput,"description",false,1000);
if(this._image){this._image.dispose()
}var b=this.injects().Components.createComponent("mobile.core.components.Image",this._skin.imageSkinClassName,this._data,{width:7.2,height:7.2,unit:"em",align:"center",valign:"center",cropMode:"full"},null);
this._image=b;
b.insertInto(this._skinParts.imageHolder,"top")
},_photoChangeHandler:function(){W.EditorDialogs.openMediaDialog(this._replacePicCB,false,"Photos",["UserMedia","Photos"])
},_replacePicCB:function(e){var b=this._image.getLogic().getDataItem();
var d=b.getData();
for(var a in e){if(!b.getMeta("isPreset")&&(a=="title"||a=="description")){continue
}d[a]=e[a]
}var f=d.title;
this._skinParts.titleInput.set("value",f);
var c=d.description;
this._skinParts.descriptionInput.set("value",c);
b.fireDataChangeEvent()
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.ImageListDataPanel",imports:["mobile.editor.components.FancyItem"],skinParts:{itemsContainer:{type:"htmlElement"},addImageButton:{type:"htmlElement"},newGallerySplashScreen:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.editpanels.BaseListDataPanel",_states:["presetData","realData"],Binds:["_splashScreenClick","_addImagesToPresetGallery","addImages"],render:function(){if(!this._hasRenderData()){this._showNewGallerySplashScreen()
}},_getRenderData:function(){if(!this._hasRenderData()){return null
}return{itemsLogicName:"mobile.editor.components.editpanels.ImageItemDataPanel",itemsDataFieldName:"items",enableHide:false,enableDelete:true}
},getFocusNode:function(){if(this.getState()=="presetData"){return this._skinParts.newGallerySplashScreen||this._view
}else{this.parent()
}},_onAllSkinPartsReady:function(b){var a=b.addImageButton;
a.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","ADD_ANOTHER_IMAGE"));
a.addEvent("click",function(){this.injects().EditorDialogs.openMediaDialog(this.addImages,true,"Photos",["UserMedia","Photos"])
}.bind(this));
b.newGallerySplashScreen.addEvent("click",this._splashScreenClick)
},_showNewGallerySplashScreen:function(){this.setState("presetData")
},_splashScreenClick:function(){this.injects().EditorDialogs.openMediaDialog(this._addImagesToPresetGallery,true,"Photos",["UserMedia","Photos"])
},_addImagesToPresetGallery:function(b){if(b.length>0){this._data.setMeta("isPreset",false);
var a=this._data.get("items");
a.empty();
this.addImages(b);
this.setState("realData")
}},addImages:function(d){for(var c=0;
c<d.length;
c++){var b=this._getDataManager().addDataItemWithUniqueId("image",d[c]);
b.dataObject.setMeta("isPreset",true);
var a=this._data.get("items");
a.push("#"+b.id)
}this._data.fireDataChangeEvent()
},getAcceptableDataTypes:function(){return["ImageList"]
},_hasRenderData:function(){var b=this._data;
var a=b?b.get("items"):null;
return(b&&(!b.getMeta("isPreset"))&&a&&a.length>0)
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.LinkItemDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{icon:{type:"htmlElement"},titleInput:{type:"htmlElement",highlight:"label",highlightAnimation:"highlightAnimationOpacity",focus:true},contentInput:{type:"htmlElement",highlight:"view",highlightAnimation:"highlightAnimationOpacity"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onFieldFocus","_onFieldFocusOut"],initialize:function(c,a,b){this.parent(c,a,b);
this.previewSkinContainer=b.previewSkinContainer
},render:function(){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
var b=this.injects().Theme.getProperty("CONTACT_DIRECTORY");
var a=b+this.injects().LinkTypes.getLinkIcon(this._data.get("linkType"));
this._skinParts.icon.set("src",a);
if(this._data.getMeta("isPreset")){this._skinParts.contentInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE",this._data.get("linkType")+"_TARGET_PRESET_TEXT"))
}else{var c=this.injects().Utils.convertFromHtmlText(this._data.get("target"));
this._skinParts.contentInput.set("value",c)
}var d=this.injects().Utils.convertFromHtmlText(this._data.get("text"));
this._skinParts.titleInput.set("value",d)
},_onAllSkinPartsReady:function(b){var a=(this._data.get("linkType")=="CALL")?15:200;
this._bindInputToDataField(b.titleInput,"text",false,100);
this._bindInputToDataField(b.contentInput,"target",true,a);
b.contentInput.addEvent("focus",this._onFieldFocus);
b.contentInput.addEvent("blur",this._onFieldFocusOut)
},_onFieldFocus:function(){if(this._data.getMeta("isPreset")){this._skinNextInputChange("target");
this._skinParts.contentInput.set("value","")
}},_onFieldFocusOut:function(){if(this._data.getMeta("isPreset")){this._skinParts.contentInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE",this._data.get("linkType")+"_TARGET_PRESET_TEXT"))
}},getAcceptableDataTypes:function(){return["Link"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.LinkListDataPanel",imports:["mobile.editor.components.FancyItem"],skinParts:{itemsContainer:{type:"htmlElement"},addLinkButton:{type:"htmlElement",autoBindDictionary:"ADD_ANOTHER_LINK"},newLinkListSplashScreen:{type:"htmlElement"},controls:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.editpanels.BaseListDataPanel",Binds:["_splashScreenClick","addLink"],_states:{"default":["idle","collapsed","presetData"],subType:["CONTACT","NETWORKS","EXTERNAL_LINKS"]},render:function(){if(this._hasRenderData()){this._skinParts.newLinkListSplashScreen.removeProperty("tabIndex");
this.setState("collapsed")
}else{this._skinParts.newLinkListSplashScreen.setProperty("tabIndex",0);
this._showNewLinkListSplashScreen()
}},_getRenderData:function(){if(this._hasRenderData()){return{itemsLogicName:"mobile.editor.components.editpanels.LinkItemDataPanel",itemsDataFieldName:"items",enableHide:false,enableDelete:true}
}return null
},_showNewLinkListSplashScreen:function(){this.setState("presetData");
this.setState(this._data.get("subType"),"subType");
this._skinParts.newLinkListSplashScreen.addEvent("click",this._splashScreenClick)
},_splashScreenClick:function(){this.injects().EditorDialogs.openAddLinkDialog(this.addLink,this._data.get("subType"))
},_onAllSkinPartsReady:function(){this._skinParts.addLinkButton.addEvent("click",function(){this.injects().EditorDialogs.openAddLinkDialog(this.addLink,this._data.get("subType"))
}.bind(this))
},addLink:function(c){var b=this._data.getDataManager().addDataItemWithUniqueId("contactLink",c);
var a=this._data.get("items");
a.push("#"+b.id);
this._data.fireDataChangeEvent()
},getAcceptableDataTypes:function(){return["LinkList"]
},_hasRenderData:function(){var b=this._data;
var a;
return(b&&(a=b.get("items"))&&a.length>0)
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.MenuItemDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{titleInput:{type:"htmlElement",highlight:"label",highlightAnimation:"highlightAnimationOpacity"},fancyContainer:{type:"htmlElement"}},componentParts:{fancyShmancy:{type:"mobile.editor.components.FancyItem",skin:"mobile.editor.skins.FancyItemSkin"}},Class:{Extends:"mobile.core.components.base.BaseComponent",render:function(){var b=(this._data.getType()=="Page")?"title":"text";
var e=this.injects().Utils.convertFromHtmlText(this._data.get(b));
var d=this._skinParts.titleInput;
if(e==d.get("value")){return
}if(!this._wasFirstRender){this._wasFirstRender=true;
d.set("value",e);
var a=(this._data.getType()=="Page")?45:45;
this._bindInputToDataField(d,b,true,a);
var c=false;
d.addEvent("blur",function(){if(d.get("value").length<2){d.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","min_2_chars"));
this._data.set(b,this.injects().Resources.get("EDITOR_LANGUAGE","empty_title_text"));
c=true
}}.bind(this));
d.addEvent("focus",function(){if(c){d.set("value","");
this._data.set(b,"");
c=false
}}.bind(this))
}else{d.set("value",this._data.get("title"))
}},getAcceptableDataTypes:function(){return["Page","Link"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.PageTitleDataPanel",imports:["mobile.editor.components.FancyItem"],traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{titleContainer:{type:"htmlElement"},titleInput:{type:"htmlElement",highlightAnimation:"highlightAnimationOpacity",focus:true},fancy:{type:"mobile.editor.components.FancyItem"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["showHideToggleHandler"],initialize:function(c,b,a){this.parent(c,b,a);
this._showingHelpText=false
},render:function(){if(!this._data){return
}var b=this._skinParts.titleInput;
var a=this._data.get("title");
var c=this.injects().Utils.convertFromHtmlText(a);
if(c==b.get("value")){return
}b.set("value",c)
},_onAllSkinPartsReady:function(b){var a=this._skinParts.fancy;
a.createGui({dataPanel:this,showHideToggleHandler:this.showHideToggleHandler,isHidden:this._data.get("hideTitle")},this._skinParts.titleContainer);
a.getViewNode().insertInto(b.view);
var c=b.titleInput;
this._bindInputToDataField(c,"title",true,45);
c.addEvent("blur",function(){if(c.get("value").length<2){c.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","min_2_chars"));
this._data.set("title",this.injects().Resources.get("EDITOR_LANGUAGE","empty_title_text"));
this._showingHelpText=true
}}.bind(this));
c.addEvent("focus",function(){if(this._showingHelpText){c.set("value","");
this._data.set("title","");
this._showingHelpText=false
}}.bind(this))
},showHideToggleHandler:function(a){this._skipRender=true;
this._data.set("hideTitle",a);
this._skipRender=false
},getAcceptableDataTypes:function(){return["Page"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.ParagraphDataPanel",imports:["mobile.editor.components.FancyItem"],skinParts:{wysiwygArea:{type:"htmlElement",highlight:["richTextContainer","description"],highlightAnimation:"highlightAnimationOpacity",focus:true},fancyItem:{type:"mobile.editor.components.FancyItem"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onFocus","_onEditorAdded","_onEditorFocus","_onInputChange"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this.skipFancy=b.skipFancy||false
},render:function(){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
var a=this._data.getType()=="Service"?"description":"text";
this._skinParts.wysiwygArea.set("html",this._data.get(a));
if(!this._guiCreated){this._createGui();
this._guiCreated=true
}},_createGui:function(){this._oldContentResult=this._getText();
if(!this.skipFancy){var a=this._skinParts.fancyItem;
a.createGui({dataPanel:this},this._skinParts.fancyContent)
}var b=this.injects().Utils.getUniqueId("wysiwyg-editor-");
this._skinParts.wysiwygArea.set("id",b);
if(this._skinParts.view.addEventListener){this._skinParts.view.addEventListener("focus",this._onFocus,true)
}else{this._skinParts.view.attachEvent("onfocusin",this._onFocus)
}},_getText:function(){var a=this._getDataTypeInputFieldname(this._data.getType());
return this._data.get(a).replace(/\n/g,"<br/>")
},_setText:function(a){a=a.replace(/\n/g,"");
a=W.Utils.sanitizeUnicode(a);
var b=this._getDataTypeInputFieldname(this._data.getType());
return this._data.set(b,a)
},_getDataTypeInputFieldname:function(a){return a=="Service"?"description":"text"
},_onFocus:function(b){var a=this._skinParts.wysiwygArea.get("id");
if(!this._editorInstance){if(tinyMCE.selectedInstance){tinyMCE.selectedInstance.remove()
}tinyMCE.onAddEditor.remove(this._onEditorAdded);
tinyMCE.onAddEditor.add(this._onEditorAdded);
tinyMCE.execCommand("mceAddControl",true,a)
}else{tinymce.execCommand("mceFocus",false,a);
this._view.fireEvent(b)
}},_onEditorAdded:function(){var a=this._skinParts.wysiwygArea.get("id");
var b=tinyMCE.getInstanceById(a);
if(b!==null){this._editorInstance=b;
tinyMCE.onAddEditor.remove(this._onEditorAdded);
b.onInit.add(function(){var c=this._getDataTypeInputFieldname(this._data.getType());
this._oldContentResult=this._data.get(c);
b.setContent(this._oldContentResult);
var d=b.dom.doc.body;
d.style.height="100%";
if(d.addEventListener){d.addEventListener("click",this._onEditorFocus,true);
d.addEventListener("focus",this._onEditorFocus,true)
}else{d.attachEvent("click",this._onEditorFocus);
d.attachEvent("onfocusin",this._onEditorFocus)
}tinymce.execCommand("mceFocus",false,a)
}.bind(this));
b.onKeyUp&&b.onKeyUp.add(this._onInputChange);
b.onKeyDown&&b.onKeyDown.add(this._onInputChange);
b.onPaste&&b.onPaste.add(this._onInputChange);
b.onChange&&b.onChange.add(this._onInputChange);
b.onUndo&&b.onUndo.add(this._onInputChange);
b.onRedo&&b.onRedo.add(this._onInputChange);
b.onClick&&b.onClick.add(function(){}.bind(this));
b.onRemove&&b.onRemove.add(function(){delete this._editorInstance
}.bind(this))
}},_onEditorFocus:function(c){var a={target:this._skinParts.wysiwygArea};
this._skinParts.fancyItem.getViewNode().fireEvent("click",a);
if(this._view.dispatchEvent){var b=document.createEvent("HTMLEvents");
b.initEvent("focus",true,false);
this._view.dispatchEvent(b)
}else{this._view.fireEvent(c)
}},_showHideToggleHandler:function(a){this._data.setMeta("isHidden",a)
},_onInputChange:function(d,b){if(b&&b.type=="keydown"){if(b.keyCode==9){var g=$$("input,textarea,[tabIndex],#"+this._skinParts.wysiwygArea.getProperty("id")).filter(function(e){return(e.isVisible()||e===this._skinParts.wysiwygArea)
},this);
var j=g.indexOf(this._skinParts.wysiwygArea);
if(j!=-1){this._skinParts.wysiwygArea.focus();
var h=b.shiftKey?-1:1;
var c=(j+h)%g.length;
var a=g[c];
a.focus();
this.injects().Utils.callLater(function(e){e.focus()
},[a],this,1)
}}}else{var i=this._editorInstance.getContent();
if(i.length>=7800){i=this._oldContentResult;
try{this._editorInstance.setContent(this._oldContentResult)
}catch(f){}this._setCursor(this._editorInstance,this._editorInstance.getDoc().body,0);
this.injects().Utils.errorPopup(this.injects().Resources.get("EDITOR_LANGUAGE","ERROR_TITLE_TO_LONG"),this.injects().Resources.get("EDITOR_LANGUAGE","ERROR_CONTENT_TO_LONG"));
this._editorInstance.getDoc().body.blur()
}i=this._tempRemoveColorStyle(i);
this._oldContentResult=i;
this._setText(i)
}},_tempRemoveColorStyle:function(a){return a.replace(/(<[^>]*style="[^"]*[^-])(color:[\s]?#?[0-9A-Fa-f]{6}[;]?[\s]?)/gi,"$1")
},_setCursor:function(b,c,h){var g=b.getDoc();
if(typeof g.createRange!="undefined"){var a=g.createRange();
a.selectNodeContents(c);
a.collapse(h);
var f=g.defaultView||g.parentWindow;
var e=f.getSelection();
e.removeAllRanges();
e.addRange(a)
}else{if(typeof g.body.createTextRange!="undefined"){var d=g.body.createTextRange();
d.moveToElementText(c);
d.collapse(h);
d.select()
}}},getAcceptableDataTypes:function(){return["Text","RichText","Service"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.PhotoDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{inputArea:{type:"htmlElement"},titleInput:{type:"htmlElement",highlightAnimation:"highlightAnimationOpacity"},descriptionInput:{type:"htmlElement",highlightAnimation:"highlightAnimationOpacity"},fancy:{type:"mobile.editor.components.FancyItem"},imagePanel:{type:"mobile.editor.components.editpanels.ImageDataPanel",dataRefField:"*",argObject:{showSizeControls:true,showDeleteButton:false},hookMethod:"_createImageArgs"},newPhotoSplashScreen:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onSplashClick","_onDelPhoto"],_createImageArgs:function(a){a.argObject.previewComponent=this._previewComponent;
return a
},render:function(){var b,a;
if(!this.runOnce){this.runOnce=true;
this._skinParts.fancy.createGui({dataPanel:this},[this._skinParts.imagePanel.getViewNode(),this._skinParts.inputArea]);
this._bindInputToDataField(this._skinParts.titleInput,"title",false,100);
this._bindInputToDataField(this._skinParts.descriptionInput,"description",false,1000)
}if(this._data.getMeta("isPreset")){this._skinParts.fancy.collapse();
this._skinParts.newPhotoSplashScreen.uncollapse();
this._skinParts.newPhotoSplashScreen.setProperty("tabIndex",0);
this._skinParts.newPhotoSplashScreen.addEvent("click",this._onSplashClick)
}else{this._skinParts.fancy.uncollapse();
this._skinParts.newPhotoSplashScreen.collapse();
this._skinParts.newPhotoSplashScreen.removeProperty("tabIndex");
this._skinParts.newPhotoSplashScreen.removeEvent("click",this._onSplashClick);
b=this.injects().Utils.convertFromHtmlText(this._data.get("title"));
a=this.injects().Utils.convertFromHtmlText(this._data.get("description"));
this._skinParts.titleInput.set("value",b);
this._skinParts.descriptionInput.set("value",a)
}},_onSplashClick:function(){this._skinParts.imagePanel.fireShowDialogEvent()
},_onDelPhoto:function(){},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.RichTextImageDataPanel",imports:["mobile.editor.components.FancyItem"],skinParts:{textDataPanel:{type:"htmlElement"},imageDataPanel:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",render:function(){var a=this._data.get("text");
var b=this.getComponentId();
this.injects().Preview.getPreviewManagers().Data.getDataByQuery(a,function(d){this._textDataPanelSkinContainer=this.injects().Components.createComponent("mobile.editor.components.editpanels.ParagraphDataPanel","mobile.editor.skins.editpanels.ParagraphDataPanelSkin",d,{},undefined,function(e){}.bind(this),b+"_text");
this._textDataPanelSkinContainer.insertInto(this._skinParts.textDataPanel)
}.bind(this));
var c=this._data.get("image");
this.injects().Preview.getPreviewManagers().Data.getDataByQuery(c,function(e){var f=this.injects().Components;
var d={standAlone:false,imagePositionHandler:this._onImagePositionChange.bind(this)};
this._imageDataPanelSkinContainer=f.createComponent("editor.components.ImageDataPanel","skin.editor.ImageDataPanelSkin",e,d,undefined,undefined,b+"_image");
this._imageDataPanelSkinContainer.insertInto(this._skinParts.imageDataPanel)
}.bind(this))
},_onImagePositionChange:function(a){this._setDataField("imagePosition",a)
},getAcceptableDataTypes:function(){return["RichTextImage"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.ServiceItemDataPanel",skinParts:{titleInput:{type:"htmlElement",highlight:"label",highlightAnimation:"highlightAnimationOpacity",autoBindData:"title"},descriptionInput:{type:"htmlElement",highlight:"description",highlightAnimation:"highlightAnimationOpacity",autoBindData:"description"},inputArea:{type:"htmlElement"},imageDiv:{type:"htmlElement"},componentTitle:{type:"htmlElement"},deletePhoto:{type:"htmlElement"},changePhoto:{type:"htmlElement"},addPhoto:{type:"htmlElement",autoBindDictionary:"addPic"}},traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["showPhoto","hidePhoto"],Binds:["_toggleHide","_onDelPhoto","_onChangePhoto","_onImageData","_setImageVisible","_onInputFocus","_onInputFocusOut","_replacePicCB","_onDescriptionFocus","_onDescriptionFocusOut"],initialize:function(c,a,b){this.parent(c,a,b);
this._allPartsReady=false
},_prepareForRender:function(){if(this._allPartsReady){return true
}var a=this.getRawData();
if(a&&a.image){var b=a.image;
this.injects().Preview.getPreviewManagers().Data.getDataByQuery(b,function(c){this._onImageData(c);
this._imageSkinContainer=this.injects().Components.createComponent("mobile.core.components.Image","mobile.core.skins.ImageSkin",c,{width:100,height:100,unit:"px",align:"center",valign:"middle",cropMode:"full"},this._onAllPartWixified.bind(this))
}.bind(this))
}else{this._allPartsReady=true
}return this._allPartsReady
},_onDelPhoto:function(){if(!this._imageData){return
}this._imageData.setMeta("isHidden",true);
this._imageData.fireDataChangeEvent()
},_onChangePhoto:function(){W.EditorDialogs.openMediaDialog(this._replacePicCB,false,"Photos",["UserMedia","Photos"])
},_replacePicCB:function(c){var b=this._imageData.getData();
for(var a in c){b[a]=c[a]
}this._imageData.setMeta("isHidden",false);
this._imageData.fireDataChangeEvent()
},_onAllSkinPartsReady:function(a){this._bindInputToDataField(a.titleInput,"title",false,100);
this._bindInputToDataField(this._skinParts.descriptionInput,"description",false,1000);
a.changePhoto.addEvent("click",this._onChangePhoto);
a.deletePhoto.addEvent("click",this._onDelPhoto);
a.addPhoto.addEvent("click",this._onChangePhoto)
},_onImageData:function(a){this._imageData=a;
this._imageData.addEvent(Constants.DataEvents.DATA_CHANGED,this._setImageVisible);
this._setImageVisible()
},_onInputFocus:function(){if(!this._data.getMeta("isPreset")){return
}this._skinParts.titleInput.set("value","")
},_onInputFocusOut:function(){if(!this._data.getMeta("isPreset")){return
}this._skinParts.titleInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","serviceTitlePresetText"))
},_onDescriptionFocus:function(){if(!this._data.getMeta("isPreset")){return
}this._skinParts.titleInput.set("value","")
},_onDescriptionFocusOut:function(){if(!this._data.getMeta("isPreset")){return
}this._skinParts.descriptionInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","serviceDescriptionPresetText"))
},_setImageVisible:function(){if(this._imageData.getMeta("isHidden")){this.setState("hidePhoto")
}else{this.setState("showPhoto")
}},_onAllPartWixified:function(a){this._imageSkinContainer.insertInto(this._skinParts.imageDiv);
this._allPartsReady=true;
this._renderIfReady()
},_toggleHide:function(){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
var a=this._data.getMeta("isHidden");
this._data.setMeta("isHidden",!a);
this._data.fireDataChangeEvent();
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
},getAcceptableDataTypes:function(){return["Service"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.ServiceListDataPanel",skinParts:{itemsContainer:{type:"htmlElement"},addLinkButton:{type:"htmlElement"},componentTitle:{type:"htmlElement"},newServiceSplashScreen:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.editpanels.BaseListDataPanel",_states:["presetData","realData"],Binds:["_addService","_addFirstService","_moveItem"],render:function(){if(!this._hasRenderData()){this.setState("presetData");
var b=this.injects().Theme.getProperty("THEME_DIRECTORY");
var a="service_empty.jpg";
var c=this._data.get("serviceType");
switch(c){case"events":a="events_empty.jpg";
break;
case"collection":a="collection_empty.jpg";
break;
case"restaurant":a="restaurant_empty.jpg";
break
}var d="url('"+b+"preset_splash_images/"+a+"') no-repeat";
this._skinParts.newServiceSplashScreen.setStyle("background",d)
}else{this.setState("realData")
}},_getRenderData:function(){if(this._hasRenderData()){return{itemsLogicName:"mobile.editor.components.editpanels.ServiceItemDataPanel",itemsDataFieldName:"items",enableHide:false,enableDelete:true}
}return null
},_onAllSkinPartsReady:function(b){var a="Add an Item";
b.componentTitle.set("html","");
b.addLinkButton.set("html",this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_ADD_ANOTHER_LINK"));
b.addLinkButton.addEvent("click",this._addService);
b.newServiceSplashScreen.addEvent("click",this._addFirstService)
},_addFirstService:function(){this._data.setMeta("isPreset",false);
this._data.get("items").empty();
this._addService()
},_addService:function(){if(tinyMCE.selectedInstance){tinyMCE.selectedInstance.remove()
}var d=this._data.getDataManager();
var c=this._data.get("serviceType");
var i=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_TITLE_1");
var g=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_DESCRIPTION_1");
var e=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_DEFAULT_IMAGE_ID_1");
switch(c){case"collection":i=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_TITLE_1");
g=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_DESCRIPTION_1");
e=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_COLLECTION_DEFAULT_IMAGE_ID_1");
break;
case"events":i=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_TITLE_1");
g=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_DESCRIPTION_1");
e=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_EVENTS_DEFAULT_IMAGE_ID_1");
break;
case"restaurant":i=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_TITLE_1");
g=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_DESCRIPTION_1");
e=this.injects().Resources.get("EDITOR_LANGUAGE","SERVICES_RESTAURANT_DEFAULT_IMAGE_ID_1");
break
}var b={uri:e,title:"",description:"",width:"93",height:"128",type:"Image",metaData:{isPreset:true}};
var f="#"+d.addDataItemWithUniqueId("Service_Image",b).id;
var h={title:i,description:g,image:f,type:"Service",metaData:{isPreset:true}};
var a="#"+d.addDataItemWithUniqueId("Service",h).id;
this._data.get("items").push(a);
this._data.fireDataChangeEvent()
},_moveItem:function(c,a){if(tinyMCE.selectedInstance){var b=tinyMCE.selectedInstance.id;
tinyMCE.selectedInstance.remove();
this.parent(c,a);
setTimeout(function(){$(b).getParent("[comp=mobile.editor.components.editpanels.ParagraphDataPanel]").fireEvent("focus")
},50)
}else{this.parent(c,a)
}},getAcceptableDataTypes:function(){return["ServiceList"]
},_hasRenderData:function(){var b=this._data;
var a=b?b.get("items"):null;
return(b&&(!b.getMeta("isPreset"))&&a&&a.length>0)
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.SiteMenuDataPanel",imports:[],skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.editpanels.BaseListDataPanel",_getRenderData:function(){return{itemsLogicName:"mobile.editor.components.editpanels.MenuItemDataPanel",itemsDataFieldName:"pages",enableHide:true,enableDelete:true}
},_onItemDelete:function(a){this.injects().Editor.deletePage(a.getDataItem())
},_getDataManager:function(){return this.injects().Preview.getPreviewManagers().Data
},getAcceptableDataTypes:function(){return["Document"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.TwitterFollowDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{fancyContainer:{type:"mobile.editor.components.FancyItem"},inputArea:{type:"htmlElement"},icon:{type:"htmlElement"},userToFollowInput:{type:"htmlElement",highlight:"label",highlightAnimation:"highlightAnimationOpacity",focus:true},showCountDropDown:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_updateShowCount","_onFocusUserToFollowInput"],initialize:function(c,a,b){this.parent(c,a);
this.previewSkinContainer=b.previewSkinContainer
},render:function(){if(!this.runOnce){this.runOnce=true;
this._skinParts.fancyContainer.createGui({dataPanel:this},[this._skinParts.icon,this._skinParts.inputArea])
}this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
var b=this.injects().Theme.getProperty("CONTACT_DIRECTORY");
var a=b+"twitter_follow.png";
this._skinParts.icon.set("src",a);
if(this._data.get("accountToFollow")===""){this._skinParts.userToFollowInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_FOLLOW_USER_TO_FOLLOW"));
this._skinParts.userToFollowInput.style.color="gray";
this._skinParts.userToFollowInput.style.fontStyle="italic"
}else{this._skinParts.userToFollowInput.set("value",this._data.get("accountToFollow"))
}this._bindInputToDataField(this._skinParts.userToFollowInput,"accountToFollow",true,100);
this._addEventsToProperties();
this._setDropDownLabels()
},_setDropDownLabels:function(){this._skinParts.showCountDropDown.getElementById("yes").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_FOLLOW_SHOW_COUNT_YES"));
this._skinParts.showCountDropDown.getElementById("no").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_FOLLOW_SHOW_COUNT_NO"))
},_addEventsToProperties:function(){this._skinParts.showCountDropDown.addEvent("change",this._updateShowCount);
this._skinParts.userToFollowInput.addEvent("focus",this._onFocusUserToFollowInput)
},_updateShowCount:function(){var a=this._skinParts.showCountDropDown.get("value");
this._previewComponent.setComponentProperty("showCount",a)
},_onFocusUserToFollowInput:function(){var a=this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_FOLLOW_USER_TO_FOLLOW");
this._switchInputTextToEditMode(this._skinParts.userToFollowInput,a)
},_switchInputTextToEditMode:function(b,a){var c=b.get("value");
if(c==a){b.set("value","");
b.style.color="black";
b.style.fontStyle="normal"
}},getAcceptableDataTypes:function(){return["TwitterFollow"]
}}});
W.Components.newComponent({name:"mobile.editor.components.editpanels.TwitterTweetDataPanel",traits:["mobile.core.components.traits.InputFieldEvents","mobile.editor.components.traits.DataPanel"],skinParts:{fancyContainer:{type:"mobile.editor.components.FancyItem"},inputArea:{type:"htmlElement"},icon:{type:"htmlElement"},defaultTextInput:{type:"htmlElement",highlight:"label",highlightAnimation:"highlightAnimationOpacity",focus:true},userToFollowInput:{type:"htmlElement",highlight:"label",highlightAnimation:"highlightAnimationOpacity",focus:true},countPositionDropDown:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_updateCountPosition","_onFocusDefaultTextInput","_onFocusUserToFollowInput"],initialize:function(c,a,b){this.parent(c,a);
this.previewSkinContainer=b.previewSkinContainer
},render:function(){if(!this.runOnce){this.runOnce=true;
this._skinParts.fancyContainer.createGui({dataPanel:this},[this._skinParts.icon,this._skinParts.inputArea])
}this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange);
var b=this.injects().Theme.getProperty("CONTACT_DIRECTORY");
var a=b+"twitter_tweet.png";
this._skinParts.icon.set("src",a);
if(this._data.get("defaultText")===""){this._skinParts.defaultTextInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_TEXT_DEFAULT"));
this._skinParts.defaultTextInput.style.color="gray";
this._skinParts.defaultTextInput.style.fontStyle="italic"
}else{this._skinParts.defaultTextInput.set("value",this._data.get("defaultText"))
}this._bindInputToDataField(this._skinParts.defaultTextInput,"defaultText",true,100);
if(this._data.get("accountToFollow")===""){this._skinParts.userToFollowInput.set("value",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_USER_TO_FOLLOW"));
this._skinParts.userToFollowInput.style.color="gray";
this._skinParts.userToFollowInput.style.fontStyle="italic"
}else{this._skinParts.userToFollowInput.set("value",this._data.get("accountToFollow"))
}this._bindInputToDataField(this._skinParts.userToFollowInput,"accountToFollow",true,100);
this._addEventsToProperties();
this._setDropDownLabels()
},_setDropDownLabels:function(){this._skinParts.countPositionDropDown.getElementById("none").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_COUNT_NONE"));
this._skinParts.countPositionDropDown.getElementById("vertical").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_COUNT_VERTICAL"));
this._skinParts.countPositionDropDown.getElementById("horizontal").set("text",this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_COUNT_HORIZONTAL"))
},_addEventsToProperties:function(){this._skinParts.countPositionDropDown.addEvent("change",this._updateCountPosition);
this._skinParts.defaultTextInput.addEvent("focus",this._onFocusDefaultTextInput);
this._skinParts.userToFollowInput.addEvent("focus",this._onFocusUserToFollowInput)
},_updateCountPosition:function(){var a=this._skinParts.countPositionDropDown.get("value");
this._previewComponent.setComponentProperty("dataCount",a)
},_onFocusDefaultTextInput:function(){var a=this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_TEXT_DEFAULT");
this._switchInputTextToEditMode(this._skinParts.defaultTextInput,a)
},_onFocusUserToFollowInput:function(){var a=this.injects().Resources.get("EDITOR_LANGUAGE","TWITTER_TWEET_USER_TO_FOLLOW");
this._switchInputTextToEditMode(this._skinParts.userToFollowInput,a)
},_switchInputTextToEditMode:function(b,a){var c=b.get("value");
if(c==a){b.set("value","");
b.style.color="black";
b.style.fontStyle="normal"
}},getAcceptableDataTypes:function(){return["TwitterTweet"]
}}});
W.Components.newComponent({name:"mobile.editor.components.internal.EditDesignColorItem",skinParts:{label:{type:"htmlElement"},colorBtn:{type:"mobile.editor.components.ColorButton"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_colorChange","_saveStatus","_previewThemePropChange"],initialize:function(c,b,a){this.parent(c,b,a);
this._initColorPropName=a.colorProp;
this._initAllowAlpha=a.allowAlpha;
this.injects().Preview.addEventForPreviewThemePropertyChange(this._previewThemePropChange)
},render:function(){this._skinParts.label.set("html",this.injects().Resources.get("EDITOR_LANGUAGE",this._initColorPropName));
this._originalColor=this.injects().Preview.getPreviewThemeProperty(this._initColorPropName);
this._saveStatus("original");
var a=this._skinParts.colorBtn;
a.setSize("100%","100%");
a.setColor(this._originalColor);
a.enableAlpha(this._initAllowAlpha);
a.setHexDisplay(true)
},_onAllSkinPartsReady:function(b){var a=b.colorBtn;
a.addEvent("change",this._colorChange);
a.addEvent("click",this._saveStatus)
},resetColor:function(){this._skinParts.colorBtn.setColor(this._originalColor);
this._colorChange({cause:"reset",color:this._originalColor})
},_colorChange:function(b){this.injects().Preview.setPreviewThemeProperty(this._initColorPropName,b.color.getRgba());
if(this._initColorPropName=="siteBgColor"){if(b.cause=="select"||b.cause=="temp"){this.injects().Preview.setPreviewThemeProperty("bgType","BG_USES_CUSTOM_COLOR")
}else{var a=(b.cause=="reset")?"original":"init";
this._resetStatus(a)
}}},_saveStatus:function(a){if(this._initColorPropName=="siteBgColor"){a=a||"init";
this["_"+a+"BgColor"]=this.injects().Preview.getPreviewThemeRawProperty("siteBgColor");
this["_"+a+"BgType"]=this.injects().Preview.getPreviewThemeRawProperty("bgType");
this["_"+a+"BgId"]=this.injects().Preview.getPreviewThemeRawProperty("bgId");
this["_"+a+"BgDir"]=this.injects().Preview.getPreviewThemeRawProperty("BG_DIRECTORY")
}},_resetStatus:function(a){if(this._initColorPropName=="siteBgColor"){a=a||"init";
this["_"+a+"BgColor"]&&this.injects().Preview.setPreviewThemeProperty("siteBgColor",new W.Color(this["_"+a+"BgColor"]).getRgba());
this["_"+a+"BgType"]&&this.injects().Preview.setPreviewThemeProperty("bgType",this["_"+a+"BgType"]);
this["_"+a+"BgId"]&&this.injects().Preview.setPreviewThemeProperty("bgId",this["_"+a+"BgId"]);
this["_"+a+"BgDir"]&&this.injects().Preview.setPreviewThemeProperty("BG_DIRECTORY",this["_"+a+"BgDir"])
}},_previewThemePropChange:function(a){if(a.name==this._initColorPropName&&this._skinParts&&this._skinParts.colorBtn&&this._skinParts.colorBtn.setColor){this._skinParts.colorBtn.setColor(a.newVal)
}}}});
W.Components.newComponent({name:"mobile.editor.components.internal.EditDesignStudioItem",skinParts:{label:{type:"htmlElement"},studioBtn:{type:"mobile.editor.components.StudioButton"}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a);
this._initPropName=a.valueProp;
this._propType=a.mode;
this._valueChange=this._valueChange.bind(this);
this._previewThemePropChange=this._previewThemePropChange.bind(this);
this.injects().Preview.addEventForPreviewThemePropertyChange(this._previewThemePropChange)
},render:function(){this._skinParts.label.set("html",this.injects().Resources.get("EDITOR_LANGUAGE",this._initPropName));
this._skinParts.studioBtn.setPropertyType(this._propType);
this._originalValue=this.injects().Preview.getPreviewThemeProperty(this._initPropName);
var a=this._skinParts.studioBtn;
a.setValue(this._originalValue);
a.setSize("100%","100%")
},_onAllSkinPartsReady:function(){this._skinParts.studioBtn.addEvent("change",this._valueChange)
},resetValue:function(){this._skinParts.studioBtn.set("value",this._originalValue);
this._valueChange({cause:"reset",value:this._originalValue})
},_valueChange:function(a){this.injects().Preview.setPreviewThemeProperty(this._initPropName,a.value)
},_previewThemePropChange:function(a){if(a.name==this._initPropName&&this._skinParts&&this._skinParts.studioBtn){this._skinParts.studioBtn.setValue(a.newVal)
}}}});
W.Classes.newTrait({name:"mobile.editor.components.traits.DataPanel",trait:{initialize:function(c,a,b){this.setPreviewComponent(b&&b.previewComponent);
this._highlightAnimActiveList={}
},focus:function(){var a=this.getFocusNode();
W.Utils.callLater(function(){try{a.focus()
}catch(b){}},null,this,50)
},setPreviewComponent:function(a){this._previewComponent=a
},highlightPreviewElement:function(b,d){if(!b||!this._previewComponent){return
}b=(b.getLogic)?b.getLogic():b;
var f=Object.keyOf(this._skinParts,b)||"view";
var e=this._skinPartsSchema[f]||{};
var c=this._getPreviewSkinPartName(e.highlight);
var a=this._previewComponent.getSkinPart(c)||this._previewComponent.getViewNode();
d=d||e.highlightAnimation||"noHighlightAnimation";
if(this[d]&&!this._highlightAnimActiveList[c]&&this._previewComponent.getViewNode().isVisible()){this._highlightAnimActiveList[c]=true;
this.injects().Preview.scrollToElement(a);
this[d](a,function(){this._highlightAnimActiveList[c]=false
}.bind(this))
}},_getPreviewSkinPartName:function(d){var c;
if(d){if(typeof d==="string"){c=d
}else{if(d.length==+d.length){for(var b=0,a=d.length;
b<a;
b++){if(this._previewComponent.getSkinPart(d[b])){c=d[b];
break
}}}}}return c||"view"
},noHighlightAnimation:function(a,b){this.injects().Utils.callLater(function(){b&&b()
},null,this,250)
},highlightAnimationBasicBlink:function(e,t){var h;
var j=e.getStyle("color");
var c=e.getStyle("background-color");
var s=new W.Color(j);
var l=s.getInvertColor();
var q=l.getHex();
var m=0.3;
var o=(s.getRed()-l.getRed())*m;
var d=(s.getGreen()-l.getGreen())*m;
var f=(s.getBlue()-l.getBlue())*m;
var a=Math.round(s.getRed()-o);
var k=Math.round(s.getGreen()-d);
var p=Math.round(s.getBlue()-f);
var n=new W.Color(a,p,k);
var i=n.getHex();
h=new Fx.Tween(e,{duration:250,property:"background-color",transition:Fx.Transitions.linear});
h.start(q,i).chain(function(){h.start(i,q).chain(function(){e.setStyle("background-color",c);
t&&t()
}.bind(this))
}.bind(this));
return h
},highlightAnimationOpacity:function(a,d){var c;
var b=a.getStyle("opacity");
if(!b&&b!==0){b=1
}c=new Fx.Tween(a,{duration:250,property:"opacity",transition:Fx.Transitions.linear});
c.start(b,0.3).chain(function(){c.start(0.3,b).chain(function(){d&&d()
}.bind(this))
}.bind(this));
return c
}}});
W.Classes.newTrait({name:"mobile.editor.components.traits.EditorFlowDispatcher",trait:{setEditorFlowCallback:function(a){this._editorFlowCallback=a
},_reportEditorFlowEvent:function(a,b){if(this._editorFlowCallback){this._editorFlowCallback(this,a,b)
}}}});
W.HtmlScriptsLoader.notifyScriptLoad();