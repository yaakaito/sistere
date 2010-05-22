var sistere = {
		
		mode : {
				slide : 0, thumbnail : 1, resource : 2, help : 3,
				current : 0
		},

		page : {
				items : [],
				width : 0, height : 0,
				now : 0	,
				delay : {}
		},

		thumbnail : {

				width : 0, height : 0,
				padding : 50,
				cursor : { now : 0 },
				line : { now : 0, top : 0},
				page : {
						items : [],
						margin : { vertical : 0, horizon : 0 },
						width : 0, height : 0,
						move : { 
								over : { 
										pos : { up : 0, down : 0 }
								}
						}
				},
				resouce : {}
		},

		resouce : {
				items : [],
				padding : 50
		},

		keymap : {
				next : [39], //→
				prev : [37], //←
				up : [38], //↑
				down : [40], //↓
				help : [72], //h
				ok : [13] //enter;
		},

		util : {
				px : function(s){ return s + "px"; },
				vInAry : function( v, ary){ for( var i=0; i<ary.length;i++)	if( ary[i] == v) return true; return false;},
				helpHtml : "<ul><li> → : Next</li><li> ← : Back</li><li> ↑ : SlideView</li><li> ↓ : Help</li></ul>",
				view : {
						hidden: {
								bottom : -10, right : -10,
								width : 1, height : 1
						}
				}
		}
};

sistere.init = function(){
		
		with( sistere){
				
				page.width = window.innerWidth;
				page.height = window.innerHeight;
				thumbnail.width = page.width - thumbnail.padding * 2;
				thumbnail.height = page.height - thumbnail.padding * 2;
				thumbnail.page.margin.horizon = ( page.width - thumbnail.padding*2 ) / 13;
				thumbnail.page.margin.vertical = ( page.height - thumbnail.padding*2 ) / 13;
				thumbnail.page.width = thumbnail.page.margin.horizon * 3;
				thumbnail.page.height = thumbnail.page.margin.vertical * 3;
				thumbnail.page.move.over.pos.down = page.height - thumbnail.page.height - thumbnail.padding*2;
				
				page.init();
				thumbnail.init();
				resouce.init();
				keymap.init();
		}
};

//todo:pagecompailに分割
//thumbnailの生成も一緒にできそうだなー withに渡す
sistere.page.init = function(){

		with( sistere){
				var sections = document.getElementsByTagName( "section");
				var display = document.body;
				var pZero = true;
				
				for( var i = 0; i < sections.length; i++){
						
						var item = document.createElement( "div");
						item.className = "page";
						item.style.width = util.px( page.width);
						item.style.height = util.px( page.height);
						item.style.top =  util.px( 0);
						item.style.left = util.px( 0);
						if( pZero){ item.style.opacity = "1"; pZero = false; }else{	item.style.opacity = "0";	}
						
						item.innerHTML = sections[i].innerHTML;
						item.delay = page.delay.init( item);
						
						display.removeChild( sections[i--]);
						display.appendChild( item);
						page.items.push( item);
				}
				
				var background = document.createElement( "div");
				background.setAttribute( "id", "slideBackground");
				background.className = "background";
				background.style.width = util.px( page.width);
				background.style.height = util.px( page.height);
				display.appendChild( background);
		}
};

sistere.page.next = function(){
		
		with( sistere.page){
				if( !delay.next( items[now].delay)){	
						if( now < items.length - 1){
								now++; sistere.thumbnail.cursor.next(); 
								items[now].visible();
								if( now > 0){
										items[now-1].hidden();
										delay.reset( items[now-1].delay);
										sistere.resouce.close( now-1);
								}
						}
				}
		}
		
};

sistere.page.prev = function(){
		
		with( sistere.page){	
				if( now > 0){	
						now--; sistere.thumbnail.cursor.prev();
						items[now].visible();
						items[now+1].hidden();
						delay.reset( items[now+1].delay);
						sistere.resouce.close( now+1);
				}
		}
};

sistere.page.flip = function(){
	
		with( sistere){
				page.items[page.now].hidden();
				resouce.close( page.now);
				page.items[thumbnail.cursor.now].visible();
				page.now = thumbnail.cursor.now;
		}
};

sistere.page.delay.init = function( pageitem){
	
		var delayset = {};
		
		with( sistere){
				var items = pageitem.getElementsByClassName( "delay");
				if( items.length > 0){
						delayset.enable = true;
						delayset = sistere.page.delay.reset( { enable : true, items : items});
				}else{
						delayset = { enable : false};
				}
		}

		return delayset;
};

sistere.page.delay.reset = function( delayset){
		
		if( delayset.enable){
				
				delayset.finish = false;
				delayset.count = 0;
				delayset.length = delayset.items.length;
				for( var i = 0; i < delayset.items.length; i++){
						delayset.items[i].hidden();
				}
		}
		return delayset;
};

sistere.page.delay.next = function( delayset){
		
		if( delayset.enable == true){	
				if( delayset.count < delayset.length)
						delayset.items[delayset.count++].visible();
				else
						return false;

				return true;
		}
		
		return false;
};

sistere.thumbnail.init = function(){
		
		with( sistere){
				var display = document.body;
				var thumbnailView = util.view.close( document.createElement( "div"));
				thumbnailView.setAttribute( "id", "thumbnailView");
				thumbnailView.className = "background";
				
				for( var i = 0; i < page.items.length; i++){
						var item = util.view.close( document.createElement( "div"));
						item.setAttribute( "id", "thumbnail_" + i);
						if( i == 0) item.className = "thumbnail_select"; else item.className = "thumbnail_unSelect";
						item.style.visibility = "hidden";
						item.innerHTML = page.items[i].innerHTML;
						thumbnailView.appendChild( item);
						thumbnail.page.items.push( item);
						thumbnail.resouce.resize( item);
				}

				display.appendChild( thumbnailView);
		}
};

sistere.thumbnail.resouce.resize = function( object){
		
		with(sistere.thumbnail){
				var resouces = object.getElementsByTagName( "div");
				for( var i = 0; i < resouces.length; i++){
						resouces.item( i).style.width = sistere.util.px( page.width / 3);
						resouces.item( i).style.height = sistere.util.px( page.height / 3);
				}
		}
};

sistere.thumbnail.open = function(){
		
		with( sistere){
				var view = document.getElementById( "thumbnailView");
				view.style.width = util.px( thumbnail.width);
				view.style.height = util.px( thumbnail.height);
				view.style.bottom = util.px( thumbnail.padding);
				view.style.right = util.px( thumbnail.padding);
				mode.current = mode.thumbnail;
				
				thumbnail.page.open();
		}
};

sistere.thumbnail.close = function(){
		
		with( sistere){
				util.view.close( document.getElementById( "thumbnailView"));
				thumbnail.page.close();
				mode.current = mode.slide;
		}
};

sistere.thumbnail.select = function(){
	
		with( sistere){
				page.flip();
				thumbnail.close();
		}
		
};

sistere.thumbnail.cursor.next = function(){

		with( sistere.thumbnail)
		if( cursor.now < page.items.length-1){
				cursor.unselect( cursor.now);
				cursor.select( ++cursor.now);
				cursor.refresh( sistere.keymap.next);
		}
};

sistere.thumbnail.cursor.prev = function(){

		with( sistere.thumbnail)
		if( cursor.now > 0){
				cursor.unselect( cursor.now);
				cursor.select( --cursor.now);
				cursor.refresh( sistere.keymap.prev);
		}
};

sistere.thumbnail.cursor.up = function(){
		
		with( sistere.thumbnail)
				if( line.now > 0){
						cursor.unselect( cursor.now);
						cursor.now -= 3;
						cursor.select( cursor.now);
						cursor.refresh( sistere.keymap.up);
				}
};

sistere.thumbnail.cursor.down = function(){
		with( sistere.thumbnail)
				if( line.now < Math.floor( page.items.length / 3)
						&& cursor.now + 3 <  page.items.length){
						cursor.unselect( cursor.now);
						cursor.now += 3;	
						cursor.select( cursor.now);
						cursor.refresh( sistere.keymap.down);
				}
};

sistere.thumbnail.cursor.refresh = function( vector){
	
		with( sistere.thumbnail){
				line.now = Math.floor( cursor.now / 3);
				if( line.now >= line.top+2) page.sliding( vector);
				if( line.now < line.top)  page.sliding( vector);
		}
};

sistere.thumbnail.cursor.unselect = function( index){
		document.getElementById( "thumbnail_" + index).className = "thumbnail_unSelect";
};

sistere.thumbnail.cursor.select = function( index){
		document.getElementById( "thumbnail_" + index).className = "thumbnail_select";
};

sistere.thumbnail.page.open = function(){

		with( sistere.thumbnail.page)
		for( var i = 0; i < items.length; i++)
				move.set( i, items[i]);
		
};

sistere.thumbnail.page.sliding = function( vector){
		
		with( sistere){
				
				if(vector == keymap.up
					 || vector == keymap.prev)
						thumbnail.line.top--;
				
				thumbnail.page.open();
				
				if(vector == keymap.down
					 || vector == keymap.next)
						thumbnail.line.top++;
		}
};

sistere.thumbnail.page.move.set = function( index, element){

		with( sistere.thumbnail){
				
				element.style.width = sistere.util.px( page.width);
				element.style.height = sistere.util.px( page.height);
				element.style.left = sistere.util.px( page.margin.horizon * ((index%3)+1) + page.width * (index%3));
				
				if( index < line.top * 3){
						return page.move.over.up( element).hidden();
				}else if( index >= (line.top + 3) * 3){	
						return page.move.over.down( element).hidden();
				}else{
						element.style.top = sistere.util.px( page.margin.vertical * (Math.floor( index / 3) - line.top+1) + page.height *  (Math.floor(index / 3) - line.top));
						element.visible();
						return element;
				}
		}
		
};

sistere.thumbnail.page.move.over.up = function( element){
		
		with( sistere)
				element.style.top = util.px( thumbnail.page.move.over.pos.up);
		return element;
};

sistere.thumbnail.page.move.over.down = function( element){
		
		with( sistere)
				element.style.top = util.px( thumbnail.page.move.over.pos.down);
		return element;
};

sistere.thumbnail.page.close = function(){
		
		with( sistere){
				for( var i = 0; i < thumbnail.page.items.length; i++)
						util.view.close( thumbnail.page.items[i]).style.visibility = "hidden";
		}
};

sistere.resouce.init = function(){
		
		var display = document.body;
		with(sistere){
				
				for( var i = 0; i < page.items.length; i++){
						if( page.items[i].getElementsByTagName("div").length > 0){
								var object = page.items[i].getElementsByTagName("div")[0];
								var item = util.view.close( document.createElement( "div"));
								item.className = "resouce";
								item.setAttribute( "id", "resouce_" + i); 
								item.innerHTML = object.innerHTML;
								item.sistere = { width : object.style.width, 
																 height : object.style.height,
																 page : i};
								display.appendChild( item);
								resouce.items.push( item);
								page.items[i].removeChild( object);
						}
				}
		}	
};

sistere.resouce.open = function( pIndex){
		
		with( sistere){
				var item = resouce.search( pIndex);
				if( item != null){
						item.style.width = item.sistere.width;
						item.style.height = item.sistere.height;
						item.style.bottom = util.px( resouce.padding);
						item.style.right = util.px( resouce.padding);
						item.visible();

						mode.current = mode.resouce;
				}
		}
};

sistere.resouce.close = function( pIndex){

		with( sistere){
				var item = resouce.search( pIndex);
				if( item != null){
						util.view.close( item).hidden();
						
						mode.current = mode.slide;
				}
		}
};

sistere.resouce.search = function( pIndex){
	
		with( sistere.resouce)
				for( var i = 0; i < items.length; i++)
						if( items[i].sistere.page == pIndex)
								return items[i];
		
		return null;
};

sistere.util.view.close = function( element){
		with( sistere.util){
				element.style.width = px( view.hidden.width);
				element.style.height = px( view.hidden.height);
				element.style.bottom = px( view.hidden.bottom);
				element.style.right = px( view.hidden.right);
		}

		return element;
};

sistere.keymap.init = function(){
    document.addEventListener('keydown',
			function(e) {
					with( sistere){
							if ( util.vInAry( e.keyCode, keymap.ok)) {
									if( mode.current == mode.thumbnail)
											thumbnail.select();
							}

							if ( util.vInAry( e.keyCode, keymap.next)) {
									if( mode.current == mode.thumbnail)
											thumbnail.cursor.next();
									else if( mode.current == mode.slide || mode.current == mode.resouce)
											page.next();
							}
							
							if ( util.vInAry( e.keyCode, keymap.prev)) {
									if( mode.current == mode.thumbnail)
											thumbnail.cursor.prev();
									else if( mode.current == mode.slide || mode.current == mode.resouce)
											page.prev();
							}

							if( util.vInAry( e.keyCode, keymap.up)){
									if( mode.current == mode.thumbnail)
											thumbnail.cursor.up();
									else if( mode.current == mode.slide)
											thumbnail.open();
							}
							
							if( util.vInAry( e.keyCode, keymap.down)){
									if( mode.current == mode.slide)
											resouce.open( page.now);	
									else if( mode.current == mode.resouce)
											resouce.close( page.now);
									else if( mode.current == mode.thumbnail)
											thumbnail.cursor.down();
							}
					}
        }, false);

};


Element.prototype.hidden = function(){

		this.style.visibility = "hidden";
		this.style.opacity = "0";
};

Element.prototype.visible = function(){
		
		this.style.visibility = "visible";
		this.style.opacity = "1";		
};

sistere.init();