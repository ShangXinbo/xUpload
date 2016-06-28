# xUpload

A light uploader for jQuery which support html5 and iframe method.
Long long ago, we developing the uloader is troubled in solution to IE6 compatibility.So we have to give up some new great  APIs in browsers.Only by Flash to do upload.Now microsoft announced IE6 is die.We must throw away the old solution to inprove our web interactive.So we new xUpload.

### Plan
In modern browsers ,we use new HTML5 input file APIs,which support multiple files,limit file tyles.we use XMLHttprequest2 APIs which support multiple file Form-data, and get progress when upload.
in older browsers(ie8~ie9), we use iframe to upload without refresh page.In this way，we code less and easy.
pay attention to that new APIs solution is trend,I made the two method separated.

### feature
* require jQuery 1.4+, it's a jQuery plugin
* HTML5 function named __htmlUpload__  and iframe function named __iframeUpload__  automatic switch based user's browsers.
* support ie8+ 
* light,all lib within  6k -
* support module loaders(AMD,CMD,UMD)

### Options
name          | value         | description
---------------|---------------|----
name          | String        | the key name in formdata to send to server，when multiple is setted true,the key will be replaced with 'name[]'
auto            | Boolen      |  if true, upload triggered when select over; 
accept        | String(MIME type)  |  the suffix of file that can be acceptted.In modern browsers it will init the "accept" attribute in input type file(MIME)
url               | String        |  the URL of upload commit 
maxSize     | Number     | only supported in modern browsers,maxSize limit you choose file, default 4\*1024\*1024 
multiple       | Boolen      |  only supported in modern browsers, if true, multiple files choose is supported
data            | Object       | other params eccept the file when form commit
onSelect     |  Function   | trigger when selected file,function([event],[files],[error])
onSuccess | Function    | trigger when upload success,function(data) 
onError       | Function    | only supported in modern browsers, trigger when upload fail. function([error])
onProgress | Function    | only supported in modern browsers, trigger when xhr onprogress. function([event])

### Example
<pre>
$('#upload').xUpload({
	url : 'http://www.geotmt.com/upload',
    name : 'file',
    accept: 'application/vnd.ms-excel',
    onSelect : function(data){
    	console.log(data);
    }
})
</pre>

### Doc in other language
[《中文说明》](https://github.com/ShangXinbo/xUpload/blob/master/README_CN.md)

## License
[GPL](https://github.com/ShangXinbo/xUpload/blob/master/LICENSE)
