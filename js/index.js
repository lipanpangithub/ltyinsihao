/**
 * Created by lpp on 2018/11/12.
 */

/**
 * 用户信息展示*/
var usermess,token;
if(localStorage.getItem("token")){
    token = localStorage.getItem("token");
    usermess = localStorage.getItem("userPhone");
    $(".user span").html(usermess);
}
/**
 * 左侧菜单*/
function slidetoggle(){
    $(".menulist").on("click",".menu-item",function() {
        var that = this;
        var menuflag = $(that).siblings().length>0;
        if(menuflag){
            $(that).siblings(".submenu").slideDown().parents("li").siblings().children(".submenu").slideUp();
        }else{
            $(that).parents("li").siblings().children(".submenu").slideUp();
            $(this).parents("li").siblings().find("i").addClass("rotateUp");
            $(".submenu li").removeClass("active");
        }
        if($(this).parent("li").hasClass("active")){
            $(this).parent("li").removeClass("active");
            $(this).siblings(".submenu").slideUp();
            $(this).find("i").addClass("rotateUp").removeClass("rotateDown");
        }else{
            $(this).parent("li").addClass("active").siblings().removeClass("active");
            $(this).siblings(".submenu").slideDown();
            $(this).find("i").addClass("rotateDown").removeClass("rotateUp").parents("li").siblings().find("i").removeClass("rotateDown").addClass("rotateUp");
        }
    });
}
slidetoggle();
$(".submenu").on("click","li",function(){
    $(this).addClass("active").siblings().removeClass("active");
});
/*==============================选号=============================*/
/**
 * 选择归属地*/
var Chosefn = new Chosenumber({
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
    proviceCallback:function(code){//选择省的回调函数
        $.ajax({
            type:"post",
            url:"http://172.27.35.3:8083/queryCityByprovinceCode",
            data:{'provinceCode':code},
            success:function(data){
                if(data.status == 0){
                    var str = "";
                    for(var i = 0;i<data.res.length;i++){
                        str += "<li value='"+data.res[i].CITY_NAME+"' data-code='"+data.res[i].CITY_CODE+"'>"+data.res[i].CITY_NAME+"</li>";
                    }
                    $(".city").append(str);
                }
            },
            error:function(msg){
                console.log(msg)
            }
        });
    },
    cityCallback:function(){ //选择市的回调函数
        var provice_code = $("#provice_mess").attr("provice_code"),
            city_code = $("#city_mess").attr("city_code");
        $.ajax({
            type:"post",
            url:"http://172.27.35.3:8083/queryNumber",//http://172.27.35.3:8083/queryNumber
            data:{'provinceCode':provice_code,'cityCode':city_code},
            success:function(data){
                $("#pagenum_cont").empty();
                var newdata = Chosefn.againGroup(data,10)[0];
                var str = "";
                for(var i=0;i<newdata.length;i++){
                    str += '<li data-identifier="'+newdata[i].index+'" data-phone="'+newdata[i].number+'">' +
                        '<input type="checkbox" name = "checkItem"/><span>'+newdata[i].number+'</span>' +
                        '</li>';
                }
                $("#pagenum_cont").append(str);
                $("#checkAll input[name=checkAll]").prop("checked",false);
                $(".noAddress").hide();
                $(".hasAddress").show();
            }
        });
    }
});
 var flag = true;
/**
 * 点击请选择归属地
 * */
$.ajax({
    type:"post",
    url:"js/package.json",//http://172.27.35.3:8083/queryNumber
    success:function(data){
        $("#pagenum_cont").empty();
        var newdata = Chosefn.againGroup(data,10)[0];
        var str = "";
        for(var i=0;i<newdata.length;i++){
            str += '<li data-identifier="'+newdata[i].index+'" data-phone="'+newdata[i].number+'">' +
                '<input type="checkbox" name = "checkItem"/><span>'+newdata[i].number+'</span>' +
                '</li>';
        }
        $("#pagenum_cont").append(str);
    }
});
$("#select_address").click(function(event){
    event.stopPropagation();
    if(flag){
        $(".address_list").show();
        flag = false;
    }else {
        $(".address_list").hide();
        flag = true;
    }
    $.ajax({
        type:"post",
        url:"js/package.json",
        contentType: 'application/json; charset=utf-8',
        success:function(data){
            if(data.status == 0){
                var str = "";
                for(var i = 0;i<data.res.length;i++){
                    str += "<li value='"+data.res[i].PROVINCE_NAME+"' data-code='"+data.res[i].PROVINCE_CODE+"'>"+data.res[i].PROVINCE_NAME+"</li>";
                }
                $(".province").append(str);
            }
        },
        error:function(msg){
            console.log(msg);
        }
    });
});

/**
 * 选择省市
 * */
Chosefn.choseAddress();

/**
 * 分页
 * */
$(".pagebtn .pageNum").click(function(){
    $(this).addClass("numactive").siblings().removeClass("numactive");
    $("#checkAll input[name=checkAll]").prop("checked",false);
    var pagenum = $(this).attr("data-page");
    var provice_code = $("#provice_mess").attr("provice_code"),
        city_code = $("#city_mess").attr("city_code");
    $.ajax({
        type:"post",
        url:"js/package.json",
        data:{'provinceCode':provice_code,'cityCode':city_code},
        success:function(data){
            $("#pagenum_cont").empty();
            var newdata = Chosefn.againGroup(data,10)[pagenum];
            var str = "";
            /*将号码放到页面*/
            for(var i=0;i<newdata.length;i++){
                str += '<li data-identifier="'+newdata[i].index+'" data-phone="'+newdata[i].number+'">' +
                    '<input type="checkbox" name = "checkItem"/><span>'+newdata[i].number+'</span>' +
                    '</li>';
            }
            $("#pagenum_cont").append(str);
            /*记录所选号码*/
            if(sessionStorage.getItem("numArr")){
                var hasCheck = sessionStorage.getItem("numArr").split(",");
                for(var i=0;i<newdata.length;i++){
                    for(var x = 0;x<hasCheck.length;x++){
                        if(hasCheck[x] == newdata[i].index){
                            var phone = $("li[data-identifier="+hasCheck[x]+"] input[name=checkItem]").attr("checked",true);
                        }
                    }
                }
            }
        }
    });
});
/**全选
 * */
Chosefn.check();
/**
 * 监测已选号码数量
 * */
Chosefn.monitor();
/**
 * 点击查看*
 * */
$("#see_number").click(function(){
    Chosefn.seeNumber("请选择号码!","check.html");
});

/**
 * 下一步
 * */
$("#nextstep").click(function(){
    var stripnum = parseInt($(".chosetip .amount").html());
    if(stripnum>0){
        //如果全部选占成功
        var successtip="已完成选号"+stripnum+"个";
        Chosefn.successtip(successtip,false,function(){
            console.log("处理选占成功后的数据回显");
            /*$.ajax({
                type:"post",
                url:"",
                success:function(data){
                    if(data.status == 0){
                        var str = "";
                        $(".tabcont tbody").empty();
                        for(var i = 0;i<data.res.length;i++){
                            str += '<tr> ' +
                                '<td><input type="checkbox"/></td> ' +
                                '<td>1</td> ' +
                                '<td>1937196387546</td> ' +
                                '<td>2018-11-06  12:00:00</td> ' +
                                '<td>18667576577</td> ' +
                                '<td>北京</td> ' +
                                '<td><span class="handlebtn">取消选号</span></td> ' +
                                '</tr>'
                        }
                        $(".tabcont tbody").append(str);
                    }
                }
            });*/
        });
        //选占失败
       /* var errtip = "已完成选号"+6+"个，失败"+4+"个";
        $.ajax({
            type:"post",
            url:"js/package.json",
            success:function(data){
                //存储失败的号码
                var errArr = [];
                for(var i=0;i<data.length;i++){
                    errArr.push(data[i]);
                }
                Chosefn.layer("errcontainer",errtip,function(){
                    console.log(errArr);
                    sessionStorage.setItem("err_phone",errArr);
                    $(".errcontainer").load("check.html");
                });
            }
        });*/
    }else{
        Chosefn.tipprompt("请先选择号码后再进行下一步!");
        return false
    }
});
/**
 * 开户*/
//判断用户是否有选占的号码，有==展示选占号码，无==展示开户详情
//假设有选占号码
/*$.ajax({
    type:"post",
    url:"",
    success:function(data){
        if(data.status == 0){
            var str = "";
            $(".tabcont tbody").empty();
            for(var i = 0;i<data.res.length;i++){
                str += '<tr> ' +
                    '<td><input type="checkbox"/></td> ' +
                    '<td>1</td> ' +
                    '<td>1937196387546</td> ' +
                    '<td>2018-11-06  12:00:00</td> ' +
                    '<td>18667576577</td> ' +
                    '<td>北京</td> ' +
                    '<td><span class="handlebtn">取消选号</span></td> ' +
                    '</tr>'
            }
            $(".tabcont tbody").append(str);
        }
    }
});*/

//点击批量开户
$("#batchopen").click(function(){
    /*$.ajax({
        type:"post",
        url:"",
        success:function(data){
            $(".tabcont tbody").empty();
            if(data.status == 0){
                var str = "";
                for(var i=0;i<data.res;i++){
                    str += '<tr> ' +
                        '<td><input type="checkbox"/></td> ' +
                        '<td>1</td> ' +
                        '<td>1937196387546</td> ' +
                        '<td>2018-11-06  12:00:00</td> ' +
                        '<td>18667576577</td> ' +
                        '<td>北京</td> ';
                    if(){
                        str += '<td><span class="account_tip suc_account">开户成功</span></td> ' +
                        '</tr>';
                    }else if(){
                        str += '<td><span class="account_tip err_account">开户失败</span></td> ' +
                            '</tr>';
                    }else{
                        str += '<td><span class="account_tip wait_account">等待开户</span></td> ' +
                            '</tr>';
                    }
                }
                $(".tabcont tbody").append(str);
            }
        }
    });*/
    $(this).hide();
});
/**
 * 查看失败原因*/
$("#see_cause").click(function(){
    $(".errbatch").show();
});
$("#new_account").click(function(){
    $(".errbatch").hide();
    /*处理重新开户的请求*/
});


