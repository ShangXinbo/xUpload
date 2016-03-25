# xUpload
一个基于jQuery的简单的上传插件.

[[README IN ENGLISH]](https://github.com/ShangXinbo/xUpload)

## intro
* 需要1.4版本以上的jQuery作为基础库
* 包含以HTML5 XMLHTTPREQUEST2为原理写的 __htmlUpload__  和基于iframe无刷新写的 __iframeUpload__。
* 良好的兼容性，现代浏览器使用心得接口完成，低版本浏览器使用旧的方式，平滑过渡，而两种方法可根据情况取舍，测试可兼容至IE8+
* 极小，未压缩版紧6k。

## 写在前
因为新的上传方式势必会替代旧的上传方式，所以iframe上传文件单独分离出来，以在后期可以完整的割舍。开始有考虑到将两个插件合成一个，基于这点就没有合并。这可能是我代码的风格，低耦合才好。
目前只支持单文件上传。


## 参数
参数名称     | 参数值     | 描述
-----------|------------------|----
name     | String       | 后台获取file的key，比如POST['file'],这里边的file 
accept    | String(MIME type)  | 所支持上传文件的类型，标准的MIME类型，如不清楚可查[MIME 参考手册]（http://www.w3school.com.cn/media/media_mimeref.asp)
url      | String       | 表单提交的地址
maxSize   | Number       | 上传文件的大小阈值
data     | Object       | 除上传文件外，其他上传的参数
onSelect  |  Function      | 当选择文件完成后触发
onSuccess  | Function      | 当上传成功后触发
onError   | Function      | 当上传出现问题时触发

## 使用试例
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

## License

[GPL](https://github.com/ShangXinbo/xUpload/blob/master/LICENSE)
