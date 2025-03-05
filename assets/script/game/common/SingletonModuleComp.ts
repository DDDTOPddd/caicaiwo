/*
 * @Author: dgflash
 * @Date: 2021-11-18 14:20:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-08 12:04:30
 */

import { Scene } from "../scene/Scene";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Home } from "../homepage/Home";
import { Initialize } from "../initialize/Initialize";
import { Operator } from "../operator/Operator";
import { LLM } from "../LLM/LLM";
import YYRecorder from "../Recorder/YYRecorder";
import { Websocket } from "../websocket/Websocket";
import { Battle } from "../battle/Battle";

/** 游戏单例业务模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 游戏主页：后续扩展为account */
    home: Home = null!;
    /** 主场景 */
    scene: Scene = null!;
    /** 操作界面 */
    operator: Operator = null!;
    /** LLM通信 */
    llm: LLM = null!;
    /** 语音转文字 */
    yyrecorder: YYRecorder = null!;
    /** Websocket通信 */
    websocketmessage: Websocket = null!;
    /** 战斗匹配 */
    battle: Battle = null!;
    reset() { }
}
/** 全局smc */
export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);