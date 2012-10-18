
// Register configuration
W.Viewer.setViewerConfig(serviceTopology);

if(window.adData){
    W.Viewer.setAdData(adData);
}
// Register anchors
W.Layout.setSavedAnchor(anchors);// Override managers

$(document).addEvent('domready', function() {
    function checkIfExperimentsAreReady() {
        if(W.Experiments.isReady()) {
            W.Data.getDataByQuery('#SITE_STRUCTURE', function(siteStructureData) {
                var lazySiteLoad = (viewMode != 'preview');
                W.Viewer.setSite($('SITE_STRUCTURE'), siteStructureData, lazySiteLoad);
            });
            if($('wixFooter')){
                $('wixFooter').wixify();
            }
        } else {
            W.Utils.callLater(checkIfExperimentsAreReady, [], window, 10);
        }
    }

    function checkIfLoadCompleted() {
        if(W.HtmlScriptsLoader.isReady()) {
            // Load any missing classes
            W.Classes.setDynamicScriptLoading(true);

            // Set theme initiate data
            // Register Data
            W.Data.setInitDataItems(wixData.document_data);
            W.ComponentData.setInitDataItems(wixData.component_properties);
            W.Theme.setInitDataItems(wixData.theme_data);

            checkIfExperimentsAreReady();
        } else {
            W.Utils.callLater(checkIfLoadCompleted, [], window, 10);
        }
    }
    checkIfLoadCompleted();
});

W.HtmlScriptsLoader.notifyScriptLoad();