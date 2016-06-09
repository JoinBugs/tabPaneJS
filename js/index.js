( function( window, document, undefined )
{
	window.addEventListener( 'load', init, false );

	function init()
	{
		var groupTabs 	= tabPane.init({
			'tabSelected' : 0
		}),

			txtTabTitle = document.querySelector( '#txtTabTitle' ),

			onKeyDownAddTab = function( e )
			{
				e.key || ( e.key = e.keyIdentifier );
				var title = e.target.value;
				if( e.key === 'Enter' )
					if( groupTabs.getTabByTitle( title ) === -1 )
						{
							createTab( title, 'newTab' );
							e.target.value = '';
						}
			},

			createTab = function( title, pos )
			{
				pos || ( pos = 'newTab' );
				groupTabs.add( {
								'title' : title,
								'pos'	: pos
							});
							groupTabs.setTabSelected( groupTabs.getCountTabs() - 2 );
			};

		groupTabs.onClickTab( function( index, tab )
		{
			groupTabs.setTabSelected( index );
			if( tab.title === 'newTab' )
				txtTabTitle.focus();
		});

		txtTabTitle.addEventListener( 'keydown', onKeyDownAddTab, false );

		var titles = [ 'Usuarios', 'Tareas', 'Grupos', 'Tab-X' ];

		for( var i = 0, l = titles.length; i < l; i++ )
			createTab( titles[i] );

		window.groupTabs = groupTabs;
	}

})( window, document );