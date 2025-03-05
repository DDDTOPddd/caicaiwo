import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";

/** 数据层对象 */
@ecs.register('LLMModel')
export class LLMModelComp extends ecs.Comp {
    /** 提供 MVVM 组件使用的数据 */
    private vm: any = {};


    /** 智能体id数组 */
    characterId: string[] = [
        `bad27dca7b2246f8b75c15c1f8cf223f`,

        `56e7e2390aa5430a935bc3df829b0a22`,
        `cd6be73022364e069cd5d4b61779ca87`,
        `dddfa6f947974504a48bf0daf5699878`,
        `13ea55289afe4b6faa601872e2b51a98`,

        `d9574fa8cf8b49718a7257a3532b53d8`,
        `9267ff4a7f594af2abb2c6a21ea6fe15`,
        `8878250455cb48c8b273f3c3eb6441a4`,
        `284eef60f69642789dc8aa30973cfd35`,

        '53fbd2dcbe354f4a9e281c9085bf6a0e',
        `f72463cdbcad42d59dbcfbadf305ac9d`,
        `db3f111caf074d87a689227be913b551`,
        'ddb121eeb0214ec798a79597dfbc4d10',

        `8bb5d74c8867425cb75243579c6efaaf`,
        `fac8bb09201844f39fae4e2ac627ffe6`,
        `e69fe2e85b364fee845cc2cd1cfbe5bc`,
        `06c2dd428fc643a9be9ffe63cf6fb6b8`,

        `77a34189566243ed95b5b105e21ad4a4`,
        `b991507f47f84453836d1f860f567c40`,
        `746c1c95e82b402ab7ca82a765fe1890`,
        `dbf42d1d44e141f1b67dc94b00ee5c50`,

        `6ee99f7e125c42e3b5c46386804e5341`,
        `6fc0ec2db4f04a04a7a27240bd38d0dc`,
        `50a38cbacc5144e5bdbf3cc402ea33c3`,
        `f2243a1c2ce7475990cd23247dff0de2`,
    ]





    /** 显示数据添加到 MVVM 框架中监视 */
    vmAdd() {
        VM.add(this.vm, "LLMModel");
    }
    /** 显示数据从 MVVM 框架中移除 */
    vmRemove() {
        VM.remove("LLMModel");
    }

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        for (var key in this.vm) {
            delete this.vm[key];
        }
    }
}