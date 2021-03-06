({
    //-- @TODO: include more code comments on how this can be called.
    
	/**
	 *  Initialization event
	 **/
    doInit : function(component, event, helper) {
        console.log( 'ltng_VisualforceContainer inited');
        
        var pageName=component.get('v.pageName');
        var recordId=component.get('v.recordId');
        var urlArguments=component.get('v.urlArguments');
        var guid = component.getGlobalId();
        
        var pageSrc=helper.getPageSrc(pageName, recordId, urlArguments, guid);
        component.set('v.src', pageSrc);
	},
    
    refreshPage : function(component) {
        var btn = component.find("refresh-button").getElement();
        if(btn) {
            btn.style.display = 'none';
        }
        
        var iFrameTarget = component.find( "targetFrame").getElement()
        iFrameTarget.src = iFrameTarget.src;
    },    
    
    /**
     *  Handler for when all associated scripts have finished loading
     **/
    handleScriptsLoaded: function( component, event, helper ){
        console.log( 'VisualforceContainer: all scripts loaded' );
		helper.onetimeSetup(component, helper);
    }
    
})