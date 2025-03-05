import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";

/** 数据层对象 */
@ecs.register('OperatorModel')
export class OperatorModelComp extends ecs.Comp {
    /** 提供 MVVM 组件使用的数据 */
    private vm: any = {};
    /** 己方获得的回答 */
    answer: string;
    /** 问题--卡片索引 */
    cards_associated: any;
    /** 卡片--问题索引 */
    ques_associated: any;

    /** 对手数据 */
    queNum: number;
    questions: any;
    


    /** 显示数据添加到 MVVM 框架中监视 */
    vmAdd() {
        this.opQue = '';
        VM.add(this.vm, "OperatorModel");
    }

    /** 显示数据从 MVVM 框架中移除 */
    vmRemove() {
        VM.remove("OperatorModel");
    }

    private _opQue: string;
    public get opQue(): string {
        return this._opQue;
    }
    public set opQue(v: string) {
        this._opQue = v;
        this.vm["opQue"] = v;
    }

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        for (var key in this.vm) {
            delete this.vm[key];
        }
    }
}