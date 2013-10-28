Easy Couch Mode
===============

Implements a "Couch Mode" toggle for responsive websites using em-based layouts. Couch mode is implemented using a vw-based font-size adjustment on the 
`body` element that is a ratio based on the size of your font and the max width of your design. In couch mode, there will be no whitespace around your design.

For more details, see http://blog.easy-designs.net/archives/zoom-layouts-v2/

Note: the toggle button only appears when the screen width is larger than your max page width.

Demo
----

[See this script in action](http://codepen.io/aarongustafson/full/stnpj) or [fork the code to play with it](http://codepen.io/aarongustafson/pen/stnpj).

API
---

To use Easy Couch Mode, you simply call the constructor method:

	window.Easy.couchMode();
	
By default the script will inject a button into the document which allows a 
user to toggle "couch mode" on & off via keyboard or mouse when the screen width 
is larger than your page’s max width. The user’s choice is maintained in 
`localStorage` to ensure all pages adhere to the decision by default.

You can configure couch mode by passing in the following options in a 
configuration object:

 * `wrapper_selector` (str): selector targeting the element acting as a wrapper (defaults to 'body')
 * `append_to_selector` (str): selector targeting the element to which the button should be appended (defaults to 'body')
 * `button_text_enlarge` (str): the text to display in the toggle button when you can enlarge it (defaults to 'Turn On Couch Mode')
 * `button_text_shrink` (str): the text to display in the toggle button (defaults to 'Turn Off Couch Mode')
 * `add_button_css` (bool): determines whether the default styles should be added to the page (defaults to `true`)

Example:

	window.Easy.couchMode({
		wrapper_selector:		'#page',
		button_text_enlarge:	'Go Big!',
		button_text_shrink:		'Return to Normal',
		add_button_css:			false
	});