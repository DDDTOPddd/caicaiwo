import { _decorator, SpriteAtlas, tween,Node, Vec3 } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../../common/config/GameUIConfig";
import { PopViewParams } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { smc } from "../../common/SingletonModuleComp";
import { Settlement, SettlementConfig } from "../../../windows_easyts/Settlement";
import { HttpEvent, HttpRequest } from "../../../../../extensions/oops-plugin-framework/assets/libs/network/HttpRequest";
import { WECHAT } from "cc/env";


const { ccclass, property } = _decorator;
@ccclass('HomeViewComp')
@ecs.register('HomeViewComp', false)
export class HomeViewComp extends CCVMParentComp{
    data: any = {};
    httpRequest: HttpRequest = new HttpRequest();
    //button
    onBind() {
        //this.onRegisterEvent(this.get(`btn_animal`), this.onClickAnimal,false,false);
        this.onRegisterEvent(this.get(`btn_human`), this.onClickHuman, false, false);
        this.onRegisterEvent(this.get(`btn_battle`), this.onClickBattle, false, false);

        this.get('btn_animal').on(Node.EventType.TOUCH_START, this.onTouchStartCallback, this, true);
        this.get('btn_animal').on(Node.EventType.TOUCH_END, this.onTouchEndCallback, this, true);
    }
    onTouchStartCallback() {
        console.log('TOUCH_START');
    }
    onTouchEndCallback() {
        console.log('TOUCH_End');
    }

    startRecording() {
        smc.yyrecorder.startRecording();
    }
    stopRecording() {
        smc.yyrecorder.stopRecording();
    }

    //单人人物卡
    onClickHuman() {
        if (WECHAT) {
            smc.yyrecorder.moshi = 0;
        }
        smc.scene.loadscene();
        smc.operator.loadOperator();
        oops.gui.remove(UIID.Home);        
    }


    //battle
    onClickBattle() {
        if (WECHAT) {
            smc.yyrecorder.moshi = 1;
        }
        smc.websocketmessage.connectwebsocket();
        oops.gui.open(UIID.BattleWaiting);
    }

    async onClickAnimal() {
        // fetch('http://localhost:3000')
        //     .then(response => response.text())
        //     .then(data => {
        //         console.log('GET request successful:', data);
        //     })
        //     .catch(error => {
        //         console.error('GET request failed:', error);
        //     });
        
        // fetch('http://localhost:3000', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(response => response.text()) // 获取原始响应文本
        // .then(data => {
        //     console.log('POST request successful:', data);
        //     try {
        //         const jsonData = JSON.parse(data); // 尝试手动解析 JSON
        //         console.log('Parsed JSON:', jsonData);
        //     } catch (error) {
        //         console.error('Error parsing JSON:', error);
        //     }
        // })
        // .catch(error => {
        //     console.error('POST request failed:', error);
        // });
    }
    
    // 弹窗动画
    private getPopCommonEffect(callbacks?: PopViewParams) {
	    let newCallbacks: PopViewParams = {
		    // 节点添加动画
            onAdded: (node, params) => {
                node.setScale(0.1, 0.1, 0.1);
                tween(node).to(0.2, { scale: new Vec3(1, 1, 1) }).start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
            tween(node).to(0.2, { scale: new Vec3(0.1, 0.1, 0.1) }).call(next).start();
            },
	    }

	    if (callbacks) {
            if (callbacks && callbacks.onAdded) {
                let onAdded = callbacks.onAdded;
                callbacks.onAdded = (node: Node, params: any) => {
                onAdded(node, params);
                newCallbacks.onAdded(node, params);
                };
            }

            if (callbacks && callbacks.onBeforeRemove) {
                let onBeforeRemove = callbacks.onBeforeRemove;
                callbacks.onBeforeRemove = (node, params) => {
                    onBeforeRemove(node, params);
                    newCallbacks.onBeforeRemove(node, params);
                };
            }
            return callbacks;
        }
        return newCallbacks;
    }

    reset() {
        this.node.destroy();
    }
}
