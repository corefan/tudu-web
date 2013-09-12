var Board=Board||{};var Tudu=Tudu||{};var TOP=TOP||getTop();Board.Lang={};Board.setLang=function(b){for(var a in b){Board.Lang[a]=b[a]}};Board.tuduList={currUrl:null,boardId:null,_vcard:null,_vnote:null,attention:"add",init:function(){var a=this;this._vcard=new Card();this._vnote=new Tudu.execNote();new FixToolbar({src:"#toolbar",target:"#float-toolbar"});$(".icon_fold").click(function(){$(this).toggleClass("icon_unfold");$(".fold_box").toggleClass("unfold_box")});$('input[name="checkall"]').click(function(){TOP.checkBoxAll("tid[]",this.checked,document.body)});$('button[name="delete"]').click(function(){Tudu.deleteTudu()});$('button[name="send"]').click(function(){location="/tudu/modify?bid="+a.boardId});$("#board-attention").bind("click",function(){Board.attentionBoard(a.boardId,a.attention)});$('button[name="move"]').bind("click",function(){var b=Tudu.getSelectId();if(b.length<=0){return TOP.showMessage(TOP.TEXT.NOTHING_SELECTED)}Board.moveBoard(b.join(","),a.boardId)});$("table.grid_list_2").mouseover(function(g){var d=g.srcElement?g.srcElement:g.target,c=$(d),b=c.parents("table.grid_list_2:eq(0)");TOP.stopEventBuddle(g);if(d.tagName.toLowerCase()=="a"&&c.attr("_email")){a._vcard.show(d,500)}if(c.hasClass("icon_tudu_note")){var f=b.attr("id").replace("tudu-","");a._vnote.show(d,f)}$(this).addClass("over")}).mouseout(function(f){var d=f.srcElement?f.srcElement:f.target,c=$(d),b=c.parents("table.grid_list_2:eq(0)");TOP.stopEventBuddle(f);if(d.tagName.toLowerCase()=="a"&&c.attr("_email")){a._vcard.hide()}if(c.hasClass("icon_tudu_note")){a._vnote.hide()}$(this).removeClass("over")}).each(function(c){var d=$(this);var b=d.attr("id").replace("tudu-","");if(d.attr("privacy")){return}d.find("td.lastupdate").click(function(){location="/tudu/view?tid="+d.attr("id").replace("tudu-","")+"&page=last&back="+a.currUrl});d.find("a.icon_attention").bind("click",function(){var g=$(this),e=g.hasClass("attention");g.toggleClass("attention");var f=e?"unstar":"star";return Tudu.starTudu(b,f)});d.find("a.icon_tudu_note_add").bind("click",function(g){var f=g.srcElement?$(g.srcElement):$(g.target);return a._vnote.create(b,function(e){f.removeClass("icon_tudu_note_add").addClass("icon_tudu_note");f.removeAttr("title");f.attr("href","/note");if(e.data){f.attr("_note",e.data.content)}})})})}};Board.classes={};Board.moveBoard=function(b,d){var a=TOP.Frame.TempWindow;a.append($("#move-tudu-win").html(),{id:"move-tudu-win",width:250,draggable:true,onClose:function(){a.destroy()}});a.find("#move-tudu").submit(function(){return false});a.find("#move-tudu").submit(function(){var e=$(this);if(a.find('select[name="bid"] option:selected').attr("_classify")=="1"&&a.find('select[name="cid"]').size()>0&&!a.find('select[name="cid"]').val()){a.find('select[name="cid"]').focus();return TOP.showMessage(TOP.TEXT.BOARD_MUST_CLASSIFY)}var f={fbid:d,bid:a.find('select[name="bid"]').val(),cid:a.find('select[name="cid"]').val(),tid:b};$.ajax({type:"POST",dataType:"json",data:f,url:e.attr("action"),success:function(g){TOP.showMessage(g.message,5000,g.success?"success":null);if(g.success){a.close();location.reload()}},error:function(g){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})});a.find('select[name="bid"]').bind("change",function(){var f=this.value,e=$(this),g=e.find("option:selected").attr("_classify");if(undefined==Board.classes[f]){$.ajax({type:"GET",dataType:"json",url:"/tudu/classes?bid="+f,success:function(h){if(h.success){Board.classes[f]=h.data;if(!g&&Board.classes[f].length){Board.classes[f]=[{classid:"",classname:Board.Lang.notspecify}].concat(Board.classes[f])}c(Board.classes[f])}},error:function(h){a.find('select[name="cid"]').empty();a.find("#toclass").hide();return}})}else{c(Board.classes[f])}});a.show();function c(e){var h=a.find('select[name="cid"]'),g=a.find("#toclass");h.find("option:not(:eq(0))").remove();if(null===e||!e.length){g.hide();return h.attr("disabled",true)}g.show();for(var f=0,j=e.length;f<j;f++){h.append('<option value="'+e[f].classid+'" title="'+e[f].classname+'">'+e[f].classname+"</option>")}h.attr("disabled",false)}};Board.attentionBoard=function(b,a){if(!b){return}if(a!="remove"){a="add"}$.ajax({type:"POST",dataType:"json",data:{bid:b,type:a},url:"/board/attention",success:function(c){TOP.showMessage(c.message,10000,"success");if(!c.success){return}var d="",e=TOP.getJQ();if(a=="add"){a="remove";var d=Board.Lang.removeattention;TOP.Frame.Boards.append(b,Board.Lang.boardname)}else{a="add";var d=Board.Lang.addattention;TOP.Frame.Boards.remove(b)}$("#board-attention").text(d).unbind("click").bind("click",function(){Board.attentionBoard(b,a)})},error:function(c){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})};Board.deleteBoard=function(a){if(!confirm(TOP.TEXT.CONFIRM_DELETE_BOARD)){return}$.ajax({type:"POST",dataType:"json",data:{bid:a},url:"/board/delete",success:function(b){TOP.showMessage(b.message,10000,"success");if(b.success){TOP.getJQ()("#b_"+a).remove();location="/board/"}},error:function(b){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})};Board.closeBoard=function(b,a){if(a){if(!confirm(TOP.TEXT.CONFIRM_CLOSE_BOARD)){return}}$.ajax({type:"POST",dataType:"json",data:{bid:b,isclose:a?1:0},url:"/board/close",success:function(c){TOP.showMessage(c.message,10000,"success");if(c.success){location.reload()}},error:function(c){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})};Board.clearBoard=function(a){if(!confirm(TOP.TEXT.CONFIRM_CLEAR_BOARD)){return}$.ajax({type:"POST",dataType:"json",data:{bid:a},url:"/board/clear",success:function(b){TOP.showMessage(b.message,10000,"success");if(b.success){location.reload()}},error:function(b){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})};Board.setGroups=function(){TOP.Cast.load(function(){var d=$("#board-groups").val().split("\n"),a=TOP.Cast.get("users"),b=TOP.Cast.get("groups"),n=[],h=[],k=false;for(var e=0,m=d.length;e<m;e++){for(var f=0,l=a.length;f<l;f++){if(typeof d[e]=="undefined"||-1===d[e].indexOf("@")){continue}if(d[e]==a[f].username){h.push("<"+a[f].username+">"+a[f].truename);if(k){break}if(n.length>6){n.push("...");k=true;break}n.push(a[f].truename)}}for(var f=0,g=b.length;f<g;f++){if(typeof d[e]=="undefined"||-1!==d[e].indexOf("@")){continue}if(d[e]==b[f].groupid){h.push(b[f].groupname+"<"+TOP.TEXT.GROUP+">");if(k){break}if(n.length>6){n.push("...");k=true;break}n.push(b[f].groupname)}}}if(n.length>0&&h.length){$("#groups-name").attr("title",h.join(","));$("#groups-name").text(n.join(","))}else{$("#groups-name").text("-")}})};Tudu.getSelectId=function(){var a=[];$(':checkbox[name="tid[]"]:checked').each(function(){a.push(this.value)});return a};Tudu.starTudu=function(b,a){$.ajax({type:"POST",dataType:"json",url:"/tudu-mgr/star",data:{tid:b,fun:a},success:function(c){if(c.data&&c.data){TOP.Label.setLabels(c.data).refreshMenu()}},error:function(c){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})};Tudu.deleteTudu=function(a){if(!a){a=Tudu.getSelectId()}if(!a.length){return TOP.showMessage(TOP.TEXT.NOTHING_SELECTED)}if(!confirm(TOP.TEXT.CONFIRM_DELETE_TUDU)){return}$("#checkall").attr("checked",false);TOP.showMessage(TOP.TEXT.DELETING_TUDU,0,"success");$.ajax({type:"POST",dataType:"json",url:"/tudu-mgr/delete",data:{tid:a},success:function(b){TOP.showMessage(b.message,10000,"success");if(b.success){location.reload()}},error:function(b){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR)}})};Tudu.execNote=function(){this.init()};Tudu.execNote.prototype={tpl:'<div class="pop pop_linkman"><form id="nodeform" method="post" action="/note/create"><input name="tid" value="" type="hidden" /><input name="format" value="1" type="hidden" /><div class="pop_header"><strong>'+TOP.TEXT.CREATE_NOTE+'</strong><a class="icon icon_close close"></a></div><div class="pop_body"><table cellspacing="0" cellpadding="0" border="0"><tr><td valign="top">'+TOP.TEXT.NOTE_CONTENT+'\uff1a</td><td><textarea name="content" style="height:90px; width:330px;"></textarea></td></table></div><div class="pop_footer"><button type="submit" name="confirm" class="btn">'+TOP.TEXT.CONFIRM+'</button><button type="button" class="btn close">'+TOP.TEXT.CANCEL+"</button></div></form></div>",tips:'<div class="float_remind"><div class="float_remind_body">'+TOP.TEXT.LOADDING_NOTE_CONTENT_TIPS+"</div></div>",ele:null,isShow:null,timer:null,init:function(){},getPos:function(e){var a=this.getAbsolutePosition(e),c=a.x,g=a.y;var b=this.ele.width(),h=$(window).width(),k=$(window).height(),d=$(e).outerHeight(),j=this.ele.height(),i=document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop,f={left:c?c:0,top:g?g+d:0};if(g+d+j-i>k){f.top=f.top-j-d}f.left=f.left+15;return f},show:function(c,b){var d=this;if(!b.length){return}if(null===this.ele){this.ele=$(this.tips);this.ele.appendTo(document.body).hide()}var a=$(c).attr("_note");if(a){d.setContent(a);var e=d.getPos(c);this.ele.css({left:e.left+"px",top:e.top+"px"});this.ele.show();this.isShow=true}else{d.timer=setTimeout(function(){d.ele.find(".float_remind_body").html(TOP.TEXT.LOADDING_NOTE_CONTENT_TIPS);var f=d.getPos(c);d.ele.css({left:f.left+"px",top:f.top+"px"});d.ele.show();d.isShow=true;clearTimeout(this.timer);d.getNote(b,function(g){if(g.data){$(c).attr("_note",g.data.content);d.setContent(g.data.content)}})},300)}},hide:function(){if(this.timer){clearTimeout(this.timer);this.timer=null}if(this.isShow){this.ele.find(".float_remind_body").empty();this.ele.hide()}this.isShow=false},setContent:function(a){this.ele.find(".float_remind_body").html(a)},getAbsolutePosition:function(b){var a={x:b.offsetLeft,y:b.offsetTop};while(b=b.offsetParent){a.x+=b.offsetLeft;a.y+=b.offsetTop}return a},getNote:function(b,c){var a=this;$.ajax({type:"GET",dataType:"json",url:"/note/get-note?limit=200&tid="+b,success:function(e){var d=a.panel;if(e.success&&e.data){if(typeof c=="function"){c.call(this,e)}}},error:function(d){}})},create:function(c,d){var a=TOP.Frame.TempWindow;a.append(this.tpl,{width:450,draggable:true,onClose:function(){a.destroy()}});var b=a.find("#nodeform");b.find('input[name="tid"]').val(c);b.submit(function(){return false});b.submit(function(){var e=b.find('textarea[name="content"]').val();if(!e.length){return TOP.showMessage(TOP.TEXT.INVALID_NOTE_CONTENT)}var f=b.serializeArray();b.find("textarea").attr("disabled",true);$.ajax({type:"POST",dataType:"json",data:f,url:b.attr("action"),success:function(g){TOP.showMessage(g.message,5000,g.success?"success":null);b.find("textarea").attr("disabled",false);if(g.success){a.close();if(typeof d=="function"){d.call(this,g)}}},error:function(g){TOP.showMessage(TOP.TEXT.PROCESSING_ERROR,5000);b.find("textarea").attr("disabled",false)}})});a.show()}};if(typeof(getTop)!="function"){function getTop(){return parent}};