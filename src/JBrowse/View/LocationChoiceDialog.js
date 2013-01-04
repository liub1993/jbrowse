/**
 * Dialog box that prompts the user to choose between several
 * different available locations to navigate to.
 */

define([
           'dojo/_base/declare',
           'dojo/dom-construct',
           'dojo/aspect',
           'dijit/Dialog',
           'dijit/focus',
           'JBrowse/View/LocationList'
       ],
       function(
           declare,
           dom,
           aspect,
           Dialog,
           dijitFocus,
           LocationListView
       ) {
return declare( null, {

    /**
     * @param args.browser the Browser object
     * @param args.locationChoices [Array] array of Location objects
     * to choose from.  The locations can optionally have 'label'
     * attributes.
     * @param args.title optional title of the dialog box.
     * @param args.prompt optional text prompt to show at the top of the dialog.
     * @param args.goCallback optional function to call for executing a 'Go' action. gets ( location, value, node, options )
     * @param args.showCallback optional function to call for executing a 'Show' action.  gets ( location, value, node, options)
     */
    constructor: function( args ) {
        this.browser = args.browser;
        this.config = dojo.clone( args.config || {} );
        this.locationChoices = args.locationChoices;
        this.title = args.title || 'Choose location';
        this.prompt = args.prompt;
        this.goCallback = args.goCallback;
        this.showCallback = args.showCallback;
    },

    show: function() {
        var dialog = this.dialog = new Dialog(
            { title: this.title,
              className: 'locationChoiceDialog'
            }
            );
        var container = dom.create('div',{});

        // show the description if there is one
        if( this.prompt ) {
            dom.create('div', {
                           className: 'prompt',
                           innerHTML: this.prompt
                       }, container );
        }

        var browser = this.browser;
        this.locationListView = new LocationListView(
            { browser: browser,
              locations: this.locationChoices,
              buttons: [
                  {
                      className: 'show',
                      innerHTML: 'Show',
                      onClick: this.showCallback || function( location ) { browser.showRegion( location ); }
                  },
                  {
                      className: 'go',
                      innerHTML: 'Go',
                      onClick: this.goCallback   || function( location ) { dialog.hide(); browser.showRegion( location ); }
                  }
              ]
            },
            dom.create( 'div', { className: 'locationList' }, container )
        );

        dialog.set( 'content', container );
        dialog.show();
        aspect.after( dialog, 'hide', dojo.hitch( this, function() {
                              dijitFocus.curNode && dijitFocus.curNode.blur();
                              dialog.destroyRecursive();
                      }));
    }
});
});