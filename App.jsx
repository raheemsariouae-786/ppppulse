import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  enableIndexedDbPersistence
} from "firebase/firestore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH",
  projectId: "YOUR_PROJECT",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(() => {});

/* ================= DISTRICTS ================= */

const districts = [
  "Karachi East","Karachi West","Karachi South","Karachi Central",
  "Korangi","Malir","Hyderabad","Sukkur","Larkana",
  "Thatta","Badin","Dadu","Matiari","Sanghar",
  "Khairpur","Mirpurkhas","Umerkot","Jacobabad","Kashmore",
  "Shikarpur","Ghotki","Naushahro Feroze","Shaheed Benazirabad",
  "Jamshoro","Tando Allahyar","Tando Muhammad Khan",
  "Tharparkar","Sujawal","Qambar Shahdadkot",
  "Kambar","Others"
];

/* ================= APP ================= */

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("viewer");

  const [view, setView] = useState("dashboard");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const [complaint, setComplaint] = useState("");
  const [complaints, setComplaints] = useState([]);

  const [members, setMembers] = useState([]);

  /* ================= AUTH ================= */

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) setRole(snap.data().role);
        else {
          await setDoc(ref, { role: "viewer" });
          setRole("viewer");
        }
      }
    });
  }, []);

  /* ================= OTP LOGIN ================= */

  const sendOTP = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible"
    });

    const confirmation = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    setConfirmObj(confirmation);
    alert("OTP Sent");
  };

  const verifyOTP = async () => {
    await confirmObj.confirm(otp);
  };

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    const snap = await getDocs(collection(db, "members"));
    setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));

    const cSnap = await getDocs(collection(db, "complaints"));
    setComplaints(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  /* ================= ADD MEMBER ================= */

  const addMember = async () => {
    await addDoc(collection(db, "members"), {
      name,
      district,
      role: roleInput,
      created: Date.now()
    });

    setName(""); setDistrict(""); setRoleInput("");
    loadData();
  };

  /* ================= ADD COMPLAINT ================= */

  const addComplaint = async () => {
    await addDoc(collection(db, "complaints"), {
      text: complaint,
      status: "pending",
      created: Date.now()
    });

    setComplaint("");
    loadData();
  };

  /* ================= LOGIN SCREEN ================= */

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔐 ULTRA PRO LOGIN</h2>

        <input
          placeholder="Phone +92..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={sendOTP}>Send OTP</button>

        <div id="recaptcha"></div>

        <input
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={verifyOTP}>Login</button>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div style={{ padding: 20 }}>
      <h1>🌹 PPP PULSE ULTRA PRO SYSTEM</h1>

      <p>Role: {role}</p>

      <button onClick={() => signOut(auth)}>Logout</button>

      {/* NAV */}
      <div>
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("members")}>Members</button>
        <button onClick={() => setView("complaints")}>Complaints</button>
      </div>

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div>
          <h2>📊 Analytics Dashboard</h2>

          <p>👥 Members: {members.length}</p>
          <p>🧾 Complaints: {complaints.length}</p>
          <p>🗺️ Districts: 33 Active</p>

          <LineChart width={300} height={200} data={members}>
            <Line type="monotone" dataKey="created" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid />
          </LineChart>
        </div>
      )}

      {/* MEMBERS */}
      {view === "members" && (
        <div>
          <h2>👥 Representatives</h2>

          {role !== "viewer" && (
            <div>
              <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
              <select onChange={e=>setDistrict(e.target.value)}>
                <option>Select District</option>
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>

              <input placeholder="Role" value={roleInput} onChange={e=>setRoleInput(e.target.value)} />

              <button onClick={addMember}>Add</button>
            </div>
          )}

          {members.map(m => (
            <div key={m.id} style={{ border: "1px solid #ddd", margin: 5 }}>
              <h3>{m.name}</h3>
              <p>{m.district}</p>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      )}

      {/* COMPLAINTS */}
      {view === "complaints" && (
        <div>
          <h2>🧾 Complaint System</h2>

          <textarea
            value={complaint}
            onChange={e=>setComplaint(e.target.value)}
            placeholder="Enter complaint..."
          />

          <button onClick={addComplaint}>Submit</button>

          {complaints.map(c => (
            <div key={c.id} style={{ border: "1px solid #ccc", margin: 5 }}>
              <p>{c.text}</p>
              <b>Status: {c.status}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
