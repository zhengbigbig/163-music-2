{
    let view = {
        el:'#songList',
        init(){
            this.$el = $(this.el)
        },
        template:`<li>
                <div>
                <p>__name__</p>
                <p>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-sq"></use>
                    </svg>
                __singer__</p>
                </div>
                <a href="__url__">
                    <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-bofang"></use>
                    </svg>
                </a>
            </li>`,
        render(data){
            {name,singer,url} = data
            this.$el.html(this.template.replace('__url__',data.url))
        }

    }
    let model = {
        data:{
            songs: []
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=> {
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
            this.model.find().then((songs)=>{
                console.log(this.model.data)
                this.view.render(songs)
            })
        },
        bindEvents(){

        }
    }
    controller.init(view,model)

}