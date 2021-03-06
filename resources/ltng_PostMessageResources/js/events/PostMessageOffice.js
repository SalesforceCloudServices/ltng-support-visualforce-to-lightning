/**
 * Class to help manage different types of postMessages based on postMessageType
 **/
this.PostMessageOffice = function( handlerScope ){
	if( !handlerScope ){
		this.handlerScope = this;
	} else {
		this.handlerScope = handlerScope;
	}
	this.handlers = {};
	
	this.unknownHandlerDefault = function( myPostMessage ){
		var errorMessage = 'there was no handler for messageType:' + myPostMessage.messageType;
		console.error( errorMessage ); console.error( arguments );
		debugger;
	};
	
	this.unknownHandler = this.unknownHandlerDefault;
};

/**
 * Adds a new handler based on messageType
 * @param messageType (string)
 * @param handler (function)
 **/
this.PostMessageOffice.prototype.addTypeHandler = function( messageType, handler ){
	if( messageType ){
		this.handlers[messageType]=handler;
		console.info('PostMessageOffice registered to handle messages of type:' + messageType);
	} else {
		this.unknownHandler = handler;
	}
};

/**
 *  Handles a new call that comes in
 *  @param postMessage event
 *  @return boolean - whether the postMessage could be handled (true) or not (false);
 **/
this.PostMessageOffice.prototype.receiveMessage = function( postMessage ){
	var myPostMessage = new PostMessageEnvelope();
	if( myPostMessage.parse(postMessage) ){
		if( this.handlers.hasOwnProperty( myPostMessage.messageType ) ){
			console.info('PostMessageOffice caught a message of type:' + myPostMessage.messageType);
			this.handlers[ myPostMessage.messageType ].call( this.handlerScope, myPostMessage );
			return( true );
		} if( this.unknownHandler ){
			this.unknownHandler.call( this.handlerScope, myPostMessage );
			return( false );
		} else {
			this.unknownHandlerDefault.call( this.handlerScope, myPostMessage );
			return( false );
		}
	} else {
		//-- not our message
		return( false );
	}
};

/**
 *  Listens for Window PostMessage events.
 *  var postOffice = new PostMessageOffice(this);
 *  postOffice.listenForPostEvents(window);
 *  @param window
 **/
this.PostMessageOffice.prototype.listenForPostEvents = function( targetWindow ){
	targetWindow.addEventListener('message',this.receiveMessage.bind(this),false);
};