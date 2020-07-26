// const electron = require('electron');
// const BrowserWindow = electron.remote.BrowserWindow;
// var cmd=require('node-cmd');
// var Promise = require('bluebird')
// const os = require('os');
// 這是之前用electron的歷史殘留

// 别看，垃圾代码，我真的不会写前端
var mojangRes

function init() {
    if (localStorage.eula != "true") {
        osMem = os.totalmem()/1024/1024;

        if ( 512 < osMem <= 2048) {
            localStorage.xmx = "512"
        }
        if ( 2048 < osMem <= 4096) {
            localStorage.xmx = "2048"
        }
        
        if ( 4096 < osMem <= 8192) {
            localStorage.xmx = "4096"
        }

        if (osMem > 8192) {
            localStorage.xmx = "8192"    
        }
        

        let win = new BrowserWindow({
            width: 800, 
            height: 585,
            resizable: false
        })
        win.setMenuBarVisibility(false)

        win.loadURL(`file://${__dirname}/eula.html`)
        return
    }



    if (localStorage.accessToken != undefined) {
        checkTokenExpire()

        
    }
    var emailEle = document.getElementById("email")
    emailEle.value = localStorage.email
    
    var passEle = document.getElementById("pass")
    pass.value = "******"

}



function checkTokenExpire() {
    var validate = new XMLHttpRequest();
    validate.open("POST", "https://authserver.mojang.com/validate", true);
    validate.setRequestHeader("Content-type", "application/json");
    validate.send(JSON.stringify({
    "accessToken": localStorage.accessToken,
    "clientToken": localStorage.clientToken
}));


validate.onreadystatechange = function() {
        if(validate.readyState == 4 && validate.status == 204)
        {
            var loginButton = document.getElementById("login-button");
            loginButton.disabled = true;
            
            var logoutButton = document.getElementById("logout-button");
            logoutButton.disabled = false;
        } 
        if(validate.readyState == 4 && validate.status == 403)
        {
            refreshToken()
            var loginButton = document.getElementById("login-button");
            loginButton.disabled = false;
            
            var logoutButton = document.getElementById("logout-button");
            logoutButton.disabled = false;
        }
    }
}

function refreshToken() {
    var refresher = new XMLHttpRequest();
    refresher.open("POST", "https://authserver.mojang.com/validate", true);
    refresher.setRequestHeader("Content-type", "application/json");
    refresher.send(JSON.stringify({
    "accessToken": localStorage.accessToken,
    "clientToken": localStorage.clientToken,
    "selectedProfile": {
        "id": localStorage.id,
        "name": localStorage.name
    },
    "requestUser": true
}));

refresher.onreadystatechange = function() {
        if(refresher.readyState == 4 && refresher.status == 200)
        {   
            refreshRes = JSON.parse(refresher.responseText)
            mojangRes["accessToken"] = refreshRes["accessToken"];
            mojangRes["clientToken"] = refreshRes["accessToken"];
            localStorage.accessToken  = mojangRes["accessToken"];
            localStorage.clientToken  = mojangRes["clientToken"];

            var loginButton = document.getElementById("login-button");
            loginButton.disabled = true;
            
            var logoutButton = document.getElementById("logout-button");
            logoutButton.disabled = false;
        } 
        if(refresher.readyState == 4 && refresher.status == 403)
        {
            var loginButton = document.getElementById("login-button");
            loginButton.disabled = false;
            
            var logoutButton = document.getElementById("logout-button");
            logoutButton.disabled = false;

            var passEle = document.getElementById("pass")
            pass.value = ""
            alert("会话过期, 请重新登录。")
        }
    }
}

function startMinecraft() {
    if (!localStorage.eula) {
        window.open("./eula.html",target="用户最终许可协议");
        return
    }
    var loginButton = document.getElementById("login-button");
    if (!loginButton.disabled) {
        alert("请先登录")
        return
    }
    var startButton = document.getElementById("start");
    startButton.innerHTML = "启动中...";
    startButton.style.disabled = true;

    
    var javaPath = "\"C:\\\\Program Files\\\\Java\\\\jdk1.8.0_241\\\\jre\\\\bin\\\\java.exe\""
    var basePath = "E:\\agenda-alpha\\.minecraft\\"
    var libsPath = basePath + "versions\\1.12.2\\natives"
    var classPath = basePath + [
                    "libraries\\net\\minecraftforge\\forge\\1.12.2-14.23.5.2854\\forge-1.12.2-14.23.5.2854.jar",
                    "libraries\\org\\ow2\\asm\\asm-debug-all\\5.2\\asm-debug-all-5.2.jar",
                    "libraries\\net\\minecraft\\launchwrapper\\1.12\\launchwrapper-1.12.jar",
                    "libraries\\org\\jline\\jline\\3.5.1\\jline-3.5.1.jar",
                    "libraries\\com\\typesafe\\akka\\akka-actor_2.11\\2.3.3\\akka-actor_2.11-2.3.3.jar",
                    "libraries\\com\\typesafe\\config\\1.2.1\\config-1.2.1.jar",
                    "libraries\\org\\scala-lang\\scala-actors-migration_2.11\\1.1.0\\scala-actors-migration_2.11-1.1.0.jar",
                    "libraries\\org\\scala-lang\\scala-compiler\\2.11.1\\scala-compiler-2.11.1.jar",
                    "libraries\\org\\scala-lang\\plugins\\scala-continuations-library_2.11\\1.0.2_mc\\scala-continuations-library_2.11-1.0.2_mc.jar",
                    "libraries\\org\\scala-lang\\plugins\\scala-continuations-plugin_2.11.1\\1.0.2_mc\\scala-continuations-plugin_2.11.1-1.0.2_mc.jar",
                    "libraries\\org\\scala-lang\\scala-library\\2.11.1\\scala-library-2.11.1.jar",
                    "libraries\\org\\scala-lang\\scala-parser-combinators_2.11\\1.0.1\\scala-parser-combinators_2.11-1.0.1.jar",
                    "libraries\\org\\scala-lang\\scala-reflect\\2.11.1\\scala-reflect-2.11.1.jar",
                    "libraries\\org\\scala-lang\\scala-swing_2.11\\1.0.1\\scala-swing_2.11-1.0.1.jar",
                    "libraries\\org\\scala-lang\\scala-xml_2.11\\1.0.2\\scala-xml_2.11-1.0.2.jar",
                    "libraries\\lzma\\lzma\\0.0.1\\lzma-0.0.1.jar",
                    "libraries\\java3d\\vecmath\\1.5.2\\vecmath-1.5.2.jar",
                    "libraries\\net\\sf\\trove4j\\trove4j\\3.0.3\\trove4j-3.0.3.jar",
                    "libraries\\org\\apache\\maven\\maven-artifact\\3.5.3\\maven-artifact-3.5.3.jar",
                    "libraries\\net\\sf\\jopt-simple\\jopt-simple\\5.0.3\\jopt-simple-5.0.3.jar",
                    "libraries\\com\\mojang\\patchy\\1.1\\patchy-1.1.jar",
                    "libraries\\oshi-project\\oshi-core\\1.1\\oshi-core-1.1.jar",
                    "libraries\\net\\java\\dev\\jna\\jna\\4.4.0\\jna-4.4.0.jar",
                    "libraries\\net\\java\\dev\\jna\\platform\\3.4.0\\platform-3.4.0.jar",
                    "libraries\\com\\ibm\\icu\\icu4j-core-mojang\\51.2\\icu4j-core-mojang-51.2.jar",
                    "libraries\\com\\paulscode\\codecjorbis\\20101023\\codecjorbis-20101023.jar",
                    "libraries\\com\\paulscode\\codecwav\\20101023\\codecwav-20101023.jar",
                    "libraries\\com\\paulscode\\libraryjavasound\\20101123\\libraryjavasound-20101123.jar",
                    "libraries\\com\\paulscode\\librarylwjglopenal\\20100824\\librarylwjglopenal-20100824.jar",
                    "libraries\\com\\paulscode\\soundsystem\\20120107\\soundsystem-20120107.jar",
                    "libraries\\io\\netty\\netty-all\\4.1.9.Final\\netty-all-4.1.9.Final.jar",
                    "libraries\\com\\google\\guava\\guava\\21.0\\guava-21.0.jar",
                    "libraries\\org\\apache\\commons\\commons-lang3\\3.5\\commons-lang3-3.5.jar",
                    "libraries\\commons-io\\commons-io\\2.5\\commons-io-2.5.jar",
                    "libraries\\commons-codec\\commons-codec\\1.10\\commons-codec-1.10.jar",
                    "libraries\\net\\java\\jinput\\jinput\\2.0.5\\jinput-2.0.5.jar",
                    "libraries\\net\\java\\jutils\\jutils\\1.0.0\\jutils-1.0.0.jar",
                    "libraries\\com\\google\\code\\gson\\gson\\2.8.0\\gson-2.8.0.jar",
                    "libraries\\com\\mojang\\authlib\\1.5.25\\authlib-1.5.25.jar",
                    "libraries\\com\\mojang\\realms\\1.10.22\\realms-1.10.22.jar",
                    "libraries\\org\\apache\\commons\\commons-compress\\1.8.1\\commons-compress-1.8.1.jar",
                    "libraries\\org\\apache\\httpcomponents\\httpclient\\4.3.3\\httpclient-4.3.3.jar",
                    "libraries\\commons-logging\\commons-logging\\1.1.3\\commons-logging-1.1.3.jar",
                    "libraries\\org\\apache\\httpcomponents\\httpcore\\4.3.2\\httpcore-4.3.2.jar",
                    "libraries\\it\\unimi\\dsi\\fastutil\\7.1.0\\fastutil-7.1.0.jar",
                    "libraries\\org\\apache\\logging\\log4j\\log4j-api\\2.8.1\\log4j-api-2.8.1.jar",
                    "libraries\\org\\apache\\logging\\log4j\\log4j-core\\2.8.1\\log4j-core-2.8.1.jar",
                    "libraries\\org\\lwjgl\\lwjgl\\lwjgl\\2.9.4-nightly-20150209\\lwjgl-2.9.4-nightly-20150209.jar",
                    "libraries\\org\\lwjgl\\lwjgl\\lwjgl_util\\2.9.4-nightly-20150209\\lwjgl_util-2.9.4-nightly-20150209.jar",
                    "libraries\\com\\mojang\\text2speech\\1.10.3\\text2speech-1.10.3.jar",
                    "versions\\1.12.2\\1.12.2.jar"
                ].reduce((acc, i) => acc + ";" + basePath + i)
    var jvmArgs = ["-Dminecraft.client.jar=.minecraft\\versions\\1.12.2\\1.12.2.jar",
                    "-XX:+UnlockExperimentalVMOptions",
                    "-XX:+UseG1GC", 
                    "-XX:G1NewSizePercent=20",
                    "-XX:G1ReservePercent=20",
                    "-XX:MaxGCPauseMillis=50",
                    "-XX:G1HeapRegionSize=16M",
                    "-XX:-UseAdaptiveSizePolicy",
                    "-XX:-OmitStackTraceInFastThrow",
                    "-Xmn" + parseInt(localStorage.xmx / 4) + "m",
                    "-Xmx" + localStorage.xmx + "m",
                    "-Dfml.ignoreInvalidMinecraftCertificates=true",
                    "-Dfml.ignorePatchDiscrepancies=true",
                    "-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump",
                    "-Djava.library.path=" + libsPath,
                    "-Dminecraft.launcher.brand=AML",
                    "-Dminecraft.launcher.version=1.0.0",
                    "-cp " + classPath,
                    "net.minecraft.launchwrapper.Launch"].reduce((acc, i) => acc + " " + i)
    var gameArgs = ["--username moeKiwiSAMA",
                    "--version \"AML 1.0.0\"",
                    "--gameDir " + basePath.slice(0, basePath.length - 1),
                    "--assetsDir " + basePath + "assets",
                    "--assetIndex 1.12",
                    "--uuid " + localStorage.id,
                    "--accessToken " + localStorage.accessToken,
                    "--userType mojang",
                    "--tweakClass net.minecraftforge.fml.common.launcher.FMLTweaker",
                    "--versionType Forge",
                    "--width 854",
                    "--height 480"].reduce((acc, i) => acc + " " + i)
    finalCMD = javaPath + " " + jvmArgs + " " + gameArgs
    cmd.run(finalCMD)
    
    sleep(10000).then(() => {
        self.close()
    })

}

function beep() {
    console.log("beep")
}
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function authMojang() {
    var startButton = document.getElementById("start")
    startButton.disabled = true
    var emailEle = document.getElementById("email")
    var email = emailEle.value
    
    var passEle = document.getElementById("pass")
    var pass = passEle.value
    if (email == "" || pass == "") {
        alert("请正确填写登录信息")
        return
    }

    var loginButton = document.getElementById("login-button");
    loginButton.disabled = true;
    var auther = new XMLHttpRequest();
    auther.open("POST", "https://authserver.mojang.com/authenticate", true);
    auther.setRequestHeader("Content-type", "application/json");
    auther.send(JSON.stringify({
    "agent": {
        "name": "Minecraft",
        "version": 1
    },
    "username": email,
    "password": pass,
    "requestUser": true
}));
    auther.onreadystatechange = function() {
        if(auther.readyState == 4 && auther.status == 200)
        {
            var logoutButton = document.getElementById("logout-button");
            logoutButton.disabled = false;

            var reloginButton = document.getElementById("relogin-button");
            reloginButton.disabled = false;
            localStorage.email = email;
            mojangRes = JSON.parse(auther.responseText)
            localStorage.accessToken  = mojangRes["accessToken"];
            localStorage.clientToken  = mojangRes["clientToken"];
            
            localStorage.name = mojangRes["selectedProfile"]["name"];
            localStorage.id = mojangRes["selectedProfile"]["id"];
            startButton.disabled = false
        } 
        if(auther.readyState == 4 && auther.status != 200)
        {
            var loginButton = document.getElementById("login-button");
            loginButton.disabled = false;
            alert("登录失败!\n异常类型: " 
            + JSON.parse(auther.responseText)["error"]
            + "\n错误消息: " 
            +JSON.parse(auther.responseText)["errorMessage"]
            + "\n这往往是凭据错误或登录过于频繁导致的。")
            // location.reload()
        }
}

}
function logout() {
    var logoutButton = document.getElementById("logout-button");
    logoutButton.disabled = true;
    var loginButton = document.getElementById("login-button");
    loginButton.disabled = false;
    var reloginButton = document.getElementById("relogin-button");
    reloginButton.disabled = true;
}

function reLogin() {
    var logoutButton = document.getElementById("logout-button");
    logoutButton.disabled = true;
    var reloginButton = document.getElementById("relogin-button");
    reloginButton.disabled = false;
    var reloginButton = document.getElementById("relogin-button");
    reloginButton.disabled = true;
    authMojang()
}

function donate() {
    const { shell, BrowserWindow } = require('electron');
    shell.openExternal("https://donate.kiwi.cat")
}

function minecraftEula() {
    const { shell } = require('electron');
    shell.openExternal("https://account.mojang.com/documents/minecraft_eula")
}

function chinaInformationLaw() {
    const { shell } = require('electron');
    shell.openExternal("http://www.gov.cn/flfg/2005-08/06/content_20928.htm")
}

function kiwi() {
    const { shell } = require('electron');
    shell.openExternal("https://nyan.kiwi.cat/")
}

function ls() {
    const { shell } = require('electron');
    shell.openExternal("https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage")
}

function jas() {
    const { shell } = require('electron');
    shell.openExternal("https://developer.mozilla.org/en-US/docs/Web/JavaScript")
}

function eulaTrue() {
    localStorage.eula = "true"
    self.close()
}


function eulaFalse() {
    self.close()
}

function settings() {
    let win = new BrowserWindow({
        width: 500, 
        height: 400,
        resizable: true
    })

    win.loadURL(`file://${__dirname}/settings.html`)
}

function settingsInit() {
    xmx = document.getElementById("xmx")
    xmx.value = localStorage.xmx
    
}

function applySettings() {
    xmx = document.getElementById("xmx")
    localStorage.xmx = xmx.value
    self.close()
}