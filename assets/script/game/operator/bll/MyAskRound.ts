import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/SingletonModuleComp";
import { Operator } from "../Operator";

/** 业务层对象 */
@ecs.register('MyAskRound')
export class MyAskRoundComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class MyAskRoundSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MyAskRoundComp);
    }

    entityEnter(e: Operator): void {
        e.OperatorView.get("t3").active = false;
        e.OperatorView.get("t1").active = true;
        e.remove(MyAskRoundComp);
    }
}