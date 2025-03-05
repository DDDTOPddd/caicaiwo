import { _decorator, Component, EditBox } from "cc";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from "../common/SingletonModuleComp";

const { ccclass, property } = _decorator;

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
}
/** 语音转文字管理模块 */
@ecs.register('YYRecorder')
export default class YYRecorder extends ecs.Entity {
    accessToken: string = '';
    recording: boolean;

    /** 0:llm  1:battle */
    moshi: number;
    

    startRecording() {
        const recorderManager = wx.getRecorderManager();
        const options = {
            duration: 20000, 
            format: 'wav', 
        }
        recorderManager.start(options);
        this.recording=true
        console.log('开始录音:', options);
    }

    stopRecording() {
        const that = this;
        const recorderManager = wx.getRecorderManager();
        recorderManager.stop(); 
        recorderManager.onStop((res) => {
            const tempFilePath = res.tempFilePath;
            // 获取音频文件的字节数
            wx.getFileSystemManager().getFileInfo({
                filePath: tempFilePath,
                success(res) {
                    const size = res.size;
                    that.fileToBase64(tempFilePath, function (base64Data) {
                    // 调用百度音频转文字 API 进行语音识别
                        that.audioToText(base64Data, size, function (textResult) {
                            console.log(textResult);
                            switch (that.moshi) {
                                case 1:
                                    smc.battle.BattleSceneView.get("LabEdit").getComponent(EditBox).string = textResult;
                                    break;
                                case 0:
                                    smc.operator.OperatorView.get("LabEdit").getComponent(EditBox).string = textResult;
                                    break;
                            }
                            
                            
                        });
                    });
                },
                fail(err) {
                    console.error('获取文件信息失败: ', err);
                }
            });
            this.recording = false;
        });

    }

    fileToBase64(filePath: string, callback: (base64Data: string) => void): void {
        wx.getFileSystemManager().readFile({
            filePath: filePath,
            encoding: 'base64',
            success: (res: { data: string }) => {
                const base64Data = res.data;
                if (typeof callback === 'function') {
                    callback(base64Data);
                } else {
                    console.error('回调函数未定义');
                }
            },
            fail: (err: any) => {
                console.error('读取文件失败:', err);
            }
        });
    }

    audioToText(base64Data: string, size: number, callback: (textResult: string) => void): void {
        wx.showLoading({
            title: '识别中...',
            mask: true
        });
        wx.request({
            url: 'https://vop.baidu.com/server_api',
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
            },
            data: {
                format: 'wav',
                rate: '16000',
                    channel: '1',
                cuid: "Ht87o0d1m8FUdf40ILh1IGmjdxCVfpqp",
                token: this.accessToken,
                speech: base64Data,
                "len": size
            },
        
            success: (res) => {
                const data = res.data as { result: string[] };
                if (res && res.data && data.result && data.result[0]) {
                    const textResult = data.result[0];
                    oops.gui.toast(textResult);
                    callback(textResult);
                } else {
                    console.error('语音识别失败: 无法获取识别结果');
                }
            },
            fail: (err: any) => {
                console.error('语音识别失败:', err);
            },
            complete: () => {
                wx.hideLoading();
            }
        });
    }

    getAccessToken(): void {
        const AK = "KCrldKtvLqgRAQf5iISd4Qog";
        const SK = "kPRPDLbtJqhQopTLVmGCpt6GDHA78vrh";
        const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`;
        wx.request({
            url: url,
            method: 'POST',
            success: (res) => {
                const data = res.data as AccessTokenResponse;
                if (data.access_token) {
                    this.accessToken = data.access_token;
                    console.log('获取成功:', data.access_token);
                } else {
                    console.error('获取access token失败');
                }
            },
            fail: (error) => {
                console.error(error);
            }
        });
  
    }

    protected init() {
        this.recording = false;
        this.getAccessToken();
    }

    destroy() {
        super.destroy();
    }
}