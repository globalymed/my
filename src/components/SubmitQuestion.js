import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path as necessary

/**
 * Submits a support question to Firestore.
 * @param {Object} params
 * @param {string} params.userId  - The currently authenticated user's UID
 * @param {string} params.questionText - The user's question or message
 * @param {string} params.category - The selected support category
 */
export const submitQuestion = async ({ userId, questionText, category }) => {
  if (!userId) {
    throw new Error("User ID not provided.");
  }

  // Fetch user information
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User data not found");
  }

  const { name, email, phone } = userSnap.data();

  const questionPayload = {
    name: name || "",
    email: email || "",
    phone: phone || "",
    question: questionText,
    category: category || "",
    status: "open", // default status
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "questions"), questionPayload);
  console.log("Question submitted with ID:", docRef.id);
  return docRef.id;
};
