/**
 * Created by 李盼盼 on 2018/11/14.
 */
function Chosenumber(options){
    this.config = {
        provice:".address_list",//省的id或class
        city:".citybox",//市的id或class
        provicebox:".provcont",//回显省的容器
        citycontbox:".citycont",//回显市的容器
        hideProviceId:"#provice_mess",//省隐藏域的id
        hideCityId:"#city_mess",//市隐藏域的id
        checkAll:"#checkAll",//全选对象
        checkItem:"input[name=checkItem]",//checkbox子元素
        number:"",//已选号码的个数
        numArr:[],//临时存储号码的数组
        proviceCallback:function(){},//省的回调
        cityCallback:function(){},//市的回调
    }
    $.extend(this.config,options);
}
Chosenumber.prototype = {
    /**
     * 选择省市*/
    choseAddress:function(){
        var that = this.config;
        /*选择省*/
        $(that.provice).on("click","li",function(){
            event.stopPropagation();
            var value = $(this).attr("value"),
                provinceCode = $(this).attr("data-code");
            $(this).addClass("select").siblings().removeClass("select");
            //将name和code放到隐藏域中
            $(that.hideProviceId).val(value);
            $(that.hideProviceId).attr("provice_code",provinceCode);
            $(that.city).show();
            if(that.proviceCallback){
                var code = $(this).attr("data-code");
                that.proviceCallback(code);
            }
        });
        /*选择市*/
        $(that.city).on("click","li",function(){
            var value = $(this).attr("value"),
                cityCode = $(this).attr("data-code");
            $(this).siblings().removeClass("select");
            //将name和code放到隐藏域中
            $(that.hideCityId).val(value);
            $(that.hideCityId).attr("city_code",cityCode);
            //将省市的name放到对应的展示容器中
            $(that.provicebox).html($(that.hideProviceId).attr("value"));
            $(that.citycontbox).html(value);

            $(that.city).hide();
            $(that.provice).hide();
            if(that.cityCallback){
                that.cityCallback();
            }
            flag = true;
        });
        $(document).click(function(){
            $(that.provice).hide();
            $(that.city).hide();
            flag = true;
        });
    },
    /**
     * 全选/反选*/
    check:function(){
        var that = this.config;
        $(that.checkAll).on("click","input[name=checkAll]",function(){
            var new_numArr = [],items = {};
            var obj = $(that.checkItem).parent();
            if($(this).is(":checked")){
                for(var i = 0;i<obj.length;i++){
                    if(!($($(obj)[i]).find(that.checkItem).is(":checked"))){
                        that.numArr.push($($(obj)[i]).attr("data-identifier"));
                        $($(obj)[i]).find(that.checkItem).prop("checked",this.checked);
                    }
                }
            }else{
                for(var i = 0;i<obj.length;i++) {
                    that.numArr = $.grep(that.numArr, function (value) {
                        return value != $(obj[i]).attr("data-identifier");
                    });
                    $($(obj)[i]).find(that.checkItem).prop("checked",false);
                }
            }
            that.number = that.numArr.length;
            $(".chosetip .amount").html(that.number);
            //子按钮事件
            $(document).on("click",that.checkItem,function(){
                var checkItem = $(that.checkItem);
                $("input[name=checkAll]").prop("checked",checkItem.length == $(that.checkItem+":checked").length ? true : false);
            });
            sessionStorage.setItem("numArr",that.numArr);
        });
    },
    /**
     * 监测选择号码数量*/
    monitor:function(){
        var that = this.config,_this = this;
        $(".number_list").on("change",that.checkItem,function(){
            var identifier = $(this).parents("li").attr("data-identifier");
            if($(this).is(":checked")){
                that.number++;
                that.numArr.push(identifier);
            }else{
                that.number--;
                that.numArr = $.grep(that.numArr, function(value) {
                    return value != identifier;
                });
            }
            $(".chosetip .amount").html(that.number);
            sessionStorage.setItem("numArr",that.numArr);
        });
    },
    /**
     * 查看已选手机号*/
    seeNumber:function(tipmess,url){
        var that = this.config,_this = this;
        if(that.number <= 0){
            _this.tipprompt(tipmess,true);
        }else{
            var tipmess = "已勾选号码"+that.number+"个";
            _this.layer("layerContianer1",tipmess,function(){
                sessionStorage.setItem("numArr",that.numArr);
                $(".layerContianer1").load("check.html");
            });
        }
    },
    /**
     * 警告信息框*/
    tipprompt:function(tipmess,hidecancel,callback){
        var toolTip = new diaPrompt();
        toolTip.warn({
            message:tipmess,
            hidecancel:hidecancel,//是否隐藏取消按钮
            callback:callback
        });
    },
    /**
     * 成功信息框*/
    successtip:function(tipmess,hidecancel,callback){
        var toolTip = new diaPrompt();
        toolTip.tips({
            message:tipmess,
            hidecancel:hidecancel,//是否隐藏取消按钮
            callback:callback
        });
    },
    /**
     * 数组处理*/
    againGroup:function(data,num){
        var result=[];
        for(var i=0,len=data.length;i<len;i+=num){
            result.push(data.slice(i,i+num));
        }
        return result;
    },
    layer:function(layerclass,alerttit,callback){
        var layerObj = new Layer({
            layerclass:layerclass,//存放页面的容器类名，
            width:"50%",
            height:"30%",
            alerttit:alerttit,
            setOverflow:"overflow-y:auto",//设置滚动的属性 overflow-y：设置竖向  overflow-x:设置横向
            callback:callback
        });
        layerObj.show();
    }
}