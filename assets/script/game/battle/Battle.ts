import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { BattleWait } from "../../windows_easyts/BattleWait";
import { SettlementConfig } from "../../windows_easyts/Settlement";
import { UIID } from "../common/config/GameUIConfig";
import { smc } from "../common/SingletonModuleComp";
import { BattleCardLoadComp, BattleCardLoadSystem } from "./bll/BattleCardLoad";
import { BattleMyAskRoundComp, BattleMyAskRoundSystem } from "./bll/BattleMyAskRound";
import { BattleMyFlopRoundComp, BattleMyFlopRoundSystem } from "./bll/BattleMyFlopRound";
import { BattleReadyComp, BattleReadySystem } from "./bll/BattleReady";
import { BattleSceneLoadComp, BattleSceneLoadSystem } from "./bll/BattleSceneLoad";
import { BattleWaitFlopComp, BattleWaitFlopSystem } from "./bll/BattleWaitFlop";
import { BattleWaitingComp, BattleWaitingSystem } from "./bll/BattleWaiting";
import { BattleModelComp } from "./model/BattleModel";
import { BattleSceneViewComp } from "./view/BattleSceneView";

/** Battle 模块 */
@ecs.register(`Battle`)
export class Battle extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    BattleModel!: BattleModelComp;

    /** ---------- 业务层 ---------- */
    BattleSceneLoad!: BattleSceneLoadComp;
    BattleCardLoad!: BattleCardLoadComp;
    BattleReady!: BattleReadyComp;
    BattleMyAskRound!: BattleMyAskRoundComp;
    BattleMyFlopRound!: BattleMyFlopRoundComp;
    BattleWaiting!: BattleWaitingComp;
    BattleWaitFlop!:BattleWaitFlopComp
    /** ---------- 视图层 ---------- */
    BattleSceneView!: BattleSceneViewComp;
    
    /** 初始添加的数据层组件 */
    protected init() {
        this.addComponents(
            BattleModelComp
        );
        this.BattleModel.vmAdd();
    }
    


    loadBattleScene() {
        this.add(BattleSceneLoadComp);
    }
    loadCard() {
        this.add(BattleCardLoadComp);
    }
    ToReady() {
        this.add(BattleReadyComp);
    }
    ToMyAskRound() {
        this.add(BattleMyAskRoundComp);
    }
    ToMyFlopRound() {
        this.add(BattleMyFlopRoundComp);
    }
    ToWaiting() {
        this.add(BattleWaitingComp);
    }
    ToWaitingFlop() {
        this.add(BattleWaitFlopComp);
    }
    ToFinal() {
        
        let t = this.BattleSceneView.lastCard();
        if (this.BattleModel.targetcardId == this.BattleModel.cardId[t - 1]) {
            smc.websocketmessage.sendWin();
            smc.websocketmessage.closeconnect();
            let k = this.BattleModel.oppototalCard;
            let parms: SettlementConfig = {
                title: "You Win!",
                content: `你猜对了！\n对方还剩${k}张牌`,
                backFunc: () => {
                    oops.gui.open(UIID.Home);
                    oops.audio.stopAll();
                    smc.battle.BattleSceneView.close();
                }
            }
            oops.gui.open(UIID.Settlement, parms);
            
        } else {
            smc.websocketmessage.sendLose();
            smc.websocketmessage.closeconnect();
            let parms: SettlementConfig = {
                title: "Fail!",
                content: `你猜错了`,
                backFunc: () => {
                    oops.gui.open(UIID.Home);
                    oops.audio.stopAll();
                    smc.battle.BattleSceneView.close();
                }
            }
            oops.gui.open(UIID.Settlement, parms);
        }

    }

    /** 模块资源释放 */
    destroy() {
        this.BattleModel.vmRemove();
        this.remove(BattleSceneViewComp);
        this.remove(BattleWaitingComp);
        this.remove(BattleWaitFlopComp);
        this.remove(BattleModelComp);
        super.destroy();
    }
}

/** Battle 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsBattleSystem extends ecs.System {
    constructor() {
        super();
        this.add(new BattleSceneLoadSystem());
        this.add(new BattleCardLoadSystem());
        this.add(new BattleReadySystem());
        this.add(new BattleMyAskRoundSystem());
        this.add(new BattleMyFlopRoundSystem());
        this.add(new BattleWaitingSystem());
        this.add(new BattleWaitFlopSystem());
    }
}
