import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ViewUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Battle } from "../Battle";
import { BattleSceneViewComp } from "../view/BattleSceneView";

/** 
 * 加载对战地图
 */
@ecs.register('BattleSceneLoad')
export class BattleSceneLoadComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {}
}

/** 业务层业务逻辑处理对象 */
export class BattleSceneLoadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BattleSceneLoadComp);
    }

    entityEnter(e: Battle): void {
        // 创建地图显示对象
        var node = ViewUtil.createPrefabNode(`scene/battlescene`);
        let comp = node.getComponent(BattleSceneViewComp)!;
        e.add(comp);
        node.parent = oops.gui.game;
        e.loadCard();
        oops.audio.playMusic(`music/bgm`);
        e.remove(BattleSceneLoadComp);
    }
}