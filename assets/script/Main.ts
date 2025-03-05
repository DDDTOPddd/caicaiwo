/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 18:25:56
 */
import { profiler, _decorator} from 'cc';
import { DEBUG, OPPO, WECHAT } from 'cc/env';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../extensions/oops-plugin-framework/assets/core/Root';
import { ecs } from '../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { smc } from './game/common/SingletonModuleComp';
import { EcsInitializeSystem, Initialize } from './game/initialize/Initialize';
import { Home } from './game/homepage/Home';
import { EcsSceneSystem, Scene } from './game/scene/Scene';
import { EcsOperatorSystem, Operator } from './game/operator/Operator';
import { LLM } from './game/LLM/LLM';
import YYRecorder from './game/Recorder/YYRecorder';
import { Websocket } from './game/websocket/Websocket';
import { Battle, EcsBattleSystem } from './game/battle/Battle';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        smc.home = ecs.getEntity<Home>(Home);
        smc.scene = ecs.getEntity<Scene>(Scene);
        smc.operator = ecs.getEntity<Operator>(Operator);
        smc.llm = ecs.getEntity<LLM>(LLM);
        smc.websocketmessage = ecs.getEntity<Websocket>(Websocket);
        smc.battle = ecs.getEntity<Battle>(Battle);

        if (WECHAT) {
            smc.yyrecorder = ecs.getEntity<YYRecorder>(YYRecorder);
        }
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    protected initEcsSystem() {
        oops.ecs.add(new EcsInitializeSystem());
        oops.ecs.add(new EcsSceneSystem());
        oops.ecs.add(new EcsOperatorSystem());
        oops.ecs.add(new EcsBattleSystem());
    }
}
