import { openSync } from "original-fs";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../common/SingletonModuleComp";
import { MyAskRoundComp, MyAskRoundSystem } from "./bll/MyAskRound";
import { MyFlopRoundComp, MyFlopRoundSystem } from "./bll/MyFlopRound";
import { OpAskRoundComp, OpAskRoundSystem } from "./bll/OpAskRound";
import { OperatorLoadComp, OperatorLoadSystem } from "./bll/OperatorLoad";
import { OperatorModelComp } from "./model/OperatorModel";
import { OperatorViewComp } from "./view/OperatorViewComp";
import { SettlementConfig } from "../../windows_easyts/Settlement";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../common/config/GameUIConfig";




/** Operator 模块 */
@ecs.register(`Operator`)
export class Operator extends ecs.Entity {
    [x: string]: any;
    /** ---------- 数据层 ---------- */
    OperatorModel!: OperatorModelComp;

    /** ---------- 业务层 ---------- */
    OperatorLoad!: OperatorLoadComp;
    MyAskRound!: MyAskRoundComp;
    MyFlopRound!: MyFlopRoundComp;
    OpAskRound!: OpAskRoundComp;
    /** ---------- 视图层 ---------- */
    OperatorView!: OperatorViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
        this.addComponents<ecs.Comp>(
            OperatorModelComp,
        );
        this.OperatorModel.vmAdd();
    }

    /** 模块资源释放 */
    destroy() {
        this.remove(MyAskRoundComp);
        this.remove(MyFlopRoundComp);
        this.remove(OpAskRoundComp);
        this.remove(OperatorViewComp);
        this.OperatorModel.vmRemove();
        this.remove(OperatorModelComp);
        super.destroy();
    }
    /** 加载 */
    loadOperator() {
        this.add(OperatorLoadComp);
    }
    /** 我方提问 */
    ToMyAskRound() {
        this.add(MyAskRoundComp);
    }
    /** 我方翻牌 */
    ToMyFlopRound() {
        this.add(MyFlopRoundComp);
    }
    /** 对方提问 */
    ToOpAskRound() {
        this.add(OpAskRoundComp);
    }

    /** 结算，跳出结算面板 */
    ToFinal(type: number) {
        //type:0对方先结算   1：我方先结算
        if (type == 0) {
            let parms: SettlementConfig = {
                title: "You Lose!",
                content: `对方比你先一步锁定目标！要加油哦`,
                backFunc: () => {
                    console.log("settlement!");
                    oops.gui.open(UIID.Home);
                    oops.audio.stopAll();
                    smc.scene.SceneView.close();
                    smc.operator.OperatorView.close();
                }
            }
            oops.gui.open(UIID.Settlement, parms);
        }
        else {
            let t = smc.scene.SceneView.lastCard();
            if (smc.scene.SceneModel.targetcardId == smc.scene.SceneModel.cardId[t - 1]) {
                let k = smc.scene.SceneModel.oppototalCard;
                let parms: SettlementConfig = {
                    title: "You Win!",
                    content: `你猜对了！\n对方还剩${k}张牌`,
                    backFunc: () => {
                        oops.gui.open(UIID.Home);
                        oops.audio.stopAll();
                        smc.scene.SceneView.close();
                        smc.operator.OperatorView.close();
                    }
                }
                oops.gui.open(UIID.Settlement, parms);
            }else {
                let parms: SettlementConfig = {
                    title: "Fail!",
                    content: `你猜错了！`,
                    backFunc: () => {
                        console.log("settlement!");
                        oops.gui.open(UIID.Home);
                        oops.audio.stopAll();
                        smc.scene.SceneView.close();
                        smc.operator.OperatorView.close();
                    }
                }
                oops.gui.open(UIID.Settlement, parms);
            }
        }
    }
}

/** Operator 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsOperatorSystem extends ecs.System {
    constructor() {
        super();
        this.add(new OperatorLoadSystem());
        this.add(new MyAskRoundSystem());
        this.add(new MyFlopRoundSystem());
        this.add(new OpAskRoundSystem());
    }
}
