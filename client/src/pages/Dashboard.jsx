import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Welcome, {user?.name} 🌿</h1>
      <p>You are now logged into GreenCart.</p>
    </div>
  );
}
