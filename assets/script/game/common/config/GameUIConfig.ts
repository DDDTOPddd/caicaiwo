/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-15 09:38:36
 */

import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 弹窗界面 */
    Window,
    /** 加载与延时提示界面 */
    Netinstable,
    /** Home */
    Home,
    /** 主场景卡牌区 */
    Scene,
    /** 操作区 */
    Operator,
    /** 暂停菜单 */
    Menu, Menu_battle,
    /** 游戏结算 */
    Settlement,
    /** 匹配中 */
    BattleWaiting,
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "gui/loading/loading" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Home]: { layer: LayerType.UI, prefab: "gui/Home/Home" },
    [UIID.Scene]: { layer: LayerType.Game, prefab: "scene/scene" },
    [UIID.Operator]: { layer: LayerType.UI, prefab: "gui/operator/operator" },
    [UIID.Menu]: { layer: LayerType.Dialog, prefab: "gui/windows/Menu" },
    [UIID.Menu_battle]: { layer: LayerType.Dialog, prefab: "gui/windows/Menu_battle" },
    [UIID.Settlement]: { layer: LayerType.Dialog, prefab: "common/prefab/settlement" },
    [UIID.BattleWaiting]: { layer: LayerType.Dialog, prefab: "gui/windows/battle_wait" },
}