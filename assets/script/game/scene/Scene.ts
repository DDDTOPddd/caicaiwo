import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { HomeViewComp } from "../homepage/view/HomeViewComp";
import { Node } from "cc";
import { SceneViewComp } from "./view/SceneViewComp";
import { ViewUtil } from "../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { MapLoadComp, MapLoadSystem } from "./bll/MapLoad";
import { SceneModelComp } from "./model/SceneModel";
import { CardLoadComp, CardLoadSystem } from "./bll/CardLoad";


/** scene 模块 */
@ecs.register(`Scene`)
export class Scene extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    SceneModel!: SceneModelComp;

    /** ---------- 业务层 ---------- */
    // SceneBll!: SceneBllComp;

    /** ---------- 视图层 ---------- */
    SceneView!: SceneViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
        this.addComponents(
            SceneModelComp,
        );
        this.SceneModel.vmAdd();
    }

    /** 加载并显示地图 */
    loadscene() {
        this.add(MapLoadComp);
    }
    /** 加载卡牌 */
    loadcard() {
        this.add(CardLoadComp);
    }
    /** 模块资源释放 */
    destroy() {
        this.remove(SceneViewComp);
        this.SceneModel.vmRemove();
        super.destroy();
    }


}

/** scene 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsSceneSystem extends ecs.System {
    constructor() {
        super();
        this.add(new MapLoadSystem());
        this.add(new CardLoadSystem());
    }
}
