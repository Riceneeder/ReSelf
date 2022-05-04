// const axios = require('axios');
//好友，群组，插件的启用选择
/**
 * 列表中开关切换触发
 */
class Select{
    // TODO
    selectFrined(event,id){
        if(event.target.checked){
            console.log('checked','接收好友QQ=>',id)
        }else{
            console.log('unchecked','屏蔽好友QQ=>',id)
        }
    }
    selectGroup(event,id){
        if(event.target.checked){
            console.log('checked','接收群QQ=>',id)
        }else{
            console.log('unchecked','屏蔽群QQ=>',id)
        }
    }
    selectPlugin(event,plug_name){
        if(event.target.checked){
            console.log('checked','启用插件=>',plug_name)
        }else{
            console.log('unchecked','禁用插件=>',plug_name)
        }
    }
}
/**
 * 渲染好友，群，插件列表
 */
class Render{
    #getList_All(){
        return new Promise((resolve,reject)=>{
            axios('/ListAll').then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err)
            })
        })
    }
    #getList_Is_Using(){
        return new Promise((resolve,reject)=>{
            axios('/UsingList').then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err)
            })
        })
    }
    #friend_item(friend_name,friend_id,checked){
        if(friend_name.length>9){friend_name = friend_name.substring(0,8)}
        let item = `                                    <xy-col span="8" style="backdrop-filter: blur(10px);border-radius: 5px;">
        <div class="layui-card" style="background-image: url('http://q1.qlogo.cn/g?b=qq&nk=${friend_id}&s=640');background-size: cover;background-attachment: fixed;">
            <div class="layui-card-header" style="backdrop-filter: blur(10px);background-color: rgba(0, 0, 0, 0.356);color: rgb(255, 255, 255);">
                <!-- 9个字符 -->
                ${friend_name}
            </div>
            <div class="layui-card-body">
              <xy-switch onchange="select.selectFrined(event,${friend_id})" ${checked?'checked':null}></xy-switch>
              <xy-button type="primary" icon="message-fill" onclick="sendToFriend(${friend_id})"></xy-button>
            </div>
        </div>                                    
    </xy-col>`
        return item;
    }
    #group_item(group_name,group_id,checked){
        if(group_name.length>9){group_name = group_name.substring(0,8)}
        let item = `<xy-col span="8" style="backdrop-filter: blur(10px);border-radius: 5px;">
        <div class="layui-card" style="background-image: url('http://q1.qlogo.cn/g?b=qq&nk=${group_id}&s=640');background-size: cover;background-attachment: fixed;">
            <div class="layui-card-header" style="backdrop-filter: blur(10px);background-color: rgba(0, 0, 0, 0.356);color: rgb(255, 255, 255);">
                ${group_name}
            </div>
            <div class="layui-card-body">
              <xy-switch onchange="select.selectGroup(event,${group_id})" ${checked?'checked':null}></xy-switch>
              <xy-button type="primary" icon="message-fill" onclick="sendToGroup(${group_id})"></xy-button>
            </div>
        </div>                                    
    </xy-col>`
        return item;
    }
    #plug_item(plug_name,checked){
        let item =`                                <xy-col span="8">
        <div class="layui-card">
            <div class="layui-card-header">${plug_name}</div>
            <div class="layui-card-body">
              <xy-switch onchange="select.selectPlugin(event,'${plug_name}')" ${checked?'checked':null}></xy-switch>
            </div>
        </div>
    </xy-col>`
        return item;
    }
    async renderFriendList(){
        let _all_friend_list = await this.#getList_All();
        let all_friend_list = _all_friend_list.friend;
        let _using_friend_list = await this.#getList_Is_Using();
        let using_friend_list = _using_friend_list.friend;
        let render_content = '';
        for (let i = 0; i < all_friend_list.length; i++) {
            if(using_friend_list.find(item=>{return JSON.stringify(item) == JSON.stringify(all_friend_list[i])})!=undefined){
                render_content += this.#friend_item(all_friend_list[i].name,all_friend_list[i].id,true);
            }else{
                render_content += this.#friend_item(all_friend_list[i].name,all_friend_list[i].id,false);
            }
        }
        document.getElementById('friend-list-box').innerHTML = render_content;
    }
    async renderGroupList(){
        let _all_group_list = await this.#getList_All();
        let _using_group_list = await this.#getList_Is_Using();
        let all_group_list = _all_group_list.group;
        let using_group_list = _using_group_list.group;
        let render_content = '';
        for (let i = 0; i < all_group_list.length; i++) {
            if(using_group_list.find(item=>{return JSON.stringify(item) == JSON.stringify(all_group_list[i])})!=undefined){
                render_content += this.#group_item(all_group_list[i].name,all_group_list[i].id,true);
            }else{
                render_content += this.#group_item(all_group_list[i].name,all_group_list[i].id,false);
            }            
        }
        document.getElementById('group-list-box').innerHTML = render_content;
    }
    async renderPluginList(){
        let _all_plugin_list =await this.#getList_All();
        let _using_plugin_list =await this.#getList_Is_Using();
        let all_plugin_list =_all_plugin_list.plugin;
        let using_plugin_list =_using_plugin_list.plugin;
        let render_content = '';
        for (let i = 0; i < all_plugin_list.length; i++) {
            if(using_plugin_list.find(item=>{return JSON.stringify(item) == JSON.stringify(all_plugin_list[i])})!=undefined){
                render_content += this.#plug_item(all_plugin_list[i].name,true);
            }else{
                render_content += this.#plug_item(all_plugin_list[i].name,false);
            }
        }
        document.getElementById('plugin-list-box').innerHTML = render_content;
    }
}
//弹幕
const screen = new BulletJs('#danmuku',{
    trackHeight:100,
});
function add_danmuku(text){
    let dom = `
                <div style="padding: 5px;backdrop-filter: blur(10px);background-color: rgba(0, 0, 0, 0.356);color: rgb(255, 255, 255);border-radius: 5px;">
                💬${text}
                </div>
`;
    screen.push(dom,{},true);
}
//发送消息
function sendToFriend(target_id){
    XyDialog.prompt({
        title:'发送一条私聊消息',
        oktext:'发送',//确定键文本
        ok:function(value){
            console.log('发送私聊消息：',value,`=>${target_id}`);
            //TODO按确定键的操作
        },
        content:'你没有手机QQ吗？？？',
    });
}
function sendToGroup(target_id){
    XyDialog.prompt({
        title:'发送一条群消息',//标题
        oktext:'发送',//确定键文本
        ok:function(value){
            console.log('发送群消息：',value,`=>${target_id}`);
            //TODO按确定键的操作
        },
        content:'你都在用机器人了还手动发消息？？？',
    });
}
const select = new Select;
const render = new Render;

