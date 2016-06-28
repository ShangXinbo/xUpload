/*
 * @fileOverview  xUpload
 * @version    1.3
 * @date       2016-3-24
 * @author     Xinbo Shang
 *
 */

"use strict";

(function (factory) {
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
}(function ($) {

    if (!$) {
        return console.warn('xUpload needs jQuery'); //jQuery must be required
    }

    //default options for this plugin
    var defaults = {
        auto: true,          // if set true, upload when you select files;
        name: 'file',        // post key of the file, you can get the file through file['name']
        accept: '',          // the suffix of file that can be acceptted.In modern browsers it will init the "accept" attribute in input type file
        multiple: false,     // support multiple files upload, only support in modern browsers
        url: '/upload',      // the URL for commit
        maxSize: 4 * 1024 * 1024, // maxSize of the upload file, only support in modern browsers
        data: {},            // other params to send
        onSelect: function (event, files, error) {   // trigger when select a file
            // @param event  the button of choose file
            // @param files  files choosed,
            // @param error  file select unexpected,with fail message
        },
        onSuccess: function (data) {         // trigger when upload success
            // @param data  xhr return data
        },
        onError: function (error) {          // trigger when upload fail, only support in modern browsers
            // @param error  xhr.statusText
        },
        onProgress: function (event) {   // trigger when xhr2 progress, only support in modern browsers
            // @param event progress
        }
    };

    /* upload for HTML5 and XMLHttpRequest2
     * when use on modern browsers,such as chrome,firefox,IE11,safari,opera
     */
    var htmlUpload = function (obj, options) {
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

        init: function (target) {

            var _this = this;

            var dom = $('<input type="file" />').css(getBtnCSS(target));

            //set multiple
            if (_this.options.multiple) {
                dom.attr('multiple', 'multiple');
            }

            //accept file type limit ,MIME type string
            if (_this.options.accept) {
                var extension = _this.options.accept.split(',');
                var mime = getMIME();
                var mimestr = '';
                for (var i = 0; i < extension.length; i++) {
                    if (mime[extension[i]]) {
                        mimestr += mime[extension[i]];
                        if (i < extension.length - 1) {
                            mimestr += ',';
                        }
                    }
                }
                dom.attr('accept', mimestr);
            }

            dom.on('change', function (event) {
                //maxsize limit
                for (var i = 0; i < this.files.length; i++) {
                    if (this.files[i].size >= _this.options.maxSize) {
                        console.log('Exceed the maximum file limit');
                        return false;
                    }
                }
                _this.file = this.files;
                if (_this.options.accept) {
                    var accept = _this.options.accept.split(',');
                    for (var j = 0; j < this.files.length; j++) {
                        var arr = this.files[j].name.split('.');
                        if ($.inArray(arr[arr.length - 1], accept) < 0) {
                            console.error('file type error');
                            _this.options.onSelect(event, _this.file, {'code': 0, 'message': 'file type error'});
                            return false;
                        }
                    }
                }

                _this.options.onSelect(event, _this.file, null);
                if (_this.options.auto) {
                    _this.upload();
                }

            });
            $('body').append(dom);
        },

        upload: function () {

            var _this = this;
            var formData = new FormData();

            if (_this.options.multiple) {
                for (var i = 0; i < _this.file.length; i++) {
                    formData.append(_this.options.name + '[]', _this.file[i]); //add file
                }
            } else {
                formData.append(_this.options.name, _this.file[0]); //add file
            }

            //other data to send
            if (this.options.data) {
                for (var key in this.options.data) {
                    formData.append(key, this.options.data[key]);
                }
            }

            var xhr = new XMLHttpRequest(); // new XMLHttpRequest2  html5 support
            xhr.open('POST', _this.options.url, true); //upload use method post
            xhr.onprogress = function (event) {
                _this.options.onProgress(event);
            };
            xhr.onload = function (event) {
                if (xhr.status == 200) {
                    var data = eval('(' + xhr.responseText + ')');
                    if (data.status == 0) {
                        _this.options.onSuccess(data); //upload success
                    } else {
                        _this.options.onError();
                    }
                } else {
                    _this.options.onError(xhr.statusText);
                }
            };
            xhr.send(formData);
        }
    };

    iframeUpload.prototype = {

        init: function (target) {
            var _this = this;

            iframeNum++;   //prevent Multiple uploader conflict

            var iframe = $('<iframe name="iframe_' + iframeNum + '" style="display:none"></iframe>');
            var form = $('<form method="post" target="iframe_' + iframeNum + '" action="' + _this.options.url + '" name="form_' + iframeNum + '" enctype="multipart/form-data"></form>');
            var html = $('<input type="file" name="' + _this.options.name + '" />').css(getBtnCSS(target));

            html.on('change', function (event) {
                var file = $(this).val();

                if (_this.options.accept) {
                    var accept = _this.options.accept.split(',');
                    var arr = file.split(',');
                    if ($.inArray(arr[arr.length - 1], accept) < 0) {
                        _this.options.onSelect(event, file, {'code': 0, 'message': '格式不支持'});
                        return false;
                    }
                }
                _this.options.onSelect(event, file, null);
                if (this.options.auto) {
                    _this.upload(this);
                }
            });

            //other data
            for (key in this.options.data) {
                html += '<input type="hidden" name="' + key + '" value="' + this.options.data[key] + '">';
            }

            form.append(html);
            iframe.load(function () {
                if (iframeLoadFirst != 0) {
                    var contents = $(this).contents().get(0);
                    var data = $(contents).find('body').text();
                    if ('json' == _this.options.dataType) {
                        data = window.eval('(' + data + ')');
                    }
                    _this.options.onSuccess(data);
                }
                iframeLoadFirst = 1;     //to prevent iframe loaded trigger when the document loaded
            });
            $('body').append(iframe).append(form);
        },
        upload: function (obj) {
            $(obj).parents('form').submit();
        }
    };


    function getBtnCSS(target) {
        return {
            'width': $(target).width(),
            'height': $(target).height(),
            'top': $(target).offset().top,
            'left': $(target).offset().left,
            'position': 'absolute',
            'opacity': '0',
            'cursor': 'pointer',
            'z-index': 1000
        };
    }

    $.fn.xUpload = function (options) {
        //Multi element support
        return this.each(function () {
            if (window.FormData) {
                return new htmlUpload(this, options);
            } else {
                return new iframeUpload(this, options);
            }
        });
    }

}));