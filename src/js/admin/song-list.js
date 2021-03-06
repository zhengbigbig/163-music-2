{
  let view = {
    el: '#songList-container',
    template: `
      <ul class="songList">
      <li>歌曲1</li>
      <li>歌曲2</li>
      </ul>
    `,
    render(data){
      let $el = $(this.el)
      $el.html(this.template)
      let {songs,selectedSongId} = data
      let liList = songs.map((song)=>{
        let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
          if(song.id === selectedSongId){$li.addClass('active')}
            return $li
      })//遍历songs并对这个数组执行函数
        //创建li，并且li的文本为song.name，绑定一个data-song-id，id为song.id
      $el.find('ul').empty()
      liList.map((domLi)=>{
        $el.find('ul').append(domLi)
      })
    },
    deactive(){
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data:{
      songs:[ ],
      selectedSongId:undefined,
    },
    find(){
      var query = new AV.Query('Song');
      return query.find().then((songs)=> {
         this.data.songs = songs.map((song)=>{
          return {id:song.id,...song.attributes}
         })

         return songs
        });
    },

  }
  let controller = {
    init(view, model){
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.bindEventHub()
        this.bindEvents()
        this.getAllSongs()
    },
    getAllSongs(){
      return this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        let songId = e.currentTarget.getAttribute('data-song-id')
          //点击li拿到对应li的id
        this.model.data.selectedSongId = songId
        this.view.render(this.model.data)
          //controller所做的事情就是更新数据，重新调用view
        let data
        let songs = this.model.data.songs
        for(let i=0;i<songs.length;i++){
          if(songs[i].id ===songId){
            data = songs[i]
            break
          }
        }
        //遍历这个songs,得到这个songs的ID，若确定这个songs存在，那么循环结束
        //用户点击list里面的li的时候，
        let string = JSON.stringify(data)
        let object = JSON.parse(string)
          //避免使用之前的内存，将内存深拷贝出来
          //将得到的object传给事件中心，以便song-form可以得到相应的数据并通过view来渲染
        window.eventHub.emit('select',object)
      })
    },
    bindEventHub(){

      window.eventHub.on('create',(songdata)=>{
        this.model.data.songs.push(songdata)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',()=>{
        this.view.deactive()
      })
      window.eventHub.on('updata',(song)=>{
         let songs = this.model.data.songs
          for(let i=0; i<songs.length;i++){
           if(songs[i].id === song.id){
             Object.assign(songs[i],song)
           }
          }
          this.view.render(this.model.data)
      })
    }
  }

  controller.init(view, model)
}