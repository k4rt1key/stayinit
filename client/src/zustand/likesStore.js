import { create } from 'zustand';
import like from "../BackendUtils/like";
import unlike from "../BackendUtils/unlike";
import getLikes from "../BackendUtils/getLikes";

const useStore = create((set, get) => ({
    likes: [],
    isLoading: false,
    error: null,

    toggleLike: async (type, propertyId, token) => {
        set({ isLoading: true, error: null });
        try {
            const isLiked = get().isPropertyLiked(type, propertyId);

            if (isLiked) {
                const response = await unlike(type, propertyId, token);
                if (response.success) {
                    set((state) => ({
                        likes: state.likes.filter((l) =>
                            (type === 'hostel' ? l.hostel?._id !== propertyId : l.flat?._id !== propertyId)
                        )
                    }));
                }
            } else {
                const response = await like(type, propertyId, token);
                if (response.success) {
                    set((state) => ({
                        likes: [...state.likes, response.data]
                    }));
                }
            }
        } catch (error) {
            set({ error: 'Failed to toggle like' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchLikedProperties: async (token) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getLikes(token);
            if (response.success) {
                set({ likes: response.data });
            }
        } catch (error) {
            set({ error: 'Failed to fetch liked properties' });
        } finally {
            set({ isLoading: false });
        }
    },

    isPropertyLiked: (type, propertyId) => {
        const { likes } = get();
        return likes.some(like =>
            (type === 'hostel' && like.hostel?._id === propertyId) ||
            (type === 'flat' && like.flat?._id === propertyId)
        );
    },

    // New method to update a single property's like status
    updatePropertyLikeStatus: (type, propertyId, isLiked) => {
        set((state) => {
            if (isLiked) {
                // If liking, add to likes array
                if (!state.isPropertyLiked(type, propertyId)) {
                    return { likes: [...state.likes, { [type]: { _id: propertyId } }] };
                }
            } else {
                // If unliking, remove from likes array
                return {
                    likes: state.likes.filter((l) =>
                        (type === 'hostel' ? l.hostel?._id !== propertyId : l.flat?._id !== propertyId)
                    )
                };
            }
            return state; // Return unchanged state if no update needed
        });
    }
}));

export default useStore;