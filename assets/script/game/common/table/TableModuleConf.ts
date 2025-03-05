
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableModuleConf {
    static TableName: string = "ModuleConf";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableModuleConf.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** hide */
    get hide(): number {
        return this.data.hide;
    }
    /** 描述 */
    get des(): string {
        return this.data.des;
    }
    /** audit_platform */
    get audit_platform(): number {
        return this.data.audit_platform;
    }
    /** check_switch */
    get check_switch(): number {
        return this.data.check_switch;
    }
    /** platform */
    get platform(): number {
        return this.data.platform;
    }
    /** 唯一id */
    get key_id(): number {
        return this.data.key_id;
    }
    /** unlock_show */
    get unlock_show(): number {
        return this.data.unlock_show;
    }
    /** 开启条件 */
    get condition(): any {
        return this.data.condition;
    }
    /** 功能名称 */
    get name(): string {
        return this.data.name;
    }
}
    