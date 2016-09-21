# xUpload
这是一个基于jQuery的简单的上传插件.
很久以前我们做文件上传功能时要考虑ie6的兼容性，所以很多时候我们必须放弃一些高性能的API来实现上传插件，只能借助flash来实现丰富的功能。而现代浏览器盛行的年代我们必须要摒弃原来的方案，其中的原因不必多说。为了尽量用最小的代价来实现通用的功能，我们需要这样一个新的插件来实现我们的目的，这就是xUpload的最根本使命。

### 实现原理
现代浏览器中使用先进的HTML5 input file 接口，支持多上传，限制文件类型功能，使用XMLHttprequest2的新接口实现异步上传，支持多文件form-data，支持上传进度查询progress.
旧版浏览器（ie8~ie9），使用iframe实现无刷新上传文件，功能简单，但实现容易，代码量小。
因为使用新接口方式势必会取代iframe上传，所以两个实现方式进行低耦合方式，以实现功能的可分离性

### 特性
* 需要1.4版本以上的jQuery作为基础库
* __htmlUpload__ 方式和 __iframeUpload__  方式根据浏览器版本自动切换，默认使用功能性更好的 __htmlUpload__ 。
* 完美兼容至IE8+
* 轻巧，未压缩版仅6k。
* 支持模块加载器（AMD,CMD,UMD）

### 参数
参数名称     |    参数值     |    描述
------------|--------------|----
name           | String          |  向后台传值的key，比如POST['file'],这里边的file，当multiple设置为true时，插件默认替换为“file[]” 
auto             | Boolen        |  选择文件后是否自动启动上传  ，默认值 true
accept         | String(MIME type)  | 设置支持的上传文件的类型，逗号间隔开的文件后缀的形式如”jpg,png,gif“,在现代浏览器上会转化成HTML5中input accept 属性，在这里我们会根据后缀名转化成MIME类型
url                | String          | 上传文件请求的接口地址
maxSize      | Number       | 仅支持现代浏览器，上传文件大小的阈值, 默认值 4\*1024\*1024
data             | Object         | 除文件外，其他上传的参数，json键值对的格式
multiple        | Boolen        | 仅支持现代浏览器，是否启用多文件上传，默认值 false
onSelect      |  Function     | 当选择文件完成后触发, function([event],[files],[error])
onSuccess  | Function      | 当上传成功后触发, function([data])
onError        | Function      | 仅支持现代浏览器，当上传出现问题时触发,function([error])
onProgress  | Function      | 仅支持现代浏览器，当xhr的progress事件触发时触发，用于跟踪上传文件的进度值 ,function([event])

### 方法
参数名称       |    描述
--------------|------
upload()        |   触发文件上传（参数auto设为false的时候使用）


### 使用试例
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

### 其他版本文档
[ [ README IN ENGLISH ] ](https://github.com/ShangXinbo/xUpload)

### 请遵守开源协议
[GPL](https://github.com/ShangXinbo/xUpload/blob/master/LICENSE)
