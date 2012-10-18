W.Classes.newClass({name:"wysiwyg.editor.managers.undoredomanager.LayoutChange",Class:{Extends:Events,Binds:["_onUpdateAnchors","_serializeAnchors"],initialize:function(){this._compSerializer=this.injects().CompSerializer
},startListenTo:function(a){a.addEvent("updateAnchors",this._onUpdateAnchors)
},_reportChange:function(a){this.fireEvent(Constants.DataEvents.DATA_CHANGED,a)
},_onUpdateAnchors:function(b){var a=b.data;
this._reportChange(this._serializeData(a))
},_serializeData:function(a){a.type=this.className;
a.oldAnchors=this._serializeAnchors(a.oldAnchors);
a.newAnchors=this._serializeAnchors(a.newAnchors);
return a
},_serializeAnchors:function(b){var c=[];
var a=this._compSerializer;
b.each(function(d){c.push(a.serializeAnchor(d))
});
return c
},_deSerializeData:function(b){var a=this.injects().Preview.getPreviewSite().$$("#"+b.compId)[0].getLogic();
return{compRef:a,oldAnchors:this._deSerializeAnchors(b.oldAnchors,a),newAnchors:this._deSerializeAnchors(b.newAnchors,a)}
},_deSerializeAnchors:function(c,a){var d=[];
var b=this.injects().Preview.getPreviewManagers().Layout;
c.each(function(e){d.push(b.desrializeAnchor(e,a))
});
return d
},_replaceComponentAnchors:function(a,b){this._removeReverseAnchorsFromTargetComponent(a);
a.setAnchors(b)
},_removeReverseAnchorsFromTargetComponent:function(a){var b=a.getAnchors();
b.each(function(c){this._removeSingleAnchorFromTargetComponent(c)
}.bind(this))
},_removeSingleAnchorFromTargetComponent:function(b){var c=b.toComp;
var d=c.getReverseAnchors();
var a=d.indexOf(b);
d.splice(a,1)
},_undo:function(a){var b=this._deSerializeData(a);
this._replaceComponentAnchors(b.compRef,b.oldAnchors);
this.injects().Layout.enforceAnchors([b.compRef],true,true)
},_redo:function(a){var b=this._deSerializeData(a);
this._replaceComponentAnchors(b.compRef,b.newAnchors)
}}});
W.Classes.newClass({name:"wysiwyg.editor.managers.undoredomanager.PositionChange",Class:{Extends:Events,Binds:["_onChange"],startListenTo:function(a){a.addEvent("updatePosition",this._onChange);
a.addEvent("updateSize",this._onChange)
},_onChange:function(b){var a=b.data;
this.fireEvent(Constants.DataEvents.DATA_CHANGED,a)
},_updateComponentPosition:function(a,b){b.x!=null?a.setX(b.x):false;
b.y!=null?a.setY(b.y):false;
a.saveCurrentCoordinates()
},_updateComponentDimensions:function(a,b){b.h!=null?a.setHeight(b.h):false;
b.w!=null?a.setWidth(b.w):false;
a.saveCurrentDimensions()
},_getComp:function(a){return this.injects().Preview.getPreviewSite().$$("#"+a)[0].getLogic()
},_undo:function(a){var b=this._getComp(a.compId);
if(this._hasCoordinates(a)){this._updateComponentPosition(b,a.oldCoordinates)
}if(this._hasDimensions(a)){this._updateComponentDimensions(b,a.oldDimensions);
b.fireEvent("resizeEnd")
}},_redo:function(a){var b=this._getComp(a.compId);
if(this._hasCoordinates(a)){this._updateComponentPosition(b,a.newCoordinates)
}if(this._hasDimensions(a)){this._updateComponentDimensions(b,a.newDimensions);
b.fireEvent("resizeEnd")
}},_hasCoordinates:function(a){return a.oldCoordinates&&a.newCoordinates
},_hasDimensions:function(a){return a.oldDimensions&&a.newDimensions
}}});
W.Classes.newClass({name:"wysiwyg.editor.managers.undoredomanager.PropertyChange",Class:{Extends:Events,Binds:["_onDataChange","_getDataItemById"],startListenTo:function(a){this._dataManager=a;
a.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
},_reportChange:function(a){this.fireEvent(Constants.DataEvents.DATA_CHANGED,a)
},_onDataChange:function(c,e,b,d){var a={type:this.className,sender:d||null,dataItemId:c.getData().id,newValue:e,oldValue:b};
if(typeof a.newValue==="undefined"&&typeof a.oldValue==="undefined"){return
}this._reportChange(a);
return a
},_applyValue:function(b,e){var c=this._getDataItemById(b);
var a=Object.keys(e)[0];
var d=e[a];
c.set(a,d,false,"undo")
},_undo:function(a){this._applyValue(a.dataItemId,a.oldValue)
},_redo:function(a){this._applyValue(a.dataItemId,a.newValue)
},_getDataItemById:function(a){return this._dataManager.getDataByQuery("#"+a)
}}});
W.Classes.newClass({name:"wysiwyg.editor.managers.undoredomanager.DataChange",Class:{Extends:Events,Binds:["_onDataChange","_getDataItemById"],startListenTo:function(a){this._dataManager=a;
a.addEvent(Constants.DataEvents.DATA_CHANGED,this._onDataChange)
},_reportChange:function(a){this.fireEvent(Constants.DataEvents.DATA_CHANGED,a)
},_onDataChange:function(c,e,b,d){var a={type:this.className,timestamp:new Date().getTime(),sender:d||null,dataItemId:c.getData().id,newValue:e,oldValue:b};
this._reportChange(a);
return a
},_applyValue:function(b,e){var c=this._getDataItemById(b);
var a=Object.keys(e)[0];
var d=e[a];
c.set(a,d,false,"undo")
},_undo:function(a){this._applyValue(a.dataItemId,a.oldValue)
},_redo:function(a){this._applyValue(a.dataItemId,a.newValue)
},_getDataItemById:function(a){return this._dataManager.getDataByQuery("#"+a)
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.EditCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._copyCommand=a.registerCommandAndListener("EditCommands.Copy",this,this._onCopy);
this._pasteCommand=a.registerCommandAndListener("EditCommands.Paste",this,this._onPaste);
this._cutCommand=a.registerCommandAndListener("EditCommands.Cut",this,this._onCut);
this._duplicateCommand=a.registerCommandAndListener("EditCommands.Duplicate",this,this._onDuplicate);
this._deleteSelectedComponentCommand=a.registerCommandAndListener("WEditorCommands.WDeleteSelectedComponent",this,this._confirmAndDeleteSelectedComponent);
this._undoCommand=a.registerCommandAndListener("WEditorCommands.Undo",this,this._onUndo);
this._redoCommand=a.registerCommandAndListener("WEditorCommands.Redo",this,this._onRedo);
this._moveTopCommand=a.registerCommandAndListener("WEditorCommands.MoveTop",this,this._onMoveTop);
this._moveBottomCommand=a.registerCommandAndListener("WEditorCommands.MoveBottom",this,this._onMoveBottom);
this._moveForwardCommand=a.registerCommandAndListener("WEditorCommands.MoveForward",this,this._onMoveForward);
this._moveBackCommand=a.registerCommandAndListener("WEditorCommands.MoveBack",this,this._onMoveBack);
this._traverseComponentsCommand=a.registerCommandAndListener("WEditorCommands.TraverseComponents",this,this._onTraverseComponents);
this._traverseComponentsReverseCommand=a.registerCommandAndListener("WEditorCommands.TraverseComponentsReverse",this,this._onTraverseComponentsReverse)
},setKeyboardEvents:function(){var a=W.InputBindings;
a.addBinding("ctrl+v",{command:this._pasteCommand});
a.addBinding("ctrl+c",{command:this._copyCommand});
a.addBinding("ctrl+x",{command:this._cutCommand});
a.addBinding("ctrl+d",{command:this._duplicateCommand});
a.addBinding("ctrl+[",{command:this._moveBottomCommand});
a.addBinding("ctrl+]",{command:this._moveTopCommand});
a.addBinding("ctrl+&lt",{command:this._moveBackCommand});
a.addBinding("ctrl+&gt",{command:this._moveForwardCommand});
a.addBinding("delete",{command:this._deleteSelectedComponentCommand});
a.addBinding("ctrl+z",{command:this._undoCommand});
a.addBinding("ctrl+y",{command:this._redoCommand});
a.addBinding("ctrl+m",{command:this._traverseComponentsCommand});
a.addBinding("ctrl+shift+m",{command:this._traverseComponentsReverseCommand})
},enableEditCommands:function(c){c=!!c;
var a=[this._copyCommand,this._cutCommand,this._duplicateCommand,this._moveBackCommand,this._moveForwardCommand,this._moveTopCommand,this._moveBottomCommand];
for(var b=a.length-1;
b>=0;
--b){a[b].setState(c)
}},_onCopy:function(b,a){if(!W.Editor._editedComponent||!W.Editor._editedComponent.isDeleteableRecurse()){return
}W.ClipBoard.setClip(W.Editor._editedComponent)
},_onPaste:function(b,a){if(W.Editor._editingScope){var c=a.source?a.source.shiftKey:false;
W.ClipBoard.paste(W.Editor._editingScope,c)
}},_onCut:function(b,a){if(!W.Editor._editedComponent||!W.Editor._editedComponent.isDeleteableRecurse()){return
}W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","CUT_COMPONENT_TITLE"),W.Resources.get("EDITOR_LANGUAGE","CUT_COMPONENT_TEXT"),"",W.EditorDialogs.DialogButtonSet.OK_CANCEL,function(c){if(c.result=="OK"){W.ClipBoard.setClip(W.Editor._editedComponent);
W.Editor.doDeleteSelectedComponent()
}}.bind(this))
},_onDuplicate:function(b,a){if(!W.Editor._editedComponent||!W.Editor._editedComponent.isDeleteableRecurse()){return
}W.ClipBoard.duplicateComp(W.Editor._editedComponent,W.Editor._editedComponent.getParentComponent().getViewNode())
},_confirmAndDeleteSelectedComponent:function(){if(!W.Editor.canDeleteSelectedComponent()){return
}var a="DELETE_COMPONENT_TEXT";
if(W.Editor._editedComponent.isMultiSelect){a="DELETE_MULTI_COMPONENT_TEXT"
}W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","DELETE_COMPONENT_TITLE"),W.Resources.get("EDITOR_LANGUAGE",a),"",W.EditorDialogs.DialogButtonSet.DELETE_CANCEL,function(b){if(b.result=="DELETE"){LOG.reportEvent(wixEvents.COMPONENT_REMOVED,{c1:W.Editor._editedComponent.className});
W.Editor.doDeleteSelectedComponent()
}}.bind(this))
},_onUndo:function(){W.UndoRedoManager.undo()
},_onRedo:function(){W.UndoRedoManager.redo()
},_onMoveTop:function(){this._onZIndexChange(W.Editor.Z_INDEX_CHANGE_TYPES.TOP)
},_onMoveBottom:function(){this._onZIndexChange(W.Editor.Z_INDEX_CHANGE_TYPES.BOTTOM)
},_onMoveForward:function(){this._onZIndexChange(W.Editor.Z_INDEX_CHANGE_TYPES.FORWARD)
},_onMoveBack:function(){this._onZIndexChange(W.Editor.Z_INDEX_CHANGE_TYPES.BACK)
},_onTraverseComponents:function(){},_onTraverseComponentsReverse:function(){},_onZIndexChange:function(a){if(W.Editor._editedComponent==null){return
}var c=W.Editor._editedComponent;
var b=c.getParentComponent();
b.moveChild(c,a)
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.SaveCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._saveCommand=a.registerCommandAndListener("WEditorCommands.Save",this,this._onSaveCommand);
this._saveAsCommand=a.registerCommandAndListener("WEditorCommands.SaveAs",this,this._onSaveAsCommand);
this._saveAsTemplateCommand=a.registerCommandAndListener("WEditorCommands.SaveAsTemplate",this,this._onPublishTemplateCommand)
},setKeyboardEvents:function(){var a=W.InputBindings;
if(window.debugMode=="debug"){a.addBinding("ctrl+e",{command:this._saveAsCommand,commandParameter:{promptResultDialog:true}})
}if(W.Editor._siteIsTemplate===false&&editorModel.siteHeader.userId==="84770f67-ecbd-44b6-b35a-584f2dc15af1"){a.addBinding("ctrl+p",{command:this._saveAsTemplateCommand,commandParameter:{promptResultDialog:true}})
}a.addBinding("ctrl+s",{command:this._saveCommand,commandParameter:{promptResultDialog:true}})
},_onSaveCommand:function(b,a){if(!W.Preview.isSiteReady()){return
}if(W.Editor._editMode==W.Editor.EDIT_MODE.PREVIEW){return
}if(W.Config.siteNeverSavedBefore()){W.EditorDialogs.openSaveDialog()
}else{if(W.Editor.getEditorStatusAPI().getSaveInProcess()){return
}W.Editor.getEditorStatusAPI().setSaveInProcess(true);
W.ServerFacade.saveDocument(window.siteHeader.id,W.Preview.getPreviewSite(),function(){W.Editor.getEditorStatusAPI().setSaveInProcess(false);
if(b&&b.onCompleteCallback){b.onCompleteCallback()
}else{if(b&&b.promptResultDialog){W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","SUCCESS_SAVE_TITLE"),W.Resources.get("EDITOR_LANGUAGE","SUCCESS_SAVE_DESCRIPTION"),"",W.EditorDialogs.DialogButtonSet.OK)
}}if(window.opener&&window.opener.document.domain==document.domain){window.opener.location.reload()
}},function(c,d){W.Editor.getEditorStatusAPI().setSaveInProcess(false);
if(b&&b.onErrorCallback){b.onErrorCallback()
}else{if(b&&b.promptResultDialog){W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_TITLE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_DOCUMENT"),W.Resources.get("EDITOR_LANGUAGE","ERROR_CODE_IS")+" "+d,W.EditorDialogs.DialogButtonSet.OK)
}}})
}if(b&&(b.src=="saveBtn")){LOG.reportEvent(wixEvents.SAVE_BUTTON_CLICKED_IN_MAIN_WINDOW,{g1:W.Editor._templateId})
}},_onSaveAsCommand:function(c,a){var b={saveAs:true};
W.EditorDialogs.openSaveDialog(b)
},_onPublishTemplateCommand:function(){if(!W.Preview.isSiteReady()){return
}var a={};
a.onCompleteCallback=function(){W.ServerFacade.publishTemplate(window.siteHeader.id,function(){},function(b){})
}.bind(this);
this._onSaveCommand(a)
},_saveCurrentDocument:function(){if(!W.Config.siteNeverSavedBefore()){this._onSaveCommand()
}}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.OpenDialogCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._openPublishDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenPublishDialog",this,this._onOpenPublishDialogCommand);
this._openPublishWebsiteDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenPublishWebsiteDialog",this,this._onOpenPublishWebsiteDialogCommand);
this._openPublishWebsiteSuccessDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenPublishWebsiteSuccessDialog",this,this._onOpenPublishWebsiteSuccessDialogCommand);
this._openPublishWebsiteShareDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenPublishWebsiteShareDialog",this,this._onOpenPublishWebsiteShareDialogCommand);
this._openPublishFbSiteDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenPublishFbSiteDialog",this,this._onOpenPublishFbSiteDialogCommand);
this._openPublishFbSiteSuccessDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenPublishFbSiteSuccessDialog",this,this._onOpenPublishFbSiteSuccessDialogCommand);
this._openSaveSuccessDialogCommand=a.registerCommandAndListener("WEditorCommands.SaveSuccessDialog",this,this._onOpenSaveSuccessDialogCommand);
this._addPageDialogCommand=a.registerCommandAndListener("WEditorCommands.AddPageDialog",this,this._onOpenAddPageDialog);
this._openFontDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenFontDialogCommand",this,this._openFontDialog);
this._openColorSelectorDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenColorSelectorDialogCommand",this,this._openColorSelectorDialog);
this._openLinkDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenLinkDialogCommand",this,this._openLinkDialog);
this._openColorAdjusterDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenColorAdjusterDialogCommand",this,this._openColorAdjusterDialog);
this._openTPASettingsDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenTPASettingsDialog",this,this._openTPASettingsDialog);
this._openListEditDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenListEditDialog",this,this._openListEditDialog);
this._openListEditDialogCommand=a.registerCommandAndListener("WEditorCommands.OpenImageDialog",this,this._openImageDialog);
this._showHelpDialogCommand=a.registerCommandAndListener("WEditorCommands.ShowHelpDialog",this,this._showHelpDialog);
this._showColorPickerDialogCommand=a.registerCommandAndListener("WEditorCommands.ShowColorPickerDialog",this,this._openColorPickerDialog);
this._showBoxShadowDialogCommand=a.registerCommandAndListener("WEditorCommands.ShowBoxShadowDialog",this,this._openBoxShadowDialog)
},_onOpenPublishDialogCommand:function(b,a){LOG.reportEvent(wixEvents.PUBLISH_BUTTON_CLICKED_IN_MAIN_WINDOW);
if(!W.Preview.isSiteReady()){return
}if(W.Config.siteNeverSavedBefore()){this.injects().Commands.executeCommand("WEditorCommands.Save",b);
return
}if(W.Config.getApplicationType()==Constants.WEditManager.SITE_TYPE_FACEBOOK){this._onOpenPublishFbSiteDialogCommand()
}else{this._onOpenPublishWebsiteDialogCommand()
}},_onOpenPublishWebsiteDialogCommand:function(b,a){W.EditorDialogs.openPublishWebsiteDialog()
},_onOpenPublishWebsiteSuccessDialogCommand:function(b,a){W.EditorDialogs.openPublishWebsiteSuccessDialog()
},_onOpenPublishWebsiteShareDialogCommand:function(b,a){W.EditorDialogs.openPublishWebsiteShareDialog()
},_onOpenPublishFbSiteDialogCommand:function(b,a){W.EditorDialogs.openPublishFbSiteDialog()
},_onOpenPublishFbSiteSuccessDialogCommand:function(b,a){W.EditorDialogs.openPublishFbSiteSuccessDialog()
},_onOpenSaveSuccessDialogCommand:function(b,a){W.EditorDialogs.openSaveSuccessDialog()
},_onOpenAddPageDialog:function(b,a){W.EditorDialogs.openWAddPageDialog(b)
},_openColorSelectorDialog:function(a){W.EditorDialogs.openColorSelectorDialog(a)
},_openFontDialog:function(a){W.EditorDialogs.openFontDialog(a)
},_openLinkDialog:function(a){W.EditorDialogs.openLinkDialog(a)
},_openColorAdjusterDialog:function(a){W.EditorDialogs.openColorAdjusterDialog(a)
},_openTPASettingsDialog:function(a){W.EditorDialogs.openTPASettingsDialog(a)
},_openListEditDialog:function(a){W.EditorDialogs.openListEditDialog(a.data,a.galleryConfigID)
},_openImageDialog:function(a){a=a||{};
W.EditorDialogs.openMediaDialog(a.callback||this._onImgSelectDefault,false,a.galleryTypeID||"photos")
},_onImgSelectDefault:function(c){if(c.width||c.height){c.width=Number(c.width);
c.height=Number(c.height)
}var b=W.Data.createDataItem(c);
var a=W.Editor.getEditedComponent().getDataItem();
a.setFields(b.getData())
},_showHelpDialog:function(e,c){var a=this.injects().Config.getHelpServerUrl();
var d=W.Data.dataMap.HELP_IDS._data.items[e];
var b=a+d;
W.EditorDialogs.openHelpDialog(b)
},_openColorPickerDialog:function(a){W.EditorDialogs.openColorPickerDialog(a)
},_openBoxShadowDialog:function(a){W.EditorDialogs.openBoxShadowDialog(a)
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.OpenPanelCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._pagesCommand=a.registerCommandAndListener("WEditorCommands.Pages",this,this._onPages);
this._settingsCommand=a.registerCommandAndListener("WEditorCommands.Settings",this,this._onSettings);
this._marketCommand=a.registerCommandAndListener("WEditorCommands.Market",this,this._onMarket);
this._designCommand=a.registerCommandAndListener("WEditorCommands.Design",this,this._showEditDesignPanel);
this._showComponentCategoriesCommand=a.registerCommandAndListener("WEditorCommands.ShowComponentCategories",this,this._onShowComponentCategories);
this._showSiteName=a.registerCommandAndListener("WEditorCommands.ShowSiteName",this,this._onShowSiteName);
this._showFaviconAndThumbnail=a.registerCommandAndListener("WEditorCommands.ShowFaviconAndThumbnail",this,this._onShowFaviconAndThumbnail);
this._showSocial=a.registerCommandAndListener("WEditorCommands.ShowSocial",this,this._onShowSocial);
this._showSEO=a.registerCommandAndListener("WEditorCommands.ShowSEO",this,this._onShowSEO);
this._showStatistics=a.registerCommandAndListener("WEditorCommands.ShowStatistics",this,this._onShowStatistics);
this._showBackgroundDesignPanelCommand=a.registerCommandAndListener("WEditorCommands.ShowBackgroundDesignPanel",this,this._onShowBackgroundDesignPanel);
this._showBackgroundEditorPanelCommand=a.registerCommandAndListener("WEditorCommands.ShowBackgroundEditorPanel",this,this._onShowBackgroundEditorPanel);
this._showColorsPanelCommand=a.registerCommandAndListener("WEditorCommands.ShowColorsPanel",this,this._onShowColorsPanel);
this._showFontsPanelCommand=a.registerCommandAndListener("WEditorCommands.ShowFontsPanel",this,this._onShowFontsPanel);
this._advancedDesignCommand=a.registerCommandAndListener("WEditorCommands.AdvancedDesign",this,this._showAdvancedDesignPanel);
this._customizeComponentStyle=a.registerCommandAndListener("WEditorCommands.CustomizeComponentStyle",this,this._onCustomizeComponentStyle);
this._customizeColorsCommand=a.registerCommandAndListener("WEditorCommands.CustomizeColors",this,this._onCustomizeColors);
this._customizeFontsCommand=a.registerCommandAndListener("WEditorCommands.CustomizeFonts",this,this._onCustomizeFonts);
this._pageSettingsCommand=a.registerCommandAndListener("WEditorCommands.PageSettings",this,this._onPageSettings);
this._backToParentPanelCommand=a.registerCommandAndListener("WEditorCommands.BackToParentPanel",this,this._backToParentPanel);
this._showComponentCategoryCommand=a.registerCommandAndListener("WEditorCommands.ShowComponentCategory",this,this._onShowAddComponent)
},_onPages:function(){this._stopRichTextEdit();
W.Editor.clearSelectedComponent();
W.Editor._editorUI.showComponentInPanel("pagesPanel",true,null,Constants.EditorUI.PAGES_PANEL)
},_onSettings:function(a){var b=a?a.callback:null;
this._stopRichTextEdit();
W.Editor._editorUI.showComponentInPanel("settings",true,null,Constants.EditorUI.SETTINGS_PANEL,b)
},_onMarket:function(a){this._stopRichTextEdit();
W.Editor._editorUI.showComponentInPanel("market",true,null,Constants.EditorUI.MARKET_PANEL)
},_showEditDesignPanel:function(){this._stopRichTextEdit();
W.Editor._editorUI.showComponentInPanel("design",true,null,Constants.EditorUI.DESIGN_PANEL)
},_onShowComponentCategories:function(){this._stopRichTextEdit();
W.Editor._editorUI.showComponentInPanel("masterComponents",true,null,Constants.EditorUI.ADD_PANEL)
},_stopRichTextEdit:function(){if(W.Editor._editorComponents.editingFrame.getState()=="inPlaceEdit"){W.Editor._editorComponents.editingFrame.stopEditRichText()
}},_onShowSiteName:function(a){var b="siteName";
if(this._showPanelIfExist(b)){return
}W.Editor._editorUI.createComponentPart(b,false,a,function(c){this._savePanelInCache(c,b);
W.Editor._editorUI.showSubPanelWithParentPanelSize(c,true)
}.bind(this))
},_onShowFaviconAndThumbnail:function(a){var b="faviconAndThumbnail";
if(this._showPanelIfExist(b)){return
}W.Editor._editorUI.createComponentPart(b,false,a,function(c){this._savePanelInCache(c,b);
W.Editor._editorUI.showSubPanelWithParentPanelSize(c,true)
}.bind(this))
},_onShowSocial:function(a){var b="social";
if(this._showPanelIfExist(b)){return
}W.Editor._editorUI.createComponentPart(b,false,a,function(c){this._savePanelInCache(c,b);
W.Editor._editorUI.showSubPanelWithParentPanelSize(c,true)
}.bind(this))
},_onShowSEO:function(a){var b="seo";
if(this._showPanelIfExist(b)){return
}W.Editor._editorUI.createComponentPart(b,false,a,function(c){this._savePanelInCache(c,b);
W.Editor._editorUI.showSubPanelWithParentPanelSize(c,true)
}.bind(this));
LOG.reportEvent(wixEvents.SEO_PANEL_OPENED)
},_onShowStatistics:function(a){var b="statistics";
if(this._showPanelIfExist(b)){return
}W.Editor._editorUI.createComponentPart(b,false,a,function(c){this._savePanelInCache(c,b);
W.Editor._editorUI.showSubPanelWithParentPanelSize(c,true)
}.bind(this))
},_onShowBackgroundDesignPanel:function(b,a){W.Editor._editorUI.showComponentInPanel("backgroundDesign",true,null,Constants.EditorUI.DESIGN_PANEL,function(c){c.saveCurrentState()
})
},_onShowBackgroundEditorPanel:function(b,a){W.Editor._editorUI.showComponentInPanel("backgroundEditor",false,null,Constants.EditorUI.DESIGN_PANEL,function(c){c.saveCurrentState()
})
},_onShowColorsPanel:function(b,a){W.Editor._editorUI.showComponentInPanel("colorDesign",true,null,Constants.EditorUI.DESIGN_PANEL,function(c){c.saveCurrentState()
})
},_onShowFontsPanel:function(a,b){W.Editor._editorUI.showComponentInPanel("fonts",true,null,Constants.EditorUI.DESIGN_PANEL,function(c){c.saveCurrentState()
})
},_showAdvancedDesignPanel:function(b,a){W.Data.getDataByQuery("#STYLES",function(c){if(!c||!c.get("styleItems")){return
}W.EditorDialogs.openAdvancedStylingDialog({styleList:c._data.styleItems,selectedComponent:b.editedComponent,left:b.left})
}.bind(this))
},_onCustomizeComponentStyle:function(a){a=a||{};
W.Commands.executeCommand("WEditorCommands.AdvancedDesign",a)
},_onCustomizeColors:function(b,a){W.Editor._editorUI.showComponentInPanel("customizeColors",true,null,Constants.EditorUI.DESIGN_PANEL);
LOG.reportEvent(wixEvents.CUSTOMIZE_COLORS_OPENED)
},_onCustomizeFonts:function(b,a){W.Editor._editorUI.showComponentInPanel("customizeFonts",true,null,Constants.EditorUI.DESIGN_PANEL,function(c){c.saveCurrentState()
});
LOG.reportEvent(wixEvents.CUSTOMIZE_FONTS_OPENED)
},_onPageSettings:function(a){W.Editor._siteStructure.getDataManager().getDataByQuery(a.pageId,this._onPageSettingsDataReady.bind(this))
},_onPageSettingsDataReady:function(a){if(this._showPanelIfExist(a._data.id)){return
}W.Editor._editorUI.createComponentPart("pageSettings",false,{data:a},function(b){this._savePanelInCache(b,a._data.id);
W.Editor._editorUI.showSubPanelWithParentPanelSize(b,true)
}.bind(this))
},_backToParentPanel:function(){var a=W.Editor._editorUI.popHistory();
if(a){W.Editor._editorUI.showComponentInPanel(a.skinPart,true,a.args,a.state)
}},_onShowAddComponent:function(a){LOG.reportEvent(wixEvents.ADD_COMPONENT_CATEGORY_CLICKED,{c1:a});
W.Editor._editorUI.showComponentInPanel("addComponent",false,{category:a},Constants.EditorUI.ADD_PANEL)
},_showPanelIfExist:function(a){this._cachedPanels=this._cachedPanels||{};
if(this._cachedPanels[a]){W.Editor._editorUI.showSubPanelWithParentPanelSize(this._cachedPanels[a],true);
return true
}return false
},_savePanelInCache:function(a,b){this._cachedPanels=this._cachedPanels||{};
this._cachedPanels[b]=a
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.PageManipulationCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_pastePage","_updatePageMenuItem"],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._pageTransitionCommand=a.registerCommandAndListener("WEditorCommands.PageTransition",this,this._onPageTransitionChanged);
this._deletePageCommand=a.registerCommandAndListener("WEditorCommands.DeletePage",this,this._onDeletePage);
this._duplicatePageCommand=a.registerCommandAndListener("WEditCommands.DuplicatePage",this,this._onDuplicatePage);
this._addPageCommand=a.registerCommandAndListener("WEditorCommands.AddPage",this,this._onWAddPage)
},_onPageTransitionChanged:function(c,b){var a=W.Preview.getPreviewManagers().Viewer.getPageGroup();
a.setComponentProperty("transition",c)
},_onDeletePage:function(a,b){W.Editor.deletePage(a)
},_onDuplicatePage:function(d){var a=d.newPageName;
var c=d.pageParent;
var e=W.Preview.getPreviewSite().$(d.pageHtmlId).getLogic();
var b=W.ClipBoard.copyComponent(e);
this._pastePage(b,a,c)
},_onWAddPage:function(d){var c=d.page;
var a=d.parent;
LOG.reportEvent(wixEvents.ADD_PAGE,{label:c.name});
var b=function(e){if(e.data){e.data.metaData.isPreset=true
}if(e.components){e.components.forEach(b)
}};
c.serializedPageData.components.forEach(b);
this._pastePage(c.serializedPageData,c.name,a);
this.injects().UndoRedoManager._endTransaction(null)
},_pastePage:function(c,a,b){W.Editor.setEditMode(W.Editor.EDIT_MODE.CURRENT_PAGE);
var f=W.Preview.getPreviewManagers().Viewer;
var e=f.getSiteNode().getElement("#SITE_PAGES");
var d=W.ClipBoard.pasteFromClip(e,true,c,false,function(){d.getLogic().listenForContentRendered()
}.bind(this));
d.addEvent(Constants.ComponentEvents.READY,function(){W.Preview.getPreviewManagers().Data.getDataByQuery(d.get("dataquery"),function(g){var i=g.get("id");
d.set("id",i);
var h=W.Utils.convertToValidUrlPart(a);
g.set("pageUriSEO",h);
g.set("title",a);
f.indexPages(e);
f.updatePagesData();
this._updatePageMenuItem(b,g);
d.getLogic().setAsWixified();
W.Commands.executeCommand("EditorCommands.gotoSitePage",i)
}.bind(this))
}.bind(this))
},_updatePageMenuItem:function(b,a){var c=W.Preview.getPreviewManagers().Data.getDataByQuery("#MAIN_MENU");
c.createAndAddNavigationItem("#"+a.get("id"),b)
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.AccountCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._upgradeToPremiumCommand=a.registerCommandAndListener("WEditorCommands.UpgradeToPremium",this,this._onUpgradeToPremiumCommand);
this._publishCommand=a.registerCommandAndListener("WEditorCommands.Publish",this,this._onPublishCommand);
this._goToMyAcountCommand=a.registerCommandAndListener("WEditorCommands.GoToMyAcount",this,this._onGoToMyAcountCommand);
this._manageDomainCommand=a.registerCommandAndListener("WEditorCommands.ManageDomain",this,this._onManageDomainCommand);
this._postInFacebookCommand=a.registerCommandAndListener("WEditorCommands.PostInFacebook",this,this._onPostInFacebookCommand);
this._postInTwitterCommand=a.registerCommandAndListener("WEditorCommands.ShareInTwitter",this,this._onShareInTwitterCommand)
},_onUpgradeToPremiumCommand:function(h,f){if(W.Config.siteNeverSavedBefore()){var e=W.Resources.get("EDITOR_LANGUAGE","MUST_SAVE_BEFORE_PUBLISH");
var g={description:e};
W.EditorDialogs.openSaveDialog(g)
}else{var a=window.serviceTopology.premiumServerUrl;
var c=a+"/wix/api/premiumStart";
var d=W.Config.getMetaSiteId();
var b="edhtml_"+h.referralAdditionalInfo;
window.open(c+"?siteGuid="+d+"&referralAdditionalInfo="+b);
W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","REFRESH_WHEN_UPGRADE_COMPLETED_TITLE"),W.Resources.get("EDITOR_LANGUAGE","REFRESH_WHEN_UPGRADE_COMPLETED_DESCRIPTION"),"",W.EditorDialogs.DialogButtonSet.OK)
}},_onPublishCommand:function(){if(!W.Preview.isSiteReady()){return
}var a={};
a.onCompleteCallback=function(){if(W.Config.getApplicationType()==Constants.WEditManager.SITE_TYPE_FACEBOOK){W.ServerFacade.publishDocument(window.siteHeader.id,function(){W.Commands.executeCommand("WEditorCommands.OpenPublishFbSiteSuccessDialog")
},function(b,c){W.Utils.errorPopup(W.Resources.get("EDITOR_LANGUAGE","ERROR_PUBLISH_DOCUMENT_FB_TITLE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_PUBLISH_DOCUMENT_FB"),W.Resources.get("EDITOR_LANGUAGE","ERROR_CODE_IS")+" "+c)
})
}else{W.ServerFacade.publishDocument(siteHeader.id,function(){W.Commands.executeCommand("WEditorCommands.OpenPublishWebsiteSuccessDialog")
},function(b,c){W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","ERROR_PUBLISH_TITLE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_PUBLISH_DOCUMENT"),W.Resources.get("EDITOR_LANGUAGE","ERROR_CODE_IS")+" "+c,W.EditorDialogs.DialogButtonSet.OK,function(){})
})
}}.bind(this);
this.injects().Commands.executeCommand("WEditorCommands.Save",a)
},_onGoToMyAcountCommand:function(){var a=window.serviceTopology.dashboardUrl;
window.open(a);
this._closeDialog()
},_onManageDomainCommand:function(){var a=window.serviceTopology.premiumServerUrl;
window.open(a+"/wix/api/domainViewForm?domainName=anotherpleskdomainfortest.com&")
},_onPostInFacebookCommand:function(a){window.open("http://www.facebook.com/sharer/sharer.php?u="+a.url+"&t="+a.text)
},_onShareInTwitterCommand:function(b){var a=b.isPremium?W.Resources.get("EDITOR_LANGUAGE","TWITTER_CHECK_OUT_MY_SITE_MSG_PREMIUM"):W.Resources.get("EDITOR_LANGUAGE","TWITTER_CHECK_OUT_MY_SITE_MSG_NON_PREMIUM");
window.open("https://twitter.com/intent/tweet?url="+b.siteUrl+"&text="+a+"&related="+W.Resources.get("EDITOR_LANGUAGE","TWITTER_RELATED_WIX_ACCOUNTS"))
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.ComponentCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._changeSelectedComponentPosSizeCommand=a.registerCommandAndListener("WEditorCommands.SetSelectedCompPositionSize",this,this._setSelectedComponentPosSize);
this._addComponentCommand=a.registerCommandAndListener("WEditorCommands.AddComponent",this,this._onAddComponent);
this._addAppComponentCommand=a.registerCommandAndListener("WEditorCommands.AddAppComponent",this,this._onAddAppComponent);
this._addComponentfullParamsCommand=a.registerCommandAndListener("WEditorCommands.AddComponentFullParams",this,this._onAddComponentFullParams);
this._gridSnapToGridCommand=a.registerCommandAndListener("EditCommands.SnapToGrid",this,this._onSnapToGrid)
},_setSelectedComponentPosSize:function(e){var c=W.Editor._editedComponent;
var d=c.getSizeLimits();
var b=e.updateLayout;
var a=c.useLayoutOnDrag();
if(e.x!=undefined){c.setX(this._enforceMinMax(e.x,this.MINIMUM_X_DEFAULT,this.MAXIMUM_X_DEFAULT))
}if(e.y!=undefined){if(a){e.y=Math.max(c.getMinDragY(),e.y)
}c.setY(this._enforceMinMax(e.y,this.MINIMUM_Y_DEFAULT,this.MAXIMUM_Y_DEFAULT))
}if(e.width!=undefined){c.setWidth(this._enforceMinMax(e.width,d.minW,d.maxW))
}if(e.height!=undefined){c.setHeight(this._enforceMinMax(e.height,d.minH,d.maxH))
}var f=[c];
if(c.isMultiSelect){f=c.getSelectedComps()
}if(b&&!a){if(e.width!=undefined||e.height!=undefined){W.Layout.reportResize(f)
}else{W.Layout.reportMove(f)
}}if(e.enforceAnchors||a){W.Layout.enforceAnchors(f,true)
}if(W.Editor._editorComponents.componentPanel){W.Editor._editorComponents.componentPanel.updateCompPosSize()
}W.Editor._editorComponents.editingFrame.fitToComp();
W.Editor.onComponentChanged(false,true)
},_enforceMinMax:function(c,b,a){return Math.min(Math.max(c,b),a)
},_onAddComponentFullParams:function(e,d){if(W.Editor._editMode!=W.Editor.EDIT_MODE.CURRENT_PAGE){W.Commands.executeCommand("WEditorCommands.WSetEditMode",{editMode:W.Editor.EDIT_MODE.CURRENT_PAGE})
}W.Editor.clearSelectedComponent();
var a=this._addComponentToCurrentScope(e.compDef,e.styleId);
var c=e.viewNodeEvents;
if(c){for(var b in c){a.addEvent(b,function(){c[b](a)
})
}}},_addComponentToCurrentScope:function(d,b){var e=W.Preview.getPreviewManagers().Viewer;
var a;
if(W.Editor.getEditMode()==W.Editor.EDIT_MODE.CURRENT_PAGE){a=e.getSiteNode().getElement("#"+e.getCurrentPageId())
}else{if(W.Editor.getEditMode()==W.Editor.EDIT_MODE.MASTER_PAGE){a=e.getSiteNode()
}}if(d.comp){d.componentType=d.comp
}var c=W.CompDeserializer.createAndAddComponent(a,d,undefined,undefined,b,undefined);
return c
},_onAddComponent:function(b){if(!W.Editor._componentData){return
}if(!b){return W.Utils.debugTrace("WEditManager::_onAddComponent: Missing parameter")
}var a=b.compData||W.Editor._componentData[b.compType];
return this._onAddComponentInternal(b,a)
},_onAddComponentInternal:function(b,a){if(!a){return W.Utils.debugTrace("WEditManager::_onAddComponent: unknown component type "+b)
}var c=a.data;
if(c){c.metaData=c.metaData||{};
c.metaData.isPreset=true
}if(W.Editor._editMode!=W.Editor.EDIT_MODE.CURRENT_PAGE){W.Commands.executeCommand("WEditorCommands.WSetEditMode",{editMode:W.Editor.EDIT_MODE.CURRENT_PAGE})
}W.Editor.clearSelectedComponent();
this._addComponentToCurrentScope(a,b.styleId);
LOG.reportEvent(wixEvents.COMPONENT_ADDED,{c1:b.compType,c2:b.styleId})
},_onSnapToGrid:function(b){if(b==undefined){var a=W.Editor.getGridScale()!=1?1:Constants.WEditManager.DEFAULT_GRID_SCALE;
W.Editor.setGridScale(a);
return
}if(b){W.Editor.setGridScale(Constants.WEditManager.DEFAULT_GRID_SCALE)
}else{W.Editor.setGridScale(1)
}},_onAddAppComponent:function(e){var b=e.appDefinitionDataObj;
var d=e.widgetId||null;
var c=e.type;
var a=b.appDefinitionId;
var f=this.injects().AppStoreManager.countAppElements(c,a);
LOG.reportEvent(wixEvents.APPS_FLOW_APP_BUTTON_CLICKED,{g1:a,i1:f});
W.EditorDialogs.openAddAppDialog(b,c,d,function(){this.injects().AppStoreManager.addComponent(c,b,d);
LOG.reportEvent(wixEvents.APPS_FLOW_APP_ADDED_TO_STAGE,{g1:b.appDefinitionId})
}.bind(this))
}}});
W.Classes.newClass({name:"wysiwyg.editor.commandregistrars.EditorCommandRegistrar",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},registerCommands:function(){var a=W.Commands;
this._gridCommand=a.registerCommandAndListener("EditCommands.ToggleGridLines",this,this._onGrid);
this._setEditModeCommand=a.registerCommandAndListener("WEditorCommands.WSetEditMode",this,this._onSetEditMode)
},_onSetEditMode:function(b,a){if(!W.Preview.isSiteReady()){return
}W.Editor.setEditMode(b.editMode);
if(b&&(b.src=="previewBtn")){LOG.reportEvent(wixEvents.PREVIEW_BUTTON_CLICKED_IN_MAIN_WINDOW,{g1:W.Editor._templateId})
}},_onGrid:function(b){var a=W.Preview.getPreviewManagers().Viewer.getPageGroup();
a.toggleGrid()
}}});
W.Classes.newClass({name:"wysiwyg.editor.managers.WCommandRegistrar",imports:["wysiwyg.editor.commandregistrars.EditCommandRegistrar"],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_keydownEventHandler","_keyupEventHandler"],initialize:function(){this._editCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.EditCommandRegistrar"))();
this._saveCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.SaveCommandRegistrar"))();
this._openDialogCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.OpenDialogCommandRegistrar"))();
this._openPanelCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.OpenPanelCommandRegistrar"))();
this._pageManipulationCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.PageManipulationCommandRegistrar"))();
this._accountCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.AccountCommandRegistrar"))();
this._componentCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.ComponentCommandRegistrar"))();
this._editorCommandRegistrar=new (W.Classes.get("wysiwyg.editor.commandregistrars.EditorCommandRegistrar"))();
this._ignoreKeyhandlerInTags=null
},registerCommands:function(){var a=W.Commands;
a.registerCommand("EditorCommands.SiteLoaded");
this._editCommandRegistrar.registerCommands();
this._saveCommandRegistrar.registerCommands();
this._openDialogCommandRegistrar.registerCommands();
this._openPanelCommandRegistrar.registerCommands();
this._pageManipulationCommandRegistrar.registerCommands();
this._accountCommandRegistrar.registerCommands();
this._componentCommandRegistrar.registerCommands();
this._editorCommandRegistrar.registerCommands()
},setKeyboardEvents:function(){var a=W.InputBindings;
this._ignoreKeyhandlerInTags=a.ignoreKeyhandlerInTags;
$$("body").addEvent("keydown",this._keydownEventHandler);
$$("body").addEvent("keyup",this._keyupEventHandler);
this._editCommandRegistrar.setKeyboardEvents();
this._saveCommandRegistrar.setKeyboardEvents()
},enableEditCommands:function(a){this._editCommandRegistrar.enableEditCommands(a)
},_keyupEventHandler:function(a){if(!W.Editor._keysEnabled||this._ignoreKeyhandlerInTags.contains(a.target.get("tag"))){return true
}},_keydownEventHandler:function(d){if(!W.Editor._keysEnabled){return this._preventBackSpace(d)
}if(this._ignoreKeyhandlerInTags.contains(d.target.get("tag"))){return true
}var g=1;
var f=d.control||d.event.metaKey;
if(f){g=10
}var e=W.Commands.getCommand("WEditorCommands.SetSelectedCompPositionSize");
var a;
var b,c;
if(d.code==17&&W.Editor._editedComponent){W.Editor._editorComponents.editingFrame.refreshMultiSelect()
}if(d.key=="down"&&W.Editor._editedComponent){b=W.Editor._editedComponent.getY();
a={y:b+g}
}if(d.key=="up"&&W.Editor._editedComponent){b=W.Editor._editedComponent.getY();
a={y:b-g}
}if(d.key=="left"&&W.Editor._editedComponent){c=W.Editor._editedComponent.getX();
a={x:c-g}
}if(d.key=="right"&&W.Editor._editedComponent){c=W.Editor._editedComponent.getX();
a={x:c+g}
}if(a){a.updateLayout=true;
e.execute(a,this);
d.preventDefault();
d.stopPropagation();
return false
}return this._preventBackSpace(d)
},_preventBackSpace:function(a){if(this._ignoreKeyhandlerInTags.contains(a.target.get("tag"))){return
}var b;
if(window.event){b=window.event.keyCode
}else{if(a.code){b=a.code
}}if(b==8){a.preventDefault();
return false
}}}});
W.Classes.newClass({name:"wysiwyg.editor.managers.WEditorStatusAPI",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(){},getSaveInProcess:function(){return this._saveInProcess
},setSaveInProcess:function(a){this._saveInProcess=a
},isPreviouslyPublished:function(){return(this._alreadyPublishedBefore||W.Preview.getPreviewSite().window.rendererModel.published)
},markSiteAsPublishedBefore:function(){this._alreadyPublishedBefore=true
}}});
W.Classes.newClass({name:"wysiwyg.editor.managers.UndoRedoManager",imports:["wysiwyg.editor.managers.undoredomanager.LayoutChange","wysiwyg.editor.managers.undoredomanager.PropertyChange","wysiwyg.editor.managers.undoredomanager.PositionChange","wysiwyg.editor.managers.undoredomanager.DataChange"],Class:{Extends:Events,Binds:["_onChange","_getComponentDataManager","_resetStacks","_onSiteLoaded","_beforeSiteLoaded","_startTransaction","undo","redo","_onPageChange"],_constants:{Modules:{LAYOUT_CHANGE:"LayoutChange",COMP_DATA_CHANGE:"PropertyChange",POSITION_CHANGE:"PositionChange",DATA_CHANGE:"DataChange"},Commands:{UNDO:"_undo",REDO:"_redo"},_prefix:"wysiwyg.editor.managers.undoredomanager."},initialize:function(){this._historyStack=[];
this._knownFutureStack=[];
this._transactionStack=[];
this._layoutData=new this.imports.LayoutChange();
this._positionData=new this.imports.PositionChange();
this._compPropData=new this.imports.PropertyChange();
this._compData=new this.imports.DataChange();
this._isReady=false;
W.Managers.addEvent("deploymentCompleted",this._beforeSiteLoaded)
},isReady:function(){return this._isReady
},clone:function(){return new this.$class()
},_beforeSiteLoaded:function(){this.injects().Commands.registerCommandListenerByName("EditorCommands.SiteLoaded",this,this._onSiteLoaded,null);
this.injects().Commands.registerCommandListenerByName("WEditorCommands.AddPage",this,this._onAddPage,null);
this.injects().Commands.registerCommandListenerByName("WEditorCommands.AddComponent",this,this._resetStacks,null);
this._isReady=true
},_onSiteLoaded:function(){W.Editor.addEvent(Constants.EditorEvents.SITE_PAGE_CHANGED,this._onPageChange);
W.Managers.getManagers().Layout.addEvent("resetHistoryStack",this._resetStacks);
this._layoutData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onChange);
this._positionData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onChange);
this._compPropData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onChange);
this._compData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onChange);
this.modules={};
this.modules[this._constants.Modules.LAYOUT_CHANGE]=this._layoutData;
this.modules[this._constants.Modules.POSITION_CHANGE]=this._positionData;
this.modules[this._constants.Modules.COMP_DATA_CHANGE]=this._compPropData;
this.modules[this._constants.Modules.DATA_CHANGE]=this._compData;
var a=W.Managers.getManagers();
this._layoutData.startListenTo(a.Layout);
this._positionData.startListenTo(a.Layout);
this._compPropData.startListenTo(this._getComponentPropDataManager());
this._compData.startListenTo(this._getComponentDataManager());
this._currentPageId=this._getCurrentPageId()
},_onChange:function(d){if(d&&d.sender==="undo"){return
}this._resetFutureStack();
if(this._isInTransaction){this._transactionStack.unshift(d);
var c=d.type===this._constants._prefix+"DataChange";
var a=d.type===this._constants._prefix+"PropertyChange";
if(c||a){this._endTransaction(this._startScopeId);
this._startTransaction(this._startScopeId)
}return
}if(d&&d.timestamp&&this._isUndoable()&&this._historyStack[0].timestamp){var b=this._historyStack[0];
if(b.type!=d.type){return
}if(b.dataItemId!=d.dataItemId){return
}if(d.timestamp-b.timestamp<500){return
}}if(d){d.pageId=W.Preview.getPreviewManagers().Viewer.getCurrentPageId()
}this._historyStack.unshift(d)
},undo:function(){if(!this._isUndoable()){return false
}var b=this._historyStack[0];
this._currentPageId=this._getCurrentPageId();
if(this._currentPageId!=b.pageId){W.Preview.getPreviewManagers().Viewer.addEvent("pageTransitionEnded",this.undo);
this.injects().Preview.goToPage(b.pageId);
return
}else{W.Preview.getPreviewManagers().Viewer.removeEvent("pageTransitionEnded",this.undo)
}if(this._isTransactionData(b)){this._undoTransaction(b.transaction);
var a=this.injects().Editor.getComponentEditBox()._editedComponent;
if(a&&a.getLogic){this.injects().Layout.enforceAnchors([a],true,false)
}}else{this._applyChangeMap(this._constants.Commands.UNDO,b,b.type)
}this._knownFutureStack.unshift(b);
this._removeItemFromStack(this._historyStack);
this._refreshComponentEditBox();
this.injects().Editor.onComponentChanged(true);
return true
},redo:function(){if(!this._isRedoable()){return false
}var a=this._knownFutureStack[0];
this._currentPageId=this._getCurrentPageId();
if(this._currentPageId!=a.pageId){this.injects().Preview.getPreviewManagers().Viewer.addEvent("pageTransitionEnded",this.redo);
this.injects().Preview.goToPage(a.pageId);
return
}else{W.Preview.getPreviewManagers().Viewer.removeEvent("pageTransitionEnded",this.redo)
}if(this._isTransactionData(a)){this._redoTransaction(a.transaction)
}else{this._applyChangeMap(this._constants.Commands.REDO,a,a.type)
}this._historyStack.unshift(a);
this._removeItemFromStack(this._knownFutureStack);
this._refreshComponentEditBox();
this.injects().Editor.onComponentChanged(true);
return true
},_undoTransaction:function(a){for(var c=0;
c<a.length;
++c){var b=a[c].type;
this._applyChangeMap(this._constants.Commands.UNDO,a[c],b)
}},_redoTransaction:function(a){for(var c=0;
c<a.length;
++c){var b=a[c].type;
this._applyChangeMap(this._constants.Commands.REDO,a[c],b)
}},_startTransaction:function(a){if(a===null&&!this._isInTransaction){this._resetAfterTransaction=true
}if(a){this._startScopeId=a
}else{this._startScopeId=null
}if(this._isInTransaction){return
}this._isInTransaction=true;
this._transactionStack=[]
},_endTransaction:function(a){if(this._resetAfterTransaction){this._resetAfterTransaction=false;
this._resetStacks();
return
}if(this._resetStacksFlag){this._transactionStack=[];
this._resetStacksFlag=false;
return
}if(a==null||a!=this._startScopeId){this._resetStacks();
return
}this._isInTransaction=false;
if(!this._transactionStack.length){return
}this._historyStack.unshift({transaction:this._transactionStack,pageId:W.Preview.getPreviewManagers().Viewer.getCurrentPageId()});
this._transactionStack=[]
},_isTransactionData:function(a){return a.transaction&&typeOf(a.transaction)=="array"
},_applyChangeMap:function(c,a,b){this.modules[this._getType(b)][c](a)
},_getType:function(a){return a.replace(this._constants._prefix,"")
},_resetFutureStack:function(){if(this._isRedoable()){this._knownFutureStack=[]
}},_isUndoable:function(){return this._historyStack.length>0
},_isRedoable:function(){return this._knownFutureStack.length>0
},_removeItemFromStack:function(a){a.splice(0,1)
},_refreshComponentEditBox:function(){var a=this.injects().Editor;
if(a.getSelectedComp()){a.getComponentEditBox().fitToComp()
}},_onAddPage:function(){this._startTransaction(null)
},_resetStacks:function(){this._resetStacksFlag=true;
this._endTransaction(null);
this._isInTransaction=false;
this._transactionStack=[];
this._knownFutureStack=[];
this._historyStack=[]
},_onPageChange:function(a){this._currentPageId=a
},_getCurrentPageId:function(){return W.Preview.getPreviewManagers().Viewer.getCurrentPageId()
},_getComponentPropDataManager:function(){return this.injects().Preview.getPreviewManagers().ComponentData
},_getComponentDataManager:function(){return this.injects().Preview.getPreviewManagers().Data
}}});