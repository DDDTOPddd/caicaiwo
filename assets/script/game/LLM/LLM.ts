import { WECHAT } from "cc/env";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../common/SingletonModuleComp";
import { LLMModelComp } from "./model/LLMModel";


/** LLM 模块 */
@ecs.register(`LLM`)
export class LLM extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    LLMModel!: LLMModelComp;

    apiKey: string = 'lm-21+eXY6Ww+aaVNA7wGrihw=='; 
    userId: string = '123456'; 
    
    /** 初始添加的数据层组件 */
    protected init() {
        this.addComponents<ecs.Comp>(
            LLMModelComp,
        );
        this.LLMModel.vmAdd();
    }

    /** 模块资源释放 */
    destroy() {
        this.LLMModel.vmRemove();
        super.destroy();
    }

    async askQue(content: string, id: number) {
        if (WECHAT) {
            console.log("ask:" + content);
            const url = 'https://nlp.aliyuncs.com/v2/api/chat/send';
            const headers = {
                "Content-Type": "application/json",
                "X-AcA-DataInspection": "enable",
                "x-fag-servicename": "aca-chat-send",
                "x-fag-appcode": "aca",
                "Authorization": `Bearer ${this.apiKey}`
            };
            const payload = {
                "input": {
                    "messages": [
                        { "role": "user", "content": content }
                    ],
                    "aca": {
                        "botProfile": {
                            "characterId": this.LLMModel.characterId[id]
                        },
                        "userProfile": {
                            "userId": this.userId,
                            "basicInfo": ""
                        },
                        "scenario": {
                            "description": ""
                        },
                        "context": {
                            "useChatHistory": false
                        }
                    }
                }
            };

            try {
                const response = await new Promise((resolve, reject) => {
                    wx.request({
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(payload),
                        header: headers,
                        success: (res) => {
                            resolve(res);
                        },
                        fail: (err) => {
                            reject(err);
                        }
                    });
                });

                if ((response as any).statusCode === 200) {
                    const responseData = (response as any).data;
                    console.log(this.LLMModel.characterId[id]);
                    this.handleResponse(responseData, id);
                } else {
                    console.error('HTTP error');
                }
            } catch (error) {
                console.error('Request error', error);
            }
        }
        else {
            console.log("ask:" + content);
            const url = 'https://nlp.aliyuncs.com/v2/api/chat/send';
            const headers = {
                "Content-Type": "application/json",
                "X-AcA-DataInspection": "enable",
                "x-fag-servicename": "aca-chat-send",
                "x-fag-appcode": "aca",
                "Authorization": `Bearer ${this.apiKey}`
            };
            const payload = {
                "input": {
                    "messages": [
                        { "role": "user", "content": content }
                    ],
                    "aca": {
                        "botProfile": {
                            "characterId": this.LLMModel.characterId[id]
                        },
                        "userProfile": {
                            "userId": this.userId,
                            "basicInfo": ""
                        },
                        "scenario": {
                            "description": ""
                        },
                        "context": {
                            "useChatHistory": false
                        }
                    }
                }
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(this.LLMModel.characterId[id]);
                    this.handleResponse(responseData, id);
                } else {
                    console.error('HTTP error', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Fetch error', error);
            }
        }

    }

    /** 处理返回值 */
    handleResponse(responseData: any,id:number) {
        if (responseData.success && responseData.data && responseData.data.choices) {
            const messages = responseData.data.choices[0].messages;
            if (messages && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage && lastMessage.content) {
                    smc.operator.OperatorModel.answer = lastMessage.content;
                    if (id == 0) {
                        console.log(lastMessage.content);
                        if (lastMessage.content == '合理') {
                            oops.message.dispatchEvent('ask');
                            oops.message.dispatchEvent('battleask');
                        }
                        else {
                            oops.gui.toast("问题不合理，请重新提问。");
                            console.log('合理性判断:', lastMessage.content);
                        }
                    } else {
                        oops.gui.toast(lastMessage.content);
                        console.log('Assistant response:', lastMessage.content);
                    }
                    
                }
            } else {
                console.error('Invalid response structure', responseData);
            }
        }
    }

    // async askQue1(content: string, id: number) {
    //     console.log("ask:" + content);
    //     const url = 'https://nlp.aliyuncs.com/v2/api/chat/send';
    //     const headers = {
    //         "Content-Type": "application/json",
    //         "X-AcA-DataInspection": "enable",
    //         "x-fag-servicename": "aca-chat-send",
    //         "x-fag-appcode": "aca",
    //         "Authorization": `Bearer ${this.apiKey}`
    //     };
    //     const payload = {
    //         "input": {
    //             "messages": [
    //                 {"role": "user", "content": content}
    //             ],
    //             "aca": {
    //                 "botProfile": {
    //                     "characterId": this.LLMModel.characterId[id]
    //                 },
    //                 "userProfile": {
    //                     "userId": this.userId,
    //                     "basicInfo": ""
    //                 },
    //                 "scenario": {
    //                     "description": ""
    //                 },
    //                 "context": {
    //                     "useChatHistory": false
    //                 }
    //             }
    //         }
    //     };

    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: headers,
    //             body: JSON.stringify(payload)
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             console.log(this.LLMModel.characterId[id]);
    //             this.handleResponse(responseData,id);
    //         } else {
    //             console.error('HTTP error', response.status, response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Fetch error', error);
    //     }
    // }
    

}


