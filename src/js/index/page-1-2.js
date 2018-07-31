{
    let view;
    view = {
        el: '#songList',
        init() {
            this.$el = $(this.el)
        },
        template:`
             <li>
                <div>
                <p>{{name1}}<span>{{name2}}</span></p>
                <p>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-sq"></use>
                    </svg>
                {{singer}}</p>
                </div>
                <a href="./song.html?id={{id}}">
                    <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-bofang"></use>
                    </svg>
                </a>
             </li>
            `,
        render(data) {
            let {songs} = data
            songs.map((song)=>{
            let names = song.name.split('(')
            let name1 = names[0]
            let name2 = names[1]
                if(name2 === undefined){
                    name2 = ''
                }else{
                    name2 = '('+ names[1]
                }
            let $li = $(this.template
                .replace('{{name1}}',name1)
                .replace('{{name2}}',name2)
                .replace('{{singer}}',song.singer)
                .replace('{{id}}',song.id)
            )
            this.$el.append($li)
            })

        }

    };
    let model = {
        data:{
            songs: []
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=> {
                this.data.songs = songs.map((song)=>{
                    return Object.assign({id:song.id},song.attributes)
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
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })

        },
        bindEvents(){
        }
    }
    controller.init(view,model)

}