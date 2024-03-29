import { Link } from "expo-router";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInLeft,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import data from "assets/data/products.json";

export default function ScrollPage() {
  // Animated shared values
  const width = useSharedValue<number>(150);
  const height = useSharedValue<number>(150);
  const scaleY = useSharedValue<number>(1);
  const backgroundColor = useSharedValue<string>("#000000");

  // Animated ref values
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Animation Functions
  const startAnimation = () => {
    const randomWidth = Math.floor(Math.random() * 400);
    const randomHeight = Math.floor(Math.random() * 400);
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    width.value = withTiming(randomWidth);
    height.value = withTiming(randomHeight);
    backgroundColor.value = withTiming(randomColor);
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    backgroundColor: backgroundColor.value,
  }));

  const animatedViewStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
    opacity: scaleY.value,
  }));

  // scrollHandler
  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    console.log(scrollHandler.value);
    return {
      opacity: scrollHandler.value > 1000 ? withSpring(1) : withSpring(0),
    };
  });

  const scrollToTop = () => {
    scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <>
      <Animated.ScrollView style={styles.container} ref={scrollRef}>
        {data?.map((item) => {
          console.log(`image-${item.id.toString()}`);
          return (
            <Animated.View
              key={item.id}
              style={[
                {
                  padding: 10,
                  backgroundColor: "yellow",
                },
                animatedViewStyle,
              ]}
              entering={FadeInLeft.duration(500).delay(300).springify()}
            >
              <Link asChild href={`/${item?.id}`}>
                <Pressable
                  android_ripple={{ color: "gray", foreground: false }}
                >
                  <Animated.Image
                    source={{ uri: item.image }}
                    style={{ height: 300, width: 200 }}
                    // sharedTransitionTag={`image-${item.id.toString()}`}
                  />
                  <Text>{item.title}</Text>
                  <Text>${item.price}</Text>
                </Pressable>
              </Link>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 20,
            right: 20,
          },
          buttonStyle,
        ]}
      >
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            padding: 6,
            backgroundColor: "#FFF",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add-circle" size={30} color="black" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
