import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type ViewabilityConfig,
  type ViewToken,
} from 'react-native';
import { Colors } from '../../constants/colors';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

type FeedItem = {
  id: string;
  type: 'text' | 'video';
  content: string;
  author?: string;
  timestamp?: string;
};

export default function Index() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [visibleVideoIds, setVisibleVideoIds] = useState<string[]>([]);
  const currentlyPlayingRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Declare player hooks dynamically
  const player1 = useVideoPlayer(videoSource, () => {});
  const player2 = useVideoPlayer(videoSource, () => {});
  const player3 = useVideoPlayer(videoSource, () => {});
  const player4 = useVideoPlayer(videoSource, () => {});
  const player5 = useVideoPlayer(videoSource, () => {});
  const player6 = useVideoPlayer(videoSource, () => {});

  // We'll populate this dynamically once feed data is loaded
  const playersRef = useRef<Record<string, ReturnType<typeof useVideoPlayer>>>(
    {},
  );

  // Map of available players
  const availablePlayers = {
    player1,
    player2,
    player3,
    player4,
    player5,
    player6,
  };

  // Control video playback based on visibility with debounce
  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new debounce timer (150ms)
    debounceTimerRef.current = setTimeout(() => {
      // Determine which video should be playing (last visible one)
      const videoToPlay = visibleVideoIds.length > 0 
        ? visibleVideoIds[visibleVideoIds.length - 1] 
        : null;
      
      // Only update playback if there's actually a change
      if (videoToPlay !== currentlyPlayingRef.current) {
        // If something is currently playing, pause it
        if (currentlyPlayingRef.current) {
          const currentPlayer = playersRef.current[currentlyPlayingRef.current];
          if (currentPlayer) {
            currentPlayer.pause();
          }
        }
        
        // Play the new video if there is one
        if (videoToPlay) {
          const playerToPlay = playersRef.current[videoToPlay];
          if (playerToPlay) {
            playerToPlay.play();
          }
        }
        
        // Update the reference to what's currently playing
        currentlyPlayingRef.current = videoToPlay;
      }
    }, 150);
    
    // Clean up on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [visibleVideoIds]);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 60,  // Increased threshold for more stability
    minimumViewTime: 300,             // Minimum time to be considered visible
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleVideos = viewableItems
        .filter((token) => token.item?.type === 'video')
        .map((token) => token.item.id);

      setVisibleVideoIds(visibleVideos);
    },
  ).current;

  useEffect(() => {
    // Generate sample feed data
    const sampleFeed: FeedItem[] = [
      {
        id: '1',
        type: 'text',
        content:
          'Just discovered an amazing new app that helps you focus on your one important thing! #productivity s',
        author: 'Emily Chen',
        timestamp: '2m ago',
      },
      {
        id: '2',
        type: 'text',
        content:
          'Just discovered an amazing new app that helps you focus on your one important thing! #productivity l',
        author: 'Emily Chen',
        timestamp: '2m ago',
      },
      {
        id: '3',
        type: 'text',
        content:
          'Just discovered an amazing new app that helps you focus on your one important thing! #productivity s',
        author: 'Emily Chen',
        timestamp: '2m ago',
      },
      {
        id: '4',
        type: 'text',
        content:
          'Just discovered an amazing new app that helps you focus on your one important thing! #productivity s',
        author: 'Emily Chen',
        timestamp: '2m ago',
      },
      {
        id: '5',
        type: 'video',
        content: videoSource,
      },
      {
        id: '6',
        type: 'text',
        content:
          'Focus on the one thing that matters most today, and everything else will fall into place.',
        author: 'Mark Johnson',
        timestamp: '15m ago',
      },
      {
        id: '10',
        type: 'text',
        content:
          'Ive been using the One Thing method for a month now. My productivity has never been better!',
        author: 'Alex Rivera',
        timestamp: '22m ago',
      },
      {
        id: '11',
        type: 'text',
        content:
          'Setting your daily priority isnt just about productivity—its about making your life simpler and more meaningful.',
        author: 'Jamie Wu',
        timestamp: '28m ago',
      },
      {
        id: '7',
        type: 'video',
        content: videoSource,
      },
      {
        id: '12',
        type: 'text',
        content:
          'Multitasking is a myth. Your brain can only focus on one thing at a time. Choose that one thing wisely!',
        author: 'Dr. Michael Barnes',
        timestamp: '32m ago',
      },
      {
        id: '13',
        type: 'text',
        content:
          'When you focus on just one priority each day, you eliminate the noise and make real progress.',
        author: 'Sophia Carter',
        timestamp: '37m ago',
      },
      {
        id: '14',
        type: 'text',
        content:
          'Success is built on daily disciplines, not occasional heroic efforts. One small action each day compounds over time.',
        author: 'Thomas Grant',
        timestamp: '40m ago',
      },
      {
        id: '8',
        type: 'text',
        content:
          'The key to success is not doing more things, but doing the right thing consistently. #onething',
        author: 'Sarah Williams',
        timestamp: '45m ago',
      },
      {
        id: '15',
        type: 'text',
        content:
          'Just finished Gary Kellers "The ONE Thing" book. Game-changing approach to work and life!',
        author: 'Rachel Morgan',
        timestamp: '49m ago',
      },
      {
        id: '16',
        type: 'text',
        content:
          'Your to-do list shouldnt be a dumping ground. Find the one task that will make everything else easier or unnecessary.',
        author: 'David Chen',
        timestamp: '53m ago',
      },
      {
        id: '9',
        type: 'video',
        content: videoSource,
      },
      {
        id: '17',
        type: 'text',
        content:
          'When you say yes to one thing, youre saying no to everything else. Choose carefully!',
        author: 'Olivia Johnson',
        timestamp: '58m ago',
      },
      {
        id: '18',
        type: 'text',
        content:
          'Your future is created by what you do today, not tomorrow. Whats your ONE thing right now?',
        author: 'Marcus Lee',
        timestamp: '1h ago',
      },
    ];

    setFeedItems(sampleFeed);

    // Dynamically set up player mapping
    const videoItems = sampleFeed.filter((item) => item.type === 'video');
    const players = Object.values(availablePlayers);

    // Assign a player to each video item
    // biome-ignore lint/complexity/noForEach: <explanation>
    videoItems.forEach((item, index) => {
      if (index < players.length) {
        playersRef.current[item.id] = players[index];
      }
    });
  }, []);

  const renderItem = ({ item }: { item: FeedItem }) => {
    if (item.type === 'text') {
      return (
        <View style={styles.textItem}>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.authorInfo}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
      );
    }

    // Get the specific player for this video ID
    const player = playersRef.current[item.id];

    if (!player) {
      return null;
    }

    return (
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  textItem: {
    backgroundColor: Colors.muted.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.muted.border,
  },
  content: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  timestamp: {
    fontSize: 14,
    color: Colors.muted.text,
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
