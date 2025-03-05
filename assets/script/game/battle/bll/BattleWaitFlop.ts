import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/SingletonModuleComp";
import { Battle } from "../Battle";


/** 业务层对象 */
@ecs.register('BattleWaitFlop')
export class BattleWaitFlopComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class BattleWaitFlopSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BattleWaitFlopComp);
    }

    entityEnter(e: Battle): void {
        e.BattleModel.isFlopped = false;

        this.check();
    }
    check() {
        if (smc.battle.BattleModel.isFlopped) {
            smc.battle.ToMyAskRound();
            smc.battle.remove(BattleWaitFlopComp);
            return
        } else {
            setTimeout(() => {
                this.check();
            }, 200);
        }
        
    }
}