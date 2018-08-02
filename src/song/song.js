{
    let view = {
        el:'#container',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            $(`<style>.container::before,header .cd-wrapper .cd-inner {background-image:url('${data.song.cover}')}</style>`).appendTo('body')
            this.$el.find('header .cd-wrapper .cd-inner').css('background-image',data.song.cover)
            let namepre = data.song.name.split('(')
            name = namepre[0] + '-'
            namelast = namepre[1].split(')')
            nameinner =namelast[0]
            this.$el.find('header .lyrics .name').text(name)
            this.$el.find('header .lyrics .nameinner').text(nameinner)
            let audio = this.$el.find('audio')
            audio.attr('src',data.song.url)
            audio[0].onended = (()=>{
                this.pause()
                window.eventHub.emit('songEnd')
                console.log('end')
            })
            let {lyrics} = data.song
            lyrics.split('\n').map((string)=>{
                console.log(string)
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                if(matches){
                    p.textContent = matches[2]
                    p.setAttribute('data-time',matches[1])
                }else{
                    if(string[0] === '['){
                        p.textContent = ''
                    }else{
                        p.textContent = string
                    }
                }
                this.$el.find('header .lyrics .lyric').append(p)
            })

        },
        play(){
            this.$el.find('audio')[0].play()
            this.$el.find('header .cd-wrapper').addClass('active')
            this.$el.find('header .cd').removeClass('deactive')
        },
        pause(){
            this.$el.find('audio')[0].pause()
            this.$el.find('header .cd-wrapper').removeClass('active')
            this.$el.find('header .cd').addClass('deactive')
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
            },
            status:'playing',
        },
        setId(id){
            this.data.id = id
        },
        get(){
            var query = new AV.Query('Song');
            return query.get(this.data.id).then((song)=>{
                Object.assign(this.data.song,song.attributes)
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
            this.view.$el.on('touchstart','header',()=>{
                if(this.model.data.status === 'playing'){
                    this.view.pause()
                    this.model.data.status = 'paused'
                }else{
                    this.view.play()
                    this.model.data.status = 'playing'
                }
            })
            window.eventHub.on('songEnd',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}