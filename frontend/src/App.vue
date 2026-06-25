<script setup lang="ts">
import { computed, ref } from "vue";

type TopTab = "mood" | "recommend" | "sound" | "podcast" | "book" | "night";
type BottomTab = "home" | "friends" | "notes" | "mine";
type MineTab = "music" | "podcast" | "notes";
type MineFilter = "recent" | "created" | "favorite";

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  color: string;
  mark: string;
  tag: string;
};

type LibraryItem = {
  title: string;
  meta: string;
  color: string;
  mark: string;
};

type Note = {
  title: string;
  body: string;
  tag: string;
  color: string;
};

const activeTop = ref<TopTab>("podcast");
const activeBottom = ref<BottomTab>("home");
const mineTab = ref<MineTab>("music");
const mineFilter = ref<MineFilter>("recent");
const profileOpen = ref(false);
const currentTrackId = ref(1);
const isPlaying = ref(true);
const playerOpen = ref(false);
const playerTool = ref<"tune" | "queue" | null>(null);
const menuOpen = ref(false);
const friendFilter = ref("全部");
const progress = ref(42);
const profileName = ref("每日音乐");
const profileSignature = ref("用声音记录每天的状态，也用前端把体验做得更顺手。");
const profileAvatar = ref("LZ");
const selectedProfileTheme = ref(0);

const topTabs: { key: TopTab; label: string }[] = [
  { key: "mood", label: "灵感" },
  { key: "recommend", label: "推荐" },
  { key: "sound", label: "声场" },
  { key: "podcast", label: "播客" },
  { key: "book", label: "听书" },
  { key: "night", label: "夜场" },
];

const bottomTabs: { key: BottomTab; label: string; icon: string }[] = [
  { key: "home", label: "首页", icon: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" },
  { key: "friends", label: "好友", icon: "M16 11a4 4 0 1 0-8 0M3.5 21a6.5 6.5 0 0 1 13 0M17 8a3 3 0 0 1 0 6M18.5 21a5 5 0 0 0-3-4.33" },
  { key: "notes", label: "灵感", icon: "M6 4h9l3 3v13H6zM14 4v4h4M9 12h6M9 16h6" },
  { key: "mine", label: "我的", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" },
];

const mineTabs: { key: MineTab; label: string }[] = [
  { key: "music", label: "音乐" },
  { key: "podcast", label: "播客" },
  { key: "notes", label: "笔记" },
];

const mineFilters: { key: MineFilter; label: string }[] = [
  { key: "recent", label: "近期" },
  { key: "created", label: "创建" },
  { key: "favorite", label: "收藏" },
];

const tracks = ref<Track[]>([
  {
    id: 1,
    title: "海屿你 0.8x",
    artist: "海屿你 0.8x 降调",
    album: "慢速降调完整版",
    duration: "03:42",
    color: "#db5866",
    mark: "海",
    tag: "慢速",
  },
  {
    id: 2,
    title: "S 宇智波带土十尾人柱力",
    artist: "火影忍者手游",
    album: "游戏混剪",
    duration: "04:08",
    color: "#8db8a8",
    mark: "忍",
    tag: "剪辑",
  },
  {
    id: 3,
    title: "真正的自由，不是一种放纵的自由",
    artist: "法外狂徒张三",
    album: "观点摘录",
    duration: "05:18",
    color: "#d0a76b",
    mark: "说",
    tag: "观点",
  },
  {
    id: 4,
    title: "大风吹",
    artist: "王赫野",
    album: "华语热歌",
    duration: "03:27",
    color: "#4d86a7",
    mark: "风",
    tag: "热歌",
  },
]);

const featuredCards = [
  { title: "晨间低频", desc: "轻节奏唤醒", color: "#256f79" },
  { title: "通勤声景", desc: "城市律动", color: "#6d5bd0" },
  { title: "深夜独处", desc: "安静循环", color: "#202938" },
];

const podcastItems: LibraryItem[] = [
  { title: "#19 你所不认识的五月天", meta: "音乐故事 · 28分钟", color: "#dbeee3", mark: "五" },
  { title: "制作人如何听一首歌", meta: "声场研究所 · 18分钟", color: "#e8e0f5", mark: "制" },
  { title: "一段旋律为什么会反复出现", meta: "旋律档案 · 21分钟", color: "#e9d4c5", mark: "旋" },
];

const notes: Note[] = [
  { title: "把副歌前 8 秒做成短视频钩子", body: "适合用于作品集展示，能快速说明声音设计和视觉节奏的关系。", tag: "剪辑", color: "#ff796d" },
  { title: "播客页信息密度控制", body: "顶部频道、专题卡片、列表入口要同时可扫读，不要全部做成大卡片。", tag: "产品", color: "#2da8a2" },
  { title: "黑胶播放页的差异化方向", body: "可以保留唱片隐喻，但背景做动态声波和歌词标记，避免完全复刻。", tag: "UI", color: "#7569d9" },
];

const libraryMap: Record<MineTab, Record<MineFilter, LibraryItem[]>> = {
  music: {
    recent: [
      { title: "夜间写代码｜低干扰循环", meta: "歌单 · 42首 · 最近播放", color: "#253044", mark: "夜" },
      { title: "华语慢速降调收藏", meta: "歌单 · 31首 · 昨天更新", color: "#8d3f49", mark: "慢" },
      { title: "听歌排行", meta: "累计听歌3748首", color: "#667085", mark: "榜" },
    ],
    created: [
      { title: "我的移动端 Demo 配乐", meta: "自建歌单 · 18首", color: "#256f79", mark: "作" },
      { title: "面试前提神歌单", meta: "自建歌单 · 25首", color: "#e26a5d", mark: "面" },
    ],
    favorite: [
      { title: "喜欢的音乐", meta: "收藏 · 128首", color: "#db5866", mark: "心" },
      { title: "最近反复播放", meta: "收藏 · 36首", color: "#d0a76b", mark: "循" },
    ],
  },
  podcast: {
    recent: [
      { title: "音乐播客：音乐故事", meta: "最近听到第 19 期", color: "#dbeee3", mark: "播" },
      { title: "声场研究所", meta: "更新至 42 期", color: "#e8e0f5", mark: "研" },
    ],
    created: [
      { title: "我的播客剪辑清单", meta: "创建 · 7段素材", color: "#2da8a2", mark: "剪" },
      { title: "产品灵感播客", meta: "创建 · 12期", color: "#7569d9", mark: "灵" },
    ],
    favorite: [
      { title: "收藏的声音故事", meta: "收藏 · 23期", color: "#e9d4c5", mark: "藏" },
      { title: "设计师访谈", meta: "收藏 · 9期", color: "#4d86a7", mark: "访" },
    ],
  },
  notes: {
    recent: [
      { title: "播客页竞品观察", meta: "笔记 · 今天 17:40", color: "#ff796d", mark: "记" },
      { title: "播放器动效草图", meta: "笔记 · 昨天", color: "#7569d9", mark: "动" },
    ],
    created: [
      { title: "我创建的 UI 规范", meta: "笔记集 · 6篇", color: "#2da8a2", mark: "规" },
      { title: "音乐 App 面试讲稿", meta: "笔记集 · 4篇", color: "#253044", mark: "稿" },
    ],
    favorite: [
      { title: "值得复用的底部播放器", meta: "收藏笔记 · 3条批注", color: "#d0a76b", mark: "收" },
      { title: "滑动切换微交互", meta: "收藏笔记 · 5条批注", color: "#8d3f49", mark: "滑" },
    ],
  },
};

const friendFilters = ["全部", "在线", "一起听", "附近"];
const friends = [
  { name: "阿澈", status: "正在听：低频航班", online: true, color: "#0f766e", avatar: "澈" },
  { name: "Mika", status: "刚收藏了《大风吹》", online: true, color: "#ff796d", avatar: "M" },
  { name: "夏木", status: "发布了一条听歌笔记", online: false, color: "#7569d9", avatar: "夏" },
  { name: "北岛", status: "邀请你一起听夜场歌单", online: true, color: "#202938", avatar: "北" },
];
const profileThemes = [
  { name: "薄荷声波", color: "#0f766e" },
  { name: "日落唱片", color: "#ff796d" },
  { name: "深夜黑胶", color: "#202938" },
];

const pageKey = computed(() => `${activeBottom.value}-${activeTop.value}-${mineTab.value}-${mineFilter.value}`);
const currentTrack = computed(() => tracks.value.find((track) => track.id === currentTrackId.value) ?? tracks.value[0]);
const mineItems = computed(() => libraryMap[mineTab.value][mineFilter.value]);
const visibleFriends = computed(() => {
  if (friendFilter.value === "在线") return friends.filter((friend) => friend.online);
  if (friendFilter.value === "一起听") return friends.filter((friend) => friend.status.includes("一起听") || friend.status.includes("正在听"));
  if (friendFilter.value === "附近") return friends.slice(1, 4);
  return friends;
});

function playTrack(track: Track) {
  currentTrackId.value = track.id;
  isPlaying.value = true;
  progress.value = Math.max(18, Math.min(78, 18 + track.id * 14));
}

function openPlayer(track?: Track) {
  if (track) playTrack(track);
  playerOpen.value = true;
  playerTool.value = null;
}

function nextTrack() {
  const index = tracks.value.findIndex((track) => track.id === currentTrackId.value);
  playTrack(tracks.value[(index + 1) % tracks.value.length]);
}

function selectTopTab(tab: TopTab, event?: MouseEvent) {
  activeTop.value = tab;
  activeBottom.value = "home";
  const target = event?.currentTarget;
  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}

function goBottom(tab: BottomTab) {
  activeBottom.value = tab;
  profileOpen.value = false;
  if (tab === "mine") activeTop.value = "sound";
}
</script>

<template>
  <main class="stage">
    <section class="phone" aria-label="声场移动端音乐软件演示">
      <div class="music-app">
        <header class="topbar">
          <button class="icon-button badge" aria-label="打开菜单" @click="menuOpen = true">
            <span>每日</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h13M4 17h16" />
            </svg>
          </button>

          <nav class="top-tabs" aria-label="顶部频道">
            <button
              v-for="tab in topTabs"
              :key="tab.key"
              :class="{ selected: activeTop === tab.key && activeBottom === 'home' }"
              type="button"
              @click="selectTopTab(tab.key, $event)"
            >
              {{ tab.label }}
            </button>
          </nav>

          <button class="icon-button" aria-label="进入好友" @click="activeBottom = 'friends'">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 11a4 4 0 1 0-8 0M3.5 21a6.5 6.5 0 0 1 13 0M17 8a3 3 0 0 1 0 6M18.5 21a5 5 0 0 0-3-4.33" />
            </svg>
          </button>
        </header>

        <div class="content">
          <Transition name="slide-panel" mode="out-in">
            <section :key="pageKey" class="page-panel">
              <template v-if="activeBottom === 'friends'">
                <section class="friends-panel">
                  <section class="friends-hero">
                    <div>
                      <span>好友动态</span>
                      <strong>一起听、互相收藏，把音乐变成关系链。</strong>
                    </div>
                    <button>邀请好友</button>
                  </section>

                  <section class="listen-room">
                    <div class="room-disc">听</div>
                    <div>
                      <strong>一起听房间</strong>
                      <small>北岛邀请你加入夜场歌单 · 4 人在线</small>
                    </div>
                    <button @click="friendFilter = '一起听'">加入</button>
                  </section>

                  <div class="friend-filter-row" aria-label="好友筛选">
                    <button
                      v-for="item in friendFilters"
                      :key="item"
                      type="button"
                      :class="{ selected: friendFilter === item }"
                      @click="friendFilter = item"
                    >
                      {{ item }}
                    </button>
                  </div>

                  <section class="friend-list" aria-label="好友列表">
                    <article v-for="friend in visibleFriends" :key="friend.name" class="friend-card">
                      <span class="friend-avatar" :style="{ '--friend': friend.color }">{{ friend.avatar }}</span>
                      <div class="friend-copy">
                        <strong>{{ friend.name }}</strong>
                        <small>{{ friend.status }}</small>
                      </div>
                      <span class="friend-state" :class="{ online: friend.online }">{{ friend.online ? "在线" : "离线" }}</span>
                      <button type="button">一起听</button>
                    </article>
                  </section>

                  <section class="friend-activity">
                    <div class="section-title compact-title">
                      <strong>朋友在听</strong>
                    </div>
                    <article v-for="track in tracks.slice(0, 3)" :key="track.id" class="audio-item compact">
                      <span class="square-cover" :style="{ '--song': track.color }">{{ track.mark }}</span>
                      <button class="audio-main" @click="playTrack(track)">
                        <strong>{{ track.title }}</strong>
                        <small>{{ track.artist }} · 来自好友收藏</small>
                      </button>
                      <button class="play-icon" @click="openPlayer(track)" aria-label="播放">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                      </button>
                    </article>
                  </section>
                </section>
              </template>

              <template v-else-if="activeBottom === 'notes'">
                <section class="notes-hero">
                  <span>灵感笔记</span>
                  <strong>把听歌时冒出来的想法收好。</strong>
                  <button>新建笔记</button>
                </section>
                <section class="note-list">
                  <article v-for="note in notes" :key="note.title" class="note-card" :style="{ '--note': note.color }">
                    <span>{{ note.tag }}</span>
                    <strong>{{ note.title }}</strong>
                    <p>{{ note.body }}</p>
                  </article>
                </section>
              </template>

              <template v-else-if="activeBottom === 'mine'">
                <template v-if="profileOpen">
                  <section class="profile-editor">
                    <button class="back-button" @click="profileOpen = false">返回</button>
                    <section class="profile-card" :style="{ '--profile': profileThemes[selectedProfileTheme].color }">
                      <div class="profile-bg">
                        <span>音乐号</span>
                        <strong>@daily-music-lz</strong>
                      </div>
                      <div class="profile-row">
                        <button class="profile-avatar" @click="profileAvatar = profileAvatar === 'LZ' ? 'DM' : 'LZ'">
                          {{ profileAvatar }}
                        </button>
                        <div>
                          <strong>{{ profileName }}</strong>
                          <small>{{ profileSignature }}</small>
                        </div>
                      </div>
                    </section>

                    <section class="profile-form">
                      <label>
                        <span>头像文字</span>
                        <input v-model="profileAvatar" maxlength="2" aria-label="头像文字" />
                      </label>
                      <label>
                        <span>用户名</span>
                        <input v-model="profileName" aria-label="用户名" />
                      </label>
                      <label>
                        <span>个性签名</span>
                        <textarea v-model="profileSignature" rows="3" aria-label="个性签名"></textarea>
                      </label>
                    </section>

                    <section class="profile-themes">
                      <div class="section-title">
                        <strong>背景卡</strong>
                      </div>
                      <button
                        v-for="(theme, index) in profileThemes"
                        :key="theme.name"
                        :class="{ selected: selectedProfileTheme === index }"
                        :style="{ '--profile': theme.color }"
                        @click="selectedProfileTheme = index"
                      >
                        <span></span>
                        {{ theme.name }}
                      </button>
                    </section>

                    <section class="profile-stats">
                      <article>
                        <strong>128</strong>
                        <span>收藏音乐</span>
                      </article>
                      <article>
                        <strong>23</strong>
                        <span>播客订阅</span>
                      </article>
                      <article>
                        <strong>14</strong>
                        <span>公开笔记</span>
                      </article>
                    </section>
                  </section>
                </template>

                <template v-else>
                  <section class="mine-head">
                    <button class="avatar profile-entry" @click="profileOpen = true">{{ profileAvatar }}</button>
                    <button class="mine-name" @click="profileOpen = true">
                      <strong>{{ profileName }}</strong>
                      <small>前端作品集 · 音乐产品 Demo</small>
                    </button>
                    <button aria-label="添加">+</button>
                  </section>

                  <section class="sub-tabs">
                    <button
                      v-for="tab in mineTabs"
                      :key="tab.key"
                      :class="{ selected: mineTab === tab.key }"
                      type="button"
                      @click="mineTab = tab.key"
                    >
                      {{ tab.label }}
                    </button>
                  </section>

                  <section class="mine-list">
                    <div class="mine-filters">
                      <button
                        v-for="filter in mineFilters"
                        :key="filter.key"
                        :class="{ selected: mineFilter === filter.key }"
                        type="button"
                        @click="mineFilter = filter.key"
                      >
                        {{ filter.label }}
                      </button>
                    </div>
                    <article v-for="item in mineItems" :key="item.title" class="mine-item">
                      <span class="square-cover" :style="{ '--song': item.color }">{{ item.mark }}</span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.meta }}</small>
                      </div>
                      <button aria-label="更多">⋮</button>
                    </article>
                    <article class="create-item">
                      <span>+</span>
                      <div>
                        <strong>添加新的{{ mineTab === "music" ? "歌单" : mineTab === "podcast" ? "播客清单" : "笔记集" }}</strong>
                        <small>这个入口会根据当前子模块变化</small>
                      </div>
                    </article>
                  </section>
                </template>
              </template>

              <template v-else-if="activeTop === 'sound'">
                <section class="wide-banner brand-banner">
                  <span>EchoLab 声场实验</span>
                  <strong>听感雷达</strong>
                  <button>生成今日声纹</button>
                </section>
                <section class="category-grid">
                  <button>氛围</button>
                  <button>华语</button>
                  <button>电子</button>
                  <button>播客</button>
                  <button>通勤</button>
                  <button>睡前</button>
                  <button>创作</button>
                  <button>复盘</button>
                </section>
                <section class="song-section">
                  <div class="section-title">
                    <strong>声场精选</strong>
                    <button @click="nextTrack">换一批</button>
                  </div>
                  <article v-for="track in tracks.slice(0, 3)" :key="track.id" class="audio-item">
                    <span class="square-cover" :style="{ '--song': track.color }">{{ track.mark }}</span>
                    <button class="audio-main" @click="playTrack(track)">
                      <strong>{{ track.title }}</strong>
                      <small>{{ track.artist }} · {{ track.album }}</small>
                    </button>
                    <button class="play-icon" @click="openPlayer(track)" aria-label="播放">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
              </template>

              <template v-else-if="activeTop === 'podcast'">
                <section class="podcast-card">
                  <div>
                    <span>声场播客 · 音乐故事</span>
                    <strong>#19 你所不认识的五月天</strong>
                    <small>转眼-五月天</small>
                  </div>
                  <div class="podcast-cover">五</div>
                  <button @click="openPlayer()">播放单集</button>
                </section>

                <section class="action-row">
                  <button @click="mineTab = 'podcast'; activeBottom = 'mine'">我的播客</button>
                  <button @click="activeBottom = 'friends'; friendFilter = '一起听'">一起听</button>
                  <button @click="activeBottom = 'notes'">声音百科</button>
                </section>

                <section class="song-section">
                  <div class="section-title">
                    <strong>为你推荐</strong>
                  </div>
                  <article v-for="track in tracks.slice(0, 3)" :key="track.id" class="audio-item">
                    <span class="square-cover" :style="{ '--song': track.color }">{{ track.mark }}</span>
                    <button class="audio-main" @click="playTrack(track)">
                      <small>{{ track.album }}</small>
                      <strong>{{ track.title }}</strong>
                      <small>{{ track.artist }}</small>
                    </button>
                    <button class="play-icon" @click="openPlayer(track)" aria-label="播放">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
              </template>

              <template v-else-if="activeTop === 'mood'">
                <section class="mood-hero">
                  <span>灵感雷达</span>
                  <strong>把听歌时的情绪和想法连起来。</strong>
                  <button @click="activeBottom = 'notes'">写一条灵感</button>
                </section>
                <section class="insight-grid">
                  <article>
                    <strong>今日情绪</strong>
                    <span>平静 · 68%</span>
                  </article>
                  <article>
                    <strong>常听场景</strong>
                    <span>通勤 / 写作</span>
                  </article>
                </section>
                <section class="song-section">
                  <div class="section-title">
                    <strong>灵感触发器</strong>
                    <button @click="activeBottom = 'notes'">查看笔记</button>
                  </div>
                  <article v-for="note in notes" :key="note.title" class="note-card" :style="{ '--note': note.color }">
                    <span>{{ note.tag }}</span>
                    <strong>{{ note.title }}</strong>
                    <p>{{ note.body }}</p>
                  </article>
                </section>
              </template>

              <template v-else-if="activeTop === 'recommend'">
                <section class="recommend-hero">
                  <div>
                    <span>每日精选</span>
                    <strong>按你的收听习惯重新排序。</strong>
                  </div>
                  <button @click="openPlayer()">播放今日推荐</button>
                </section>
                <section class="feature-row">
                  <article v-for="card in featuredCards" :key="card.title" :style="{ '--song': card.color }">
                    <strong>{{ card.title }}</strong>
                    <small>{{ card.desc }}</small>
                    <button @click="openPlayer()">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
                <section class="song-section">
                  <div class="section-title">
                    <strong>猜你会循环</strong>
                    <button @click="nextTrack">换一批</button>
                  </div>
                  <article v-for="track in tracks" :key="track.id" class="audio-item compact">
                    <span class="square-cover" :style="{ '--song': track.color }">{{ track.mark }}</span>
                    <button class="audio-main" @click="playTrack(track)">
                      <strong>{{ track.title }}</strong>
                      <small>{{ track.artist }} · {{ track.album }}</small>
                    </button>
                    <button class="play-icon" @click="openPlayer(track)" aria-label="播放">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
              </template>

              <template v-else-if="activeTop === 'book'">
                <section class="book-hero">
                  <span>听书频道</span>
                  <strong>把长内容拆成适合碎片时间的章节。</strong>
                </section>
                <section class="book-list">
                  <article>
                    <span>产品传记</span>
                    <strong>创作者的声音经济</strong>
                    <small>第 4 章 · 32 分钟</small>
                  </article>
                  <article>
                    <span>设计方法</span>
                    <strong>移动端信息架构</strong>
                    <small>第 2 章 · 26 分钟</small>
                  </article>
                  <article>
                    <span>故事电台</span>
                    <strong>城市夜行人的十个片段</strong>
                    <small>单集 · 18 分钟</small>
                  </article>
                </section>
              </template>

              <template v-else-if="activeTop === 'night'">
                <section class="night-hero">
                  <span>夜场模式</span>
                  <strong>低亮度、慢节奏、适合睡前的声音。</strong>
                  <button @click="openPlayer()">进入夜场</button>
                </section>
                <section class="night-strip">
                  <article>
                    <strong>23:00</strong>
                    <span>城市白噪</span>
                  </article>
                  <article>
                    <strong>00:30</strong>
                    <span>低频航班</span>
                  </article>
                  <article>
                    <strong>02:00</strong>
                    <span>睡前故事</span>
                  </article>
                </section>
                <section class="song-section">
                  <div class="section-title">
                    <strong>夜场播放队列</strong>
                    <button @click="nextTrack">换一组</button>
                  </div>
                  <article v-for="track in tracks.slice().reverse()" :key="track.id" class="audio-item compact">
                    <span class="square-cover" :style="{ '--song': track.color }">{{ track.mark }}</span>
                    <button class="audio-main" @click="playTrack(track)">
                      <strong>{{ track.title }}</strong>
                      <small>{{ track.artist }} · {{ track.duration }}</small>
                    </button>
                    <button class="play-icon" @click="openPlayer(track)" aria-label="播放">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
              </template>

              <template v-else>
                <section class="feature-row">
                  <article v-for="card in featuredCards" :key="card.title" :style="{ '--song': card.color }">
                    <strong>{{ card.title }}</strong>
                    <small>{{ card.desc }}</small>
                    <button @click="openPlayer()">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
                <section class="song-section">
                  <div class="section-title">
                    <strong>猜你喜欢的声音</strong>
                    <button @click="nextTrack">换一批</button>
                  </div>
                  <article v-for="track in tracks" :key="track.id" class="audio-item compact">
                    <span class="square-cover" :style="{ '--song': track.color }">{{ track.mark }}</span>
                    <button class="audio-main" @click="playTrack(track)">
                      <strong>{{ track.title }}</strong>
                      <small>{{ track.artist }} · {{ track.album }}</small>
                    </button>
                    <button class="play-icon" @click="openPlayer(track)" aria-label="播放">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                    </button>
                  </article>
                </section>
              </template>
            </section>
          </Transition>
        </div>

        <button class="mini-player" @click="openPlayer()">
          <span class="mini-disc" :class="{ spinning: isPlaying }" :style="{ '--song': currentTrack.color }"></span>
          <span class="mini-title">
            <span class="marquee">
              <strong>{{ currentTrack.title }}</strong>
              <strong aria-hidden="true">{{ currentTrack.title }}</strong>
            </span>
            <small>{{ currentTrack.artist }}</small>
          </span>
          <span class="mini-progress"><i :style="{ width: `${progress}%` }"></i></span>
          <span class="mini-play">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
          </span>
          <span class="mini-list">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
          </span>
        </button>

        <nav class="bottom-nav" aria-label="主导航">
          <button
            v-for="item in bottomTabs"
            :key="item.key"
            :class="{ selected: activeBottom === item.key }"
            type="button"
            @click="goBottom(item.key)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="item.icon" /></svg>
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <aside v-if="playerOpen" class="player-sheet" :style="{ '--song': currentTrack.color }" aria-label="播放详情">
          <header>
            <button class="icon-button" aria-label="收起播放页" @click="playerOpen = false; playerTool = null">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div>
              <strong>{{ currentTrack.title }}</strong>
              <span>{{ currentTrack.artist }}</span>
            </div>
            <button class="icon-button" aria-label="更多">⋮</button>
          </header>
          <div class="disc-wrap">
            <div class="disc" :class="{ spinning: isPlaying }" :style="{ '--song': currentTrack.color }">
              <div></div>
            </div>
          </div>
          <section class="lyric">
            <strong>正在播放</strong>
            <p>让节奏把今天的状态慢慢推亮</p>
            <p class="muted">下一句歌词将在这里滚动显示</p>
          </section>
          <div class="player-progress">
            <span>01:36</span>
            <div><i :style="{ width: `${progress}%` }"></i></div>
            <span>{{ currentTrack.duration }}</span>
          </div>
          <div class="controls">
            <button aria-label="播放调节" @click="playerTool = playerTool === 'tune' ? null : 'tune'">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11l-3-3M20 17H9l3 3M4 17h2M18 7h2" /></svg>
            </button>
            <button aria-label="上一首" @click="nextTrack">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6v12M18 6l-8 6 8 6V6Z" /></svg>
            </button>
            <button class="main-control" aria-label="播放暂停" @click="isPlaying = !isPlaying">
              <svg v-if="isPlaying" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
            </button>
            <button aria-label="下一首" @click="nextTrack">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6v12M6 6l8 6-8 6V6Z" /></svg>
            </button>
            <button aria-label="播放队列" @click="playerTool = playerTool === 'queue' ? null : 'queue'">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
          </div>

          <Transition name="tool-drawer">
            <section v-if="playerTool" class="player-tool" :aria-label="playerTool === 'tune' ? '播放调节面板' : '播放队列面板'">
              <div class="tool-grabber"></div>
              <header>
                <div>
                  <span>{{ playerTool === "tune" ? "播放调节" : "当前队列" }}</span>
                  <strong>{{ playerTool === "tune" ? "为这首歌调整听感" : "接下来播放" }}</strong>
                </div>
                <button aria-label="关闭面板" @click="playerTool = null">关闭</button>
              </header>

              <div v-if="playerTool === 'tune'" class="tune-panel">
                <div class="mode-row">
                  <button class="selected">标准</button>
                  <button>沉浸</button>
                  <button>人声</button>
                  <button>低音</button>
                </div>
                <label>
                  <span>播放速度</span>
                  <input type="range" min="80" max="125" value="100" aria-label="播放速度" />
                  <small>1.0x</small>
                </label>
                <label>
                  <span>环境音量</span>
                  <input type="range" min="0" max="100" value="36" aria-label="环境音量" />
                  <small>36%</small>
                </label>
                <div class="switch-list">
                  <button>定时关闭 · 30分钟</button>
                  <button>歌词显示 · 开启</button>
                  <button>空间音频 · 轻量</button>
                </div>
              </div>

              <div v-else class="queue-panel">
                <article v-for="(track, index) in tracks" :key="track.id" :class="{ active: track.id === currentTrack.id }" @click="playTrack(track)">
                  <span>{{ index + 1 }}</span>
                  <div>
                    <strong>{{ track.title }}</strong>
                    <small>{{ track.artist }} · {{ track.duration }}</small>
                  </div>
                  <button aria-label="更多">⋮</button>
                </article>
              </div>
            </section>
          </Transition>
        </aside>

        <div v-if="menuOpen" class="menu-scrim" @click="menuOpen = false"></div>
        <aside v-if="menuOpen" class="side-menu" aria-label="功能菜单">
          <header>
            <div class="avatar small">LZ</div>
            <div>
              <strong>每日音乐</strong>
              <span>创作者体验中心</span>
            </div>
          </header>
          <section class="menu-card">
            <button>
              <span>创作者中心</span>
              <small>作品数据、收益与发布管理</small>
            </button>
            <button>
              <span>音乐小程序</span>
              <small>听歌识曲、音频剪辑、歌单工具</small>
            </button>
            <button>
              <span>客服与反馈</span>
              <small>账号问题、内容申诉、产品建议</small>
            </button>
            <button>
              <span>设置</span>
              <small>播放、通知、隐私与缓存</small>
            </button>
          </section>
          <section class="menu-quick">
            <button>夜间模式</button>
            <button>定时关闭</button>
            <button>扫一扫</button>
          </section>
        </aside>
      </div>
    </section>
  </main>
</template>
