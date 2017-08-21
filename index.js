var storage = {
    get(key){
        return JSON.parse(window.localStorage.getItem(key));
    },
    save(key,value){
        window.localStorage.setItem(key,JSON.stringify(value))
    }
}

var list = storage.get('todo') || []
var filterHash = {
    all : function(list){
        return list;
    },
    finish : function(list){
        return list.filter(function(item){
            return item.checked
        });
    },
    unfinish : function(list){
        return list.filter(function(item){
            return !item.checked;
        })
    }
}

const vm = new Vue({
    el : ".main",
    data :{
        list : list,
        todo : "",
        editedTodo : "",
        beforeTodo : "",
        visilibal : 'all'
    },
    watch : {
        list : {
            deep : true,
            handler : function(){
                storage.save("todo",this.list)
            }
        }
    },
    computed:{
        filterList:function(){
            return this.list.filter(function(item){return !item.checked}).length //返回未完成任务的长度
        },
        filterTodo : function(){
            return filterHash[this.visilibal](this.list);
        }
    },
    methods:{
        keyup(e){
            this.list.push({
                title : this.todo,
                checked : false
            })
                this.todo = ""
        },
        deleteTodo:function(todo,e){
            let index = this.list.indexOf(todo);
            this.list.splice(index,1);
        },
        editingTodo:function(todo){
            this.beforeTodo = todo.title;
            this.editedTodo = todo;
        },
        editTodo:function(){
            this.editedTodo = ""
        },
        backTodo:function(todo){
            todo.title      = this.beforeTodo;
            this.editedTodo = "";
        }
    },
    directives:{
        focus:{
            update(el,binding){
                if(binding.value){
                    el.focus();
                }
            }
        }
    }
})
function hashChange(){
    vm.visilibal = window.location.hash.slice(1);
    console.log(vm.visilibal);
}
window.addEventListener("hashchange",hashChange);
hashChange();