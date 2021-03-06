import { IPlatform } from "./IPlatform";
import { wxApi } from "../../library/wechat/wxApi";

export default class WXPlatform implements IPlatform {
    async getOpenID() {
        console.log("get openId");
        try {
            let res = await wxApi.login();
            console.log("login succ", res.code, res);

            res = await wxApi.callFunction("login");
            console.log("call login succ", res);
            return res.result.openid;
        } catch (e) {
            console.log("call login fail", e);
            return "";
        }
    }

    async authSettingOfUserInfo() {
        let isAuthorize = await wxApi.authSettingOfUserInfo();
        return isAuthorize;
    }

    async createUserInfoButton() {
        /** 创建登陆按钮 */
        let x = window.innerWidth / 2 - 250 / 2;
        let y = window.innerHeight / 1.2;
        let button = wx.createUserInfoButton({
            type: "text",
            text: "微信登陆",
            image: "",
            style: {
                left: x,
                top: y,
                width: 250,
                height: 43,
                lineHeight: 43,
                backgroundColor: "#FC3768",
                color: "#ffffff",
                textAlign: "center",
                fontSize: 18,
                borderRadius: 4
            }
        });
        /** 用户点击登陆按钮后获取userInfo */
        await new Promise(resolve => {
            button.onTap((res) => {
                console.log("authorize finish:", res);
                if (res.userInfo) {
                    button.destroy();
                    resolve();
                }
            });
        });
    }

    async getUserInfo() {
        let res = await wxApi.getUserInfo(false, "zh_CN");
        return res.userInfo;
    }

    async shareAppMessage(title: string, imageUrl: string, imageUrlId: string, query: string) {
        wx.shareAppMessage({
            title: title,
            imageUrlId: imageUrlId,
            imageUrl: imageUrl,
            query: query,
        });
    }

    async getLaunchOption() {
        let res = wx.getLaunchOptionsSync();
        if (res && res.query) {
            return {
                query: res.query,
                scene: res.scene,
            };
        }
    }

    getLaunchOptionOnShow(callback: (query: any, scene: any) => any) {
        wx.onShow((res) => {
            if (res && res.query && res.scene) {
                callback && callback(res.query, res.scene);
            }
        });

    }

    async showLoading(title: string = "加载中", isMask: boolean = true) {
        wx.showLoading({
            title: title,
            mask: isMask
        });
    }

    async hideLoading() {
        wx.hideLoading({
        });
    }

    async showToast(title: string, duration: any = 1000) {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: duration,
        });
    }

    async hideToast() {
        wx.hideToast({
        });
    }

    showModal(title: string, callback: (isConfirm: boolean) => any, content: string = "", showCancel: any = true, confirmText: any = "确定",
        cancelText: any = "取消") {
        wx.showModal({
            title: title,
            content: content,
            showCancel: showCancel,
            confirmText: confirmText,
            cancelText: cancelText,
            success(res) {
                if (res.confirm) {
                    callback(true);
                    // wx.hid
                } else if (res.cancel) {
                    callback(false);
                }
            }
        });
    }

    hideModal() {

    }
}