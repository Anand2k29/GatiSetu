import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Play, User, Plus, X, Upload, Video, Info, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import VoiceInputButton from './VoiceInputButton';

const INITIAL_STORIES = [
    {
        id: 1,
        author: 'Ramesh Kumar',
        title: 'How I doubled my mustard yield',
        category: 'Productivity',
        likes: '1.2k',
        comments: 45,
        color: 'from-emerald-400 to-teal-600',
        tags: ['#Organic', '#Mustard', '#WinterCrop']
    },
    {
        id: 2,
        author: 'Sunita Devi',
        title: 'Review: Mini Power Tiller',
        category: 'Machinery',
        likes: '850',
        comments: 28,
        color: 'from-blue-400 to-indigo-600',
        tags: ['#Tiller', '#SmallFarm', '#Tech']
    },
    {
        id: 3,
        author: 'Amit Singh',
        title: 'Drip irrigation setup in 5 mins',
        category: 'Innovation',
        likes: '2.5k',
        comments: 112,
        color: 'from-amber-400 to-orange-600',
        tags: ['#WaterSaving', '#DIY', '#SmartFarm']
    },
    {
        id: 4,
        author: 'Gopal Yadav',
        title: 'Krishi-Link saved me ₹5000!',
        category: 'Success Story',
        likes: '3.1k',
        comments: 89,
        color: 'from-rose-400 to-pink-600',
        tags: ['#Logistics', '#Savings', '#KrishiLink']
    }
];

export default function FarmerStories() {
    const { farmerProfile } = useApp();
    const [stories, setStories] = useState(INITIAL_STORIES);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [newStory, setNewStory] = useState({
        title: '',
        category: 'Success Story',
        tags: ''
    });

    const categories = ['All', 'Productivity', 'Machinery', 'Innovation', 'Success Story'];

    const filteredStories = activeCategory === 'All'
        ? stories
        : stories.filter(s => s.category === activeCategory);

    const handleUpload = (e) => {
        e.preventDefault();
        if (!newStory.title) return;

        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);

                const COLORS = [
                    'from-violet-400 to-purple-600',
                    'from-cyan-400 to-blue-600',
                    'from-lime-400 to-green-600',
                    'from-fuchsia-400 to-pink-600'
                ];

                const storyToAdd = {
                    id: Date.now(),
                    author: farmerProfile?.name || 'Vikas Farmer',
                    title: newStory.title,
                    category: newStory.category,
                    likes: '0',
                    comments: 0,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    tags: newStory.tags.split(',').map(t => `#${t.trim()}`).filter(t => t !== '#')
                };

                setStories([storyToAdd, ...stories]);
                setIsUploading(false);
                setUploadProgress(0);
                setShowUploadModal(false);
                setNewStory({ title: '', category: 'Success Story', tags: '' });
            }
        }, 200);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Play className="text-emerald-600 fill-emerald-600 w-6 h-6" />
                        Farmer Stories
                    </h3>
                    <p className="text-sm text-gray-500">Short tips, success stories, and reviews from the community.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <div className="flex bg-white/50 p-1 rounded-xl shadow-sm border border-gray-100 min-w-max">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                    activeCategory === cat
                                        ? "bg-emerald-600 text-white shadow-md"
                                        : "text-gray-500 hover:text-emerald-600"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Upload Story
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredStories.map((story) => (
                        <motion.div
                            key={story.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="group relative h-[450px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100"
                        >
                            {/* "Video" Placeholder with Gradient */}
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90 transition-transform group-hover:scale-110 duration-700", story.color)}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                                    <Play className="text-white fill-white w-8 h-8 ml-1" />
                                </div>
                            </div>

                            {/* Top Info */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                                <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {story.category}
                                </span>
                                <button className="text-white/80 hover:text-white transition-colors">
                                    <Bookmark size={20} />
                                </button>
                            </div>

                            {/* Sidebar Actions */}
                            <div className="absolute right-4 bottom-24 flex flex-col space-y-4 z-10">
                                <ActionButton icon={Heart} label={story.likes} color="hover:text-rose-500" />
                                <ActionButton icon={MessageCircle} label={story.comments} color="hover:text-blue-500" />
                                <ActionButton icon={Share2} label="Share" color="hover:text-emerald-500" />
                            </div>

                            {/* Bottom Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                        <User size={16} />
                                    </div>
                                    <span className="font-bold text-sm tracking-wide">{story.author}</span>
                                </div>
                                <h4 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-300 transition-colors">
                                    {story.title}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {story.tags.map(tag => (
                                        <span key={tag} className="text-[10px] opacity-80 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isUploading && setShowUploadModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-emerald-100"
                        >
                            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Upload Your Story</h3>
                                        <p className="text-emerald-50 text-xs opacity-80">Share your wisdom with fellow farmers</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !isUploading && setShowUploadModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Story Title</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. My experience with smart irrigation"
                                                className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-700"
                                                value={newStory.title}
                                                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                            />
                                            <VoiceInputButton
                                                onTranscript={(text) => setNewStory({ ...newStory, title: text })}
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                            <select
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-700 appearance-none"
                                                value={newStory.category}
                                                onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                                            >
                                                {categories.filter(c => c !== 'All').map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tags (comma separated)</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    placeholder="tips, harvest, drone"
                                                    className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-700"
                                                    value={newStory.tags}
                                                    onChange={(e) => setNewStory({ ...newStory, tags: e.target.value })}
                                                />
                                                <VoiceInputButton
                                                    onTranscript={(text) => setNewStory({ ...newStory, tags: text })}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload Video (Max 30s)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                id="video-upload"
                                                className="hidden"
                                                onChange={() => { }} // Simulation only
                                            />
                                            <label
                                                htmlFor="video-upload"
                                                className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
                                            >
                                                <Upload className="w-10 h-10 text-gray-300 group-hover:text-emerald-500 mb-3 transition-colors" />
                                                <span className="text-sm font-bold text-gray-400 group-hover:text-emerald-600">Select Video File</span>
                                                <span className="text-xs text-gray-400 mt-1">MP4, MOV up to 50MB</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-emerald-600">
                                            <span>Uploading Story...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => !isUploading && setShowUploadModal(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className={cn(
                                            "flex-[2] py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2",
                                            isUploading ? "bg-emerald-700 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                        )}
                                    >
                                        {isUploading ? 'Contributing...' : 'Share Story'}
                                    </button>
                                </div>

                                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                                    <Info size={12} /> Your story will be visible to all Krishi-Link users after automated moderation.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ActionButton({ icon: Icon, label, color }) {
    return (
        <div className="flex flex-col items-center">
            <button className={cn("p-3 bg-white/10 backdrop-blur-lg rounded-full text-white transition-all transform hover:scale-110 border border-white/10", color)}>
                <Icon size={20} fill="currentColor" className="fill-transparent hover:fill-current" />
            </button>
            <span className="text-[10px] text-white font-bold mt-1 shadow-sm">{label}</span>
        </div>
    );
}
