
{
  let view = {
    el: '.uploadArea',
    find(selector){
      return $(this.el).find(selector)[0]
    }
  }
  let model = {
    data: {
      status: 'open'
    }
  }
  let controller = {
    init(view, model){
      this.view = view 
      this.model = model
      this.initQiniu()
    },
    initQiniu(){
      var uploader = Qiniu.uploader({
        runtimes: 'html5',      // 上传模式,依次退化
        browse_button:this.view.find('#uploadButton'),         // 上传选择的点选按钮，**必需**
        // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
        // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
        // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
        // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
        uptoken_url: 'http://localhost:8080/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        // uptoken_func: function(file){    // 在需要获取 uptoken 时，该方法会被调用
        //    // do something
        //    return uptoken;
        // },
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
        // downtoken_url: '/downtoken',
        // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
        // unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
        // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'pbw0wx370.bkt.clouddn.com',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
        // container: '#uploadContainer',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
        max_file_size: '40mb',             // 最大文件体积限制
        dragdrop: true,                     // 开启可拖曳上传
        drop_element:this.view.find('#uploadContainer'),          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true, 
                      // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        
        init:{
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': (up, file)=> {
	        window.eventHub.emit('beforeUpload')
                if(this.model.data.status === 'open'){
	              this.model.data.status = 'close'
                    return true
                }else{
                    return false
                }
                   // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                   // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': (up, file, info)=> {
	        window.eventHub.emit('afterUpload')
            this.model.data.status = 'open'
                   // 每个文件上传成功后,处理相关的事情
                   // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                   // {
                   //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                   //    "key": "gogopher.jpg"
                   //  }
                   // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
    
                   var domain = up.getOption('domain');
                   var response = JSON.parse(info.response);
                   var sourceLink = 'http://'+ domain + '/' + encodeURIComponent(response.key); 
                  //  获取上传成功后的文件的Url
                   window.eventHub.emit('new', {
                    url: sourceLink,
                    name: response.key
                  })
            },
            'Error': function(up, err, errTip) {
                   //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                   //队列文件处理完毕后,处理相关的事情
            },
            // 'Key': function(up, file) {
            //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            //     // 该配置必须要在 unique_names: false , save_key: false 时才生效
            //
            //     var key = "aaa";
            //     // do something with key here
            //     return key
            // }
        }
    });
 
    }
  }
  controller.init(view, model)
}
