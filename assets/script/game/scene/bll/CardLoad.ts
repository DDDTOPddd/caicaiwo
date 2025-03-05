import { Scene } from "../Scene";
import { ViewUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/SingletonModuleComp";
import { ArrayUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/ArrayUtil";
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";
import { UiHelp } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/UiHelp";

/** 加载卡组 */
@ecs.register('CardLoad')
export class CardLoadComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class CardLoadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CardLoadComp);
    }

    entityEnter(e: Scene): void {
        e.SceneModel.targetcardId = getRandomInt(1, 24);
        e.SceneModel.opponent_targetId = getRandomInt(1, 24);
        e.SceneModel.totalCard = 24;
        e.SceneModel.oppototalCard = 24;

        console.log(`MyTargetId:` + e.SceneModel.targetcardId);
        console.log(`OPPO_TargetId:` + e.SceneModel.opponent_targetId);

        //生成对方卡片
        for (let i = 0; i <= 23; i++){
            let p = e.SceneView.get(`op${i + 1}`);
            UiHelp.SetSpriteFrame(p, `gui/card/${i+1}`);
        }
        let p = e.SceneView.get(`op_target_card`);
        UiHelp.SetSpriteFrame(p, `gui/card/${e.SceneModel.opponent_targetId}`);
        
        /** 己方卡组随机生成 */
        //ArrayUtil.fisherYatesShuffle(e.SceneModel.cardId);
        for (let i = 0; i <= 23; i++){
            let node = ViewUtil.createPrefabNode(`scene/cardprefab/card${e.SceneModel.cardId[i]}`);
            let p = e.SceneView.get(`p${i+1}`);
            node.parent = p;
            node.setSiblingIndex(0);
        }
        JsonUtil.load(`HumanCardConf`, (h: any) => {
            e.SceneModel.human = h;
        });
        e.remove(CardLoadComp);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}