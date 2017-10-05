(function () {
    'use strict';

    window.FRUTILS = {
        getUser: function(){
            return  localStorage.getItem('email');
        },
        setUser: function(email){
            return  localStorage.setItem('email', email);
        },
        fixTime: function (t) {
            return t && t.split('.')[0].replace('T', ' ');
        },
        getQueryObj: function () {
            var res = [];
            if (location.search) {
                location.search.substr(1).split("&").forEach(function (item) {
                    var s = item.split("="),
                        k = s[0],
                        v = s[1] && decodeURIComponent(s[1]);
                    (res[k] = res[k] || []).push(v);
                });
            }
            return res;
        },
        getQueryId: function(){
            return location.href.split('/').pop();
        }
    }


}());

