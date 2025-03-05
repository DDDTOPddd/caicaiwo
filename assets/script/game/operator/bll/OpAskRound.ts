import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/SingletonModuleComp";
import { Operator } from "../Operator";

/** 业务层对象 */
@ecs.register('OpAskRound')
export class OpAskRoundComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class OpAskRoundSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(OpAskRoundComp);
    }

    entityEnter(e: Operator): void {
        e.OperatorView.get("t2").active = false;
        e.OperatorView.get("t3").active = true;
        
        let x = this.ChooseQue();
        e.OperatorModel.opQue = e.OperatorModel.questions[`${x}`];
        this.OpAskQue(x);
        setTimeout(() => {
            if (smc.scene.SceneModel.oppototalCard == 1) {
                e.ToFinal(0);
            } else {
                e.ToMyAskRound();
            }
        }, 3500);
        e.remove(OpAskRoundComp);
    }
    /** 选择问题策略 */
    ChooseQue():number {
        let t = smc.operator.OperatorModel.cards_associated[0];
        let min = 24, q = 0;
        min = 24, q = 0;
        for (let i = 1; i <= (smc.operator.OperatorModel.questions.number * 2); i = i + 2){
            if (Math.abs(t[i] - t[i + 1]) < min) {
                min = Math.abs(t[i] - t[i + 1]);
                q = i;
            }
        }
        return (q + 1) / 2;
    }

    /** 提问，k为问题序号 */
    OpAskQue(k: number) {
        console.log("oppo提问：" + smc.operator.OperatorModel.questions[`${k}`]);
        let t = smc.scene.SceneModel.opponent_targetId;
        let s = smc.scene.SceneModel.human[`${t}`];
        switch (k) {
            case 1:
            // ta是男的吗
                if (s.sex == "male") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 2:
            //ta是双马尾
                if (s.hair.style == "bunches") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 3:
            //ta是红头发吗
                if (s.hair.color == "red") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 4:
            //ta是白头发
                if (s.hair.color == "white") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 5:
                //ta是光头吗
                if (s.hair.style == "none") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 6:
                //ta是黄头发吗
                if (s.hair.color == "yellow") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 7:
                //ta的肤色偏白吗
                if (s.skin == "white") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 8:
                //ta的眉毛是黑色的
                if (s.eyebrowcolor == "black") {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 9:
                //ta戴帽子吗
                if (s.decoration.cap != 0){
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 10:
                //ta有胡子
                if (s.hasmustache == true) {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            case 11:
                //ta脸上有疤
                if (s.hasscar == true) {
                    oops.gui.toast("是");
                    this.OpFlopCard(k, -1);
                }
                else {
                    oops.gui.toast("不是");
                    this.OpFlopCard(k, 0);
                }
                break;
            default: break;
        }
        console.log(smc.scene.SceneModel.opponent_cardIsOk);
    }
    OpFlopCard(k: number, pd: number) {      
        (pd == -1) ? console.log("是") : console.log("不是");
        //arr记录要排除的牌的Id
        let arr: number[] = smc.operator.OperatorModel.cards_associated[k * 2 + pd];
        for (let i = 0; i < arr.length; i++){
            if (smc.scene.SceneModel.opponent_cardIsOk[arr[i]]) {
                //一次翻牌改变boolean数组
                smc.scene.SceneModel.opponent_cardIsOk[arr[i]] = false;
                smc.scene.SceneModel.oppototalCard--;
                smc.scene.SceneView.changeop(arr[i]);
                //关联问题能影响的牌数减一
                let q_arr: number[] = smc.operator.OperatorModel.ques_associated[arr[i]];
                for (let j = 0; j < q_arr.length; j++){
                    smc.operator.OperatorModel.cards_associated[0][q_arr[j]]--; 
                }
            }
        }
        console.log("oppo还剩:" + smc.scene.SceneModel.oppototalCard);
        console.log(smc.operator.OperatorModel.cards_associated[0]);

    }





}