/**
 * Created by xhgx on 2017/4/24.
 */
/*弹框的基本对象*/
function Prompt(options){
    this.config = {
        id :"promptBox",
        message:"填写相关提示信息",
        alertClass:{success:["aTip","成功"],warn:["aWarn","警告"],error:["aError","错误"]},
        timer:false,/*是否开启定时器*/
        sec:"3",/*倒计时的时间*/
        hidecancel:false,
        callback: function () { },
        cancel: function () { }
    }
    $.extend(this.config,options);
    this.ele = null;
}
Prompt.prototype = {
    /*创建弹出框*/
    _createDialog:function(state){
        var that = this;
        var str = "";
        var time="";
        var num = that.config.sec;
        var timernum = that.config.timer;
        var conditionBtn = "";
        if(this.config.hidecancel){
            conditionBtn = "none"
        }else{
            conditionBtn = "inline-block"
        }
        str = '<div class="overlay_prompt"><div id="'+this.config.id+'"class="animated zoomIn"><div class="dialogHeader">'+this.config.alertClass[state][1]+'<a href="javascript:;" class="close_btn"></a></div><div class="dialogContianer '+this.config.alertClass[state][0]+'">'+ this.config.message ;
        if(timernum){
            str += '<div class="sec">( <span id="sec">'+num+'</span>s后关闭 )</div>';
        }
        str += '</div><div class="dialogFooter">' +
            '<input type="submit" value="确定" class="btn-xs btnY" id="ensure" style="display:'+conditionBtn+';"/>' +
            '<input type="submit" value="取消" id="cannel" class="btn-xs btnN" style="display:'+conditionBtn+';"/></div></div></div>';
        $("body").append(str);
        $("#ensure").click(function (){
            that.delDialog();
            if(that.config.callback){
                that.config.callback();
            }
            clearInterval(time);
        });
        $("#cannel").click(function (){
            that.delDialog();
            if(that.config.cancel){
                that.config.cancel();
            }
            clearInterval(time);
        });
        $(document).keyup(function(event){
            if(event.keyCode ==13){
                $("#ensure").trigger("click");
            }
            clearInterval(time);
        });

        if(that.config.timer){
            time = setInterval(function(){
                var those = that;
                num--;
                $("#sec").html(num);
                if(num == -1){
                    clearInterval(time);
                    $(".overlay_prompt").remove();
                    if(those.config.callback()){
                        those.config.callback().apply(this,[]);
                    }
                }
            },1000);
            that.config.timer=false;
        }

        $(".close_btn").click(function(){
            that.delDialog();
            clearInterval(time);
        });
        return str;
    },
    /*移除弹框*/
    delDialog:function(createOverlay){
        $(".overlay_prompt").remove();
    }
}
/*提示框对象*/
function diaPrompt(options){
    Prompt.call(this,options);
}
diaPrompt.prototype = new Prompt();
/*提示*/
diaPrompt.prototype.tips = function(obj){
    $.extend(this.config,obj);
    this._createDialog("success");
}
/*警告*/
diaPrompt.prototype.warn = function(obj){
    $.extend(this.config,obj);
    this._createDialog("warn");
}
/*错误*/
diaPrompt.prototype.error = function(obj){
    $.extend(this.config,obj);
    this._createDialog("error");
}

;(function(win){
    if(win["UDP"]){
        win["UDP"].Prompt = Prompt;
    }else{
        win.UDP = {Prompt:Prompt};
    }
})(window);

