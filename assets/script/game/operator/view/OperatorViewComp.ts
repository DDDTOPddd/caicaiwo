import { _decorator, EditBox, Node, Button, director  } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { smc } from "../../common/SingletonModuleComp";
import { Operator } from "../Operator";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../../common/config/GameUIConfig";
import { WECHAT } from "cc/env";

const { ccclass, property } = _decorator;

/** 视图层对象 - 支持 MVVM 框架的数据绑定 */
@ccclass('OperatorViewComp')
@ecs.register('OperatorView', false)
export class OperatorViewComp extends CCVMParentComp {
    /** 脚本控制的界面 MVVM 框架绑定数据 */
    data: any = {};
    
    protected onBind(): void {
        this.onRegisterEvent(this.get("btn_send"), this.onClickSend, false, false);
        this.onRegisterEvent(this.get("btn_submit"), this.onClickSubmit, false, false);
        this.onRegisterEvent(this.get("btn_menu"), this.onClickMenu, true, false);
        
        // this.onRegisterEvent(this.get("btn_say"), this.onClickSay, false, false);
        // this.onRegisterEvent(this.get("btn_sayend"), this.onCLickSayEnd, false, false);
        if (WECHAT) {
            this.get('btn_talk').on(Node.EventType.TOUCH_START, this.onClickSay, this, true);
            this.get('btn_talk').on(Node.EventType.TOUCH_END, this.onCLickSayEnd, this, true);
        }
        

        this.initEvent(`ask`, this.askllm);
    }
    
    askllm() {
        let s: string =
        this.get("LabEdit").getComponent(EditBox).string;
        smc.llm.askQue(s, smc.scene.SceneModel.targetcardId);
            setTimeout(() => {
                smc.operator.ToMyFlopRound();
            },2500);
    }

    onClickSay() {
        smc.yyrecorder.startRecording();
    }
    onCLickSayEnd() {
        smc.yyrecorder.stopRecording();
    }
    
    /** send发送问题=>我方翻牌 */
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
    /** 提交排除=>对方提问 */
    onClickSubmit() {
        smc.scene.SceneView.onClickSubmit();
        if (smc.scene.SceneModel.totalCard == 1) {
            smc.operator.ToFinal(1);
        } else {
            smc.operator.ToOpAskRound();
        }
        
    }
    /** 调出菜单*/
    onClickMenu() {
        oops.gui.open(UIID.Menu);
        director.pause();
    }
    
    close() {
        (this.ent as Operator).remove(OperatorViewComp);
    }
    
    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        oops.gui.remove(UIID.Operator);
        this.node.destroy();
    }
}