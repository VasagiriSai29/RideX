import { db } from "../firebase";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";

const colRef = collection(db, "passengers");

export const addPassenger = (data) => addDoc(colRef, data);

export const listenPassengers = (setPassengers) => {
  const q = query(colRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    setPassengers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
