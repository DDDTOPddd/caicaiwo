import { _decorator, Button, color, Node, Sprite } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { Operator } from "../../operator/Operator";
import { smc } from "../../common/SingletonModuleComp";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Scene } from "../Scene";

const { ccclass, property } = _decorator;

/** 视图层对象 - 支持 MVVM 框架的数据绑定 */
@ccclass('SceneViewComp')
@ecs.register('SceneView', false)
export class SceneViewComp extends CCVMParentComp {

    /** 脚本控制的界面 MVVM 框架绑定数据 */
    data: any = {};
    btns: Node[] = new Array(25);
    btns_is_ok: boolean[] = new Array(25);
    
    //button
    onBind() {
        for (let i = 1; i <= 24; i++){
            this.onRegisterEvent(this.get(`btn_${i}`),() => this.onClickCard(i),true,false);
        }
        
    }
    start(): void {
        for (let i = 1; i <= 24; i++){
            this.btns[i] = this.get(`btn_${i}`);
            this.btns_is_ok[i] = true;
        }
    }

    /** 卡牌点击
     */
    onClickCard(x: number) {
        let button = this.btns[x].getComponent(Button);
        if (this.btns_is_ok[x]) {
            if (smc.scene.SceneModel.totalCard > 1) {
                //常黑
                button.normalColor = color(0, 0, 0, 255);
                //悬停透光
                button.hoverColor = color(0, 0, 0, 200);
                //按下透光
                button.pressedColor = color(0, 0, 0, 200);
                this.btns_is_ok[x] = false;
                //监听当前卡牌数
                smc.scene.SceneModel.totalCard --;
            } else {
                oops.gui.toast(`只剩一张牌了`);
            }
            
        }
        else {
            button.normalColor = color(0, 0, 0, 0);
            button.hoverColor = color(255, 255,255, 100);
            button.pressedColor = color(0, 0, 0, 255);
            this.btns_is_ok[x] = true;
            smc.scene.SceneModel.totalCard++;
        }
    }

    /** 提交:锁定排除的卡牌 */
    onClickSubmit(): void{
        for (let i = 1; i <= 24; i++){
            if (!this.btns_is_ok[i] && this.btns[i].getComponent(Button).interactable) {
                this.btns[i].getComponent(Button).interactable = false;
            }    
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

    changeop(x: number) {
        this.get(`op${x}`).getComponent(Sprite).color = color(0, 0, 0, 255);
    }
    close() {
        (this.ent as Scene).remove(SceneViewComp);
    }
    reset() {
        this.node.destroy();
    }
    
}