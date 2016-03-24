/*
 * @fileOverview  xUpload
 * @version    1.0.2
 * @date       2016-3-24
 * @author     Xinbo Shang
 *
 */

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
}(function($) {

    if (!$) {
        return console.warn('xUpload needs jQuery'); //jQuery must be required
    }

    //default options for this plugin
    var defaults = {
        name: 'file',   // post key of the file, you can get the file through file['name']
        accept: '',     // the MIME type of files that the uploader can accept    
        url: '/upload', // the URL for commit 
        maxSize: 4 * 1024 * 1024, // maxSize of the upload file, support in modern browsers
        data: {},       // other params to send
        onSelect: function() {},  // trigger when select a file
        onSuccess: function() {}, // trigger when upload success 
        onError: function() {}
    };


    /* upload for HTML5 and XMLHttpRequest2
     * when use on modern browsers,such as chrome,firefox,IE11,safari,opera
     */
    var htmlUpload = function(obj, options) {
        this.file = '';
        this.options = $.extend(defaults, options);
        this.init(obj);
    };

    /* upload for ie8~ie9 
     * when use on older browsers
     */
    var iframeNum = 0,
        iframeLoadFirst = 0;

    function iframeUpload(obj, options) {
        this.options = $.extend(defaults, options);
        this.init(obj);
    };

    htmlUpload.prototype = {

        init: function(target) {

            var _this = this,
                target = $(target);

            var dom = $('<input type="file" />').css({ //set input[type="file"]
                'width': target.width(),
                'height': target.height(),
                'top': target.offset().top,
                'left': target.offset().left,
                'position': 'absolute',
                'opacity': '0',
                'cursor': 'pointer',
                'z-index': 1000 //max z-index 1000
            });

            //accept file type limit ,MIME type string
            if (this.options.accept) {
                dom.attr('accept', this.options.accept);
            }

            dom.on('change', function(event) {
                _this.file = this.files[0]; //TODO 支持多文件上传
                //maxsize limit
                if (_this.file.size <= _this.options.maxSize) {
                    _this.options.onSelect();
                    _this.upload(); //TODO 是否立即上传 this.options.auto
                } else {
                    console.log('Exceed the maximum file limit');
                }
            });
            $('body').append(dom);
        },

        upload: function() {

            var _this = this;
            var formData = new FormData();

            formData.append(_this.options.name, _this.file); //add file

            //other data to send
            if (this.options.data) {
                for (var key in this.options.data) {
                    formData.append(key, this.options.data[key]);
                }
            }

            var xhr = new XMLHttpRequest(); // new XMLHttpRequest2
            xhr.open('POST', _this.options.url, true); //upload use method post
            xhr.onload = function(event) {
                if (xhr.status == 200) {
                    console.log(xhr.responseText);
                    return;
                    var data = eval('(' + xhr.responseText + ')');
                    if (data.status == 0) {
                        _this.onSuccess(); //upload success
                    } else {
                        _this.onError();
                    }
                } else {
                    _this.onError();
                }
            };
            xhr.send(formData);
        }
    };

    iframeUpload.prototype = {
        init: function(target) {

            var _this = this,
                target = $(target);

            iframeNum++; //prevent Multiple uploader conflict

            var iframe = $('<iframe name="iframe_' + iframeNum + '" style="display:none"></iframe>');
            var form = $('<form method="post" target="iframe_' + iframeNum + '" action="' + _this.options.url + '" name="form_' + iframeNum + '" enctype="multipart/form-data"></form>');
            var html = $('<input type="file" name="' + _this.options.name + '" />').css({
                'width': target.width(),
                'height': target.height(),
                'top': target.offset().top,
                'left': target.offset().left,
                'position': 'absolute',
                'opacity': '0',
                'cursor': 'pointer',
                'z-index': 1000
            });

            html.on('change', function() { //size limit is not supported here 
                _this.options.onSelect();
                _this.upload(this);
            });

            //other data
            for (key in this.options.data) {
                html += '<input type="hidden" name="' + key + '" value="' + this.options.data[key] + '">';
            }

            form.append(html);
            iframe.load(function() {
                if (iframeLoadFirst != 0) {
                    var contents = $(this).contents().get(0);
                    var data = $(contents).find('body').text();
                    if ('json' == _this.options.dataType) {
                        data = window.eval('(' + data + ')');
                    }
                    _this.options.onSuccess(data);
                }
                iframeLoadFirst = 1; //to prevent iframe loaded trigger when the document loaded
            });
            $('body').append(iframe).append(form);

        },
        upload: function(obj) {
            $(obj).parents('form').submit();
        }
    };

    $.fn.xUpload = function(options) {
        //Multi element support
        return this.each(function() {
            if (window.FormData) {
                return new htmlUpload(this, options);
            } else {
                return new iframeUpload(this, options);
            }
        });
    }

}));