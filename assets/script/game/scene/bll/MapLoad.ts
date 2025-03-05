import { Scene } from "../Scene";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ViewUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { SceneViewComp } from "../view/SceneViewComp";
import { UIID } from "../../common/config/GameUIConfig";
import { Prefab } from "cc";

/** 
 * 加载地形资源 
 */
@ecs.register('MapLoad')
export class MapLoadComp extends ecs.Comp {
    reset() { }
}

export class MapLoadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MapLoadComp);
    }

    entityEnter(e: Scene): void {
        // 创建地图显示对象
        var node = ViewUtil.createPrefabNode(`scene/scene`);
        let comp = node.getComponent(SceneViewComp)!;
        e.add(comp);
        node.parent = oops.gui.game;
        e.loadcard();
        oops.audio.playMusic(`music/bgm`);
        e.remove(MapLoadComp);
    }
}