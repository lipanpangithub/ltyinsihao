/**
 * Created by lpp on 2018/11/13.
 */

function Router(){
    this.routes={};
    this.currentURL='';
}

Router.prototype.route = function(path,callback){
    this.routes[path] = callback || function(){};
}

Router.prototype.refresh = function(){
    this.currentURL = location.hash.slice(1) || '/index';
    this.routes[this.currentURL]();
    sessionStorage.clear();
}

Router.prototype.init = function () {
    window.addEventListener('load',this.refresh.bind(this),false);
    window.addEventListener('hashchange',this.refresh.bind(this),false);
}

function display_page(id){
    $(".content").eq(id).show().siblings().hide();
}

window.Router = new Router();

Router.route('/index',function(){
    display_page(0);
});

Router.route('/openAccount',function(){
    display_page(1);
});

Router.route('/recharge',function(){
    display_page(2);
});
Router.route('/details',function(){
    display_page(3);
});
window.Router.init();



