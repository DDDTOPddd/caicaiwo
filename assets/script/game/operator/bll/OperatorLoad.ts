import { UICallbacks } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../../common/config/GameUIConfig";
import { smc } from "../../common/SingletonModuleComp";
import { Operator } from "../Operator";
import { OperatorViewComp } from "../view/OperatorViewComp";
import { MyAskRoundComp } from "./MyAskRound";
import { Node } from "cc";
/** 业务层对象 */
@ecs.register('OperatorLoad')
export class OperatorLoadComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class OperatorLoadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(OperatorLoadComp);
    }

    entityEnter(e: Operator): void {

        var callbacks: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                smc.operator.add(node.getComponent(OperatorViewComp) as ecs.Comp);
            }
        };
        oops.gui.open(UIID.Operator, null, callbacks);

        
        JsonUtil.load(`HumanCardQue`, (h: any) => {
            e.OperatorModel.cards_associated = h.QueCards;
            e.OperatorModel.questions= h.Ques;
            //计算出oppo卡牌-问题索引
            e.OperatorModel.ques_associated = new Array(25).fill(0).map(() => new Array());
            for (let i = 1; i <= 24; i++){
                for (let j = 1; j <= (smc.operator.OperatorModel.questions.number * 2); j++){
                    if (e.OperatorModel.cards_associated[j].indexOf(i) != -1) {
                        e.OperatorModel.ques_associated[i].push(j);
                    }
                }
            }
            //console.log(e.OperatorModel.ques_associated);
        });
        setTimeout(() => {
            e.ToMyAskRound();
            e.remove(OperatorLoadComp);    
        }, 200);
        
    }
}