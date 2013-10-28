/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){if(!("HTMLElement" in j)&&!("Element" in j)){return}var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false;do{r=t[s]+"";var q=g(this,r);if(q!==-1){this.splice(q,1);o=true}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}return !o};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

/* addEventListener Polyfill @source https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener*/
(function(){
	if (!Element.prototype.addEventListener)
	{
		var eventListeners=[],
			addEventListener = function( type, listener /*, useCapture (will be ignored) */ )
			{
				var self=this,
					wrapper=function(e)
					{
						e.target=e.srcElement;
						e.currentTarget=self;
						if (listener.handleEvent) {
							listener.handleEvent(e);
						}
						else
						{
							listener.call(self,e);
						}
					},
					wrapper2,
					e;
				if (type=="DOMContentLoaded")
				{
					wrapper2 = function(e)
					{
						if (document.readyState=="complete")
						{
							wrapper(e);
						}
					};
					document.attachEvent("onreadystatechange",wrapper2);
					eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
					if (document.readyState=="complete")
					{
						e=new Event();
						e.srcElement=window;
						wrapper2(e);
					}
				}
				else
				{
					this.attachEvent("on"+type,wrapper);
					eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
				}
			};

		Element.prototype.addEventListener=addEventListener;
		if (HTMLDocument)
		{
			HTMLDocument.prototype.addEventListener=addEventListener;
		}
		if (Window)
		{
			Window.prototype.addEventListener=addEventListener;
		}
	}
}());

/*! localStorage Polyfill */
(function(window,UNDEFINED){
	if ( ! 'localStorage' in window )
	{
		var cache = document.createElement('div'),
			expires;
			
		// UserData
		cache.style.behavior = 'url(#default#userData)';
		document.body.appendChild( cache );
		
		if ( cache.XMLDocument != UNDEFINED )
		{
			cache.load('localStoragePolyfill');
			
			// expiry
			expires = new Date();
			expires.setMinutes(
				expires.getMinutes() + 10080 // expiration = 1 week
			);
			cache.expires = expires.toUTCString();
			
			window.localStorage = {
				getItem: function( key )
				{
					return cache.getAttribute( key );
				},
				setItem: function( key, value )
				{
					return cache.setAttribute( key, value );
				},
				removeItem: function( key )
				{
					var current,
						attrs = cache.XMLDocument.firstChild.attributes,
						len = attrs.length;
					
					while ( i-- )
					{
						current = attr[i].nodeName;
						if ( current.indexOf( key ) === 0 )
						{
							cache.removeAttribute( key );
						}
					}
					return cache.save( id );
				}
			};
		}
		else
		{
			throw new Error('localStorage is not possible');
		}
	}
}(this));


/*! @source https://github.com/easy-designs/easyCouchMode.js*/
(function(window,document,UNDEFINED){
	
	var script_name = 'easyCouchMode',
		localStorage_key = script_name + '::is_enabled',
		BODY = 'body',
		ENABLED = script_name + '-enabled',
		BUTTON = script_name + '-button',
	 	couch_mode = false,
		config,
		wrapper,
		append_to,
		widget,
		button,
		css,
		body,
		head;
	
	// Requirement: QuerySelectorAll
	if ( ! 'querySelectorAll' in document ) { return; }
	
	// resize watcher
	function watchResize(callback)
	{
		var resizing;
		function done()
		{
			clearTimeout( resizing );
			resizing = null;
			callback();
		}
		window.addEventListener('resize',function(e){
			if ( resizing )
			{
				clearTimeout( resizing );
				resizing = null;
			}
			resizing = setTimeout( done, 100 );
		});
		// init
		callback();
	};
	
	function configure( custom_config )
	{
		var default_config = {
				wrapper_selector: BODY,
				append_to_selector: BODY,
				button_text_enlarge: 'Turn On Couch Mode',
				button_text_shrink: 'Turn Off Couch Mode',
				add_button_css: true
			},
			final_config = {},
			key;
		
		custom_config = custom_config || {};

		for ( key in default_config )
		{
			if ( default_config.hasOwnProperty( key ) )
			{
				final_config[key] = ( custom_config[key] != UNDEFINED ) ? custom_config[key] : default_config[key];
			}
		}
		return final_config;
	}
	
	
	function inCouchMode( set_to )
	{
		// Setting the couch mode in the session
		if ( typeof set_to == 'boolean' )
		{
			window.localStorage.setItem( localStorage_key, set_to.toString() );
		}
		// Retrieving the status
		else
		{
			return ( window.localStorage.getItem( localStorage_key ) == 'true' );
		}
	}
	
	
	// The resizer
	function onResize()
	{
		var browser_width = window.innerWidth;
		
		if ( browser_width > config.wrapper_max_width )
		{
			if ( widget.parentNode != append_to )
			{
 				append_to.appendChild(
					widget
				);
			}
			fixWebkitResizeBug();
		}
		else if ( browser_width < config.wrapper_max_width &&
				  widget.parentNode == append_to )
		{
			append_to.removeChild(
				widget
			);
		}
	}
	
	
	// Event listener
	function listen(e)
	{
		if ( e.target.className == BUTTON )
		{
			// only trap keycodes for enter and space
			if ( e.type == 'keydown' &&
			 	 e.keyCode != 32 &&
				 e.keyCode != 13 )
			{
				return;
			}
			if ( body.classList.contains( ENABLED ) )
			{
				body.classList.remove( ENABLED );
				button.innerHTML = config.button_text_enlarge;
				//button.classList.remove( ENABLED );
				inCouchMode(false);
			}
			else
			{
				body.classList.add( ENABLED );
				button.innerHTML = config.button_text_shrink;
				//button.classList.add( ENABLED );
				inCouchMode(true);
			}
			e.preventDefault();
		}
	}
	
	
	// A fix for theWebKit Resize Bug https://bugs.webkit.org/show_bug.cgi?id=53166.
	function fixWebkitResizeBug()
	{
		body.style.overflow = 'hidden';
		body.offsetHeight;
		body.style.removeProperty('overflow');
	}
	
	
	/* easyCouchMode
	 * Adds a button to the page to allow a use to enter "couch mode" and maintains it for the session
	 * 
	 * @param config - configuration object
	 * 		- wrapper_selector (str): selector targeting the element acting as a wrapper (defaults to 'body')
	 * 		- append_to_selector (str): selector targeting the element to which the button should be appended (defaults to 'body')
	 * 		- button_text_enlarge (str): the text to display in the toggle button when you can enlarge it (defaults to 'Turn On Couch Mode')
	 * 		- button_text_shrink (str): the text to display in the toggle button (defaults to 'Turn Off Couch Mode')
	 * 		- add_button_css (bool): determines whether the default styles should be added to the page (defaults to true)
	 * 
	 * @return null
	 * 
	 */
	function easyCouchMode( custom_config )
	{
		var css_text = '',
			in_couch_mode = inCouchMode();
		
		// configuration
		config = configure( custom_config );
    	
		// we need a wrapper
		wrapper = document.querySelectorAll( config.wrapper_selector );
		if ( wrapper.length == 0 ) { return; }
		wrapper = wrapper[0];
		config.wrapper_max_width = wrapper.clientWidth;
		config.wrapper_max_width_ems = config.wrapper_max_width / 16;
		
		// listen on the wrapper
		wrapper.addEventListener( 'click', listen );
		wrapper.addEventListener( 'touchend', listen );
		wrapper.addEventListener( 'keydown', listen );
		
		// we need somewhere to append things
		append_to = document.querySelectorAll( config.append_to_selector );
		if ( append_to.length == 0 ) { return; }
		append_to = append_to[0];
		
		
		// set up the button
		button = document.createElement('button');
		button.className = BUTTON;
		button.appendChild(
			document.createTextNode( config.button_text_enlarge )
		);
		
		// set up the widget
		widget = document.createElement('div');
		widget.className = script_name + '-widget';
		widget.appendChild(
			button
		);
		
		// set up the css
		css = document.createElement('style');
		css_text =	'@media only screen and (min-width:' + config.wrapper_max_width_ems + 'em){' +
						'body.' + ENABLED + '{font-size:' + ( ( 1 / config.wrapper_max_width_ems ) * 100 ) + 'vw;}' +
					'}';
		// Style the button?
		if ( config.add_button_css )
		{
			css_text += '.' + script_name + '-widget{position:fixed;top:0;left:100%}';
			css_text += '.' + script_name + '-button{padding:.25em;margin-left:-1.4em;white-space:nowrap;-moz-transition:margin-left .5s;-webkit-transition:margin-left .5s;transition:margin-left .5s}';
			css_text += '.' + script_name + '-button:hover' + ',.' + script_name + '-button:focus{margin-left:-100%}';
			css_text += '.' + script_name + '-button::before{content:"\\00A0";background:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1"><style>.style0{fill:none;fill-rule:evenodd;}.style1{fill:#4E4E50;}</style><g><path d="M27.414 24.586 L22.828 20 L20 22.828 L24.586 27.414 L20 32 L32 32 L32 20 L27.414 24.586 Z M27.414 24.586"/><path d="M12 0 L0 0 L0 12 L4.586 7.414 L9.129 11.953 L11.957 9.125 L7.414 4.586 L12 0 Z M12 0"/><path d="M12 22.828 L9.172 20 L4.586 24.586 L0 20 L0 32 L12 32 L7.414 27.414 L12 22.828 Z M12 22.828"/><path d="M32 0 L20 0 L24.586 4.586 L20.043 9.125 L22.871 11.953 L27.414 7.414 L32 12 L32 0 Z M32 0"/></g></svg>\') top left no-repeat;background-size:100%;background-size:contain;display:inline-block;width:.7em;height:.7em;margin-right:.5em;vertical-align:baseline}';
			css_text += 'body.' + ENABLED + ' .' + script_name + '-button::before{background-image:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="47px" height="47px" viewBox="0 0 47 47" version="1.1"><style>.style0{fill:none;fill-rule:evenodd;}.style1{fill:#4E4E50;}</style><g><path d="M35.879 40.121 L42.758 47 L47 42.758 L40.121 35.879 L47 29 L29 29 L29 47 L35.879 40.121 Z M35.879 40.121"/><path d="M0 18 L18 18 L18 0 L11.121 6.879 L4.3125 0.065 L0.0705 4.306 L6.879 11.121 L0 18 Z M0 18"/><path d="M0 42.758 L4.242 47 L11.121 40.121 L18 47 L18 29 L0 29 L6.879 35.879 L0 42.758 Z M0 42.758"/><path d="M29 18 L47 18 L40.121 11.121 L46.9415 4.306 L42.6995 0.065 L35.879 6.879 L29 0 L29 18 Z M29 18"/></g></svg>\')}';
		}
		css.innerHTML = css_text;
		
		// grab the head & body & add the CSS
		body = document.getElementsByTagName(BODY)[0];
		head = document.getElementsByTagName('head')[0];
		head.appendChild(
			css
		);
		
		// The watcher
		watchResize(onResize);
		
		// initialization
		if ( in_couch_mode )
		{
			button.dispatchEvent(
				new MouseEvent('click', {
					'target': widget,
					'view': window,
					'bubbles': true,
					'cancelable': true
				})
			);
		}
		
	}
	
	// expose it in the Easy namespace
	if ( window.Easy == UNDEFINED ){
		window.Easy = {};
	}
	window.Easy.couchMode = easyCouchMode;
	
}(this,this.document));