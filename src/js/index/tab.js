{
    let view = {
        el:'#header',
        init(){
            this.$el = $(this.el)
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
            this.view.$el.find('.navBar > li').eq(0).addClass('active')
           this.view.$el.on('click','.navBar > li',function (e) {
               let $li = $(e.currentTarget)
               let index = $li.index()
               $li.addClass('active')
                   .siblings().removeClass('active')
               window.eventHub.emit('tabSwitch',index)

           })
        }

    }
    controller.init(view,model)
}