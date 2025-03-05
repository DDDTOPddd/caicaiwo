import { UICallbacks } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { HomeViewComp } from "./view/HomeViewComp";
import { Node } from "cc";


@ecs.register('Home')
export class Home extends ecs.Entity{

    //视图层
    HomeView!: HomeViewComp;


    protected init() {
        
    }

    destroy(): void {
        this.remove(HomeViewComp);
        super.destroy();
    }

    async loadHome() {    
        var callbacks: UICallbacks = {     
            onAdded: (node: Node, params: any) => {
                this.add(node.getComponent(HomeViewComp) as ecs.Comp);
            } 
        };
        oops.gui.open(UIID.Home,null,callbacks);
        
    }

}