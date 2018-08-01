{
    let view = {
        el:'#container',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {
        data:{
            song:{
                name:'',
                singer:'',
                url:'',
                id:'',
                cover:'',
                lyrics:''
            }
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
                console.log(song)
                this.view.play()
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
            this.view.$el.delegate('.container::before').css('background-url',this.model.data.song.cover)
            this.view.$el.on('touchstart',()=>{
                if(this.view.$el.delegate())

            })
        }
    }
    controller.init(view,model)
}