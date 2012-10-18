W.Classes.newClass({

    name: 'wysiwyg.editor.managers.WClipBoard',
    Class: {

        Extends:Events,

        initialize: function()
        {
            this._currentClip = null;
            this._isReady = true;
        },

        setClip: function(component)
        {
            //Component description object
            var clip  = this.copyComponent(component);
            //Store clip
            this._currentClip = clip;
        },
        duplicateComp: function(component, parent)
        {
            //Component description object
            var clip  = this.copyComponent(component);
            this.pasteFromClip(parent, true, clip);

        },


        copyComponent: function(component)
        {
            if(!component.isMultiSelect)
            {
                return W.CompSerializer.serializeComponent(component.getViewNode(),true);
            }
            else
            {
                var comps = [];
                for(var i=0;i<component.getSelectedComps().length;i++)
                {
                    comps.unshift(W.CompSerializer.serializeComponent(component.getSelectedComps()[i].getViewNode(),true));
                }
                return {isMultiSelect:true,comps:comps}
            }
        },



        isReady: function()
        {
            return this._isReady;
        },

        clone: function()
        {
            return new this.$class();
        },

        getClip: function()
        {
            return this._currentClip;
        },


        paste: function(toHtmlNode, useOriginalCoordinate,autoSelect) //
        {
            if(autoSelect==undefined)
            {
                autoSelect = true;
            }
            if(this._currentClip)
            {
                return this.pasteFromClip(toHtmlNode, useOriginalCoordinate, this._currentClip,autoSelect);
            }
            else
            {
                return null;
            }
        },
        pasteFromClip: function(toHtmlNode, useOriginalCoordinate, clip, autoSelect, callBack){
            if(autoSelect==undefined)
                autoSelect = true;
            if(clip.isMultiSelect)
            {
                W.CompDeserializer.createAndAddComponents(toHtmlNode, clip.comps, autoSelect);
                return;
            }
            var pastedComponent = W.CompDeserializer.createAndAddComponent(toHtmlNode, clip, useOriginalCoordinate, autoSelect,undefined, callBack);
            W.Editor._editorComponents.editingFrame.highlightEditingFrame();
            return pastedComponent;
        }
    }
});