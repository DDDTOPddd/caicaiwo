import { _decorator,Button,color,director,EditBox,Node } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { smc } from "../../common/SingletonModuleComp";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Battle } from "../Battle";
import { UIID } from "../../common/config/GameUIConfig";
import { SettlementConfig } from "../../../windows_easyts/Settlement";
import { BattleWaitingComp } from "../bll/BattleWaiting";
import { BattleWaitFlopComp } from "../bll/BattleWaitFlop";
import { WECHAT } from "cc/env";

const { ccclass, property } = _decorator;

/** 视图层对象 - 支持 MVVM 框架的数据绑定 */
@ccclass('BattleSceneViewComp')
@ecs.register('BattleSceneView', false)
export class BattleSceneViewComp extends CCVMParentComp {
    /** 脚本控制的界面 MVVM 框架绑定数据 */
    data: any = {};

    btns: Node[] = new Array(25);
    btns_is_ok: boolean[] = new Array(25);



    onBind() {
        for (let i = 1; i <= 24; i++){
            this.onRegisterEvent(this.get(`btn_${i}`),() => this.onClickCard(i),true,false);
        }
        this.onRegisterEvent(this.get("btn_send"), this.onClickSend, false, false);
        this.onRegisterEvent(this.get("btn_submit"), this.onClickSubmit, false, false);
        this.onRegisterEvent(this.get("btn_menu"), this.onClickMenu, false, false);
        if (WECHAT) {
            this.get('btn_talk').on(Node.EventType.TOUCH_START, this.onClickSay, this, true);
            this.get('btn_talk').on(Node.EventType.TOUCH_END, this.onCLickSayEnd, this, true);
        }


        this.initEvent(`battleask`, this.askllm);



        this.initEvent('OppoOut', () => {
            oops.gui.open(UIID.Home);
            oops.audio.stopAll();
            smc.websocketmessage.closeconnect();
            this.close();
        },)
        this.initEvent('OppoLose', () => {
            console.log('win');
            smc.websocketmessage.closeconnect();
            let parms: SettlementConfig = {
                title: "You Win!",
                content: `对手先排除完牌\n不幸的是，ta排除错了`,
                backFunc: () => {
                    oops.gui.open(UIID.Home);
                    oops.audio.stopAll();
                    smc.battle.BattleSceneView.close();
                }
            }
            oops.gui.open(UIID.Settlement, parms);
        },)
        this.initEvent('OppoWin', () => {
            console.log('lose');
            smc.websocketmessage.closeconnect();
            let parms: SettlementConfig = {
                title: "You Lose!",
                content: `对手先排除完牌`,
                backFunc: () => {
                    oops.gui.open(UIID.Home);
                    oops.audio.stopAll();
                    smc.battle.BattleSceneView.close();
                }
            }
            oops.gui.open(UIID.Settlement, parms);
        },)


    }

    onClickSay() {
        smc.yyrecorder.startRecording();
    }
    onCLickSayEnd() {
        smc.yyrecorder.stopRecording();
        
    }

    start(): void {
        for (let i = 1; i <= 24; i++){
            this.btns[i] = this.get(`btn_${i}`);
            this.btns_is_ok[i] = true;
        }
    }

    onClickSend(): void{
        let s: string =
            this.get("LabEdit").getComponent(EditBox).string;
        if (s == "") {
            console.log(`未输入问题`);
        }
        else {
            smc.llm.askQue(s, 0);
        }    
    }
    askllm() {
        let s: string =
        this.get("LabEdit").getComponent(EditBox).string;
        smc.llm.askQue(s, smc.battle.BattleModel.targetcardId);
        //向服务器发送消息
        smc.websocketmessage.sendAskQue(s);

        setTimeout(() => {
                smc.battle.ToMyFlopRound();
            },2500);
    }

    onClickSubmit() {
        //禁用排除的卡
        for (let i = 1; i <= 24; i++){
            if (!this.btns_is_ok[i] && this.btns[i].getComponent(Button).interactable) {
                this.btns[i].getComponent(Button).interactable = false;
            }    
        }
        if (smc.battle.BattleModel.totalCard == 1) {
            smc.battle.ToFinal();
        } else {
            smc.websocketmessage.sendFlopCards(smc.battle.BattleModel.totalCard);
            smc.battle.ToWaiting();
        }
    }


    /** 卡牌点击
     */
    onClickCard(x: number) {
        let button = this.btns[x].getComponent(Button);
        if (this.btns_is_ok[x]) {
            if (smc.battle.BattleModel.totalCard > 1) {
                //常黑
                button.normalColor = color(0, 0, 0, 255);
                //悬停透光
                button.hoverColor = color(0, 0, 0, 200);
                //按下透光
                button.pressedColor = color(0, 0, 0, 200);
                this.btns_is_ok[x] = false;
                //监听当前卡牌数
                smc.battle.BattleModel.totalCard --;
            } else {
                oops.gui.toast(`只剩一张牌了`);
            }
            
        }
        else {
            button.normalColor = color(0, 0, 0, 0);
            button.hoverColor = color(255, 255,255, 100);
            button.pressedColor = color(0, 0, 0, 255);
            this.btns_is_ok[x] = true;
            smc.battle.BattleModel.totalCard++;
        }
    }

    /** 最后一张卡 */
    lastCard(): number{
        for (let i = 1; i <= 24; i++){
            if (this.btns_is_ok[i]) {
                return i;
            }
        }
        return 0;
    }

    onClickMenu() {
        oops.gui.open(UIID.Menu_battle);
    }
    
    close() {
        oops.audio.stopAll();
        (this.ent as Battle).remove(BattleWaitingComp);
        (this.ent as Battle).remove(BattleWaitFlopComp);
        (this.ent as Battle).remove(BattleSceneViewComp);
    }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}