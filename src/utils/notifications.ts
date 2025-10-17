import * as Notifications from 'expo-notifications';

export async function sendLikeNotification(like: {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}) {
  try {
    // Get the current user who made the like (for display purposes)
    const { AuthService } = await import('../services/authService');
    const currentUser = await AuthService.getCurrentUser();
    
    if (!currentUser) {
      console.log('No current user found for notification');
      return;
    }

    // Create local notification content
    const notificationContent = {
      title: 'Someone liked your post! ❤️',
      body: `${currentUser.username} liked your post!`,
      data: { 
        postId: like.post_id,
        likeId: like.id,
        type: 'like' 
      },
    };

    // Send local notification
    await sendLocalNotification(notificationContent);
    
    console.log('Local like notification sent:', notificationContent);
  } catch (error) {
    console.error('Send like notification error:', error);
  }
}

async function sendLocalNotification(message: {
  title: string;
  body: string;
  data?: any;
}) {
  try {
    // Schedule immediate local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: message.data || {},
        sound: 'default',
      },
      trigger: null, // Show immediately
    });
    
    console.log('Local notification scheduled:', message.title);
  } catch (error) {
    console.error('Local notification error:', error);
  }
}

// Export additional notification utilities for local use
export async function sendWelcomeNotification(username: string) {
  const message = {
    title: `Welcome to Instagram! 🎉`,
    body: `Hi ${username}! Start sharing your moments.`,
    data: { type: 'welcome' },
  };
  
  await sendLocalNotification(message);
}

export async function sendPostCreatedNotification() {
  const message = {
    title: 'Post Created! 📸',
    body: 'Your post has been shared successfully!',
    data: { type: 'post_created' },
  };
  
  await sendLocalNotification(message);
}
