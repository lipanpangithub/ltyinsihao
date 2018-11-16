/**
 * Created by xhgx on 2017/4/24.
 * zhge yilai nnnn xian
 * 
 * 滚动条overflow-y参数
 * 		visible	不裁剪内容，可能会显示在内容框之外。	
 * 		hidden	裁剪内容 - 不提供滚动机制。	
 * 		scroll	裁剪内容 - 提供滚动机制。	
 * 		auto	如果溢出框，则应该提供滚动机制。	
 * 		no-display	如果内容不适合内容框，则删除整个框。	
 * 		no-content	如果内容不适合内容框，则隐藏整个内容。
 */
/*本页面依赖于public-method.js*/
/*弹框的基本对象*/
function Layer(options){
    this.config = {
        layerBoxClass :"layerBox1",
        layerclass:"",
        width:300,
        height:200,
        zIndex:1000,
        alerttit:"信息",
        setOverflow:"overflow-y:auto",
        ensureCallback:function(){},//点击确定的回调函数
        callback: function () { }//
    }
    $.extend(this.config,options);
}
Layer.prototype = {
    /*创建弹出框*/
    _createDialog:function(state){
        var that = this;
        var str = "";
        var strwd = that.config.width,strhg = that.config.height;
        var s = this.view();
        that.config.zIndex++;
        if((typeof that.config.width) == "string"){
            if(strwd.indexOf("%")&&strhg.indexOf("%")){
                var layerW = s.w*(parseInt(this.config.width)/100),layerH = s.h*(parseInt(this.config.height)/100);
                str = '<div class="overlay" style="z-index:'+that.config.zIndex+'">' +
                    '<div class="animated zoomIn layerBox '+that.config.layerBoxClass+'" style = "width:'+ this.config.width+';height:'+this.config.height+'">' +
                    '<div class="layerHeader">'+this.config.alerttit+'<a href="javascript:;" class="close_btn"></a></div>' +
                    '<div class="layerContianer '+this.config.layerclass+'" style="'+this.config.setOverflow+'">' +
                    '</div><span class="layer-size"></span>' +
                    '<div class="layerhandle"><input type="button" value="确定" class="ensure"/><input type="button" value="取消" class="cancle"/></div>' +
                    '</div></div>';
                $("body").append(str);
                $("."+that.config.layerBoxClass).eq($(".overlay").size()-1).css({left: (s.w - layerW)/2+"px",top: (s.h - layerH)/2+"px"});
            }
        }else{
            str = '<div class="overlay" style="z-index:'+that.config.zIndex+'">' +
                '<div class="animated zoomIn layerBox '+that.config.layerBoxClass+'" style = "width:'+ this.config.width+'px;height:'+this.config.height+'px">' +
                '<div class="layerHeader">'+this.config.alerttit+'<a href="javascript:;" class="close_btn"></a></div>' +
                '<div class="layerContianer '+this.config.layerclass+'" style="'+this.config.setOverflow+'">' +
                '</div><span class="layer-size"></span>' +
                '<div class="layerhandle"><input type="button" value="确定" class="ensure"/><input type="button" value="取消" class="cancle"/></div>' +
                '</div></div>';
            $("body").append(str);
            $("."+that.config.layerBoxClass).eq($(".overlay").size()-1).css({left: (s.w- this.config.width)/2+"px",top: (s.h-this.config.height)/2+"px"});
        }
        /*点击关闭*/
        $(".close_btn").click(function (){
            that.delDialog($(this));
        });
        /*点击确定*/
        $(".ensure").click(function(){
            that.delDialog($(this));
            if(that.config.ensureCallback){
                that.config.ensureCallback.apply(this,[]);
            }
        });
        if(that.config.callback){
            that.config.callback.apply(this,[]);
        }
        /*点击取消*/
        $(".cancle").click(function(){
            that.delDialog($(this));
        });
        return str;
    },
    /*移除弹框*/
    delDialog:function(ele){
        $(ele).parents(".overlay").remove();
    },
    /*手动调整弹框大小*/
    revampSize:function(){
        var that = this;
        var s = that.view();
        $(".layer-size").mousedown(function(e){
            var theme = this;
            var moveEle = $(theme).parents("."+that.config.layerBoxClass);
            var x = e.clientX - moveEle.width();
            var y = e.clientY - moveEle.height();
            $(document).mousemove(function(e){
                var width = e.clientX-x+"px";
                var height = e.clientY-y+"px";
                width=width<0 ? 0:width;
                width=width>s.w ? s.w :width;
                height=height<0 ? 0:height;
                height=height>s.h ? s.h :height;
                moveEle.css({width:width,height:height});
            });
            $(document).mouseup(function(){
                $(document).unbind("mousemove");
            });
        });
    }
    ,show:function(){
        this._createDialog();
        this.revampSize();
    },
    view: function () {
        return {
            //w:可视区域的宽度    h:可视区域的高度
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
        }
    }
}

;(function(win){
    if(win["UDP"]){
        win["UDP"].Layer = Layer;
    }else{
        win.UDP = {Layer:Layer};
    }
})(window);


