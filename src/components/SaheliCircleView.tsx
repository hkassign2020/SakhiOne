import React, { useState } from "react";
import { Users, Heart, MessageCircle, Send, Volume2, VolumeX, CheckCircle, MapPin, Sparkles, Plus } from "lucide-react";
import { CommunityPost, LanguageCode } from "../types";
import { INITIAL_COMMUNITY_POSTS } from "../data/community";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface SaheliCircleViewProps {
  language: LanguageCode;
}

export const SaheliCircleView: React.FC<SaheliCircleViewProps> = ({ language }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // New post modal state
  const [isPosting, setIsPosting] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<CommunityPost["category"]>("pads_health");

  // Reply state
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  const handlePlayVoice = (post: CommunityPost) => {
    if (playingVoiceId === post.id) {
      stopSpeech();
      setPlayingVoiceId(null);
      return;
    }

    const script = post.contents[language] || post.contents.hi;
    setPlayingVoiceId(post.id);
    speakText(
      script,
      language,
      () => {},
      () => setPlayingVoiceId(null)
    );
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const author = newAuthor.trim() || (language === "ta" ? "சகோதரி" : language === "te" ? "సోదరి" : "सखी बहन");
    const multilangAuthor = {
      hi: author, ta: author, te: author, ml: author, kn: author, mr: author,
      raj: author, gu: author, mai: author, bn: author, pa: author, or: author,
    };
    const multilangZone = {
      hi: "स्थानीय पंचायत", ta: "உள்ளூர் பகுதி", te: "స్థానిక పంచాయతీ", ml: "പഞ്ചായത്ത്",
      kn: "ಸ್ಥಳೀಯ ಪಂಚಾಯಿತಿ", mr: "स्थानिक गाव", raj: "गाँव रो दायरो", gu: "સ્થાનિક વિસ્તાર",
      mai: "स्थानीय गाम", bn: "স্থানীয় এলাকা", pa: "ਪਿੰਡ ਦਾ ਇਲਾਕਾ", or: "ସ୍ଥାନୀୟ ଅଞ୍ଚଳ",
    };
    const multilangTime = {
      hi: "अभी-अभी", ta: "இப்போது", te: "ఇప్పుడే", ml: "ഇപ്പോൾ",
      kn: "ಈಗಷ್ಟೇ", mr: "आत्ताच", raj: "अबारे ही", gu: "હમણાં જ",
      mai: "एखने", bn: "এইমাত্র", pa: "ਹੁਣੇ", or: "ଏବେ",
    };
    const multilangContent = {
      hi: newContent.trim(), ta: newContent.trim(), te: newContent.trim(), ml: newContent.trim(),
      kn: newContent.trim(), mr: newContent.trim(), raj: newContent.trim(), gu: newContent.trim(),
      mai: newContent.trim(), bn: newContent.trim(), pa: newContent.trim(), or: newContent.trim(),
    };

    const newPostItem: CommunityPost = {
      id: "post_" + Date.now(),
      authorNames: multilangAuthor,
      villageZones: multilangZone,
      distanceKm: 2.1,
      timeAgos: multilangTime,
      category: newCategory,
      contents: multilangContent,
      likesCount: 1,
      repliesCount: 0,
      hasVoiceNote: true,
      voiceDuration: "0:15",
      isVerifiedSister: true,
      replies: [],
    };

    setPosts([newPostItem, ...posts]);
    setNewAuthor("");
    setNewContent("");
    setIsPosting(false);
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    const repAuthor = language === "ta" ? "உங்கள் தோழி" : language === "te" ? "మీ సఖి" : "आपकी सखी";
    const multilangRepAuthor = {
      hi: repAuthor, ta: repAuthor, te: repAuthor, ml: repAuthor, kn: repAuthor, mr: repAuthor,
      raj: repAuthor, gu: repAuthor, mai: repAuthor, bn: repAuthor, pa: repAuthor, or: repAuthor,
    };
    const multilangRepText = {
      hi: replyText.trim(), ta: replyText.trim(), te: replyText.trim(), ml: replyText.trim(),
      kn: replyText.trim(), mr: replyText.trim(), raj: replyText.trim(), gu: replyText.trim(),
      mai: replyText.trim(), bn: replyText.trim(), pa: replyText.trim(), or: replyText.trim(),
    };
    const multilangRepTime = {
      hi: "अभी", ta: "இப்போது", te: "ఇప్పుడే", ml: "ഇപ്പോൾ",
      kn: "ಈಗ", mr: "आत्ता", raj: "अबारे", gu: "હમણાં",
      mai: "एखने", bn: "এইমাত্র", pa: "ਹੁਣੇ", or: "ଏବେ",
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newRep = {
            id: "rep_" + Date.now(),
            authors: multilangRepAuthor,
            texts: multilangRepText,
            timeAgos: multilangRepTime,
          };
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...(p.replies || []), newRep],
          };
        }
        return p;
      })
    );
    setReplyText("");
    setReplyPostId(null);
  };

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6 pb-20">
      {/* Circle Banner */}
      <div className="bg-gradient-to-br from-teal-800 via-emerald-800 to-stone-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md mb-2 inline-flex">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.circleBannerTag}</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{t.circleBannerTitle}</h2>
          <p className="text-xs text-teal-100 leading-relaxed mb-4">
            {t.circleBannerDesc}
          </p>

          <button
            onClick={() => setIsPosting(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.circleAskBtn}</span>
          </button>
        </div>

        <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none text-white">
          <Users className="w-44 h-44" />
        </div>
      </div>

      {/* New Post Form Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md p-5 shadow-2xl text-stone-900 dark:text-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t.newPostTitle}</span>
              </h3>
              <button
                onClick={() => setIsPosting(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">{t.yourNameLabel}</label>
                <input
                  type="text"
                  placeholder="శాంతి అక్క / शांति दीदी"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{t.topicLabel}</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pads_health">{t.filterTopicPads}</option>
                  <option value="small_business">{t.filterTopicBiz}</option>
                  <option value="schemes_help">{t.filterTopicSchemes}</option>
                  <option value="skills">{t.filterTopicSkills}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{t.yourMsgLabel}</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="flex-1 py-2.5 bg-stone-200 dark:bg-stone-800 rounded-xl font-semibold"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.sendMsgBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: t.filterAll },
          { id: "pads_health", label: t.filterTopicPads },
          { id: "small_business", label: t.filterTopicBiz },
          { id: "schemes_help", label: t.filterTopicSchemes },
          { id: "skills", label: t.filterTopicSkills },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Community Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isPlaying = playingVoiceId === post.id;
          const isReplyingThis = replyPostId === post.id;
          const postAuthor = post.authorNames[language] || post.authorNames.hi;
          const postZone = post.villageZones[language] || post.villageZones.hi;
          const postTime = post.timeAgos[language] || post.timeAgos.hi;
          const postContent = post.contents[language] || post.contents.hi;

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-3"
            >
              {/* Author & Village Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-sm border border-teal-200 dark:border-teal-800">
                    {postAuthor.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {postAuthor}
                      </h4>
                      {post.isVerifiedSister && (
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <span>{postZone}</span>
                      <span>·</span>
                      <span className="text-teal-700 dark:text-teal-400 font-medium">
                        {post.distanceKm} km
                      </span>
                      <span>·</span>
                      <span>{postTime}</span>
                    </div>
                  </div>
                </div>

                {/* Voice Note Listen Button */}
                <button
                  onClick={() => handlePlayVoice(post)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isPlaying
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 hover:bg-teal-100"
                  }`}
                  title={t.listenBtn}
                >
                  {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? t.stopBtn : post.voiceDuration ? `${t.listenBtn} (${post.voiceDuration})` : t.listenBtn}</span>
                </button>
              </div>

              {/* Message Content */}
              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {postContent}
              </p>

              {/* Actions: Likes & Reply */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{post.likesCount} {t.admiredBySisters}</span>
                </button>

                <button
                  onClick={() => setReplyPostId(isReplyingThis ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-teal-700 font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.repliesCount} {t.repliesText}</span>
                </button>
              </div>

              {/* Replies Thread */}
              {post.replies && post.replies.length > 0 && (
                <div className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-2xl space-y-2 border border-stone-100 dark:border-stone-800">
                  {post.replies.map((rep) => {
                    const repAuthor = rep.authors[language] || rep.authors.hi;
                    const repText = rep.texts[language] || rep.texts.hi;
                    const repTime = rep.timeAgos[language] || rep.timeAgos.hi;

                    return (
                      <div key={rep.id} className="text-xs space-y-0.5">
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {repAuthor}
                          </span>
                          <span>{repTime}</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                          {repText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reply Input Box */}
              {isReplyingThis && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={t.replyToSister}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                  <button
                    onClick={() => handleAddReply(post.id)}
                    className="px-3 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
                  >
                    {t.sendReplyBtn}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
