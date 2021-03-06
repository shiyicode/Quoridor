export const ProjectConfig = {
    PREFAB_UI_DIR: "prefab/",
    AUDIO_DIR: "audio/",
}

export enum WorldNotification {
    RUN_LAUNCH = "RUN_LAUNCH",

}

// TODO 很多FAIL可以考虑用SHOW_TIPS代替
export enum RoomNotification {
    ROOM_CREATE = "ROOM_CREATE",
    ROOM_JOIN = "ROOM_JOIN",
    ROOM_LEAVE = "ROOM_LEAVE",
    ROOM_MATCH = "ROOM_MATCH",
    ROOM_RETURN_CHECK = "ROOM_RETURN_CHECK",  // 提示是否返回当前房间
    ROOM_RETURN_NOT_CHECK = "ROOM_RETURN_NOT_CHECK",  // 不需要提示
    ROOM_UPDATE = "ROOM_UPDATE",
}

export enum GameNotification {
    GAME_START = "GAME_START",
    GAME_UPDATE = "GAME_UPDATE",
}

export enum GameAction {
    MOVE_CHESS = 0,
    ADD_WALL,
    LEAVE,
    GIVEUP,
}

export enum PlayerStatus {
    DEFAULT,
    LEAVE,
    OFFLINE,
    GIVEUP,
}

export enum RoomStatus {
    DEFAULT = 0,
    MATCH_ING,
    MATCH_WILL,
    MATCH_SUCC,
    TEAM,
    GAME_ING,
    GAME_END,
}

export enum GameStatus {
    DEFAULT,
    END,
}

export enum GameType {
    TEAM2 = "team2",
    MATCH2 = "match2",
    MACHINE2 = "machine2",
    TEAM4 = "team4",
    MATCH4 = "match4",
    MACHINE4 = "machine4",
}

export enum WallType {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
}

export enum Scene {
    WELCOME = "welcome",
    MENU = "menu",
    ROOM = "room",
    GAME = "game",
}

export enum ChessboardLimit {
    CHESS_LIMIT = 9, // 棋子格局大小限制为9
    WALL_LIMIT = 8, // 墙体格局大小限制为棋子格局减1
}

export const Config = {
    WXCloudEnvID: "dev-620e72", // 开发环境ID

    MGOBEGameId: "obg-fqdy9jzs", // 替换为控制台上的“游戏ID”
    MGOBESecretKey: 'edb151a57fbbbd59f1c81399d8a5773aa40aee21',// 替换为控制台上的“游戏key”
    MGOBEHost: 'fqdy9jzs.wxlagame.com',

    reconnectMaxTimes: 5,      // 最大重试次数
    reconnectInterval: 1000,   // 重试间隔
    resendInterval: 1000,      // 重发间隔
    resendTimeout: 10000,      // 重发超时时间
    isDebug: false,            // 是否debug模式
    matchCode1v1: "match-m7bq0udn",
    matchCode1v1v1v1: "match-kc5sm7tx",

}