W.Classes.newTrait({
    'name': 'wixapps.integration.components.traits.ResizableProxyTrait',
    'trait': {
        Binds: ['_handleSizeChange', '_onAppResize', '_onAppViewCreated', '_onResizableProxyDataChange'],
        initialize: function () {
        },

        _createWixComponent: function () {
            var innerElement = this.parent.apply(this, arguments);
	        if (innerElement.isCollapsed()) { // only the outer should be collapsed
		        innerElement.uncollapse();
	        }

            innerElement.setAttribute("position", "absolute");
            innerElement.removeAttribute("hasproxy");
            var element = this._createElement("div");
            element.adopt(innerElement);
            element.wixifySubElement = function () {
                innerElement.wixify.apply(this._innerElement, arguments);
            }.bind(this);
            this._innerElement = innerElement;
            return element;
        },

        _onComponentWixified: function () {
            // We want all the stuff to happen after everything has been processed...
            this._activateResizeMechanism();
        },

        _activateResizeMechanism: function () {
            this._componentLogic.addEvent('autoSizeChange', this._handleSizeChange);
            this.addEvent(Constants.WixAppEvents.APP_PART_RESIZE, this._onAppResize);
            this.addEvent(Constants.WixAppEvents.APP_VIEW_READY, this._onAppViewCreated);
            this._def.addEvent(Constants.DataItemEvents.CHANGE, this._onResizableProxyDataChange);
        },

        _deactivateResizeMechanism: function () {
            this._componentLogic.removeEvent('autoSizeChange', this._handleSizeChange);
            this.removeEvent(Constants.WixAppEvents.APP_PART_RESIZE, this._onAppResize);
            this.removeEvent(Constants.WixAppEvents.APP_VIEW_READY, this._onAppViewCreated);
            this._def.removeEvent(Constants.DataItemEvents.CHANGE, this._onResizableProxyDataChange);
        },

        _onResizableProxyDataChange: function () {
            setTimeout(function () {
                this._refreshComponentSize();
            }.bind(this), 250);
        },

        _refreshComponentSize: function () {
            this._setNaturalSize();
            this._onAppResize();
        },

        _onAppViewCreated: function () {
            this._refreshComponentSize();
            this._componentLogic.fireEvent('autoSizeChange');
        },

        /**
         * Called when the app part has been resized, which might possibly change the layout-based size
         * of the component
         */
        _onAppResize: function () {
            this._onLayoutChange();
        },

        /**
         * @override
         */
        _onLayoutChange: function (layoutWidth, layoutHeight) {
            var sizeCache = {};
            if (this._isLayoutBasedWidth()) {
                this._updateComponentDimension(layoutWidth, "x", sizeCache);
            }
            if (this._isLayoutBasedHeight()) {
                this._updateComponentDimension(layoutHeight, "y", sizeCache);
            }
        },

        _updateComponentDimension: function (size, dimProp, elementSizeCache) {
            var setterFunc = (dimProp === "x" ? this._componentLogic.setWidth : this._componentLogic.setHeight).bind(this._componentLogic);
            if(!this._isAbsoluteDimension(size)) {
                if(!(dimProp in elementSizeCache)) {
                    var elementSize = this._element.getSize();
                    elementSizeCache.x = elementSize.x;
                    elementSizeCache.y = elementSize.y;
                }
                size = elementSizeCache[dimProp];
            }
            setterFunc(size);
        },

        _isAbsoluteDimension: function (dimension) {
            if(dimension === undefined) {
                return false;
            } else if(typeOf(dimension) == "string" && dimension.contains("%")) {
                return false;
            }
            return true;
        },

        _setNaturalSize: function () {
            if (this._isCompBasedWidth()) {
                var naturalWidth = this._componentLogic.getSizeLimits().minW;
                this._element.setStyle("width", naturalWidth);
                this._innerElement.setStyle("width", naturalWidth);
            }
            if (this._isCompBasedHeight()) {
                var naturalHeight = this._componentLogic.getSizeLimits().minH;
                this._element.setStyle("height", naturalHeight);
                this._innerElement.setStyle("height", naturalHeight);
            }
        },

        /**
         * Called when the component has resized itself from within
         */
        _handleSizeChange: function () {
            if (this._isCompBasedWidth()) {
                this._element.setStyle("width", this._componentLogic.getWidth());
                this._innerElement.setStyle("width", this._componentLogic.getWidth());
            }
            if (this._isCompBasedHeight()) {
                this._element.setStyle("height", this._componentLogic.getHeight());
                this._innerElement.setStyle("height", this._componentLogic.getHeight());
            }
        },

        /**
         * Determines from the view definition, whether the width of the component is
         * determined by its layout (true) or by the component itself (false)
         * @return {*}
         * @private
         */
        _isLayoutBasedWidth: function () {
            var layoutDef = this._def.getParent().getChildValue('layout');
            if (this._getImplicitDimensions().contains('width')) {
                return false;
            }
            if (layoutDef && (('width' in layoutDef) || ('zoomExpand' in layoutDef))) {
                return true;
            } else {
                var parentLayout = this._getParentLayoutName();
                if (parentLayout === "VBox") {
                    return true;
                } else {
                    if (parentLayout === "HBox") {
                        return (layoutDef && ('box-flex' in layoutDef));
                    } else {
                        return false;
                    }
                }
            }
        },

        /**
         * Determines from the view definition, whether the height of the component is
         * determined by its layout (true) or by the component itself (false)
         * @return {*}
         * @private
         */
        _isLayoutBasedHeight: function () {
            var layoutDef = this._def.getParent().getChildValue('layout');
            if (this._getImplicitDimensions().contains('height')) {
                return false;
            }
            if (layoutDef && (('height' in layoutDef) || ('zoomExpand' in layoutDef))) {
                return true;
            } else {
                var parentLayout = this._getParentLayoutName();
                if (parentLayout === "HBox") {
                    return true;
                } else {
                    if (parentLayout === "VBox") {
                        return (layoutDef && ('box-flex' in layoutDef));
                    } else {
                        return false;
                    }
                }
            }
        },

        _isCompBasedWidth: function () {
            return !this._isLayoutBasedWidth();
        },

        _isCompBasedHeight: function () {
            return !this._isLayoutBasedHeight()
        },

        _getParentLayoutName: function () {
            var def = this._def.getParent();
            while (def && (!def.getChildByRef || !def.getChildByRef('items'))) {
                def = def.getParent();
            }
            if (def) {
                return def.getChildValue('name');
            }
        },

        _checkMinHeight: function (layoutHeight) {
            var minHeight = this._componentLogic.getPhysicalHeight();
            if (layoutHeight < minHeight) {
                this._element.setStyle("height", minHeight + "px");
                this._componentLogic.setHeight(minHeight);
                window.requestAnimFrame(function () {
                    if(this.fireEvent)
                        this.fireEvent(Constants.WixAppEvents.APP_PART_RESIZE);
                }.bind(this));
            }
        },

        _getDefaultPosition: function () {
            return "absolute";
        },

        /**
         * Returns list of dimension which are defined even if not explicitly specified in the 'layout' section.
         * For example, image in the 'fitWidth' mode has an implicit dimension 'height', because it is determined
         * by the width of the image.
         * @returns {Array.<String>}
         */
        _getImplicitDimensions: function () {
            return [];
        }


    }
});