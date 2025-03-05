import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Operator } from "../Operator";

/** 业务层对象 */
@ecs.register('MyFlopRound')
export class MyFlopRoundComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class MyFlopRoundSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MyFlopRoundComp);
    }

    entityEnter(e: Operator): void {
        // 注：自定义业务逻辑
        e.OperatorView.get("t1").active = false;
        e.OperatorView.get("t2").active = true;
        e.remove(MyFlopRoundComp);
    }
}