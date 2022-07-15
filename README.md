# VRChat-OSCproxyHub

```
> npm install
> npm run tsc
> npm run regist
```

OSCでUDP#9001番へ送信:
* `/Hub/regist", Unique-ID, Port`  
    localhost#Portに対してVRChatから受信したメッセージを転送します  
    VRChat → this_app#9001 → your_app#Port

* `/Hub/unregist", Unique-ID`
    転送をやめます