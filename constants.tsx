
import React from 'react';
import { Mission, MissionType, CatType } from './types';

export const CAT_STATS = {
  [CatType.LIHUA]: {
    logic: 2,
    investigation: 2,
    charm: 0,
    empathy: 0,
    perception: 1,
    description: "推理大师，擅长破解谜题。逻辑+2，侦查+2",
    icon: "🐱"
  },
  [CatType.ORANGE]: {
    logic: 0,
    investigation: 0,
    charm: 2,
    empathy: 2,
    perception: 1,
    description: "社交达人，擅长理解他人。魅力+2，共情+2",
    icon: "🐈"
  }
};

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "任务一：记忆迷雾 🕵️",
    skill: "感知检定",
    difficulty: 8,
    type: MissionType.DICE,
    bonusAttribute: 'perception',
    description: "在YYQ的公寓里，你发现了一张褪色的照片...照片背后写着一行字：'还记得我们第一次一起做的事吗？' 你的猫咪直觉告诉你，这是一条重要线索...",
    successText: "🎉 成功！你的胡须微微颤动，记忆如潮水般涌来！没错，就是那天...那个特殊的时刻... ✨ 线索 +1：一张完整的回忆拼图",
    failureText: "💫 未能完成。你挠了挠耳朵，记忆有些模糊...但爱不需要完美的记忆对吧？重要的不是记得所有细节，而是记得那份温暖的感觉... 💭 '有时候，感受比记忆更真实'"
  },
  {
    id: 2,
    title: "任务二：密码保险箱 🔐",
    skill: "逻辑检定",
    difficulty: 10,
    type: MissionType.DICE,
    bonusAttribute: 'logic',
    description: "你在桌上发现一个密码锁保险箱，上面刻着：'我们的重要日子'。作为侦探猫，你需要推理出正确的密码！",
    successText: "🎉 成功！咔嚓！保险箱打开了！里面是一封YYQ写给你的信：'你知道吗？每一个和你在一起的日子，都是我想要记住的重要日子...' 🎁 获得物品：YYQ的秘密情书",
    failureText: "💫 未能完成。保险箱纹丝不动...你用爪子试图撬开它，甚至用头去顶了顶，但显然需要更优雅的方法。不过没关系，有些秘密需要慢慢解开。🐾 '也许最好的密码，就是心意相通'"
  },
  {
    id: 3,
    title: "任务三：心意感应 💭",
    skill: "共情检定",
    difficulty: 7,
    type: MissionType.CHOICE,
    bonusAttribute: 'empathy',
    description: "房间里散落着几样物品。作为一只敏锐的猫，你需要用第六感判断：YYQ最可能把重要线索藏在哪里？",
    options: ["🎮 游戏机旁边", "📚 书架上", "🛏️ 枕头下", "☕ 咖啡桌"],
    correctOption: 2, // C
    successText: "🎉 成功！你的猫直觉告诉你...就是这里！你轻巧地跳上床，用爪子翻开枕头，发现了YYQ的日记本，里面夹着你们的合照。📖 线索 +1：日记中的秘密",
    failureText: "💫 未能完成。你翻找了一番，虽然没找到关键线索，但发现了YYQ偷偷收藏的你的照片... 照片背后写着：'她笑起来真好看'。💕 '有时候，寻找本身就是答案'"
  },
  {
    id: 4,
    title: "任务四：隐藏线索 🔍",
    skill: "侦查检定",
    difficulty: 9,
    type: MissionType.DICE,
    bonusAttribute: 'investigation',
    description: "墙上挂着一幅画，画面是你们一起去过的地方。但总觉得哪里不对劲...你必须感知房间里的异常...",
    successText: "🎉 成功！等等！画框后面有东西！你用爪子小心翼翼地把画拉开，发现了一张地图，上面标记着'最终地点'！🗺️ 关键线索：藏宝地图！",
    failureText: "💫 未能完成。你盯着画看了很久，暂时没有发现异常。不过你的猫咪直觉告诉你，这幅画一定有问题... 🎨 '艺术需要时间去欣赏'"
  },
  {
    id: 5,
    title: "任务五：终极卖萌 😻",
    skill: "魅力检定",
    difficulty: 5,
    type: MissionType.DICE,
    bonusAttribute: 'charm',
    description: "终于，在最后的房间里，你看到了被施了'沉睡魔法'的YYQ！要唤醒他，只有一个办法——发动终极卖萌攻击！",
    successText: "🎉 成功！'喵～' 你发出最柔软、最可爱的叫声，用小爪子轻轻拍了拍他的脸... YYQ睁开了眼睛，露出了温暖的笑容。💖 YYQ已被成功唤醒！",
    failureText: "（此任务必胜）",
  }
];

export const ENDINGS = {
  PERFECT: {
    title: "🎊 完美结局：真爱无敌！",
    icon: "💝",
    text: "你成功集齐了所有的线索，唤醒了YYQ！他说：'我就知道你一定会来的。这一路上的每个谜题，都是我为你准备的考验，因为我想确认...你是真的了解我。' 🎁 礼物就在你最常坐的那个位置旁边...抬头看看～"
  },
  SUCCESS: {
    title: "💖 成功结局：爱的力量！",
    icon: "🌟",
    text: "虽然不是所有谜题都解开了，但你集齐了足够的线索！YYQ醒来笑着说：'真爱是任何谜题都困不住的。其实啊，最重要的不是解开所有谜题，而是你愿意为我来到这里。' 🎁 去你最喜欢的那个角落看看..."
  },
  WARM: {
    title: "💕 温馨结局：过程最重要！",
    icon: "🌈",
    text: "侦探喵...虽然挑战重重，但你依然没有放弃。YYQ缓缓睁开眼睛，看到你时轻声说：'谢谢你来找我...不管结果如何，你愿意来就已经是最好的礼物了。' 🎁 礼物就在你身边～"
  }
};
