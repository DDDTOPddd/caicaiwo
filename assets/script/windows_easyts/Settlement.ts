import { Component, EventTouch, _decorator } from "cc";
import { LanguageLabel } from "../../../extensions/oops-plugin-framework/assets/libs/gui/language/LanguageLabel";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";


export interface SettlementConfig {
    /** 标题 */
    title?: string,
    /** 内容 */
    content?: string,
    /** 确认时执行的方法 */
    backFunc?: Function,
}

const { ccclass, property } = _decorator;

/** 公共提示窗口 */
@ccclass("Settlement")
export class Settlement extends Component {
    /** 窗口标题多语言组件 */
    @property(LanguageLabel)
    private lab_title: LanguageLabel | null = null;

    /** 提示内容多语言组件 */
    @property(LanguageLabel)
    private lab_content: LanguageLabel | null = null;

    private config: any = {};


    /**
     * @param params 参数 
     * {
     *     title:      标题
     *     content:    内容
     *     backFunc:   确认时执行的方法
     * }
     */
    onAdded(params: SettlementConfig) {
        this.config = params || {};
        this.setTitle();
        this.setContent();
        this.node.active = true;
    }

    private setTitle() {
        this.lab_title!.dataID = this.config.title;
    }

    private setContent() {
        this.lab_content!.dataID = this.config.content;
    }


    private onBack() {
        if (typeof this.config.backFunc == "function") {
            this.config.backFunc();
        }
        this.close();
    }

    private close() {
        oops.gui.removeByNode(this.node);
    }

    onDestroy() {
        this.config = null;
    }
}