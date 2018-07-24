{
  let view = {
    el: '.page > main',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
        <div class="row">
          <label> 歌名</label><input name="name" type="text" value="__name__">
        </div>
        <div class="row">
          <label>
          歌手
          </label>
          <input name="singer" type="text" value="__singer__">
        </div>
        <div class="row">
          <label>
          外链
          </label>
          <input name="url" type="text" value="__url__">
        </div>
        <div class="row">
          <label>
          封面
          </label>
          <input name="cover" type="text" value="__cover__">
        </div>
        <div class="row">
          <label>
          歌词
          </label>
          <textarea cols=100 rows=10 name="lyrics">__lyrics__</textarea>
        </div>
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}){
      let placeholders = ['name', 'url','singer','id']
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
        if(data.id){
            $(this.el).prepend('<h1>编辑歌曲</h1>')
        }else{
            $(this.el).prepend('<h1>新建歌曲</h1>')
        }
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data:{
      name:'',singer:'',url:'',id:''
    },
    create(data){
        // 声明类型
      var Song = AV.Object.extend('Song');
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set('name',data.name);
      // 设置优先级
      song.set('singer',data.singer);
      song.set('url',data.url);
      return song.save().then((newSong)=>{
        let {id,attributes} = newSong
        Object.assign(this.data,{id,...attributes})
      }, (error)=>{
        console.error(error);
      });
    },
    updata(data){
        console.log(1121212)
        console.log(data)
        var song = AV.Object.createWithoutData('Song',this.data.id);
        // 修改属性
        song.set('name', data.name);
        song.set('singer',data.singer);
        song.set('url',data.url);
        // 保存到云端
        return song.save().then((response)=>{
          Object.assign(this.data,data)
            return response

        });
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('select',(data)=>{
        this.view.render(data)
        this.model.data.id = data.id
      })
      window.eventHub.on('new',(data)=>{
        if(this.model.data.id){ //这个data的id是从leancloud里面取的，如果存在，说明用户正在编辑
          this.model.data = {} //则清空
        }else{
          Object.assign(this.model.data,data)
        }
        this.view.render(this.model.data)
      })
    },
    create(){
        let needs = 'name singer url'.split(' ')
        let data = {}
        needs.map((string)=>{
            data[string] = $(this.view.el).find(`[name="${string}"]`).val()
        })
        this.model.create(data).then(()=>{
            this.view.reset()
            let string = JSON.stringify(this.model.data)
            let object = JSON.parse(string)
            window.eventHub.emit('create',object)
        })
    },
    updata(){
        let needs = 'name singer url'.split(' ')
        let data = {}
        needs.map((string)=>{
            data[string] = $(this.view.el).find(`[name="${string}"]`).val()
        })
        this.model.updata(data).then(()=>{
            window.eventHub.emit('updata',this.model.data)
        })
    }
    ,
    bindEvents(){
      $(this.view.el).on('submit','form',(e)=>{
          e.preventDefault()
          if(this.model.data.id){
              //数据没传过来
            this.updata()
          }else{
            this.create()
          }
      })
    }

  }
  controller.init(view, model)

}
//bug 当用户刷新，再次点编辑时又创建了一个新的Li,修改任何时，都修改的是这个li？
//说明上一个updata出了问题