import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/SingletonModuleComp";
import { Battle } from "../Battle";

/** 业务层对象 */
@ecs.register('BattleWaiting')
export class BattleWaitingComp extends ecs.Comp {
    reset() {
    }
}

/** 业务层业务逻辑处理对象 */
export class BattleWaitingSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BattleWaitingComp);
    }

    entityEnter(e: Battle): void {
        e.BattleModel.isAsked = false;
        e.BattleSceneView.get("t3").active = true;
        e.BattleSceneView.get("t2").active = false;
        e.BattleSceneView.get("t1").active = false;
        this.check();
    }

    check() {
        if (smc.battle.BattleModel.isAsked) {
            smc.battle.ToWaitingFlop();
            smc.battle.remove(BattleWaitingComp);
            return
        } else {
            setTimeout(() => {
                this.check();
            }, 200);
        }
    }
}