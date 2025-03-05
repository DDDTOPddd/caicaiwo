import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Battle } from "../Battle";

/** 业务层对象 */
@ecs.register('BattleMyFlopRound')
export class BattleMyFlopRoundComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class BattleMyFlopRoundSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BattleMyFlopRoundComp);
    }

    entityEnter(e: Battle): void {
        e.BattleSceneView.get("t1").active = false;
        e.BattleSceneView.get("t2").active = true;

        e.remove(BattleMyFlopRoundComp);
    }
}