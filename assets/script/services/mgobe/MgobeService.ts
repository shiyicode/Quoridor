import { Config, RoomStatus, GameType } from "../../Constants";
import "../../library/mgobe/MGOBE.js";
import { PlayerVO } from "../../model/vo/GameVO";

export default class MgobeService {
    // 将room置为私有 private
    static room: MGOBE.Room = null;

    static isStartFrameSync() {
        return this.room.roomInfo.frameSyncState == MGOBE.ENUM.FrameSyncState.START;
    }

    static startFrameSync(callback?: (event) => any) {
        if (this.room.roomInfo.frameSyncState !== MGOBE.ENUM.FrameSyncState.START) {
            this.room.startFrameSync({}, event => {
                callback && callback(event);
            });
        }
    }

    static stopFrameSync(callback?: (event) => any) {
        this.room.stopFrameSync({}, event => {
            callback && callback(event);
        });
    }

    static sendFrame(data, callback?: (event) => any) {
        const sendFramePara: MGOBE.types.SendFramePara = {
            data: data,
        };

        this.room.sendFrame(sendFramePara, event => {
            callback && callback(event);
        });
    }

    static sendToClient(msg: string, callback?: (event) => any) {
        const sendToClientPara: MGOBE.types.SendToClientPara = {
            recvPlayerList: [],
            recvType: MGOBE.types.RecvType.ROOM_ALL,
            msg,
        };

        this.room.sendToClient(sendToClientPara, event => {
            callback && callback(event);
        });
    }

    static getMyRoom(callback?: (event) => any) {
        MGOBE.Room.getMyRoom(event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                this.room.roomInfo = event.data.roomInfo;

            }
            callback && callback(event);
        });
    }

    static initRoom(roomId: string, callback?: (event) => any) {
        // const roomInfo = { id: roomId };
        // this.room.initRoom(roomInfo);
        const getRoomByRoomIdPara2 = {
            roomId: roomId,
        };
        MGOBE.Room.getRoomByRoomId(getRoomByRoomIdPara2, (event) => {
            callback && callback(event);
        });
    }

    static joinRoom(roomId: string, player: PlayerVO, callback?: (event) => any) {
        this.initRoom(roomId, (event) => {
            console.log("获取房间信息", roomId, event);
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log("获取房间信息, 更新成功", roomId);
                this.room.initRoom(event.data.roomInfo);

            }
            const playerInfo: MGOBE.types.PlayerInfoPara = {
                name: player.nickName,
                customPlayerStatus: player.isReady ? 1 : 0,
                customProfile: player.avatarUrl,
            };

            const joinRoomPara: MGOBE.types.JoinRoomPara = {
                playerInfo: playerInfo,
            };
            this.room.joinRoom(joinRoomPara, (event) => {
                callback && callback(event);
            });
        });
    }

    static createRoom(player: PlayerVO, maxPlayers: number, roomType: string, callback?: (event) => any) {
        const playerInfo: MGOBE.types.PlayerInfoPara = {
            name: player.nickName,
            customPlayerStatus: player.isReady ? 1 : 0,
            customProfile: player.avatarUrl,
        };

        const createRoomPara: MGOBE.types.CreateRoomPara = {
            roomName: roomType,
            maxPlayers: maxPlayers,
            roomType: roomType,
            isPrivate: false,
            customProperties: "WAIT",
            playerInfo: playerInfo,
        };

        this.room.createRoom(createRoomPara, (event) => {
            callback && callback(event);
        });
    }

    static cancelMatch(callback?: (event) => any) {
        const cancelMatchPara = {
            matchType: MGOBE.ENUM.MatchType.PLAYER_COMPLEX,
        };

        this.room.cancelPlayerMatch(cancelMatchPara, event => {
            callback && callback(event);
        });
    }

    static matchPlayers(player:PlayerVO, maxPlayers: number, roomType: string, callback?: (event) => any) {
        const playerInfo = {
            name: player.nickName,
            customPlayerStatus: 1,
            customProfile: player.avatarUrl,
            matchAttributes: [{
                name: "score",
                value: player.value,
            }]
        };

        let matchCode = Config.matchCode1v1;
        if(roomType == GameType.MATCH4) {
            matchCode = Config.matchCode1v1v1v1;
        }

        const matchPlayersPara = {
            playerInfo,
            matchCode: matchCode,
        };

        // 发起匹配
        this.room.matchPlayers(matchPlayersPara, event => {
            callback && callback(event);
        });
    }

    static leaveRoom(callback?: (event) => any) {
        this.room.leaveRoom({}, event => {
            callback && callback(event);
        });
    }

    // static changeRoomStatus(roomStatus: RoomStatus) {
    //     const changeRoomPara = {
    //         customProperties: roomStatus as string,
    //     };

    //     this.room.changeRoom(changeRoomPara, event => console.log("changeRoom", roomStatus, event));
    // }

    static changeCustomPlayerStatus(customPlayerStatus, callback?: (event) => any) {
        const changeCustomPlayerStatusPara = {
            customPlayerStatus
        };

        this.room.changeCustomPlayerStatus(changeCustomPlayerStatusPara, event => {
            callback && callback(event);
        });
    }

    static isInited(): boolean {
        // 初始化成功后才有玩家ID
        return !!MGOBE.Player && !!MGOBE.Player.id;
    }

    static initMgobeSDK(openId: string, gameId: string, secretKey: string, url: string, cacertNativeUrl: string, callback?: (event: { code: MGOBE.ErrCode }) => any): void {
        // 如果已经初始化，直接回调成功
        if (this.isInited()) {
            return callback && callback({ code: MGOBE.ErrCode.EC_OK });
        }

        let gameInfo: MGOBE.types.GameInfoPara = {
            gameId: gameId,
            secretKey: secretKey,
            openId: openId,
        }
        let config: MGOBE.types.ConfigPara = {
            url: url,
            reconnectInterval: Config.reconnectInterval,
            reconnectMaxTimes: Config.reconnectMaxTimes,
            resendInterval: Config.resendInterval,
            resendTimeout: Config.resendTimeout,
            isAutoRequestFrame: true,
            cacertNativeUrl: cacertNativeUrl,
        }

        MGOBE.DebuggerLog.enable = Config.isDebug;

        // if (cc.sys.isNative) {
        //     MGOBE.DebuggerLog.enable = false;
        // }

        // 初始化
        MGOBE.Listener.init(gameInfo, config, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                // 初始化后才能添加监听
                this.room = new MGOBE.Room();
                MGOBE.Listener.add(this.room);
                // 设置默认广播
                this.setBroadcastCallbacks(null, {});
            }
            callback && callback({ code: event.code });
        });
    }

    // TODO 将callback注册放到这里 将room
    static setCallbacks() {

    }

    /**
     * 设置房间广播回调函数
     * @param broadcastCallbacks
     */
    static setBroadcastCallbacks(context: any, broadcastCallbacks?: BroadcastCallbacks) {

        if (!this.room) {
            return;
        }

        // 默认回调函数
        const generateDefaultCallback = (tag: string) => (event) => { console.log(tag, "->", event); };

        const defaultCallbacks: BroadcastCallbacks = {
            onUpdate: () => generateDefaultCallback("onUpdate"),
            onJoinRoom: () => generateDefaultCallback("onJoinRoom"),
            onLeaveRoom: () => generateDefaultCallback("onLeaveRoom"),
            onChangeRoom: () => generateDefaultCallback("onChangeRoom"),
            onDismissRoom: () => generateDefaultCallback("onDismissRoom"),
            onStartFrameSync: () => generateDefaultCallback("onStartFrameSync"),
            onStopFrameSync: () => generateDefaultCallback("onStopFrameSync"),
            onRecvFrame: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFrameBst>) => {
                generateDefaultCallback("onRecvFrame");
                // 每次收到帧广播都需要计算
                // calcFrame(event.data.frame);
            },
            onChangeCustomPlayerStatus: () => generateDefaultCallback("onChangeCustomPlayerStatus"),
            onRemovePlayer: () => generateDefaultCallback("onRemovePlayer"),
            onRecvFromClient: () => generateDefaultCallback("onRecvFromClient"),
            onRecvFromGameSvr: () => generateDefaultCallback("onRecvFromGameSvr"),
            onAutoRequestFrameError: () => generateDefaultCallback("onAutoRequestFrameError"),
        };

        // 给 room 实例设置广播回调函数
        Object.keys(defaultCallbacks).forEach((key: keyof BroadcastCallbacks) => {
            const callback = broadcastCallbacks[key] ? broadcastCallbacks[key].bind(context) : defaultCallbacks[key];
            this.room[key] = callback;
        });
    }
}

interface BroadcastCallbacks {
    onUpdate?,
    onJoinRoom?,
    onLeaveRoom?,
    onChangeRoom?,
    onDismissRoom?,
    onStartFrameSync?,
    onStopFrameSync?,
    onRecvFrame?,
    onChangeCustomPlayerStatus?,
    onRemovePlayer?,
    onRecvFromClient?,
    onRecvFromGameSvr?,
    onAutoRequestFrameError?,
}