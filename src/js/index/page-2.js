{
    let view = {
        el:'#hot-sl',
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
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            window.eventHub.on('tabSwitch',(index)=>{
                if(index === 1){
                    this.view.active()
                }else{
                    this.view.deactive()
                }
            })
            this.view.$el.on('touchstart','.moreMessage',(e)=>{
                e.preventDefault()
                console.log('阻止事件')
                window.eventHub.emit('lookAll')
            })
        }
    }
    controller.init(view,model)
}