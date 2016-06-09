( function( window, document, util, undefined )
{
	var tabPane = {},

		TabPane = ( function()
		{
			function Tab( args )
			{
				if( args === undefined )
					return this;
				init.call( this, args, Tab );
				this.setHead( args.head );
				this.setBody( args.body );
			}

			function TabPane( args )
			{
				init.call( this, args, TabPane );
				this.setTabSelected( args.tabSelected );
			}

			TabPane.prototype = new Tab();

			function init( args, cntx )
			{
				cntx || ( cntx = this );
				for( var key in args )
					if( cntx.PARAMS.indexOf( key ) !== -1 )
						this[ key ] = args[ key ];
			}

			( function()
			{
				var addOnClick = function( index, tab, callBack )
				{
					tab.head.addEventListener( 'click', function( event )
								{
									callBack( index, tab );
								}, false );
				};

				this.getTitles = function()
				{
					var tabs 	= this.getTabs(),
						titles 	= [];
					for( var i = 0, l = tabs.length; i < l; i++ )
						titles.push( tabs[i].title );
					return titles;
				};

				this.getTabs = function()
				{
					var heads 		= this.tabHeads.querySelectorAll( '.' + Tab.classes.head ),
						tabsBody  	= this.parent.querySelectorAll( '.' + Tab.classes.body ),
						tabs 		= [];
					for( var i = 0, l = heads.length; i < l; i++ )
							tabs.push( new Tab( {
											'head' : heads[ i ],
											'body' : tabsBody[ i ]
										}));
					return tabs;
				};

				this.onClickTab = function( callBack )
				{
					var tabs = this.getTabs();
					this.__currentCallBackClick__ = callBack;
					for( var i = 0, l = tabs.length; i < l; i++ )
						( function( e )
							{
								addOnClick( e, tabs[ e ], callBack );
							})( i );
				};

				this.setTabSelected = function( index )
				{
					index || ( index = 0 );
					var tabs 		= this.getTabs(),
						tabBody 	= tabs[ index ].body,
						tabHead 	= tabs[ index ].head,
						classBody  	= TabPane.classes.tabSelectedBody,
						classHead	= TabPane.classes.tabSelectedHead;
					if( !tabBody.classList.contains( classBody ) )
						if( !tabHead.classList.contains( classHead ) )
						{
							tabHead.classList.add( classHead );
							tabBody.classList.add( classBody );
						}

					for( var i = 0, l = tabs.length; i < l; i++ )
						if( i !== index )
							if( tabs[ i ].head.classList.contains( classHead ) )
								if( tabs[ i ].body.classList.contains( classBody ) )
								{
									tabs[ i ].head.classList.remove( classHead );
									tabs[ i ].body.classList.remove( classBody );
								}
				};

				this.appendTab = function( tab )
				{
					this.tabHeads.appendChild( tab.head );
					this.parent.appendChild( tab.body );
				};

				this.changePosTab = function( tabCurrentPos, tabNewPos )
				{
					this.tabHeads.insertBefore( tabCurrentPos.head, tabNewPos.head );
					var body = document.querySelector( '.tabBody' );
					if( body === null )
						body = this.parent;
					body.insertBefore( tabCurrentPos.body, tabNewPos.body );
				};

				this.changePosTabByIndex = function( indexCurrentPos, indexNewPos )
				{
					var tabs = this.getTabs();

					if( indexNewPos === tabs.length - 1 )
						this.appendTab( tabs[ indexCurrentPos ] )
					else
					{
						var	tabMove = tabs[ indexCurrentPos ],
							tabRef  = tabs[ indexNewPos ];

						return this.changePosTab( tabMove, tabRef );
					}
				};

				this.changePosTabByTitle = function( titleCurrentPost, titleNewPos )
				{
					var titles = this.getTitles();
					return this.changePosTabByIndex( titles.indexOf( titleCurrentPost ), 
											  		 titles.indexOf( titleNewPos ) );
				};

				this.getTabByTitle = function( title )
				{
					var tabs = this.getTabs();
					for( var i = 0, l = tabs.length; i < l; i++ )
						if( tabs[ i ].title === title )
							return tabs[ i ];
					return -1;
				};

				this.getCountTabs = function()
				{
					return this.getTabs().length;
				};

				this.add = function( args )
				{
					var tab = Tab.create( args );
					this.tabHeads.appendChild( tab.head );
					this.parent.appendChild( tab.body );
					this.changePosTabByTitle( tab.title, args.pos );
					this.onClickTab( this.__currentCallBackClick__ );
					//addOnClick( this.getCountTabs() - 1, tab, this.__currentCallBackClick__ );
				};

				this.toString = function()
				{
					return "TabPane--Object";
				};

				TabPane.PARAMS = [
					'countTabs',
					'titles',
					'parent',
					'tabHeads',
					'tabsBody',
					'tabSelected',
				];

				TabPane.classes = {
					tab 			: 'tab',
					tabSelectedBody	: 'tab-selected',
					tabSelectedHead	: 'tab-head-selected'
				};
			})
			  .apply( TabPane.prototype );

			( function()
			{
				Tab.PARAMS = [
					'head',
					'body'
				];

				Tab.classes = {
					head 		: 'tab-head',
					title 		: 'title',
					body 		: 'tab'
				};

				Tab.create = function( args )
				{
					var head = document.createElement( 'div' );
					var body = document.createElement( 'div' );
					head.classList.add( Tab.classes.head );
					body.classList.add( Tab.classes.body );
					head.textContent = args.title;
					return new Tab( {
						'head' : head,
						'body' : body
					});
				};

				this.setHead = function( head )
				{
					this.setTitle( head );
					head.classList.add( Tab.classes.head + '-' + this.title.toLowerCase() );
					this.head = head;
				};

				this.setTitle = function( nodeTitle )
				{
					nodeTitle || ( nodeTitle = this.head );
					if( nodeTitle.childElementCount > 0 )
						nodeTitle = nodeTitle.querySelector( '.' + Tab.classes.title );
					this.title = nodeTitle.textContent.trim();
				};

				this.setBody = function( nodeBody )
				{
					nodeBody.classList.add( Tab.classes.body + '-' + this.title.toLowerCase() );
					this.body = nodeBody;
				};

				this.toString = function()
				{
					return "Tab--Object";
				};
			})
			  .apply( Tab.prototype );

			return TabPane;
		})();

	( function()
	{
		this.init = function( args )
		{
			var parentTabs = document.querySelector( '.tabPane' ),
				tabHeads   = document.querySelector( '.tabHeads' ),
				tabsBody   = document.querySelectorAll( '.tab' );

			var tabs = new TabPane( {
				'parent' 		: parentTabs,
				'tabHeads' 		: tabHeads,
				'tabsBody'		: tabsBody,
				'tabSelected'	: args.tabSelected
			});
			return tabs;
		};
	})
	  .apply( tabPane );

	window.tabPane = tabPane;

})( window, document, {} );