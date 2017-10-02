let leftWidth = 270;

export const GridStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
        height: '34px',
        lineHeight: '34px',
    },
    center: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    bottom: {
        display: 'flex',
        flexDirection: 'row',
        height: '50px',
        lineHeight: '50px',
    },
    topL: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#363636',
        width: leftWidth + 'px',
        padding: '0px 0px 0px 10px',
        color: '#dfdfdf',
    },
    topR: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#363636',
        flex: 1,
        padding: '0px 0px 0px 0px',
        color: '#dfdfdf',
    },
    centerL: {
        backgroundColor: '#262626',
        width: leftWidth + 'px',
        display: 'flex',
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.4)'
    },
    centerR: {
        backgroundColor: '#212121',
        flex: 1,
        display: 'flex',
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.4)'
    },
    bottomL: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#303030',
        width: leftWidth + 'px',
    },
    bottomR: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#303030',
        flex: 1,
    },
}

export const MainStyle = {
    mediaListTitle: {
        paddingTop: '3px',
        textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
    },
    mediaFolderPath: {
        fontSize: '11px',
        color: '#bbbbbb',
        marginLeft: '4px'
    },
    mediaNameTitle: {
        paddingTop: '3px', textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
    },
    folderBtnRow: {
        display: 'flex',
        flexDirection: 'row',
        margin: '0px 4px 0px auto',
        padding: '0px 0px 0px 0px'
    },
    folderBtn: {
        margin: '4px 12px 4px 2px',
        border: 0,
        backgroundColor: '#404040',
        color: '#ffffff',
        width: '33px',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
    },
    topBtnRow: {
        display: 'flex',
        flexDirection: 'row',
        margin: '0px 4px 0px auto',
        padding: '0px 0px 0px 0px'
    },
    topBtn: {
        margin: '4px 2px 4px 2px',
        border: 0,
        backgroundColor: '#404040',
        color: '#ffffff',
        width: '70px',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
    },
    mediaList: {
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'scroll',
        padding: '0',
        margin: '5px 0px 5px 0px',
    },
    mediaListPrompt: {
        color: '#707070',
        textAlign: 'center',
        margin: '45px 0 0 0'
    },
    mediaListKindTitle: {
        margin: '6px 0px 0px 2px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        lineHeight: '30px',
    },
    launchBtn: {
        margin: '1px 2px 1px 1px',
        border: 0,
        backgroundColor: '#1565C0',
        flex: 1,
        color: '#ffffff',
        fontSize: '15px',
        letterSpacing: '1px',
    },
    launchedBtn: {
        margin: '1px 2px 1px 1px',
        border: 0,
        backgroundColor: '#DC143C',
        flex: 1,
        color: '#ffffff',
        fontSize: '15px',
        letterSpacing: '1px',
    },
    fnBtn: {
        margin: '1px 2px 1px 2px',
        // margin: '10px 20px 10px 20px',
        border: 0,
        backgroundColor: '#404040',
        flex: 1,
        color: '#ffffff',
        fontSize: '15px',
        letterSpacing: '1px',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
    }
}
