{
    let view = {
        el:'#searchSong',
        init(){
            this.$el = $(this.el)
        },
        active(){
            this.$el.addClass('active')
        },
        deactive(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            window.eventHub.on('tabSwitch',(index)=>{
                if(index === 2){
                    this.view.active()
                }else{
                    this.view.deactive()
                }
            })
        }
    }
    controller.init(view,model)
}