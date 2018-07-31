{
    let view = {
        el:'#app',
        template:`
        <audio src="{{url}}" controls></audio>
        <div>
                <button id="play">播放</button>
                <button id="pause">暂停</button>
        </div>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.html(this.template.replace('{{url}}',data.url))
        },
        play(){
            let audio = this.$el.find('audio')[0]
            audio.play()
        },
        pause(){
            let audio = this.$el.find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        setId(id){
            this.data.id = id
        },
        get(){
            var query = new AV.Query('Song');
            return query.get(this.data.id).then((song)=>{
                Object.assign(this.data,song.attributes)
                return song
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.setId(id)
            this.model.get().then((song)=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        getSongId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search =search.substring(1)
            }
            let array = search.split('&').filter((v)=>v)
            let id = ''
            for(let i=0;i<array.length;i++){
                let kv = array[i].split('=')
                let k = kv[0]
                let v = kv[1]
                if(k === 'id'){
                    id = v
                    break;
                }
            }
            return id
        },
        bindEvents(){
            this.view.$el.on('touchstart','#play',()=>{
                this.view.play()
            })
            this.view.$el.on('touchstart','#pause',()=>{
                this.view.pause()
            })

        }
    }
    controller.init(view,model)
}