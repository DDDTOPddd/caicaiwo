import { WECHAT } from "cc/env";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { smc } from "../common/SingletonModuleComp";

/** Websocket 模块 */
@ecs.register(`Websocket`)
export class Websocket extends ecs.Entity {
    //ws: WebSocket;
    ws:any;
    ID: number;
    protected init() {
        if (WECHAT) {
            wx.cloud.init();
        }
        
    }

    /** 模块资源释放 */
    destroy() {
        // 注: 自定义释放逻辑，视图层实现 ecs.IComp 接口的 ecs 组件需要手动释放
        super.destroy();
    }

    async connectwebsocket() {
        if (WECHAT) {
            let that = this;
            const { socketTask } = await wx.cloud.connectContainer({
                config: {
                    env: 'ddd-easywebsocket-5e1m4xcf6dad1c',
                },
                service: 'ws',
                path: '/ws'
            })
            socketTask.onMessage(function (res) {
                try {
                    const jsonData = JSON.parse(res.data);
                    console.log('收到的 JSON 数据：', jsonData);
                    
                } catch (error) {
                    console.log('非JSON 数据:');
                    console.log(res.data);

                    if (res.data.includes('您的ID是:')) {
                        const id = parseInt(res.data.split(':')[1]);
                        that.ID = id;
                    } else if (res.data.includes('start_game')) {
                        that.startgame();
                    } else if (res.data.includes('对手提问：')) {
                        let s = res.data.split('对手提问：')[1];
                        // 数据传递
                        smc.battle.BattleModel.opQue = s;
                        smc.battle.BattleModel.isAsked = true;
                    } else if (res.data.includes('对手剩余：')) {
                        let s = parseInt(res.data.split('对手剩余：')[1]);
                        // 数据传递
                        smc.battle.BattleModel.oppototalCard = s;
                        smc.battle.BattleModel.isFlopped = true;
                    } else if (res.data.includes('对手退出')) {
                        oops.message.dispatchEvent("OppoOut");
                    } else if (res.data.includes('对手结算')) {
                        let s = res.data.split('结算')[1];
                        if (s == `输了`) {
                            oops.message.dispatchEvent("OppoLose");
                        } else {
                            oops.message.dispatchEvent("OppoWin");
                        }
                    } else {
                        // 其他情况处理
                    }



                }
            });
            socketTask.onOpen(async function (res) {
                console.log('【WEBSOCKET】', '链接成功！')
            })
            socketTask.onClose(async function () {
                console.log('【WEBSOCKET】链接关闭！')
            })
            this.ws = socketTask;
        } else {
            this.ws = new WebSocket('wss://ws-ddd-easywebsocket-5e1m4xcf6dad1c-1328212923.ap-shanghai.run.wxcloudrun.com/ws');
            this.ws.onopen = () => {
                console.log('WebSocket 连接已建立');
            };

            this.ws.onmessage = (event) => {
                try {
                    const jsonData = JSON.parse(event.data);
                    console.log('收到的 JSON 数据：', jsonData);

                    // 在这里处理收到的 JSON 数据
                } catch (error) {
                    console.log('非JSON 数据:');
                    console.log(event.data);

                    // 检查是否是特殊信息字符串
                    if (event.data.includes('您的ID是:')) {
                        const id = parseInt(event.data.split(':')[1]);
                        this.ID = id;
                    } else if (event.data === 'start_game') {
                        this.startgame();
                    } else if (event.data.includes('对手提问：')) {
                        let s = event.data.split('对手提问：')[1];
                        //数据传递
                        smc.battle.BattleModel.opQue = s;
                        smc.battle.BattleModel.isAsked = true;
                    } else if (event.data.includes('对手剩余：')) {
                        let s = parseInt(event.data.split('对手剩余：')[1]);
                        //数据传递
                        smc.battle.BattleModel.oppototalCard = s;
                        smc.battle.BattleModel.isFlopped = true;
                    } else if (event.data.includes('对手退出')) {
                        oops.message.dispatchEvent("OppoOut");
                    } else if (event.data.includes('对手结算')) {
                        let s = event.data.split('结算')[1];
                        
                        console.log(event.data)
                        console.log(s)

                        if (s == `输了`) {
                            oops.message.dispatchEvent("OppoLose");
                        } else {
                            oops.message.dispatchEvent("OppoWin");
                        }
                    } else {

                    }
                }
            };
        }
        
      

        
        
    }


    startgame() {
        console.log('oooooooooooooooooo')
        oops.gui.remove(UIID.BattleWaiting);
        oops.gui.remove(UIID.Home);
        smc.battle.loadBattleScene();
    }

    sendAskQue(s: string) {
        if (WECHAT) { this.ws.send({ data: `对手提问：${s}` }); }
        else { this.ws.send(`对手提问：${s}`); }
    }

    sendFlopCards(x: number) {
        if (WECHAT) {
            this.ws.send({ data: `对手剩余：${x}` });
        } else {
            this.ws.send(`对手剩余：${x}`);
        }
    }

    sendOut() {
        if (WECHAT) {
            this.ws.send({data:'对手退出了' });
        } else {
            this.ws.send('对手退出了');
        }
    }

    sendWin() {
        if (WECHAT) {
            this.ws.send({data:'对手结算赢了'});
        } else {
            this.ws.send('对手结算赢了');
        }
        
    }

    sendLose() {
        if (WECHAT) {
            this.ws.send({data:'对手结算输了'});
        } else {
            this.ws.send('对手结算输了');
        }
        
    }

    closeconnect() {
        this.ws.close();
    }
}

