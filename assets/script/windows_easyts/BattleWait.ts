import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../game/common/config/GameUIConfig';
import { smc } from '../game/common/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('BattleWait')
export class BattleWait extends Component {
    /** 取消连接 */
    onClickCancell() {
        smc.websocketmessage.closeconnect();
        oops.gui.remove(UIID.BattleWaiting);
    }
}


