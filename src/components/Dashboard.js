import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
      setError("");

      try{
          await logout();
          history.push('/login');
          // this won't work here. When logout fn is called the authState is changed, the listener for change in auth state (in authcontextprovider component)
          //fires its callback function which changes the state of 'currentUser'. change in state triggers re-render of AuthContextProvider component 
          //=> all its child components re render => dashboard re-renders
          //since dashboard uses the authContext's currentUser property to display the current user's email id, and now the currentUser property of the authContext is null
          //the app crashes, by the time history.push('/login') runs 
          //to get over this, we make it impossible for the dashboard component to be rendered when currentUser is 'null' i.e. user is logged out, by creating a private route component
          //this way when authcontextprovider re-renders along with all its children and goes on to render the dashboard component, it can't beacse private route component prevents it
      } catch {
          setError("Failed to log out");
      }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="mb-4 text-center">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong>{currentUser.email}
            <Link to="/update-profile" className="w-100 btn btn-primary mt-3">Update Profile</Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
