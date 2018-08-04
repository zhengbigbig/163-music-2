{
    let view = {
        el:'#rec-img',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let liTags = this.$el.find('li')
            for(let i=0;i<liTags.length;i++){
                let li = this.$el.find('li')[i]
                $(li).find('span').eq(1).text(data[i])

            }
        }
    }
    let model = {
        data: {
            id: '5b649d3767f35600356d5cc7',
            number:{}
        },
        get(){
            var dates = new AV.Query('Dates');
            return dates.get(this.data.id).then((data)=> {
                let array = data.attributes.number
                Object.assign(this.data.number,array)
                return data
            })
        },
        updata(arr){
            var dates = AV.Object.createWithoutData('Dates',this.data.id );
            // 修改属性
            dates.set('number',arr);
            // 保存到云端
            return dates.save().then((data)=>{
                Object.assign(this.data.number,data.attributes.number)
                return data
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.get().then((data)=>{
                console.log(data)
                console.log(this.model.data)
                this.view.render(this.model.data.number)
            })
            this.bindEvents()

        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                let index = $(e.currentTarget).index()
                let num = this.model.data.number[index] -0
                console.log(num)
                num +=1
                console.log(num)
                this.model.data.number[index] = num +""
                let value = this.model.data.number[index]
                Object.assign(this.model.data.number,{index:value})
                let obj = this.model.data.number
                let arr = []
                for(let key in obj){
                    arr.push(obj[key])
                }

                this.model.updata(arr).then((data)=>{
                    this.view.render(arr)
                })
            })
        }
    }
    controller.init(view,model)
}

// var Dates = AV.Object.extend('Dates');
// // 新建对象
// var date = new Dates();
// // 设置名称
// date.set('number',['111','111','111','111','22','22']);
// // 设置优先级
// date.save()