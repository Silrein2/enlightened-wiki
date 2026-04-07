import { ref } from 'vue';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// This is our single source of truth
export const userProfile = ref(null);

export const fetchUserProfile = async (uid) => {
  // If we already have the profile, don't fetch it again
  if (userProfile.value && userProfile.value.uid === uid) {
    return userProfile.value;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      userProfile.value = { uid, ...userDoc.data() };
      return userProfile.value;
    }
  } catch (error) {
    console.error("Store: Error fetching profile:", error);
  }
  return null;
};

export const clearUserProfile = () => {
  userProfile.value = null;
};