import { _decorator, Component, director, Node } from 'cc';
import { oops } from '../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../game/common/config/GameUIConfig';
import { smc } from '../game/common/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('MenuComp')
export class MenuComp extends Component {
    onClickContinue() {
        director.resume();
        oops.gui.remove(UIID.Menu);
    }

    onClickBack() {
        director.resume();
        oops.gui.open(UIID.Home);
        oops.audio.stopAll();
        smc.scene.SceneView.close();
        smc.operator.OperatorView.close();
        oops.gui.remove(UIID.Menu);
    }

    onClickContinue_battle() {
        oops.gui.remove(UIID.Menu_battle);
    }

    onClickBack_Battle() {
        oops.gui.open(UIID.Home);
        smc.battle.BattleSceneView.close();
        smc.websocketmessage.sendOut();
        smc.websocketmessage.closeconnect();
        oops.audio.stopAll();
        oops.gui.remove(UIID.Menu_battle);
    }
}


