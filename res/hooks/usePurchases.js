import { useState, useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const usePurchases = (RevenueCatApiKey) => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(null);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    try {
      if (Platform.OS === "ios") {
        const data = await AsyncStorage.getItem("USER");
        let user = null;
        if (data) {
          let d = JSON.parse(data);
          user = d.user;
          await Purchases.configure({
            apiKey: RevenueCatApiKey,
            appUserID: `${user.id}`,
          });
          console.log("Initialized user with id:", user.id);

          try {
            const customerInfo = await Purchases.getCustomerInfo();
            if (
              typeof customerInfo.entitlements.active["premium"] !== "undefined"
            ) {
              console.log(
                "User subscribed to plan ",
                customerInfo.entitlements.active["premium"]
              );
            }
          } catch (e) {
            console.log("Error fetching customer info:", e);
          }
          fetchProducts();
        }
      } else if (Platform.OS === "android") {
        await Purchases.configure({ apiKey: RevenueCatApiKey });
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to initialize purchases:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Loading products...");
      const offerings = await Purchases.getOfferings();
      setLoading(false);

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const availableProducts = offerings.current.availablePackages.map(
          (pkg) => pkg.product
        );
        console.log("Available products:", availableProducts);
        setProducts(availableProducts);
      } else {
        console.log("No available products found");
      }
    } catch (e) {
      console.log("Error getting offerings:", e);
      setLoading(false);
    }
  };

  const buyProduct = async (product) => {
    setLoading2(product.identifier);
    try {
      console.log("Subscribing to", product);
      const { customerInfo } = await Purchases.purchaseProduct(
        product.identifier
      );
      if (customerInfo.entitlements.active["premium"]) {
        console.log("User subscribed to premium");
        let p = customerInfo.entitlements.active["premium"];
        let date = p.originalPurchaseDateMillis;
        console.log("Original date ", date);
        await UpdateProfile(JSON.stringify({ originalPurchaseDate: date }));
        console.log("Profile updated");
        setLoading2(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "TabBarContainer" }],
        });
      }
    } catch (e) {
      setLoading2(null);
      console.log("Exception during purchase:", e);
      if (!e.userCancelled) {
        // Handle other errors
      }
    }
  };

  return {
    loading,
    loading2,
    products,
    fetchProducts,
    buyProduct,
  };
};

export default usePurchases;
