
"use strict";

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS Module
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery || Zepto);
    }
}(function($){

    if (!$) {
        return console.warn('xUpload needs jQuery'); //jQuery must be required
    }

    var defaults = {
        accept: '',
        url: 'http://ana.geotmt.com/valueadded/loanafter/upload/upload',
        maxSize: 4*1024*1024,
        onSelect: function(){},
        onSuccess: function(){},
        onError : function(){},
        data: {}
    };

    function htmlUpload(obj,options){       
        this.file = '';
        this.options = $.extend(defaults, options);
        this.init(obj);
    };
    
    htmlUpload.prototype = {
        init: function(target){
            var _this = this,
                target = $(target);
            var dom = $('<input type="file" />').css({
                'width': target.width(),
                'height': target.height(),
                'top': target.offset().top,
                'left': target.offset().left,
                'position': 'absolute',
                'opacity': '0',
                'cursor': 'pointer',
                'z-index': 1000 
            });
            if(this.options.accept){
                dom.attr('accept',this.options.accept);
            }
            dom.on('change', function(event) {
                _this.file = $(this)[0].files[0];
                if(_this.file.size<= _this.options.maxSize){
                    _this.options.onSelect();
                    _this.upload();
                }else{
                    console.log('limit size');
                }
            });
            $('body').append(dom);
        },
        upload: function(){
            var _this = this;
            var formData = new FormData();
            formData.append('file',_this.files);
            if(this.options.data){
                for(var key in this.options.data){
                    formData.append('"'+ key + '"', this.options.data[key]);
                }
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', _this.options.url);   
            xhr.onload = function(event) {
                console.log(xhr);
                if(xhr.status==200){
                    var data = eval('('+ xhr.responseText+')');
                    if(data.status==0){ 
                        _this.onSuccess();   //upload success
                    }else{
                        _this.onError();     //upload error
                    } 
                }else{ 
                    _this.onError();         //request error
                }
            };
            xhr.send();
        }
    };

    var iframeNum = 0;
    var iframeUpload = function(obj,options){
        this.options = $.extend(defaults, options);
        this.init(obj);
    };
    iframeUpload.protoType = {
        init : function(){
            var _this = this;
            iframeNum++;
            var iframe = $('<iframe name="iframe_'+ iframeNum +'" style="display:none"></iframe>')
            var form = $('<form target="iframe_'+ iframeNum +'" action="'+ url +'" name="form_'+ iframeNum +'" style="display:none;" enctype="multipart/form-data"></form>');
            var html = $('<input type="file" name="file" />');
            for (key in this.options.data) {
                html += '<input type="hidden" name="' + key + '" value="' + this.options.data[key] + '">';
            }
            form.append(html);
            form.on('change','[type="file"]',function(){
                _this.options.onSelect();
            });
            iframe.load(function() {
                var contents = $(this).contents().get(0);
                var data = $(contents).find('body').text();
                if ('json' == opts.dataType) {
                    data = window.eval('(' + data + ')');
                }
                _this.options.onSuccess(data);
                iframe.remove();
                form.remove();
            });
            $('body').append(iframe).append(form);
        },
        upload: function(){
            form.submit();
        }
    };


    $.fn.xUpload = function(options) {
        //Multi element support
        return this.each(function() {
            if(window.FormData){
                var s = new htmlUpload(this,options);
            }else{
                var s = new iframeUpload(this,options);
            }   
        });
    }

}));