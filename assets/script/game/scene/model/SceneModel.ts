import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";

/** 数据层对象 */
@ecs.register('SceneModel')
export class SceneModelComp extends ecs.Comp {
    /** 提供 MVVM 组件使用的数据 */
    private vm: any = {};
    /** 我方 */
    targetcardId: number = null!;
    cardId: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    /** 对手 */
    opponent_targetId: number = null!;
    opponent_cardIsOk: boolean[] = new Array(25);
    human: any=null!;


    /** 显示数据添加到 MVVM 框架中监视 */
    vmAdd() {
        this.totalCard = 24;
        this.oppototalCard = 24;
        for (let i = 0; i < 25; i++){
            this.opponent_cardIsOk[i] = true;
        }
        VM.add(this.vm, "SceneModel");
    }

    /** 显示数据从 MVVM 框架中移除 */
    vmRemove() {
        VM.remove("SceneModel");
    }

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        this.totalCard = 24;
        this.oppototalCard = 24;
        for (var key in this.vm) {
            delete this.vm[key];
        }
        
    }

    /** 当前card数 */
    private _totalCard: number = 24;
    public get totalCard(): number {
        return this._totalCard;
    }
    public set totalCard(v: number) {
        this._totalCard = v;
        this.vm["totalCard"] = v;
    }
    /** 对手card数量 */
    private _oppototalCard: number = 24;
    public get oppototalCard(): number {
        return this._oppototalCard;
    }
    public set oppototalCard(v: number) {
        this._oppototalCard = v;
        this.vm["oppototalCard"] = v;
    }

    


}