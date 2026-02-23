import { db } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const ridesRef = collection(db, "rides");


export const addRide = async (ride) => {
  return addDoc(ridesRef, {
    ...ride,
    createdAt: Timestamp.now(),
  });
};

// Listen all rides (latest first)
export const listenRides = (setRides) => {
  const q = query(ridesRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    setRides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// Listen rides for one rider
export const listenRidesByRider = (riderId, setRides) => {
  const q = query(ridesRef, where("riderId", "==", riderId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    setRides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
