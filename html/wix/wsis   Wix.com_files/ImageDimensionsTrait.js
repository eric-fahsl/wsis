W.Classes.newTrait({
    'name': 'wixapps.integration.components.traits.ImageDimensionsTrait',
    'trait': {
        _imageModeDimDict: null,

        _getImageModeDimensionsFunc: function (imageMode) {
            this._imageModeDimDict = this._imageModeDimDict || {
                'fill': this._calcImageDimensionsFill.bind(this),
                'full': this._calcImageDimensionsFull.bind(this),
                'stretch': this._calcImageDimensionsStretch.bind(this),
                'fitWidth': this._calcImageDimensionsFitWidth.bind(this),
                'fitHeight': this._calcImageDimensionsFitHeight.bind(this)
            };

            return this._imageModeDimDict[imageMode];
        },

        _calcImageDimensionsFill: function (wrapperSize, imgSize) {
            return this._calcProportionalDimensions(wrapperSize, imgSize,
                Math.max(
                    wrapperSize.width / imgSize.width,
                    wrapperSize.height / imgSize.height
                )
            );
        },

        _calcImageDimensionsFull: function (wrapperSize, imgSize) {
            return this._calcProportionalDimensions(wrapperSize, imgSize,
                Math.min(
                    wrapperSize.width / imgSize.width,
                    wrapperSize.height / imgSize.height
                )
            );
        },

        _calcImageDimensionsStretch: function (wrapperSize, imgSize) {
            return {
                imgLeft: 0,
                imgTop: 0,
                imgWidth: wrapperSize.width,
                imgHeight: wrapperSize.height
            };
        },

        _calcImageDimensionsFitWidth: function (wrapperSize, imgSize) {
            var dim = this._calcProportionalDimensions(wrapperSize, imgSize, wrapperSize.width / imgSize.width);
            dim.imgLeft = 0;
            dim.imgTop = 0;
            dim.wrapperWidth = wrapperSize.width;
            dim.wrapperHeight = dim.imgHeight;
            return dim;
        },

        _calcImageDimensionsFitHeight: function (wrapperSize, imgSize) {
            var dim = this._calcProportionalDimensions(wrapperSize, imgSize, wrapperSize.height / imgSize.height);
            dim.imgLeft = 0;
            dim.imgTop = 0;
            dim.wrapperWidth = dim.imgWidth;
            dim.wrapperHeight = wrapperSize.height;
            return dim;
        },

        _calcProportionalDimensions: function (wrapperSize, imgSize, factor) {
            var imgWidth = factor * imgSize.width;
            var imgHeight = factor * imgSize.height;
            var imgLeft = (wrapperSize.width - imgWidth) / 2.0;
            var imgTop = (wrapperSize.height - imgHeight) / 2.0;

            return {
                imgLeft: imgLeft,
                imgTop: imgTop,
                imgWidth: imgWidth,
                imgHeight: imgHeight
            };
        }
    }
});