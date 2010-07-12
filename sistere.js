/* 
 * Sietere v1.01 
 * yaakaito.org/sistere/
 * 
 * Create by yaakaito 
 * yaakaito.org , yaakaito@gmail.com
 * MIT Licence
 * 
 * 2010/07/05
 */

var sistere = {
		
		mode : {
				slide : 0, thumbnail : 1, resource : 2, help : 3,
				current : 0
		},

		page : {
				items : [], now : 0,
				now : null, index  : 0
		},

		thumbnail : {
        items : [],  now : null, layer : null, scrollCnt : 0
		},

		keymap : {
				next : [39], //→
				prev : [37], //←
				up : [38], //↑
				down : [40], //↓
				help : [72], //h
				ok : [13], //enter
				plus : [187],
				minus : [189]
		},

		touch : {
				
				
		},

		util : {
        size : window.innerHeight / 25,
        zoom : 1
		},

    hock : {
        
    },

    toString : function(){ return "Sistere Object";}
};


sistere.page.init = function(){

		var sections = document.getElementsByTagName( "section").toArray();
		for( var i = 0; i < sections.length; i++){
        sistere.page.items.push( sistere.page.create( sections[i]));
	  }		
};

sistere.page.next = function(){
    

    if( sistere.page.now.nextEffect() && sistere.mode.current == sistere.mode.slide){
        sistere.page.now.updateEffect();
        return;
    }
    sistere.page.move( sistere.page.index + 1);

};

sistere.page.prev = function(){

    sistere.page.move( sistere.page.index - 1);
};

sistere.page.up = function(){

    sistere.page.move( sistere.page.index - 3);
};

sistere.page.down = function(){

    sistere.page.move( sistere.page.index + 3);
};

sistere.page.move = function( no){


    if( no >= 0 && no < sistere.page.items.length){
        
        var tag = sistere.page.items[no],
        tTag = sistere.thumbnail.items[no],
        now = sistere.page.now,
        tNow = sistere.thumbnail.now;

        if( no > sistere.page.index){
            //次のページに入る時にEffectを戻す
            tag.downEffect();
        }

        if( now != null){
            now.classList.remove( "now");
            tNow.classList.remove( "now");
           
        }

        if( sistere.mode.current == sistere.mode.slide){
            tag.classList.add( "now");
        }


        sistere.page.now = tag;

        location.hash = "#p" + no.toString();

        sistere.thumbnail.move( no);

        sistere.page.index = no;
    }
};

sistere.thumbnail.move = function( no){
    
    if( no >= 0 && no < sistere.page.items.length){
        
        var tTag = sistere.thumbnail.items[no],
        tNow = sistere.thumbnail.now,
        index = sistere.page.index;
        
        if( tNow != null){
            tNow.classList.remove( "now");
        }
        
        tTag.classList.add( "now");
        sistere.thumbnail.now = tTag;

        if( index < sistere.page.items.length - 10 &&
            ( no == index+3 || (index%3==2 && no > index))){
            sistere.thumbnail.layer.scroll( -24);
            sistere.thumbnail.scrollCnt++;
        }

        if( sistere.thumbnail.scrollCnt > 0 &&  no < sistere.thumbnail.scrollCnt*3 &&
            ( no == index-3 || (index%3==0 && no < index))){
            sistere.thumbnail.layer.scroll( 24);
            sistere.thumbnail.scrollCnt--;
        }
    }
};

sistere.thumbnail.init = function(){
		
    var display = document.getElementsByTagName( "article")[0],
        thumbLayer = document.createElement( "div"),
        i = 0, thumbIn = "",
        pageItems = sistere.page.items, pLen = pageItems.length,
        thumbItems = [], offset = [ "2.5%", "35%", "67.5%"], tmp, topOffset = 2.5,
        aspect = window.innerHeight/window.innerWidth;

    thumbLayer.id="tlayer";
    thumbLayer.styler( { position:"absolute", top:"0%", left:"12.5%",
                         width:"75%", height:"100%", opacity:"0"});

    thumbLayer.scroll = function( v){
        this.style.top = ( parseInt( this.style.top.split( "%")[0]) + v) + "%";
    };

    for( ; i < pLen; i++){
        thumbIn += pageItems[i].outerHTML;
    }
    thumbLayer.innerHTML = thumbIn;
    thumbItems = thumbLayer.getElementsByTagName( "section").toArray();
    
    for( i = 0; i < pLen; i++){
   
        if( i!=0 && i%3==0) topOffset+=22.5+1.5;
        tmp = thumbItems[i];
        tmp.styler( { position:"absolute",top:topOffset+"%",left:offset[i%3],
                      width:"30%",height:"22.5%",
                      backgroundColor:"#ffffff",opacity:"1"
                    });
    }

    sistere.thumbnail.now = thumbItems[0];
    sistere.thumbnail.items = thumbItems;
    sistere.thumbnail.layer = thumbLayer;
    
    display.appendChild( thumbLayer);

};

sistere.thumbnail.open = function(){
		
    sistere.thumbnail.layer.styler( { opacity:"1" });
    sistere.page.now.classList.remove( "now");
		sistere.mode.current = sistere.mode.thumbnail;
		
};

sistere.thumbnail.close = function(){

    sistere.thumbnail.layer.styler( { opacity:"0" });
    sistere.page.now.classList.add( "now");
		sistere.mode.current = sistere.mode.slide;
		
};

sistere.keymap.init = function(){
    document.addEventListener('keydown',
			function(e) {
					var mode = sistere.mode.current;
          if ( sistere.keymap.ok.contains( e.keyCode)) {
	            if( mode == sistere.mode.thumbnail){
                  sistere.thumbnail.close();
              }
					}
          else if ( sistere.keymap.next.contains( e.keyCode)) {
              sistere.page.next();
					}
          else if ( sistere.keymap.prev.contains( e.keyCode)) {
              sistere.page.prev();
					}
          else if ( sistere.keymap.up.contains( e.keyCode)) {
              if( mode == sistere.mode.slide){
                  sistere.thumbnail.open();
              }else{
                  sistere.page.up();
              }
					}
          else if ( sistere.keymap.down.contains( e.keyCode)) {
              if( mode == sistere.mode.thumbnail){
                  sistere.page.down();
              }
					}
          else if ( sistere.keymap.plus.contains( e.keyCode)) {
 				      sistere.util.resize( 0.2);
          }
          else if ( sistere.keymap.minus.contains( e.keyCode)) {
 				      sistere.util.resize( -0.2);
					}
        }, false);	
};

sistere.util.resize = function( v){
		
		sistere.util.zoom += v;
		var size = sistere.util.size * sistere.util.zoom;
    document.getElementsByTagName("article")[0].styler( { fontSize: size+"px"});
		sistere.thumbnail.layer.styler( { fontSize: size*0.25+"px"});
};


sistere.page.create = function( elem){

    //次のエフェクト
    elem.updateEffect = function(){
        if( this.nextEffect()){
            this.effects[this.effectIndex++].updateEffect();
        }
    };

    elem.updateAllEffect = function(){
        while( this.nextEffect()){
            this.updateEffect();
        }
    };

    //このページに属するEffectをすべて戻す
    elem.downEffect = function(){
        var i = 0;
        for( ; i < this.effects.length; i++){
            this.effects[i].downEffect();
        }
        this.effectIndex = 0;
    };

    
    //次のEffect処理があるか教えてくれる
    elem.nextEffect = function(){
        if( this.effects.length == 0 || this.effectIndex == this.effects.length){
            return false;
        }
        return true;
    };

    elem.effects = sistere.page.createEffects( elem);
    elem.effectIndex = 0;

    return elem;
};

sistere.page.createEffects = function( elem){
    var child = elem.childNodes.toArray(),
        i = 0, l = [];
    for( ; i < child.length; i++){
        if( child[i].getAttribute != undefined){
            if( child[i].getAttribute( "effect") != null){
                //Effectさせる
                child[i].updateEffect = function(){
                    this.setAttribute( "effected", "effected");
                };
                
                //Effectを戻す
                child[i].downEffect = function(){
                    this.removeAttribute( "effected");
                };
                l.push( child[i]);

            }
        }
        
        l = l.concat( sistere.page.createEffects( child[i]));
    }
    return l;
};

//いろいろ初期化
sistere.init = function(){
		
		sistere.page.init();
		sistere.thumbnail.init();
		sistere.keymap.init();
    
    sistere.page.move( 0);
    sistere.util.resize( 0);
		
};

/* Collections toArray */
HTMLCollection.prototype.toArray = function(){
		
		var i = 0,
		    l = [];
		for( ; i < this.length; i++){
				
				l[i] = this[i];
		}
		return l;
};

NodeList.prototype.toArray = function(){
		
		var i = 0,
		    l = [];
		for( ; i < this.length; i++){
				
				l[i] = this[i];
		}
		return l;
};


/* Array.contains */
Array.prototype.contains = function( v){
    
    for( var i = 0, len = this.length;  i < len; i++){
        if( this[i] === v){
            return true;
        }
    }

    return false;
};
/* classList */
var ClassList = function( element){
    this.element = element;
};
ClassList.toString = function(){
    return "classList";
};
ClassList.prototype.__defineGetter__(
    "_list",
    function(){
        var name = this.element.className;
        name.replace(/^\s*|\s*$/g, "");
        if( name == ""){
            return [];
        }
        return name.split( " ");
    }
);
ClassList.prototype.__defineSetter__(
    "_list",
    function( v){
        return this.element.className = v;
    }
);
ClassList.prototype.__defineGetter__(
    'length',
    function () { return this._list.length; }
);
ClassList.prototype.item = function( i){
    return this._list.split(" ")[i];
};

ClassList.prototype.contains = function( v){
    return this._list.match( v);
};
ClassList.prototype.add = function( v){
    var ary = this._list;
    ary.push(v);
    this._list = ary.join( " ");
};
ClassList.prototype.remove = function(v){
    var ary = this._list,
    i, len = ary.length;
    for( i = 0; i < len; i++){
        if( ary[i] === v){
            ary.splice( i, 1);
        }
    }
    this._list = ary.join( " ");
};

(function(){

     /* classList */
     if(!('classList' in document.createElement('div'))){
         
         HTMLElement.prototype.__defineGetter__(
             "classList",
             function(){
                 return this.__classList || (this.__classList = new ClassList( this));
             }
         );
     }
     
     /* outerHTML */
     if (!('outerHTML' in document.createElement('div'))) {
         HTMLElement.prototype.__defineGetter__(
             'outerHTML',
             function() { 
                 return this.ownerDocument.createElement('div').appendChild(this.cloneNode(true)).parentNode.innerHTML; 
             }
         );
     }

     /* Element Styler */
     HTMLElement.prototype.styler = function( styles){
         
         for( var key in styles){
             this.style[key] = styles[key];
         }
     };
     
     sistere.init();
 })();
