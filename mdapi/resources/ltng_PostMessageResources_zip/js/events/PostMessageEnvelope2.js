/**
 *  Class representing a dispatchEvent.
**/

/**
 *  Constructs an Post Message Envelope (payload).
 *  <p>To be dispatched using the dispatch event</p>
 *  @param pageName - String - name of the page
 *  @param messageType - String - arbitrary name of the message type to be sent.
 *  @param isSuccessful (Boolean) - whether the call was successful or not
 *  @param payload (String|Object) - payload to be provided (will be converted to string)
 *  <p>TypeScript: constructor( pageName:String, messageType:String, isSuccessful:Boolean, payload:Object|String )</p>
**/
		
// Namespaces for the cometd implementation
this.PostMessageEnvelope = function(pageName, messageType, isSuccessful, payload ){
	this.sender = pageName;
	this.messageType = messageType;
	this.isSuccessful = isSuccessful;
	this.data = payload;
	
	return( this );
};

/**
 *  Dispatches the event.
 *  @param targetWindow (Window) - target window to dispatch from. i.e. parent
 *  @param targetDomain (String) - target domain to accept the request, defaults to '*'
 *  @return void
 *  <p>Typescript: dispatch( targetWindow:Window, targetDomain:String = '*' ):void</p>
**/
this.PostMessageEnvelope.prototype.dispatch = function( targetWindow, targetDomain ){
	if( !targetDomain ){
		targetDomain = '*';
	}
	var dataStr = "";
	var dataClone = JSON.parse(JSON.stringify(this.data));
	var payload = { sender: this.sender, messageType: this.messageType, isSuccessful: this.isSuccessful, data: dataClone };
	console.info('PostMessage now posting to the target window');
	targetWindow.postMessage( payload, targetDomain );
};
	
/**
 *  Whether the event was sent from a given page.
 *  @param pageName (String)
 *  @return boolean - whether the event was sent from that page in a case insensitive manner (true) or not (false)
 *  <p>TypeScript: matchesPage( pageName:String ):boolean</p>
**/
this.PostMessageEnvelope.prototype.matchesPage = function( pageName ){
	return( this.sender.toUpperCase() === pageName.toUpperCase() );
};
	
/**
 *  Whether the event was for a specific message.
 *  @param messageType (String)
 *  @return boolean - whether the message matches in a case insensitive manner (true) or not (false)
 *  <p>TypeScript: matchesMessageType( messageType:String ):boolean</p>
**/
this.PostMessageEnvelope.prototype.matchesMessageType = function( messageType ){
	return( this.messageType.toUpperCase() === messageType.toUpperCase() );
};
	
/**
 *  Whether it matches both the page and the message type
 *  @param pageName (String)
 *  @param messageType (String)
 *  @return boolean - whether the pageName and the messageType both match in a case insensitive manner.
 *  <p>TypeScript: matchesPageMessage( pageName:String, messageType:String ):boolean</p>
**/
this.PostMessageEnvelope.prototype.matchesPageMessage = function( pageName, messageType ){
	return( this.matchesPage( pageName ) && this.matchesMessageType( messageType ));
};
	
//-- static methods
	
/**
 *  Determines the origin of a PostMessage event.
 *  @return String
 *  <p>TypeScript getMessageOrigin( evt:PostMessageEvent ):String</p>
**/
this.PostMessageEnvelope.prototype.getMessageOrigin = function( evt ){
	return( event.origin || event.originalEvent.origin );
};
	
/**
 *  Parses a dispatched Event
 *  @param evt (postMessage Event)
 *  @return payload (Object) - instance of the PostMessageEnvelope (if applicable) - null if not.
 *  <p>TypeScript: getPayload( evt:PostMessageEvent ):PostMessageEnvelope</p>
**/
this.PostMessageEnvelope.prototype.parse = function( evt ){
	var results = null;
	try {
		if( !evt.data.sender ){
			throw( "not a PostMessageEnvelope" );
		}
		
		this.sender = evt.data.sender;
		this.messageType = evt.data.messageType;
		this.isSuccessful = evt.data.isSuccessful;
		this.data = evt.data.data;
	} catch( err ){
		//console.error( "unable to parse payload" );
		//console.error( err );
		return( false );
	}
	return( true );
};