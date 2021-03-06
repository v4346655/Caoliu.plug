// ==UserScript==
// @name CL1024
// @version 1.1.2
// @description 草榴社区 - 「取消viidii跳转」「种子链接转化磁链接」「去帖子广告」「阅读帖子按楼数快速跳转楼层」「帖子内隐藏1024的回复」「今日帖子加亮」
// @downloadURL	http://userscripts.org/scripts/source/151695.user.js
// @updateURL   http://userscripts.org/scripts/source/151695.meta.js
// @copyright 2012-2013 The CYW
// @require http://code.jquery.com/jquery.min.js
// @include http://*t66y*
// @include http://*184*
// @include http://*shenyingwang*
// @include http://*cl*
// @include http://*c1*
// @include http://*1024*
// @include http://*caoliu*
// @grant       none
// ==/UserScript==

(function (){
    
    //浏览器判断
    //if (navigator.userAgent.indexOf('Chrome') > 0 ){ }
	
	//=========================================================
	//2012-11-28 19:56:07 js版本转化jquery版本，方便后续功能增加
	//=========================================================
	var reCatvi = /www.viidii.com/;
	var reCat = /hash/gi;//判断hash 直接转化磁链接

	//=========================================================
	//所有种子链接转化为磁力链接
	//=========================================================
	$("a").each(function(){
		var thiz = $(this);
		var hrefval = thiz.attr("href"); 
		
		if ( reCatvi.test( hrefval ) ){
			if ( reCat.test( hrefval ) ){
			    var hrefconvert = hrefval.replace(/&z/g, "").split("hash=");
			    if (hrefconvert.length > 1 ){
					hrefconvert = 'magnet:?xt=urn:btih:' + hrefconvert[1].substring(3);
			    } else {
					hrefconvert = hrefval;
			    }
			    thiz.attr("href", hrefconvert);
		    } else {
			    //获得地址
			    hrefconvert = hrefval.replace("http://www.viidii.com/?", "").replace(/______/g, ".").replace(/&z/g, "");
				thiz.attr("href", hrefconvert);
		    }
		}
		
	});
	
	//=========================================================
	//图片链接处理 - 不经过viidii跳转
	//=========================================================
	$("img,input[type=image]").each(function(){
		var thiz = $(this);
		var thizonclick = thiz.attr("onclick");
		if ( reCatvi.test( thizonclick ) ){
			var newonclick = thizonclick.replace("http://www.viidii.com/?", "").replace(/______/g, ".").replace(/&z/g, "");
			thiz.attr("onclick", newonclick);
		}
	});

	//=========================================================
	//去tips广告
	//=========================================================
	//$(".tips").remove();
	$(".sptable").parent().remove();
	

	//=========================================================
	// 2012年12月23日21:26:30 新增楼层跳转，封装系列方法
	//=========================================================
	//楼层跳转
	var CONSTANTS = {
	    tips: '<div class="tips_container"><div class="close">X</div>去<input type="text" class="input-w80" placeholder="" id="wantlc" name="wantlc" />樓<input type="button" id="gotolc" value="Go" /> or <input type="button" id="goback" value="Back" onclick="history.go(-1);"><br /></div>',
	    css: '.tips_container{position:fixed;bottom:2em;right:2em;color:green;opacity:0.4;background:#fff;padding:10px;z-index:99999}.tips_container:hover{opacity:0.9}.tips_container .close{position:absolute;top:0;right:0;color:red;cursor:pointer}.tips_container select, .tips_container select option{max-width:18em} input.input-w80 {background: none repeat scroll 0 0 #FFFFFF; border: 1px solid #B2CCCC; height: 18px;line-height: 18px;margin: 2px;padding: 0 3px;width:40px;}.hidden1024{height:36px;overflow:hidden;}',
	    indexcss: '.posttoday{color:#f60;}'
	};

	//hot key
	var KEY_ASCLL = {
		// Shift key, ⇧
		'⇧': 16, 'shift': 16,
		// CTRL key, on Mac: ⌃
		'⌃': 17, 'ctrl': 17,
		// ALT key, on Mac: ⌥ (Alt)
		'⌥': 18, 'alt': 18, 'option': 18,
		// META, on Mac: ⌘ (CMD), on Windows (Win), on Linux (Super)
		'⌘': 91, 'meta': 91, 'cmd': 91, 'super': 91, 'win': 91,
		// Backspace key, on Mac: ⌫ (Backspace)
		'⌫': 8, 'backspace': 8,
		// Tab Key, on Mac: ⇥ (Tab), on Windows ⇥⇥
		'⇥': 9, '⇆': 9, 'tab': 9,
		// Return key, ↩
		'↩': 13, 'return': 13, 'enter': 13, '⌅': 13,
		// Pause/Break key
		'pause': 19, 'pause-break': 19,
		// Caps Lock key, ⇪
		'⇪': 20, 'caps': 20, 'caps-lock': 20,
		// Escape key, on Mac: ⎋, on Windows: Esc
		'⎋': 27, 'escape': 27, 'esc': 27,
		// Space key
		'space': 32,
		// Page-Up key, or pgup, on Mac: ↖
		'↖': 33, 'pgup': 33, 'page-up': 33,
		// Page-Down key, or pgdown, on Mac: ↘
		'↘': 34, 'pgdown': 34, 'page-down': 34,
		// END key, on Mac: ⇟
		'⇟': 35, 'end': 35,
		// HOME key, on Mac: ⇞
		'⇞': 36, 'home': 36,
		// Insert key, or ins
		'ins': 45, 'insert': 45,
		// Delete key, on Mac: ⌫ (Delete)
		'del': 45, 'delete': 45,
		
		// Left Arrow Key, or ←
		'←': 37, 'left': 37, 'arrow-left': 37,
		// Up Arrow Key, or ↑
		'↑': 38, 'up': 38, 'arrow-up': 38,
		// Right Arrow Key, or →
		'→': 39, 'right': 39, 'arrow-right': 39,
		// Up Arrow Key, or ↓
		'↓': 40, 'down': 40, 'arrow-down': 40,
		
		// odities, printing characters that come out wrong:
		// Num-Multiply, or *
		'*': 106, 'star': 106, 'asterisk': 106, 'multiply': 106,
		// Num-Plus or +
		'+': 107, 'plus': 107,
		// Num-Subtract, or -
		'-': 109, 'subtract': 109,
		//';': 186, //???
		// = or equals
		'=': 187, 'equals': 187,
		// Comma, or ,
		',': 188, 'comma': 188,
		//'-': 189, //???
		// Period, or ., or full-stop
		'.': 190, 'period': 190, 'full-stop': 190,
		// Slash, or /, or forward-slash
		'/': 191, 'slash': 191, 'forward-slash': 191,
		// Tick, or `, or back-quote 
		'`': 192, 'tick': 192, 'back-quote': 192,
		// Open bracket, or [
		'[': 219, 'open-bracket': 219,
		// Back slash, or \
		'\\': 220, 'back-slash': 220,
		// Close backet, or ]
		']': 221, 'close-bracket': 221,
		// Apostraphe, or Quote, or '
		'\'': 222, 'quote': 222, 'apostraphe': 222,
	};

	// To minimise code bloat, add all of the NUMPAD 0-9 keys in a loop
	var i = 95, n = 0;
	while(++i < 106) {
		KEY_ASCLL['num-' + n] = i;
		++n;
	}
	
	// To minimise code bloat, add all of the top row 0-9 keys in a loop
	var i = 47, n = 0;
	while(++i < 58) {
		KEY_ASCLL[n] = i;
		++n;
	}
	
	var i = 111, n = 1;
	while(++i < 136) {
		KEY_ASCLL['f' + n] = i;
		++n;
	}
	
	var i = 64;
	while(++i < 91) {
		KEY_ASCLL[String.fromCharCode(i).toLowerCase()] = i;
	}

	// UTILS Func
	var UTILS = {
	    addCss: function(str){
	        var style = document.createElement('style');
	        style.textContent = str;
	        document.head.appendChild(style);
	    },
	    getScript: function (src) {
	        var script = document.createElement('script');
	        script.src = src;
	        document.body.appendChild(script);
	    },
	    addDom: function(html, callback){
	        var div = document.createElement('div');
	        div.innerHTML = html;
	        callback.call(div,div);
	        document.body.appendChild(div);
	    },
	    validate: function(url){
	        var magnetPattern = /magnet:\?xt=urn:btih:([a-zA-Z0-9]+)/;
	        if(magnetPattern.test(url)){
	            return url.match(magnetPattern)[0];
	        }
	        return url;
	    },
	    getCookie: function(ae) {
	        return (document.cookie.match(new RegExp("(^" + ae + "| " + ae + ")=([^;]*)")) == null) ? "" : RegExp.$2
	    },
	    proxy: function(fn){
	        var script = document.createElement('script');
	        script.textContent = '(' + fn.toString() + ')(window);';
	        document.body.appendChild(script);
	    },
	    isArray: function(o){
	        return Object.prototype.toString.call(o).indexOf('Array')!==-1;
	    },
	    array_prototype_del : function(array, n) {　//n表示第几项，从0开始算起。
			if(n<0) {　//如果n<0，则不进行任何操作。
		　　     return array;
		    } else {
		　　     return array.slice(0,n).concat(array.slice(n+1,array.length));
		    }
		　　/*
		　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
		　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
		　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
		　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
		　　*/
		},
	    onlynum: function (input){
	        $("#" + input).keyup(function(e){
	            $(this).val($(this).val().replace(/[^0-9)]+/,''));
	        }).focus(function(){
	            $(this).val($(this).val().replace(/[^0-9]+/,''));
	        });
	    },
	    getQueryString: function (url){
	    	var url = url || location.search;
	    	var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));
	    	if(result == null) return new Array();
	    	for(var i = 0; i < result.length; i++){
	    		result[i] = result[i].substring(1);
	    	}
	    	return result;
	    },
	    getQueryStringByName: function (name){
	    	var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)","i"));
	    	if(result == null || result.length < 1){
	    		return "";
	    	}
	    	return result[1];
	    },
	    getQueryStringByIndex: function (index){
	    	if(index == null){
	    		return "";
	    	}
	    	var queryStringList = getQueryString();
	    	if (index >= queryStringList.length){
	    		return "";
	    	}
	    	var result = queryStringList[index];
	    	var startIndex = result.indexOf("=") + 1;
	    	result = result.substring(startIndex);
	    	return result;
	    },
	    html_scrollTop_target : function (){

			var target  = arguments[0] || 0;
			var timeset = arguments[1] || 500;

			if (target == '0') {
                return false;
			}

			if (target == 'top') {
                $('html,body').animate({
                    scrollTop: 0
                },
                timeset);
                return false;
			}

			if ( target.length > 2 ) {
				var $target = $("#" + target);
	            if ($target.length>0) {
	                var targetOffset = $target.offset().top;
	                $('html,body').animate({
	                    scrollTop: targetOffset
	                },
	                timeset);
	            }
	            return false;
			}
	    },
	     /** 
         * js时间对象的格式化;
         * this new Data()
         * eg:format="yyyy-MM-dd hh:mm:ss";  
         */ 
         data_format : function(data, format){ 
	         var o = { 
	              "M+" :  data.getMonth()+1,  //month 
	              "d+" :  data.getDate(),     //day 
	              "h+" :  data.getHours(),    //hour 
	              "m+" :  data.getMinutes(),  //minute 
	              "s+" :  data.getSeconds(), //second 
	              "q+" :  Math.floor((data.getMonth()+3)/3),  //quarter 
	              "S"  :  data.getMilliseconds() //millisecond 
            }
            if(/(y+)/.test(format)) { 
            	format = format.replace(RegExp.$1, (data.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o) { 
            	if(new RegExp("("+ k +")").test(format)) { 
            		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
             	} 
            } 
         	return format; 
        },
		shortcut_key_jump : function (isDown, currentclass){
			var className = currentclass;
			var current = $('.' + className).first(),
			next = undefined;
			next = isDown ? current.next().next('.t2') : current.prev().prev('.t2');
			if (next && next.length) {
				current.removeClass(className);
				next.addClass(className);

				//var next_div = next[0];
	    		UTILS.html_scrollTop_target(next.attr("id"), 300);
	    		return false;

			}
		},
		shortcut_key_current : function (){

			var _class  = arguments[0] || '.t2';

			var _scrollTop = $(document).scrollTop();

			if ($('.current-comment').length > 0 ){
				return ;
			}

			if (_scrollTop == 0) {
				$(_class).first().addClass('current-comment'); 
			} else {
				$(_class).each(function(){
					if ($(this).offset().top > _scrollTop && $('.current-comment').length == 0){
						$(this).addClass('current-comment');
						return ;
					} else {
						$(this).removeClass('current-comment');
					}
				});
			}
		}
	};

	
	var locationurl = window.location.href;
	var readurl     = 'http://' + window.location.host + '/read.php';
	var showflag    = false;
	var regIsblog   = /htm_data|read.php/gi;
	var target 		= UTILS.getQueryStringByName('target');
	showflag = regIsblog.test(locationurl);

	if (showflag) {
		//优化 - 增加楼层
		$("a[class=s3]").each(function(i, val){
			var a_html = $(this).html();
			if (a_html.indexOf('樓') > 0 ){
				var parentdiv = $(this).parent().parent().parent().parent().parent().parent().parent();
				parentdiv.attr('id', 'post_' + parseInt(a_html));
			}
		});

		UTILS.addCss(CONSTANTS.css);
		UTILS.addDom(CONSTANTS.tips, function(){ return false;});
		UTILS.onlynum('wantlc');

		//Bind Quick redirct by input Enter Key - cat
		$('#wantlc').bind('keyup',function(event){
		    if(event.keyCode == 13) {
		        $('#gotolc').click();
		    }
		});

		//$("#wantlc").focus(); 悲剧，先注释了。

		$(".close").click(function(){
			$(this).parent().remove();
		});

		$("#gotolc").click(function(){
		    var wantlc = parseInt($(this).prev().val());//想去的楼层 - cyw
		    var locationurlarray = UTILS.getQueryString(locationurl);//分析链接 - cyw
		    
		    if (wantlc != '') {
		    	var urlgetpage = UTILS.getQueryStringByName('page');
		    	var page = Math.ceil( (wantlc + 1 ) /25);

		    	if (urlgetpage == page) {
		    		UTILS.html_scrollTop_target('post_' + wantlc);
		    		return false;
		    	}

		        if ( locationurlarray.length > 1){
					var rePage   = /page/gi;
					var reTarget = /target/gi;
		            for (var i = locationurlarray.length - 1; i >= 0; i--) {
		            	//page and target
		                if ( rePage.test( locationurlarray[i] ) ){
			    	   		locationurlarray[i] = 'page=' + page;            
			       		}
		                if ( reTarget.test( locationurlarray[i] ) ){
		                	locationurlarray = UTILS.array_prototype_del(locationurlarray, i);      
			       		}
		            };
		            locationurlarray = locationurlarray.join('&');
		            window.location.href = readurl + "?" + locationurlarray + '&target=post_' + wantlc;
		            //window.open();
		            return false;
		        } else {
		            locationurlarray = locationurl.split("/");//Get tid 
		            var tid = locationurlarray.pop().split(".");
		            if (typeof(tid[0]) != "undefined") {
		            	tid = tid[0];
		            	window.location.href = readurl + '?tid=' + tid + '&page=' + page + '&target=post_' + wantlc;
		            	return false;
		            }
		        }
		    }
		});
	
		UTILS.html_scrollTop_target(target);


		//======================================================================
		// 2013-1-16 22:36:48 隐藏论坛中无意义的1024跟帖
		//======================================================================
		$("div.t2").each(function(){
			var thiz = $(this);
			var html = thiz.children().find('.tpc_content').html();
			var thiz_id = thiz.attr("id");
			
			if (  html == '1024' ){
				thiz.addClass("hidden1024");

				var tiptop  = thiz.find(".tiptop");
				var thiz_lc = thiz.find('.tipad > span:last').children().clone();
				tiptop.append('<a class="show1024" class="act-show-1024" rel="'+ thiz_id +'" style="color:green" href="javascript:void(0);">显示</a> | ').append(thiz_lc);
			}

		});

		$(".show1024").click(function(){
			var thiz_id = $(this).attr("rel");
			$("#" + thiz_id).toggleClass("hidden1024");
		});


		//======================================================================
		// 2013年3月11日21:56:30 快捷键J K 
		//======================================================================
		// jwerty.key('j/J', function () { 
		// 	UTILS.shortcut_key_current();
		// 	UTILS.shortcut_key_jump(true, 'current-comment');
		// });
		// jwerty.key('k/K', function () { 
		// 	UTILS.shortcut_key_current();
		// 	UTILS.shortcut_key_jump(false, 'current-comment');			
		// });

		// jwerty.key('.', function () { 
		// 	UTILS.html_scrollTop_target();
		// });

		$(document).keydown(function(e){
			console.log(KEY_ASCLL);
            if(e.keyCode == KEY_ASCLL.j) {
				UTILS.shortcut_key_current();
				UTILS.shortcut_key_jump(true, 'current-comment');
                return false;
            }
            if(e.keyCode == KEY_ASCLL.k) {
				UTILS.shortcut_key_current();
				UTILS.shortcut_key_jump(false, 'current-comment');		
                return false;
            }
            if(e.keyCode == KEY_ASCLL.period) {
                UTILS.html_scrollTop_target('top');
                return false;
            }
            if(e.keyCode == KEY_ASCLL.f6) {
                window.location.href = '/' + 'thread0806.php?fid=7';
                return false;
            }
        }); 
	}

	//======================================================================
	// 区别今天发的帖子，列表标题左边将.::显示橘色，用户名下日期显示橘色
	//======================================================================

	//today 样式
	UTILS.addCss(CONSTANTS.indexcss);

	var today =  new Date();
	today = UTILS.data_format(today, 'yyyy-MM-dd');

	$(".tr3").each(function(){
		var tr3 = $(this);
		var postdata = $(this).find("a[class=bl]").next();
		if (postdata.text() == today){
			postdata.addClass('posttoday');
			tr3.find("td:first").children().html("Today").addClass('posttoday').css("border-bottom", "1px dotted tomato");
		}
	});

}());