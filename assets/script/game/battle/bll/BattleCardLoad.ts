import { UiHelp } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/UiHelp";
import { ViewUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/SingletonModuleComp";
import { Battle } from "../Battle";

/** 业务层对象 */
@ecs.register('BattleCardLoad')
export class BattleCardLoadComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class BattleCardLoadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BattleCardLoadComp);
    }

    entityEnter(e: Battle): void {
        e.BattleModel.targetcardId=getRandomInt(1, 24);
        console.log(`MyTargetId:` + e.BattleModel.targetcardId);
        e.BattleModel.oppototalCard = 24;
        e.BattleModel.totalCard = 24;

        /** 己方卡组随机生成 */
        //ArrayUtil.fisherYatesShuffle(e.BattleModel.cardId);
        for (let i = 0; i <= 23; i++){
            let node = ViewUtil.createPrefabNode(`scene/cardprefab/card${e.BattleModel.cardId[i]}`);
            let p = e.BattleSceneView.get(`p${i+1}`);
            node.parent = p;
            node.setSiblingIndex(0);
        }

        //生成对方卡片
        for (let i = 0; i <= 23; i++){
            let p = e.BattleSceneView.get(`op${i + 1}`);
            UiHelp.SetSpriteFrame(p, `gui/card/${i+1}`);
        }

        if ((smc.websocketmessage.ID % 2) == 1) {
            e.BattleModel.isFirst = true;
        } else {
            e.BattleModel.isFirst = false;
        }

        e.ToReady();
        e.remove(BattleCardLoadComp);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
