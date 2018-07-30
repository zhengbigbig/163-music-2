{
    let view = {
        el:'#recMusic',
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
            this.loadModule1()
            this.loadModule2()
        },
        bindEvents(){
            window.eventHub.on('tabSwitch',(index)=>{
                if(index === 0){
                    this.view.active()
                }else{
                    this.view.deactive()
                }
            })
        },
        loadModule1(){
            let script1 = document.createElement('script')
            script1.src = 'js/index/page-1-1.js'
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2 = document.createElement('script')
            script2.src = 'js/index/page-1-2.js'
            document.body.appendChild(script2)
        }
    }
    controller.init(view,model)
}