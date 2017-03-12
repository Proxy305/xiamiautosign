# XiamiAutoSign
Automatically daily sign for xiami.com via PhantomJS

## Change log

- v0.0.4: Debug output and debug render is now disabled.

## Description

Xiami.com is a Chinese online music service. You can listen to online music for free on xiami.com, but when it comes to download, it is not free. However, you can collect points, which can be used to download songs, by commiting "daily signs", which means visit xiami.com, log in and click the "SIGN" button. You can sign once per day. After you have signed, the "SIGN" button will remain unclickable in the rest of the day. Once you have signed for a sequencial 7 days, one point will be given. And the longer the sequence is, the more points you get.Since it's so easy to forget to sign, which voids the sequence and the efforts,it will be better to make this automatic. 

XiamiAutoSign is a PhantomJS script for finishing the xiami.com auto daily sign. Running XiamiAutoSign will sign in you xiami.com account and perform sign action for once. When and only when used with other automation tools (e.g. cron), the goal of automatic daily sign can be achieved.

XiamiAutoSign is designed for xiami.com, but its usage is not limited. In theory, XiamiAutoSign applies to any browser workflow which consist of two actions: `Input` and `Click`.

- `Input` : Input contents in elements like \<textarea\>, \<input\>, etc.
- `Click` : Clicking some elements, like \<a\>, \<button\>, etc.

You can see signing xiami.com as the built-in workflow, and it's only one of many workflows possible. By modifying the config file, everyone can create his/her workflow in a couple of minutes.

## Dependency

- PhantomJS

## Installation & Run

Simply clone this to local:

    git clone https://github.com/Proxy305/xiamiautosign.git

Open config.json, change the username and the password.

Browse to the repo folder in terminal, then:

    phantomjs sign.js

If you'd like to use config file other than `config.json`, then:

    phantomjs sign.js path/to/config.json

## Configuration Guide

If you wish to compose your own workflow via altering `config.json`, please see wiki for guidance.

## Known issues

- In rare cases, xiamiautosign might fail. If you are using `cron`, please set multiple `cronjob`s for xiamiautosign, so it has the chance to retry.

## Disclaimer

XiamiAutoSign comes with no warranty. Using XiamiAutoSign means that you are fully informed of the possible risks and consequences, and are willing to take all corresonding responisibilities. 

