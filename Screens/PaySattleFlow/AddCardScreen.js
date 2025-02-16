import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { screenHeight, screenWidth } from "../../res/Constants";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { ShowMessage } from "../../components/ShowMessage";
import keys from "../../Api/ApiKeys";
import axios from "axios";
import { Apipath } from "../../Api/Apipaths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../res/Colors";

const AddCardScreen = ({ close }) => {
  const [cardDetails, setCardDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();

  const handleAddCard = async () => {
    // close()
    if (!cardDetails?.complete) {
      ShowMessage("Please enter valid card details");
      console.log("error");
      return;
    }

    try {
      setLoading(true);
      const { token, error } = await stripe.createToken({
        type: "Card",
        ...cardDetails,
      });

      if (error) {
        ShowMessage(error.message);
        close();
        setLoading(false);
        return;
      }

      console.log("Token:", token);

      // Call your API with the token ID
      await addNewCard(token.id);
    } catch (err) {
      setLoading(false);
      console.error("Error creating token:", err);
      ShowMessage("An error occurred while processing your card details.");
    }
  };

  const addNewCard = async (tokenId) => {
    try {
      const data = await AsyncStorage.getItem("USER");

      let apiData = {
        source: tokenId,
      };
      console.log("apiData", apiData);

      if (data) {
        let u = JSON.parse(data);
        const response = await axios.post(
          Apipath.addNewCard,
          { apiData },
          {
            headers: {
              Authorization: "Bearer " + u.token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setLoading(false);
          if (response.data.status == 200) {
            ShowMessage("Card added successfully!", "green");
            close();
          } else {
            close();
            ShowMessage(response.data.message || "Failed to add card.");
            console.log("add new card api message is", response.data.message);
          }
        }
      }
    } catch (error) {
      close();
      setLoading(false);
      console.error("API Error:", error);
      ShowMessage("Network error occurred while adding the card.");
    }
  };

  return (
    <StripeProvider publishableKey={keys.stripeTestKey}>
      <Modal visible={true} transparent={true} animationType="fade">
        <View style={styles.container}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Add new card</Text>
              <TouchableOpacity onPress={close}>
                <Image
                  source={require("../../assets/Images/crossIcon.png")}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Card Input */}
            <CardField
              postalCodeEnabled={false} // Disable postal code input
              placeholders={{
                number: "1234 1234 1234 1234",
              }}
              cardStyle={{
                backgroundColor: "#efefef",
                textColor: "#000",
              }}
              style={styles.cardField}
              onCardChange={(cardDetails) => setCardDetails(cardDetails)}
            />

            {/* Submit Button */}
            {loading ? (
              <ActivityIndicator size="large" color={Colors.orangeColor} />
            ) : (
              <TouchableOpacity
                style={[GlobalStyles.capsuleBtn, { width: screenWidth - 80 }]}
                onPress={handleAddCard}
              >
                <Text style={[GlobalStyles.BtnText]}>Add Card</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </StripeProvider>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: screenWidth - 40,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  cardField: {
    height: 50,
    marginVertical: 20,
  },
});
