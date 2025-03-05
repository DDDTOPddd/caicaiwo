import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Battle } from "../Battle";

/** 
 * BattleReady
 * 地图和卡片局面初始化后的准备阶段
 * 可以处理双方接下来进入的回合
 */
@ecs.register('BattleReady')
export class BattleReadyComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class BattleReadySystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BattleReadyComp);
    }

    entityEnter(e: Battle): void {
        e.BattleModel.round = 0;

        if (e.BattleModel.isFirst) {
            e.ToMyAskRound();
            console.log("提问")
        } else {
            e.ToWaiting();
            console.log("等待")
        }


        e.remove(BattleReadyComp);
    }
}